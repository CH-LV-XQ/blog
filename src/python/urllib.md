---
icon: pen-to-square
date: 2025-02-11
category:
  - Python
tag:
  - UrlLib
  - Python 爬虫
star: true
---

# UrlLib使用

## 编解码

```te
将汉字转成unicode的编码格式，有两种方式
1、quote：适合只有一个参数
2、urlencode：适合多个参数
```

### quote编码

```python
import urllib.parse

name = '周杰伦'
parse_name = urllib.parse.quote(name)
print(parse_name)

# 输出结果
# %E5%91%A8%E6%9D%B0%E4%BC%A6
```

### urlencode编码

```python
import urllib.parse
data = {
    'wd': '周杰伦',
    'sex': '男'
}
parse_data = urllib.parse.urlencode(data)
print(parse_data)

# 输出结果会自动将多个参数一起转换并拼接
# wd=%E5%91%A8%E6%9D%B0%E4%BC%A6&sex=%E7%94%B7
```

### post请求方式

案例：百度翻译

```python
'''
注意：
    1、参数必须编码 urlencode
    2、编码之后必须调用encode方法 .encode('utf-8')
    3、参数是放在请求对象定制的方法中   data
    4、Accept-Encoding头信息要注释
'''
import urllib.request
import urllib.parse
import json

url ='https://fanyi.baidu.com/sug'
headers = {
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}
keyword = input('请输入您要查询的单词')
data ={
	'kw' :keyword
}
data =urllib.parse.urlencode(data).encode('utf-8')
request = urllib.request.Request(url=url,headers=headers,data=data)
response = urllib.request.urlopen(request)
content = response.read().decode('utf-8')
print(content)
obj = json.loads(content)
print(obj)
```



## Ajax的GET请求
案例：豆瓣电影
```python
#爬取豆瓣电影前10页数据
# https://movie.douban.com/j/chart/top_list?type=20&interval_id=100%3A90&action=&start=0&limit=20
# https://movie.douban.com/j/chart/top_list?type=20&interval_id=100%3A90&action=&start=20&limit=20
# https://movie.douban.com/j/chart/top_list?type=20&interval_id=100%3A90&action=&start=40&limit=20
import urllib.request
import urllib.parse
# 下载前10页数据
# 下载的步骤:1.请求对象的定制 2.获取响应的数据 3.下载


# 每执行一次返回一个request对象
def create_request(page):
    base_url = 'https://movie.douban.com/j/chart/top_list?type=24&interval_id=100%3A90&action=&'
    data = {
        'start': (page-1)*20,
        'limit': 20
    }
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
    data = urllib.parse.urlencode(data)
    url = base_url + data
    request = urllib.request.Request(url=url, headers=headers)
    return request

# 获取响应数据
def get_content(request):
    response = urllib.request.urlopen(request)
    content = response.read().decode('utf-8')
    return content

# 下载数据
def down_load(page,content):
    with open('douban_' + str(page) + '.json', 'w', encoding='utf-8') as fp:
        fp.write(content)


# 程序入口
if __name__ == '__main__':
    start_page = int(input('请输入起始页数'))
    end_page = int(input('请输入结束页数'))
    for page in range(start_page, end_page + 1):
        request = create_request(page)
        content = get_content(request)
        down_load(page,content)
```



