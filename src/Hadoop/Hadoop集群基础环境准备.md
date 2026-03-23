---
title: 基础环境准备
index: false
icon: laptop-code
category:
  - Hadoop
---
# Hadoop集群基础环境准备.md

上传【datasophon-manager\1.2.1】、【DDP-1.2.1】、【DDP-其他相关】目录下所有的文件到集群第一台服务器的/opt/datasophon/DDP/packages目录下：

![image-20240914170741295](images\base_images\image-20240914170741295.png)

### 1）、操作系统环境准备

#### （1）、修改主机名

<font color="red">按照大数据机器规划，三台机器分别修改主机名</font>

```shell
[root@hadoop-cdh01 datasophon]# vim /etc/hostname 
# 示例：hadoop-cdh01.hxkr.com
```

#### （2）、主机名映射

<font color="red">三台机器均操作</font>

```shell
[root@hadoop-cdh01 datasophon]# vim /etc/hosts
```

![image-20240809190329018](images\base_images\image-20240809190329018.png)

#### （3）、关闭防火墙

<font color="red">三台机器均操作</font>

```shell
[root@hadoop-cdh01 datasophon]# systemctl stop firewalld
[root@hadoop-cdh01 datasophon]# systemctl disable firewalld
```

#### （4）、关闭selinux

<font color="red">三台机器均操作</font>

```shell
[root@hadoop-cdh01 datasophon]# vim /etc/selinux/config 
```

![selinux_img.png](images\base_images\selinux_img.png)

#### （5）、免密登录

<font color="red">三台机器均操作</font>

```shell
## 按照提示全部回车即可
[root@hadoop-cdh01 datasophon]# ssh-keygen -t rsa -m PEM
## 按照提示输入密码回车即可，以后再SSH远程登录就不需要输密码了
[root@hadoop-cdh01 datasophon]# ssh-copy-id hadoop-cdh01.hxkr.com
[root@hadoop-cdh01 datasophon]# ssh-copy-id hadoop-cdh02.hxkr.com
[root@hadoop-cdh01 datasophon]# ssh-copy-id hadoop-cdh03.hxkr.com
```

#### （6）、修改limits.conf

<font color="red">三台机器均操作</font>

用于配置用户或用户组资源限制的配置文件。限制着用户可以使用的最大文件数，最大线程，最大内存等资源使用量。

```shell
[root@hadoop-cdh13 packages]# vim /etc/security/limits.conf
```

在最后追加如下内容：

```shell
* soft nofile 655360
* hard nofile  655360
* soft nproc 655360
* hard nproc 655360
```

![image-20240903170008274](images\base_images\image-20240903170008274.png)

#### （7）、修改sysctl.conf

在文件末尾追加：vm.max_map_count = 262144

```shell
[root@hadoop-cdh11 logs]# vim /etc/sysctl.conf
[root@hadoop-cdh11 logs]# sysctl -p
```

### 2）、本地YUM源配置

如果部署环境联网，该步骤可以忽略。如果部署环境在不联网的情况下进行，需要搭建本地yum源，用以安装在使用过程中遇到的依赖环境。<font color="red">以下命令在所有节点上进行</font>：

```shell
## 进入到/mnt目录下，上传镜像iso到该目录下
[root@hadoop-cdh01 mnt]# cd /mnt/ && ll
total 4669442
-rw-r--r--. 1 root root 4781506560 Aug  8 18:24 CentOS-7-x86_64-DVD-2003.iso
drwxr-xr-x. 8 root root       2048 Apr 22  2020 iso
## 创建挂载目录，并将iso挂载到该目录下
[root@hadoop-cdh01 mnt]# mkdir iso
[root@hadoop-cdh01 mnt]# mount -o loop CentOS-7-x86_64-DVD-2003.iso ./iso/
## 进入到yum源配置目录下，将默认的yum配置移动到备份目录下
[root@hadoop-cdh01 mnt]# cd /etc/yum.repos.d/
[root@hadoop-cdh01 mnt]# mkdir bak
[root@hadoop-cdh01 mnt]# mv *.repo bak/
## 创建新的yum源配置，并配置
[root@hadoop-cdh01 yum.repos.d]# vim Centos-7-Base.repo 
```

