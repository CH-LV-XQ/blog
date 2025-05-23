---
icon: pen-to-square
date: 2025-05-23
category:
  - Docker
---

# Docker 常用命令

## 基本操作
```shell
# 启动Docker服务命令
systemctl start docker

# 停止Docker服务命令
systemctl stop docker

# 查看Docker服务运行状态
systemctl status docker

# 查看 Docker 版本
docker version

# 从 Docker 文件构建 Docker 映像
# 注意最后面还有一个”.”，表示当前路径。 
# eg：docker  build  -t  jeecg-boot:v1  .
docker  build  -t  <image>:<tag> .

# 从主机复制文件到容器
# eg: sudo docker cp /home/data123.txt 87a94228f133:/opt/
sudo docker cp <host_path> <container_id>:<container_path>

# 从容器复制文件到主机
# eg: sudo docker cp 87a94228f133:/opt/123.txt /home/data
sudo docker cp <container_id>:<container_path> <host_path>
```


## 镜像相关操作
```shell
# 查看已下载的 Docker 映像
docker images

# 搜索镜像
docker search <image_name>

# 拉取基础镜像
docker pull <image_name:版本>

# 删除镜像
docker rmi <image_name>/<image_id>

# 删除所有镜像
docker rmi $(docker images -q)

# 强制删除所有镜像
docker rmi -r $(docker images -q)

# 删除所有虚悬镜像‍
docker rmi $(docker images -q -f dangling=true)

docker image prune
```


## 容器相关操作
```shell
# 查看最近的运行容器
docker ps -l

# 查看所有正在运行的容器
docker ps -a

# 运行 Docker 映像
docker run -d --name <container_name> -p 内部端口:容器端口 <image_name:版本>

# 停止运行容器
docker stop <container_id>

# 重新运行容器
docker restart <container_id>

# 删除所有容器
docker rm $(docker ps -a -q)

# 进入 Docker 容器
docker exec -it <container-id> /bin/bash

# 退出容器到宿主机
注意：不能使用exit命令，或者Ctrl + c，这两种方式会将容器进程杀死。正确的退出方式为Ctrl + p组合键
```

## 镜像的导入导出
> 1、镜像导出
* 方式一
```shell
# docker save 【镜像ID】 > 【保存镜像名称.tar】
docker save image_id > image-save.tar
```
* 方式二
```shell
# docker save -o 【保存镜像名称.tar】 【镜像ID】
docker save -o image-save.tar image_id
```
> 2、镜像导入
* 方式一
```shell
docker load < nginx-save.tar
```
* 方式二
```shell
docker load -i nginx-save.tar
```
<font color="red">注意：使用 image_id作为参数的方式导出的镜像包进行导入会出现 none的情况，需要手动打标签</font>
```shell
# docker tag <image_id> <镜像名称：版本> 
docker tag 87a94228f133 nginx:1.21.3
```

## 容器的导入导出
> 1、容器的导出

容器的导出是将当前容器变成一个容器包
```shell
# docker export -o <容器导出名称.tar> <容器ID>
docker export -o nginx-export.tar 66b23477cdc6
```
> 2、容器包的导入
```shell
docker import nginx-export.tar nginx:1.21.3-new
```
> export 和 import 导出的是一个容器的快照, 不是镜像本身, 也就是说没有 layer。</br>
你的 dockerfile 里的 workdir, entrypoint 之类的所有东西都会丢失，commit 过的话也会丢失。</br>
快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状态），而镜像存储文件将保存完整记录，体积也更大。</br>

注意：
* docker save 保存的是镜像（image），docker export 保存的是容器（container）；

* docker load 用来载入镜像包，docker import 用来载入容器包，但两者都会恢复为镜像；

* docker load 不能对载入的镜像重命名，而 docker import 可以为镜像指定新名称。
