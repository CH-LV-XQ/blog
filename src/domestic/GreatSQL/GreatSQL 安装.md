---
title: GreatSQL
index: false
icon: laptop-code
category:
  - 信创
---

# GreatSQL安装
GreatSQL 数据库是一款 开源免费 数据库，可在普通硬件上满足金融级应用场景，具有 高可用、高性能、高兼容、高安全 等特性，可作为 MySQL 或 Percona Server for MySQL 的理想可选替换。
## 下载地址

[官网地址](https://github.com/GreatSQL/GreatSQL)

[下载地址](https://gitee.com/GreatSQL/GreatSQL/releases/tag/GreatSQL-8.4.4-4)

## 解压并安装

- 依赖安装

```bash
[root@hadoop-cdh01 opt]# yum install -y epel-release
[root@hadoop-cdh01 opt]# yum install -y pkg-config perl libaio-devel numactl-devel numactl-libs \
> net-tools openssl openssl-devel jemalloc jemalloc-devel \
> perl-Data-Dumper perl-Digest-MD5 perl-JSON perl-Test-Simple
```

- 解压之前先卸载mysql有关的安装包

```bash
# 查看是否安装 mariadb
rpm -qa | grep mariadb

#输出
mariadb-5.5.68-1.el7.x86_64
mariadb-server-5.5.68-1.el7.x86_64
mariadb-libs-5.5.68-1.el7.x86_64


# 卸载安装的程序
rpm -e --nodeps ${上面那条命令查询的内容}
rpm -e --nodeps mariadb-5.5.68-1.el7.x86_64
rpm -e --nodeps mariadb-server-5.5.68-1.el7.x86_64
rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64
```

```bash
# 查看是否安装 mysql
rpm -qa | grep mysql

# 输出
akonadi-mysql-1.9.2-4.el7.x86_64
qt-mysql-4.8.7-8.el7.x86_64

# 卸载操作
rpm -e --nodeps akonadi-mysql-1.9.2-4.el7.x86_64
rpm -e --nodeps qt-mysql-4.8.7-8.el7.x86_64
```

```bash
# 删除系统自带的MySQL
rpm -qa | grep mysql | xargs rpm -e --nodeps
```

```bash
sudo systemctl stop mysqld mariadb 2>/dev/null
sudo dnf remove -y *mysql* *mariadb*
sudo rm -rf /var/lib/mysql /etc/my.cnf* /var/log/mysqld.log
```

* 安装

```bash
[root@hadoop-cdh01 opt]# tar -Jxvf greatsql-8.4.4-4.1.el7.amd64.rpm-bundle.tar.xz
greatsql-client-8.4.4-4.1.el7.x86_64.rpm
greatsql-devel-8.4.4-4.1.el7.x86_64.rpm
greatsql-icu-data-files-8.4.4-4.1.el7.x86_64.rpm
greatsql-server-8.4.4-4.1.el7.x86_64.rpm
greatsql-shared-8.4.4-4.1.el7.x86_64.rpm
# 安装
[root@hadoop-cdh01 opt]# rpm -ivh --nodeps greatsql-*.rpm
```

* 创建数据目录

```bash
mkdir -p /data/mysql/{data,log,binlog,relaylog,tmp}
chown -R mysql:mysql /data
chmod 750 /data/mysql
# 提前移动默认数据（避免启动失败）
mv /var/lib/mysql /var/lib/mysql.bak
```

* 修改配置文件

```bash
cat > /etc/my.cnf <<'EOF'
[mysqld]
# 基础设置
port=3307
lower_case_table_names=1
datadir=/data/mysql/data
socket=/data/mysql/mysql.sock
pid-file=/data/mysql/mysqld.pid
tmpdir=/data/mysql/tmp
# 时区
default-time-zone=+08:00

# 日志相关
log-error=/data/mysql/log/mysqld.log
slow-query-log=1
slow-query-log-file=/data/mysql/log/slow.log
long-query-time=2

# binlog
server-id=1
log-bin=/data/mysql/binlog/mysql-bin
binlog_format=ROW
# 自动清理 binlog 单位是秒
binlog_expire_logs_seconds=1728000
max_binlog_size=1G

# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

sql-mode="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION"
# group_concat 长度 自定义字段需要
group_concat_max_len=1024000
# 信任函数
log_bin_trust_function_creators=1
max_allowed_packet=128M
max_connections=2000

innodb_redo_log_capacity=1073741824
innodb_strict_mode=1

max_connect_errors=100
max_user_connections=0


[client]
socket=/data/mysql/mysql.sock
default-character-set=utf8mb4
EOF
```

* 初始化系统库

```bash
mysqld --initialize --user=mysql --datadir=/data/mysql/data
# 获取临时密码
grep 'temporary password' /data/mysql/log/mysqld.log
```

* 启动并加入开机自启

```bash
systemctl start mysqld

# 如果启动报错，可临时关闭 SELinux（快速测试，重启失效） 
setenforce 0

systemctl enable mysqld
systemctl status mysqld          # 确认 active (running)
```

* 首次登录并改密

```bash
mysql -uroot -p

ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNew@Pass4!';

flush privileges;
```

* 验证目录

```bash
mysql -uroot -pMyNew@Pass4! -e "select @@datadir,@@log_error;"

mysql: [Warning] Using a password on the command line interface can be insecure.
+-------------------+----------------------------+
| @@datadir         | @@log_error                |
+-------------------+----------------------------+
| /data/mysql/data/ | /data/mysql/log/mysqld.log |
+-------------------+----------------------------+
```



## 卸载

```bash
# 1. 查看已安装的 GreatSQL 相关包
rpm -qa | grep -i greatsql
rpm -qa | grep -i mysql

# 2. 停止服务
systemctl stop mysqld

# 3. 卸载所有相关包（根据第1步查出的包名）
rpm -e --nodeps greatsql-server-8.0.32-25
rpm -e --nodeps greatsql-client-8.0.32-25
rpm -e --nodeps greatsql-common-8.0.32-25
rpm -e --nodeps greatsql-libs-8.0.32-25

# 或者一条命令卸载全部
rpm -qa | grep greatsql | xargs rpm -e --nodeps
rpm -qa | grep  mysql | xargs rpm -e --nodeps

# 4. 删除数据目录和配置文件
rm -rf /data/GreatSQL
rm -rf /var/lib/mysql
rm -rf /var/log/mysqld.log
rm -f /etc/my.cnf
rm -f /etc/my.cnf.d/

# 5. 删除残留用户（可选）
userdel -r mysql
```