## Ajax的POST请求
案例：肯德基餐厅
```python
# ajax POST 请求
import urllib.request
import urllib.parse

# 请求对象定制
def create_request(page):
    base_url = 'https://www.kfc.com.cn/kfccda/ashx/GetStoreList.ashx?op=cname'

    data = {
        'cname': '北京',
        'pid': '',
        'pageIndex': page,
        'pageSize': 10,
    }
    
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
    data = urllib.parse.urlencode(data).encode('utf-8')
    request = urllib.request.Request(base_url, data=data, headers=headers)
    return request

# 获取响应数据
def get_content(request):
    response = urllib.request.urlopen(request)
    content = response.read().decode('utf-8')
    return content


# 下载数据
def down_load(content,page):
    with open('kendeji' + str(page) + '.json', 'w', encoding='utf-8') as f:
        f.write(content)


# 程序入口
if __name__ == '__main__':
    start_page = int(input('请输入起始页数'))
    end_page = int(input('请输入结束页数'))
    for page in range(start_page, end_page + 1):
        request = create_request(page)
        content = get_content(request)
        down_load(content,page)
```
## URLError/HTTPError
```text
简介:
    1.HTTPError类是URLError类的子类
    2.导入的包urllib.error.HTTPError   urllib.error.URLError
    3.http错误:http错误是针对浏览器无法连接到服务器而增加出来的错误提示。引导并告诉浏览者该页是哪里出了问题。
    4.通过ur11ib发送请求的时候，有可能会发送失败，这个时候如果想让你的代码更加的健壮，可以通过try-except进行捕获异常，异常有两类，URLError\HTTPError
```

### HTTPError

```python
# 某一界面不存在导致
import urllib.request
import urllib.error

url ='https://blog.csdn.net/2201_75584283/article/details/1423885141'

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

try:
    request = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read().decode('utf-8')
    print(content)
except urllib.error.HTTPError:
    print('系统正在维护中...')
```

### URLError

```python
# 域名地址本地就不存在导致
import urllib.request
import urllib.error

url ='https://123.com'

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

try:
    request = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read().decode('utf-8')
    print(content)
except urllib.error.URLError:
    print('系统正在维护中...')
```

### Cookie 登录

### Handle处理器
```text
为什么要学习handler?
    urllib.request.urlopen(url)
        不能定制请求头
    urllib.request.Request(url,headers,data)
        可以定制请求头
    Handler
        定制更高级的请求头(随着业务逻辑的复杂 请求对象的定制已经满足不了我们的需求(动态cookie和代理不能使用请求对象的定制)
```

```python
# 使用handler来访问百度 获取网页源码
import urllib.request
url='http://www.baidu.com'
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

request = urllib.request.Request(url=url,headers=headers)
# (1)获取handler对象
handler = urllib.request.HTTPHandler()
# (2)获取opener对象
opener = urllib.request.build_opener(handler)
# (3)调用opener方法
response = opener.open(request)
print(response.read().decode('utf-8'))
```

### 代理
```python
# 使用代理IP来访问百度 获取网页源码
# 快代理(https://www.kuaidaili.com/free/):免费代理
import urllib.request
url='http://www.baidu.com/s?wd=ip'
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

request = urllib.request.Request(url=url,headers=headers)
proxies = {
    'http': '47.121.183.107:8443',
}
# (1)获取handler对象
handler = urllib.request.ProxyHandler(proxies=proxies)
# (2)获取opener对象
opener = urllib.request.build_opener(handler)
# (3)调用opener方法
response = opener.open(request)
content = response.read().decode('utf-8')
with open('proxy.html','w',encoding='utf-8') as fp:
    fp.write(content)
```

### 代理池
```python
import urllib.request
import random

proxies_pool = [
    {'http': '47.121.183.107:8443'},
    {'http': '47.121.183.107:8444'},
    {'http': '47.121.183.107:8445'},
    {'http': '47.121.183.107:8445'}
]
url='http://www.baidu.com/s?wd=ip'
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

request = urllib.request.Request(url=url,headers=headers)
# 随机数从代理池获取代理地址
proxies = random.choice(proxies_pool)
# (1)获取handler对象
handler = urllib.request.ProxyHandler(proxies=proxies)
# (2)获取opener对象
opener = urllib.request.build_opener(handler)
# (3)调用opener方法
response = opener.open(request)
content = response.read().decode('utf-8')
with open('proxy_pool.html','w',encoding='utf-8') as fp:
    fp.write(content)
```