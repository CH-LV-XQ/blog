---
icon: pen-to-square
date: 2025-05-21
category:
  - Docker
tag:
  - Docker
---
# 解决Docker 容器日志占用空间大问题

## 查看 Docker 数据目录（镜像、容器存储位置）
```shell
docker info | grep "Docker Root Dir"

# 输出示例
Docker Root Dir: /var/lib/docker
```
## 步骤一：快速定位哪个容器导致日志暴涨
```shell
docker ps -a | grep <container-id>

# 或者直接在容器目录查看文件夹占用大小
# 根据输出的文件夹占用大小定位容器
du -h
```
或者查看日志路径对应的容器：
```shell
docker inspect <container-id> --format '{{.Name}} - {{.LogPath}}'
```

## 步骤二：查看日志内容(可省略不看内容)
不要直接 cat，否则会把终端撑爆。使用 tail 查看最后的内容：
```shell
# docker 日志默认位置，根据自身环境设置目录
tail -n 100 /var/lib/docker/containers/<container-id>/<container-id>-json.log
```
## 步骤三：立即清空日志（释放磁盘空间）
这是临时措施，不会重启容器：
```shell
> /var/lib/docker/containers/<container-id>/<container-id>-json.log
```
注意：这是将文件内容置空，文件仍存在但大小变为 0。

## 步骤四：配置日志轮转，防止再次暴涨
修改你的 docker-compose.yml 或运行参数，加入日志限制配置：
```yaml
services:
  milvus-standalone:
    image: milvusdb/milvus:v2.5.6
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
```
说明：
* 每个日志文件最大 100MB
* 最多保留 5 个轮转文件
* 日志总量最多 500MB

## 步骤五：重启容器使配置生效
```shell
docker-compose down
docker-compose up -d
```
或手动重启指定容器：
```shell
docker restart <container-id>
```
## 最佳实践建议
|  操作 | 推荐  |
|---|---|
|  生产环境日志 |  启用 max-size + max-file |
| 更高级管理  |  日志集中管理（ELK / Loki / FluentBit） |
|  调试级别 | 避免无脑开启 debug 模式  |
|  定期巡检 | du -sh /var/lib/docker/containers/*/*.log  |

## 总结
Docker 的 json-file 日志驱动默认**无大小限制**，在长时间运行服务时非常危险。我们可以：
* 临时清空日志释放空间
* 长期设置轮转策略限制日志增长
* 结合日志监控工具提升运维能力

避免磁盘“爆仓”，从这一刻开始优化你的 Docker 容器日志策略！
