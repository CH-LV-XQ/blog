---
icon: pen-to-square
date: 2025-02-11
category:
  - Python
tag:
  - Python 爬虫
  - Xpath
  - BeautifulSoup
---

# 爬虫解析——Xpath

## Xpath

### Xpath Helper 安装
```text
作用：
	在网页直接定位测试编写的表达式是否正确
安装方式：
	1、打开chrome浏览器
	2、打开扩展程序
	3、在Chorme商店搜索安装Xpath Helper
	4、安装成功后重新启动chorme浏览器
	5、打开网页执行快捷键Ctrt + Shift + X运行
	6、顶部出现小黑框，证明安装成功
```
### xpath依赖下载及使用步骤
```text
注意：提前安排xpath插件
1、安装lxml库
	注意：
		安装时python3.7及以下才能安装成功。
		安装位置：Python安装路径下Scripts文件夹中
	conda install lxml
	pip install lxml - http://pypi.douban.com/simple
2、导入lxml.etree
	from lxml import etree
	注意：若果第一步安装成功，导入依赖还是报错
		1.安装位置错了。检查PyCharm编辑器设置中python解释器中右侧列表中有没有
		2.如果有，重启解决
3、第一种解析本地文件 etree.parse()  
	html_tree = etree.parse('xx.html')
4、第二种服务器响应文件 etree.HTML() 
	html_tree = etree.HTML(response.read().decode('utf-8'))
5、html_tree.xpath(xpath路径)
```
### Xpath基本语法
```text
1.路径查询
	//：查询所有子孙节点，不考虑层级关系
	/ ：找直接子节点
2.谓词查询
	//div[@id]
	//div[@id="maincontent"]
3.属性查询
	//@class
4.模糊查询
	//div[contains(@id,"he")]
	//div[starts-with(@id,"he")]
5.内容查询
	//div/h1/text()
6.逻辑运算
	//div[@id="head" and @class="s_down"]   谁和谁
	//title ｜ //price						谁或谁
```
本地html文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Title</title>
</head>
<body>
	<ul>
		<li id="l1" class="c1">北京</li>
		<li id="l2">上海</li>
		<li id="c3">深圳</li>
		<li id="c4">武汉</li>
	</ul>
	<ul>
		<li>大连</li>
		<li>锦州</li>
		<li>沈阳</li>
	</ul>
</body>
</html>
```
```python
# xpath 解析本地文件(电脑本地文件)
from lxml import etree

# (1)xpath 解析本地文件
tree = etree.parse('本地文件.html')

# (2)查找ul下面的li
li_list = tree.xpath('//body//ul/li')
print(li_list)
print(len(li_list))


# 查找所有有id属性的li标签
# text() 获取标签中的内容
id_li_text = tree.xpath('//ul/li[@id]/text()')
print(id_li_text)
# 输出结果： ['北京','上海']



# 找到id=l1的li标签  注意id值的引号，不加引号获取不到值
l1_li_text = tree.xpath('//ul/li[@id="l1"]/text()')
print(l1_li_text)
# 输出结果：['北京']




# 查找到id为11的Ii标签的CIass的属性值
class_li_text = tree.xpath('//ul/li[@id="l1"]/@class')
print(class_li_text)
# 输出结果：['c1']



# 模糊包含查询：查询id中包含l的li标签
contains_li_list = tree.xpath('//ul/li[contains(@id,"l")]/text()')
print(contains_li_list)
# 输出结果：['北京', '上海']


#模糊查询：查询id的值以1开头的li标签
with_li_list = tree. xpath('//ul/li[starts-with(@id, "l")]/text()')
print(with_li_list)
# 输出结果：['北京', '上海']



#查询id为l1和Class为C1的li标签
and_li_list = tree.xpath('//ul/li[@id="l1" and @class="c1"]/text()')
print(and_li_list)
# 输出结果：['北京']

# 查询id为l1或者id为l1的li标签
or_li_list = tree.xpath('//ul/li[@id="l1"]/text() | //ul/li[@id="l2"]/text()') 
print(or_li_list)
# 输出结果：['北京', '上海']

```
```python
# xpath 解析服务器响应文件 response.read().decode('utf-8')
import urllib.request
from lxml import etree
url='http://www.baidu.com'
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

request = urllib.request.Request(url=url,headers=headers)
response = urllib.request.urlopen(request)
content = response.read().decode('utf-8')
tree = etree.HTML(content)

# 获取想要的数据 百度一下 四个字  xpath返回值是一个数组列表
result = tree.xpath('//input[@id="su"]/@value')[0]
print(result)

# 输出结果  百度一下
```

案例：站长前10页图片
```python
import urllib.request
from lxml import etree
# 需求 下载的前十页的图片
# https://sc.chinaz.com/tupian/qinglvtupian.html       第一页数据
# https://sc.chinaz.com/tupian/qinglvtupian_2.html     第二页数据
# # https://sc.chinaz.com/tupian/qinglvtupian_3.html   第三页数据

# (1)请求对象定制
def create_request(page):
	if(page == 1):
		url = 'https://sc.chinaz.com/tupian/qinglvtupian.html'
	else:
		url = 'https://sc.chinaz.com/tupian/qinglvtupian' + str(page) + '.html'
		
	headers = {
	    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
	}
	request = urllib.request.Request(url = url, headers=headers)
	return request
# (2)获取响应数据
def get_content(request):
    response = urllib.request.urlopen(request)
    content = response.read().decode('utf-8')
    return content

# (3) 下载
def down_load(content):
	p
	# 下载图片
	# urllib.request.urlretrieve（'图片地址’，‘文件的名字"）
	tree = etree.HTML(content)
	name_list = tree. xpath('//div[@id="container"]//a/img/@alt')
	# 一般涉及到图片的网站都会进行懒加载 路径名默认src2，只有展示的时候才会变为src
	src_list = tree. xpath('//div[@id="container"]//a/img/@src2')
	print(len(name_list))
	for i in range(len(name_list)):
		name = name_list[i]
		src = src_list[i]
		url = 'https:' + src
		# 图片保存路径如果需要设置文件夹，则拼接即可 如：'./img/' + name + '.jpg'
		urllib.request.urlretrieve(url = url,filename = './img/' + name + '.jpg')

# 程序入口
if __name__ == '__main__':
    start_page = int(input('请输入起始页数'))
    end_page = int(input('请输入结束页数'))
	for page in range(start_page, end_page + 1):
		# (1) 请求对象定制
		request = create_request(page)
		# (2) 获取网页源码
		content = get_content(request)
		# (3) 下载
		down_load(content)
```
## JsonPath
## BeautifulSoup



