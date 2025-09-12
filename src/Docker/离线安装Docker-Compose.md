---
icon: pen-to-square
date: 2025-05-21
category:
  - Docker
tag:
  - Docker-compose
---

# 离线安装 Docker Compose
## 步骤 1：提前下载 docker-compose 二进制文件
在有网络的环境中，下载适合 Linux 系统的 docker-compose 二进制文件：

* 访问官方发布页：https://github.com/docker/compose/releases </br>
选择适合的版本（推荐稳定版，如 v2.20.3，注意 v2 版本与 v1 命令兼容）。

* 下载对应架构的二进制文件：对于 x86_64 架构，文件名为 docker-compose-linux-x86_64； </br>
  下载链接示例（替换版本号）：</br>
  https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-linux-x86_64
## 步骤 2：将文件传输到离线 CentOS 服务器
通过 U 盘、SCP 等方式，将下载好的 docker-compose-linux-x86_64 文件传输到离线服务器的任意目录（如 /tmp）。
## 步骤 3：安装并配置 docker-compose
在离线服务器上执行以下命令：

1、移动文件到系统可执行目录

将二进制文件移动到 /usr/local/bin 并命名为 docker-compose：
```shell
sudo mv /tmp/docker-compose-linux-x86_64 /usr/local/bin/docker-compose
```
2、添加执行权限

赋予文件可执行权限：
```shell
sudo chmod +x /usr/local/bin/docker-compose
```
3、验证安装
```shell
docker-compose --version
```
若输出类似 Docker Compose version v2.20.3 的信息，说明安装成功。
