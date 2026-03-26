---
icon: pen-to-square
date: 2026-03-26
category:
  - JAVA
---

# 安装 Redis 环境

1、首先添加Redis的官方仓库，可以使用以下命令：

```sh
sudo yum install epel-release
```

2、安装Redis：

```sh
sudo yum install redis
```

3、启动Redis服务

````sh
sudo systemctl start redis
````

4、设置Redis开机自启：

```sh
sudo systemctl enable redis
```

5、检查状态

```sh
sudo systemctl status redis
```

6、设置密码

```sh
# 1、打开配置文件 
vim /etc/redis.conf
# 2、找到 # requirepass foobared这一行。
# 3、取消这行的注释，并将foobared替换成你想要的密码
# 4、保存并关闭配置文件。
# 5、重启Redis服务以应用更改 
sudo systemctl restart redis
# 6、测试
redis-cli
auth 密码
```

# 卸载redis

1、使用yum卸载redis

```sh
sudo yum remove redis
```

2、清除残留文件

```sh
sudo rm -rf /etc/redis
sudo rm -rf /var/lib/redis
```