![image-20240812084029459](images\base_images\image-20240812084029459.png)

```shell
[c7-media]
name=c7-media
baseurl=file:///mnt/iso/
gpgcheck=0
enabled=1
gpgkey=file:///mnt/iso/RPM-GPG-KEY-CentOS-7
```

```shell
## 更新缓存（如果报错，请保证iso镜像与操作系统一致）
[root@hadoop-cdh01 yum.repos.d]# yum clean all
[root@hadoop-cdh01 yum.repos.d]# yum makecache
```

### 3）、NTP服务器

<font color='red'>如果部署环境联网，该步骤可以忽略，如果不联网，一定要做。</font>

因为大数据平台对集群时间同步有着非常严格的要求，即使慢3-5秒，平台就会出现故障。因此搭建NTP服务器保证时间同步是非常重要的步骤。

此次使用了hadoop-cdh03.hxkr.com作为ntp服务器，其它节点定时向该节点同步时间。

#### （1）、主服务器配置

hadoop-cdh03.hxkr.com机器上执行

```shell
## 修改NTP配置文件
[root@hadoop-cdh03 ~]# vim /etc/ntp.conf 
```

![image-20240809191652291](images\base_images\image-20240809191652291.png)

```shell
## 启动NTP服务
[root@hadoop-cdh03 ~]# systemctl status ntpd
```

#### （2）、客户端配置

hadoop-cdh01.hxkr.com、hadoop-cdh02.hxkr.com上执行

```shell
[root@hadoop-cdh01 ~]# crontab -e
```

添加如下配置：0-59/10 * * * * /usr/sbin/ntpdate hadoop-cdh03.hxkr.com

![image-20240809191955563](images\base_images\image-20240809191955563.png)

### 4）、MySQL部署

rpm包部署方式，此种方式对系统架构要要求，如果【解压安装】步骤失败，请跳转到下一章节的MySQL部署

#### （1）、下载地址

下载地址:https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-8.0.34-1.el7.x86_64.rpm-bundle.tar

#### （2）、解压并安装

```shell
## 解压之前先卸载mysql有关的安装包
[root@hadoop-cdh01 data]# rpm -qa | grep mariadb
[root@hadoop-cdh01 data]# rpm -e --nodeps ${上面那条命令查询的内容}
[root@hadoop-cdh01 data]# cd /opt/datasophon/mysql
[root@hadoop-cdh01 data]# tar -xvf mysql-8.0.34-1.el7.x86_64.rpm-bundle.tar
```

![image-20240808194615964](images\base_images\image-20240808194615964.png)

```shell
## 删除系统自带的MySQL
[root@hadoop-cdh01 mysql]# rpm -qa | grep mysql | xargs rpm -e --nodeps
## 安装
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-common-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-common-8.0.34-1.e################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-client-plugins-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-client-plugins-8.################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-libs-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-libs-8.0.34-1.el7################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-libs-compat-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-libs-compat-8.0.3################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-client-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-client-8.0.34-1.e################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-icu-data-files-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-icu-data-files-8.################################# [100%]
[root@hadoop-cdh01 mysql]# rpm -ivh mysql-community-server-8.0.34-1.el7.x86_64.rpm
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql-community-server-8.0.34-1.e################################# [100%]
[root@hadoop-cdh01 mysql]# mysql -V
mysql  Ver 8.0.34 for Linux on x86_64 (MySQL Community Server - GPL)
```

#### （3）、初始化数据库

<div style="background-color: red;font-size 15px;">如果需要修改配置，请在初始化数据库之前修改，配置文件路径:/et/my.cnf</div>

```shell
## 初始化
[root@hadoop-cdh01 mysql-8.0.34]# mysqld --initialize --user=mysql --basedir=/opt/datasophon/mysql-8.0.34 --datadir=/data/mysql/data
## 启动mysql
[root@hadoop-cdh01 mysql-8.0.34]# systemctl start mysqld
## 查看临时密码
[root@hadoop-cdh01 mysql-8.0.34]# grep 'temporary password' /var/log/mysqld.log
2024-08-08T11:30:21.252929Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: S!fZod8F:L4e
2024-08-08T11:30:58.684684Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: Nm*_yoKi2Dre
```

