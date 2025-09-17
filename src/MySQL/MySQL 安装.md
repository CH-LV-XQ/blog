---
icon: pen-to-square
date: 2025-09-16
category:
  - MySQL
---

# Ubuntu系统 MySQL 安装

## MySQL 安装
### 1、更新源

```sh
sudo apt update
```

### 2、安装 mysql-server

```sh
apt install mysql-server -y
```

安装完成之后，Mysql服务将自动启动

### 3、查看服务状态

```sh
service mysql status
```

### 4、配置忽略大小写

```sh
# 1.停掉 mysql 服务
systemctl stop mysql

# 2.删除 /var/lib/mysql （建议重要数据，提前备份）
rm -rf /var/lib/mysql 

# 3.新建 /var/lib/mysql
mkdir /var/lib/mysql

# 4.授权
sudo chown -R mysql:mysql /var/lib/mysql

# 5.配置文件 [mysqld] 组下中添加 
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

# 6.初始化 lower-case-table-names=1
sudo /usr/sbin/mysqld --initialize --user=root --lower-case-table-names=1

# 7.启动服务
systemctl start mysql

# 8.经过初始化后会重置密码，给一个随机的密码
grep "A temporary password" /var/log/mysql/error.log

# 9.命令行登录并修改密码(第一次强制修改密码，否则无法操作其他命令)
mysql -uroot -p 

# 10.修改密码
mysql> alter user 'root'@'localhost' identified by '初始密码';
 
# 11.登录mysql后，查看忽略大小写是否成功
mysql> show variables like 'lower-case-table-names%';

```

### 5、新增用户

```sh
# 1.新增用户
mysql> CREATE USER 'username'@'host' IDENTIFIED BY 'password';

# 2.授权
# 所有操作
GRANT ALL ON *.* TO 'pig'@'%';
# 部分数据库
GRANT SELECT, INSERT ON databasename.user TO 'pig'@'%';
GRANT SELECT, INSERT ON databasename.* TO 'pig'@'%';

# 3.刷新权限
FLUSH PRIVILEGES;
```
### 6、移动数据存储目录

```shell
# 停掉 mysql 服务
systemctl stop mysql
# 1、创建新的存储目录并授权
sudo mkdir -p /data/mysql/data
sudo chown -R mysql:mysql /data/mysql/data
sudo chmod -R 755 /data/mysql/data

# 2、复制现有数据到新目录
sudo rsync -av /var/lib/mysql/ /data/mysql/data/
# 编辑配置文件，修改datadir路径
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

# 3、编辑配置文件
datadir = /data/mysql/data
socket = /data/mysql/data/mysql.sock

# 4、修改 AppArmor 配置
sudo vim /etc/apparmor.d/usr.sbin.mysqld
# 添加新目录权限：
/data/mysql/data/ r,
/data/mysql/data/** rwk,
# 重启 AppArmor：
sudo systemctl restart apparmor

# 启动 MySQL 服务：
sudo systemctl start mysql

# 验证配置是否生效：
mysql -u root -p -e "SELECT @@datadir;"

# 如果看到输出的是新设置的目录路径，说明移动成功。
```

### 7、移动日志存储目录

```shell
# 1、停掉 mysql 服务
systemctl stop mysql

# 2、创建新的日志目录
sudo mkdir -p /data/mysql/logs
sudo chown -R mysql:mysql /data/mysql/logs
sudo chmod 750 /data/mysql/logs  # 限制权限，增强安全性

# 3、修改 MySQL 配置文件
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
# 错误日志（必须修改）
log_error = /data/mysql/logs/error.log

# 4、处理 AppArmor 限制（如适用）
# 如果系统使用 AppArmor（如 Ubuntu），需要在其配置中添加新日志目录的访问权限：
sudo vim /etc/apparmor.d/usr.sbin.mysqld
# 新日志目录权限
/data/mysql/logs/ r,
/data/mysql/logs/** rwk,
# 保存后重启 AppArmor：
sudo systemctl restart apparmor

# 5、移动现有日志文件（可选）
# 如果已有日志文件需要保留，可将其复制到新目录：
sudo cp -a /var/log/mysql/* /data/mysql/logs/
sudo chown -R mysql:mysql /data/mysql/logs/*  # 确保权限正确

# 6、启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl status mysql  # 检查服务状态
```

### 8、开启二进制日志(bin-log)

* 修改配置文件开启

  ```shell
  # 编辑
  sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
  ```

  ```ini
  [mysqld]
  # 开启 bin-log 日志
  log_bin = /data/mysql/logs/mysql-bin.log  # 指定 bin-log 存储路径和前缀（Linux 示例）
  # log_bin = C:/ProgramData/MySQL/MySQL Server 8.0/Data/mysql-bin  # Windows 示例
  
  # 服务器唯一 ID（主从复制必须配置，取值 1-2^32-1）
  server-id = 1
  
  # 可选配置：
  binlog_format = row  # 日志格式（row 模式记录数据行变更，推荐用于主从复制）
  expire_logs_days = 7  # 日志自动过期天数（避免磁盘占满）
  max_binlog_size = 100M  # 单个 bin-log 文件最大大小（达到后自动切割）
  ```

