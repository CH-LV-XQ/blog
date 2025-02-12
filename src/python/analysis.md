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

# 解析

## Xpath
```text
Xpath Helper 安装
	1、打开chrome浏览器
	2、打开扩展程序
	3、在Chorme商店搜索安装Xpath Helper
	4、安装成功后重新启动chorme浏览器
	5、打开网页执行快捷键Ctrt + Shift + X运行
	6、顶部出现小黑框，证明安装成功
```
```text
xpath使用：
	注意：提前安排xpath插件
	1、安装lxml库
		conda install lxml
		pip install lxml - http://pypi.douban.com/simple
	2、导入lxml.etree
		from lxml import etree
	3、etree.parse()  解析本地文件
		html_tree = etree.parse('xx.html')
	4、etree.HTML()	  服务器响应文件
		html_tree = etree.HTML(response.read().decode('utf-8'))
	5、html_tree.xpath(xpath路径)
```
## JsonPath
## BeautifulSoup