#### （4）、配置MySQL

```shell
[root@hadoop-cdh01 mysql-8.0.34]# mysql_secure_installation
```

![image-20240808195226875](images\base_images\image-20240808195226875.png)

![image-20240808195242013](images\base_images\image-20240808195242013.png)

#### （5）、开启root远程登陆

```sql
mysql> update user set host='%' where user='root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> flush privileges;
Query OK, 0 rows affected (0.01 sec)

mysql> exit;
Bye
[root@hadoop-cdh01 mysql-8.0.34]# systemctl restart mysqld
```

### 5）、MySQL部署

tar包部署，此种部署方式对系统架构要求不高

选择跟服务器glibc版本相对应的mysql安装包：

```shell
[root@DataEase bin]# rpm -qa | grep glibc
glibc-2.17-307.el7.1.x86_64
```

下载地址：https://downloads.mysql.com/archives/community/

![image-20240914162548520](images\base_images\image-20240914162548520.png)

#### （1）、解压安装

```shell
## 解压：mysql包在哪个目录下就去哪个目录下执行
[root@DataEase software]# tar -zxvf mysql-8.0.34-linux-glibc2.17-x86_64.tar.gz 
## 改名
[root@DataEase software]# mv mysql-8.0.34-linux-glibc2.17-x86_64 mysql
## 移动到/usr/local
[root@DataEase software]# mv mysql /usr/local/
```

#### （2）、增加mysql用户组

```shell
[root@DataEase mysql]# groupadd mysql
[root@DataEase mysql]# useradd -g mysql mysql
```

#### （3）、创建必须的目录

```shell
## mysql数据目录
[root@DataEase mysql]# mkdir /usr/local/mysql/data
## mysql日志目录
[root@DataEase mysql]# mkdir /usr/local/mysql/logs
## mysql 建立连接时存放.sock 文件的目录
[root@DataEase mysql]# mkdir /var/lib/mysql
[root@DataEase mysql]# cd logs/
## 在logs目录创建日志文件
[root@DataEase logs]# touch mysql.log
## 修改目录权限为mysql
[root@DataEase logs]# chown -R mysql:mysql /usr/local/mysql
[root@DataEase logs]# chown -R mysql:mysql /var/lib/mysql
```

#### （4）、配置文件调整

```shell
[root@DataEase logs]# vim /etc/my.cnf
```

```shell
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/8.0/en/server-configuration-defaults.html

[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove the leading "# " to disable binary logging
# Binary logging captures changes between backups and is enabled by
# default. It's default setting is log_bin=binlog
# disable_log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M
#
# Remove leading # to revert to previous value for default_authentication_plugin,
# this will increase compatibility with older clients. For background, see:
# https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
# default-authentication-plugin=mysql_native_password

datadir=/usr/local/mysql/data
socket=/usr/local/mysql/mysql.sock
sql_mode=STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITut

log-error=/usr/local/mysql/logs/mysql.log
pid-file=/usr/local/mysql/logs/mysql.pid
#设置不区分大小写
lower_case_table_names=1
```

```shell
## 修改权限
[root@DataEase mysql]# chown -R mysql:mysql /etc/my.cnf 
[root@DataEase mysql]# chown 644 /etc/my.cnf 
```

#### （5）、初始化mysql

```shell
[root@DataEase mysql]# cd /usr/local/mysql/bin/
[root@DataEase bin]# ./mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data
```

#### （6）、查看mysql初始密码

```shell
[root@DataEase bin]# cat ../logs/mysql.log 
```

![image-20240914162838899](images\base_images\image-20240914162838899.png)

#### （7）、复制mysql.server 到 /etc/init.d 目录下

```shell
[root@DataEase bin]# cd /usr/local/mysql/
[root@DataEase mysql]# cp support-files/mysql.server /etc/init.d/mysql
```