* 重启 MySQL 服务

  ```shell
  # Linux 系统（根据安装方式选择）
  systemctl restart mysqld  # 系统服务方式
  # 或
  service mysql restart     # 服务脚本方式
  ```

* 验证 bin-log 是否开启

  ```shell
  show variables like 'log_bin';
  ```

  若输出 `Value` 为 `ON`，表示 bin-log 已成功开启：

  ```text
  +---------------+-------+
  | Variable_name | Value |
  +---------------+-------+
  | log_bin       | ON    |
  +---------------+-------+
  ```

* 再执行以下命令可查看当前 bin-log 列表：

  ```sql
  show binary logs;
  ```

* ### 注意事项

  * **权限问题**：确保配置的 `log_bin` 路径对 MySQL 进程有写入权限（如 Linux 中通常为 `mysql` 用户）。
  * **性能影响**：开启 bin-log 会略微降低数据库写入性能（因需额外记录日志），但通常在可接受范围内。
  * **日志清理**：若未配置自动过期，需定期手动清理旧日志（使用 `PURGE BINARY LOGS` 命令），避免磁盘空间耗尽。

### 9、开启慢查询

* 修改配置文件开启慢查询

```shell
# 编辑
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

```ini
[mysqld]
# 开启慢查询日志
slow_query_log = 1
slow_query_log_file = /data/mysql/logs/mysql-slow.log  # 日志文件路径（Linux 示例）
# slow_query_log_file = C:/ProgramData/MySQL/MySQL Server 8.0/Data/slow.log  # Windows 示例

# 慢查询阈值（单位：秒，超过此值的 SQL 会被记录）
long_query_time = 2

# 可选：记录未使用索引的 SQL
log_queries_not_using_indexes = 1

# 可选：记录管理语句（如 ALTER TABLE 等，默认不记录）
log_slow_admin_statements = 1
```

* ### 验证慢查询日志是否开启

```sql
-- 查看慢查询日志是否开启 slow_query_log 的值为 ON 或 1，表示已成功开启。
show variables like 'slow_query_log';

-- 查看慢查询阈值
show variables like 'long_query_time';

-- 查看日志文件路径
show variables like 'slow_query_log_file';
```

* ### 分析慢查询日志

慢查询日志记录了符合条件的 SQL 语句及其执行时间等信息。可以直接查看日志文件：

```shell
# Linux 示例
cat /data/mysql/logs/mysql-slow.log
```

也可以使用 MySQL 自带的 `mysqldumpslow` 工具分析日志（更清晰）：

```shell
# 查看最耗时的 10 条 SQL
mysqldumpslow -s t -t 10 /data/mysql/logs/mysql-slow.log

# 查看访问次数最多的 10 条 SQL
mysqldumpslow -s c -t 10 /data/mysql/logs/mysql-slow.log
```

* ### 临时开启（无需重启 MySQL）

登录 MySQL 客户端，执行以下命令临时开启慢查询日志（重启服务后失效）：

```sql
-- 开启慢查询日志
set global slow_query_log = on;

-- 设置慢查询阈值（单位：秒，这里示例为 2 秒，即执行时间超过 2 秒的 SQL 会被记录）
set global long_query_time = 2;

-- 可选：设置慢查询日志存储路径（默认在数据目录）
set global slow_query_log_file = '/var/lib/mysql/slow.log';  -- Linux 示例
-- set global slow_query_log_file = 'C:/ProgramData/MySQL/MySQL Server 8.0/Data/slow.log';  -- Windows 示例

-- 可选：记录未使用索引的 SQL（即使执行时间未超过阈值）
set global log_queries_not_using_indexes = on;
```

* ### 注意事项

  - **性能影响**：开启慢查询日志会有轻微性能损耗（尤其是记录所有未使用索引的 SQL 时），生产环境建议设置合理的阈值（如 1-5 秒）。

  - **日志清理**：慢查询日志会不断增长，需定期清理或通过日志轮转工具（如 `logrotate`）管理。

## MySQL 卸载

```shell
# 首先我们需要查看mysql依赖项，输入如下代码
dpkg --list | grep mysql
# 然后我们就来卸载mysql-common，输入如下代码
sudo apt remove mysql-common
# 接下来我们就可以卸载并清除mysql8.0，输入如下代码：
sudo apt autoremove --purge mysql-server-8.0
sudo apt-get remove --purge [安装包名称]
# 接下来我们就要来清除残留数据，输入如下代码：
dpkg -l | grep ^rc| awk '{print$2}'| sudo xargs dpkg -P
# 接下来我们在此检查依赖项，输入如下代码：
dpkg --list | grep mysql
# 如果输出为空，那么表示mysql已经彻底卸载干净了，如果不为空那么我们还要继续进行删除卸载，继续输入如下代码：
sudo apt autoremove --purge mysql-apt-config
# 最后，删除MySQL相关的配置文件
sudo apt-get autoremove
# 删除数据目录
sudo rm -rf /var/lib/mysql
# 到底为止，Ubuntu上的mysql就已经彻底删除卸载干净了。
```
