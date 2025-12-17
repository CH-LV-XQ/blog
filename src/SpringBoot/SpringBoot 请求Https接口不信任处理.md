---
icon: pen-to-square
date: 2025-12-17
category:
  - SpringBoot
---

# SpringBoot 请求Https接口不信任处理

SpringBoot报错示例：
```java
"I/O error on GET request for \"https://datago.tcc1955.edu.cn/data-interface/jinsannianzhaoshengqingkuang \": sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target; nested exception is javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target"
```

<font color="red">原因一句话：对方 HTTPS 证书不在 JDK 信任列表里，SSL 握手失败。</font>

解决方案：

## 方案一
**最简单：把对方证书导入 JDK（一次解决，全局可信）**
```bash
# 1. 下载站点证书（Linux 示例）
openssl s_client -connect datago.tcc1955.edu.cn:443 </dev/null | \
  sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > datago.cer

# 2. 导入到当前使用的 JDK
sudo /opt/module/jdk1.8.0.171/jre/bin/keytool -import -alias datago \
  -file datago.cer \
  -keystore $JAVA_HOME/jre/lib/security/cacerts \
  -storepass changeit
  
# 以下是辅助操作，可不执行
# 3.查找keytool路径
# 先确认本机 JDK 装在哪
echo $JAVA_HOME
find / -name keytool 2>/dev/null | head -5
# 常见结果示例：
# /usr/lib/jvm/java-17-openjdk-amd64/bin/keytool
# /usr/local/java/jdk1.8.0_361/bin/keytool

# 4.查看证书是否正确,执行命令看到输出的Owner(所有者)一行包括：CN=datago.tcc1955.edu.cn 是否一致
/opt/module/jdk1.8.0_171/jre/bin/keytool -list -v \
 -keystore $JAVA_HOME/jre/lib/security/cacerts \
 -storepass changeit -alias datago

```
重启应用，错误消失。

> 两条命令干的事：
> 
> 1、把对方网站的“身份证”（HTTPS 证书）下载到本地文件 datago.cer； 
> 
>2、把这张身份证登记到 JDK 的“可信名单”里，以后 Java 程序访问它就不再报 “PKIX path building failed”。

```text
逐句拆解：
1️⃣ openssl s_client -connect datago.tcc1955.edu.cn:443
用 OpenSSL 模拟一次 HTTPS 握手，把服务器返回的证书链打印到屏幕。
2️⃣ </dev/null
立即结束输入，不让 OpenSSL 等待交互。
3️⃣ sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p'
从输出里截取“-----BEGIN CERTIFICATE-----”到“-----END CERTIFICATE-----”之间的文本，也就是真正的 X.509 证书内容。
4️⃣ > datago.cer
把截出来的证书保存成文件 datago.cer。
5️⃣ keytool -import
JDK 自带的“证书管理工具”，做“导入”操作。
6️⃣ -alias datago
给这张证书起个昵称，方便以后查看或删除。
7️⃣ -file datago.cer
指定刚才保存下来的证书文件。
8️⃣ -keystore $JAVA_HOME/lib/security/cacerts
告诉 keytool 要把证书写进哪个“信任库”；cacerts 就是 JDK 自带的全局信任库。
9️⃣ -storepass changeit
cacerts 的默认密码是 changeit，输入它才能写进去。
```
## 方案二
**只想临时调通：代码层“信任所有证书”（仅开发/测试）**
```java 
@Configuration
public class UnsafeSslConfig {

    @Bean
    public RestTemplate restTemplate() throws Exception {
        // 制造一个信任所有证书的 SSLContext
        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(null, new TrustManager[]{ new X509TrustManager(){
            public void checkClientTrusted(X509Certificate[] chain, String authType) {}
            public void checkServerTrusted(X509Certificate[] chain, String authType) {}
            public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
        }}, new SecureRandom());

        // 允许任意主机名
        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(
                ctx, NoopHostnameVerifier.INSTANCE);

        CloseableHttpClient client = HttpClients.custom()
                .setSSLSocketFactory(csf)
                .build();

        HttpComponentsClientHttpRequestFactory factory =
                new HttpComponentsClientHttpRequestFactory(client);

        return new RestTemplate(factory);
    }
}
```
用完即删，不要上线。

## 方案三
**生产环境既不能导证书也不想全信任 → 把对方证书做成独立 trustStore，只让本应用加载**
```yaml
# application.yml
server:
  ssl:
    trust-store: classpath:datago.p12   # 把 cer 转成 p12 放进 resources
    trust-store-password: 123456
    trust-store-type: PKCS12
```
或通过启动参数：
```bash
-Djavax.net.ssl.trustStore=datago.p12 \
-Djavax.net.ssl.trustStorePassword=123456 \
-Djavax.net.ssl.trustStoreType=PKCS12
```

**小结**
* 长期方案选 1（导入 JDK cacerts）。
* 只想本地调接口，用 2 最快，但务必禁止上生产。
* 若对端证书经常换，又无法导入，则考虑 3 独立 trustStore。
