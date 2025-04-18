---
icon: pen-to-square
date: 2025-04-18
category:
  - Linux
tag:
  - 网络
---

# centos7 设置网络代理

## 设置代理
这样设置后默认请求都会走代理,比如 curl和wget，但是 yum 和 docker 依旧不会走代理，他们的代理需要单独设置
```shell
export http_proxy=http://192.168.2.102:15732
export https_proxy=https://192.168.2.102:15732


#设置：无需代理的IP
export no_proxy="localhost, 127.0.0.1, ::1"

#更新环境文件使之生效
source /etc/profile

```


## yum设置代理
```shell
在 /etc/yum.conf后面添加以下内容：
proxy=http://192.168.2.102:15732

更新一下环境文件：
source /etc/yum.conf
```

## docker代理
很多时候即便在 /etc/docker/daemon.json 里面指定 国内的镜像源，还有有些资源访问不到，这时候只要你有任意可以上网的主机，并且走主机的代理上网就可以了请求到资源了
```shell
#创建一下目录和文件
mkdir /etc/systemd/system/docker.service.d/ 
vim /etc/systemd/system/docker.service.d/http-proxy.conf

#添加一下内容
[Service]
Environment="HTTP_PROXY=代理地址"
Environment="HTTPS_PROXY=代理地址"
Environment="NO_PROXY=localhost,127.0.0.1"

#重启
systemctl daemon-reload
systemctl restart docker

#检查代理
docker info | grep -i proxy

```

## curl设置代理
curl -x https_proxy://代理地址 请求地址
```shell
curl -x  https_proxy://192.168.2.102:15732  https://www.google.com.hk/

#这样也可以，省略协议默认是hhttp 协议
curl -x  192.168.2.102:15732  https://www.google.com.hk/

```