#### （8）、启动mysql

```shell
[root@DataEase mysql]# service mysql start
Starting MySQL. SUCCESS! 
```

#### （9）、配置环境变量

```shell
[root@DataEase mysql]# vim /etc/profile
```

![image-20240914163302890](images\base_images\image-20240914163302890.png)

```shell
[root@DataEase mysql]# source /etc/profile
```

#### （10）、修改默认密码

```shell
## 初始化时生成的临时密码
[root@DataEase mysql]# mysql -uroot -ps_Glj+UkD2_x
mysql> alter user 'root'@'localhost' identified by 'HXKR@123.com' ;
```

![image-20240914164327331](images\base_images\image-20240914164327331.png)

#### （11）、调整mysql可远程访问

```shell
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> update user set host='%' where user = 'root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

重启mysql使配置生效

```shell
[root@DataEase mysql]# service mysql restart
```

### 6）、Apache服务器（可不装）

在hadoop-cdh01.hxkr.com上执行

```shell
## 安装
[root@hadoop-cdh01 datasophon]# yum install -y http*
## 开机启动
[root@hadoop-cdh01 datasophon]# systemctl enable httpd
## 立即启动
[root@hadoop-cdh01 datasophon]# systemctl start httpd
```

浏览器访问http://hadoop-cdh01.hxkr.com/

Apache服务器文件根目录：/var/www/html

### 7）、自定义shell脚本

#### （1）、xsync自动分发脚本

```shell
[root@hadoop-cdh11 bin]# vim /usr/local/bin/xsync 
```

```shell
#!/bin/bash
#1. 判断参数个数
if [ $# -lt 1 ]
then
 echo Not Enough Arguement!
 exit;
fi
#2. 遍历集群所有机器（忽略本机）
for host in  hadoop-cdh12.hxkr.com  hadoop-cdh13.hxkr.com
do
 echo ==================== $host ====================
 #3. 遍历所有目录，挨个发送
 for file in $@
 do
 #4. 判断文件是否存在
 if [ -e $file ]
 then
 #5. 获取父目录
 pdir=$(cd -P $(dirname $file); pwd)
 #6. 获取当前文件的名称
 fname=$(basename $file)
 ssh $host "mkdir -p $pdir"
 rsync -av $pdir/$fname $host:$pdir
 else
 echo $file does not exists!
 fi
 done
done
```

```shell
[root@hadoop-cdh11 bin]# chmod +x /usr/local/bin/xsync 
```

#### （2）、xcall一键执行命令到所有节点

```shell
[root@hadoop-cdh11 bin]# vim /usr/local/bin/xcall
```

```shell
#!/bin/bash
# 遍历所有机器
for host in hadoop-cdh11.hxkr.com hadoop-cdh12.hxkr.com hadoop-cdh13.hxkr.com
do
 echo =============== $host ===============
 ssh $host $1
done
```

```shell
[root@hadoop-cdh11 bin]# chmod +x /usr/local/bin/xcall 
```

比如，查看所有节点的java进程，或者查看所有机器的系统时间

```shell
[root@hadoop-cdh11 bin]# xcall jps
[root@hadoop-cdh11 bin]# xcall date
```

### 8）、Python 安装
需要安装 python2.7.x版本

1. 先安装依赖（必须）
```shell
sudo yum install -y gcc gcc-c++ make zlib zlib-devel openssl-devel bzip2-devel libffi-devel
```
2. 下载 Python 2.7.18（官方最后一版）
```shell
cd /usr/local/src
wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz
```
3. 解压编译安装
```shell
tar -zxvf Python-2.7.18.tgz
cd Python-2.7.18
./configure --prefix=/usr/local/python27
make && sudo make install
```
4. 创建软链接（让系统识别 python2 /pip2）
```shell
# 注意：这里创建软连接/usr/bin/python 要查看是否被占用，不能python3 占用
sudo ln -s /usr/local/python27/bin/python2.7 /usr/bin/python
```
5. 验证安装成功
```shell
python --version
# 出现这个内容 Python 2.7.18 即为安装成功
```
### 9）、检查JDK 安装情况
