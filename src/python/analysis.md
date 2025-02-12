---
icon: pen-to-square
date: 2025-02-11
category:
  - Python
tag:
  - Python 爬虫
  - Xpath
  - JsonPath
  - BeautifulSoup
---

# 爬虫解析

## Xpath

### Xpath Helper 安装
```text
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

```
## JsonPath
## BeautifulSoup



