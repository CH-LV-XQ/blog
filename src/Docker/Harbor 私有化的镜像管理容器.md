---
icon: pen-to-square
date: 2025-09-18
category:
- Docker
---

# Harbor 私有化的镜像管理容器


## 简介
Harbor 是一个开源的企业级 Docker 镜像仓库管理工具，由 VMware 公司开源并贡献给 CNCF（Cloud Native Computing Foundation）。它提供了镜像存储、镜像复制、用户管理、访问控制、漏洞扫描等丰富的功能，特别适合企业级环境使用。
### 1、Harbor基本介绍
Harbor 是一个开源的企业级 Docker 镜像仓库管理工具，专为云原生环境设计。以下是其核心特性的简单描述：
* 镜像管理

  支持 Docker 镜像的存储、复制和清理。
* 安全性 
  
  提供漏洞扫描、内容信任、基于角色的访问控制（RBAC）和 HTTPS 加密。
* 用户认证

  支持本地用户、LDAP/AD 集成和 OIDC（OpenID Connect）。
* 镜像复制

  支持跨多个 Harbor 实例的镜像同步，适合多数据中心或混合云。
* 高可用性

  支持分布式存储和集群部署，确保稳定性和可扩展性。
* 用户友好

  提供直观的 Web UI 和完整的 RESTful API。
* Kubernetes 集成

  支持 Helm Chart 部署，适合云原生环境。
* 开源免费

  完全开源，拥有活跃的社区支持。
 
Harbor 是企业级镜像管理的理想选择，特别适合需要高安全性和多租户支持的环境。
### 2、Harbor下载
[下载地址](https://github.com/goharbor/harbor/releases)
## 部署步骤
这个配置使用了 Harbor v2.8.0 版本，你可以根据需要修改为最新版本。部署完成后，你就可以使用这个私有 Docker 镜像仓库来管理你的容器镜像了。
### 1、准备环境：
* 确保已安装 Docker 和 Docker Compose
* 创建必要的目录结构：
```shell
mkdir -p /data/{database,registry,redis,secret}
mkdir -p ./common/config/{log,registry,db,core,nginx,registryctl,shared/trust-certificates}
```

### 2、配置 Harbor：
* 修改 docker-compose.yml 中的配置，如端口映射、数据存储路径等
* 默认用户名是 admin，密码是 Harbor12345
```yaml
version: '2.3'

services:
  log:
    image: goharbor/harbor-log:v2.8.0
    container_name: harbor-log
    restart: always
    volumes:
      - /var/log/harbor:/var/log/docker/harbor
      - type: bind
        source: ./common/config/log/logrotate.conf
        target: /etc/logrotate.d/logrotate.conf
      - type: bind
        source: ./common/config/log/rsyslog_docker.conf
        target: /etc/rsyslog.d/rsyslog_docker.conf
    ports:
      - 127.0.0.1:1514:10514
    networks:
      - harbor
    environment:
      - ROTATE_LOGS=true
      - LOG_LEVEL=info
    cap_drop:
      - ALL

  registry:
    image: goharbor/registry-photon:v2.8.0
    container_name: registry
    restart: always
    volumes:
      - /data/registry:/storage
      - ./common/config/registry/:/etc/registry/
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "registry"
    environment:
      - GODEBUG=netdns=cgo
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - DAC_OVERRIDE

  postgresql:
    image: goharbor/harbor-db:v2.8.0
    container_name: harbor-db
    restart: always
    volumes:
      - /data/database:/var/lib/postgresql/data
      - ./common/config/db/:/var/lib/postgresql/data/pg_hba.conf.d/
    networks:
      - harbor
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "postgresql"
    environment:
      - POSTGRES_PASSWORD=root123
      - POSTGRES_USER=postgres
      - POSTGRES_DB=registry
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - DAC_OVERRIDE
      - SETGID
      - SETUID

  redis:
    image: goharbor/redis-photon:v2.8.0
    container_name: redis
    restart: always
    volumes:
      - /data/redis:/data
    networks:
      - harbor
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "redis"
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
      - DAC_OVERRIDE

  core:
    image: goharbor/harbor-core:v2.8.0
    container_name: harbor-core
    restart: always
    volumes:
      - /data/secret:/etc/secrets
      - /data:/data
      - ./common/config/core/app.conf:/etc/core/app.conf
      - ./common/config/core/private_key.pem:/etc/core/private_key.pem
      - ./common/config/core/certificates/:/etc/core/certificates/
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    depends_on:
      - log
      - registry
      - postgresql
      - redis
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "core"
    environment:
      - GODEBUG=netdns=cgo
      - DB_USR=postgres
      - DB_PWD=root123
      - DB_NAME=registry
      - DB_HOST=postgresql
      - DB_PORT=5432
      - REDIS_URL=redis:6379
      - REGISTRY_URL=http://registry:5000
      - REGISTRY_CONTROLLER_URL=http://registryctl:8080
      - LOG_LEVEL=info
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
      - DAC_OVERRIDE

  portal:
    image: goharbor/harbor-portal:v2.8.0
    container_name: harbor-portal
    restart: always
    networks:
      - harbor
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "portal"

  nginx:
    image: goharbor/nginx-photon:v2.8.0
    container_name: nginx
    restart: always
    volumes:
      - ./common/config/nginx:/etc/nginx
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    ports:
      - 80:8080
      - 443:8443
    depends_on:
      - registry
      - core
      - portal
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "nginx"
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - NET_BIND_SERVICE
      - DAC_OVERRIDE

  registryctl:
    image: goharbor/harbor-registryctl:v2.8.0
    container_name: registryctl
    restart: always
    volumes:
      - /data/registry:/storage:shared
      - ./common/config/registry/:/etc/registry/
      - ./common/config/registryctl:/etc/registryctl/
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    depends_on:
      - log
      - registry
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://127.0.0.1:1514"
        tag: "registryctl"
    environment:
      - REGISTRY_HTTP_ADDR=registry:5000
      - REGISTRY_CONTROLLER_URL=http://registryctl:8080
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - DAC_OVERRIDE

networks:
  harbor:
    external: false
    
```
### 3、启动 Harbor：
```shell
docker-compose up -d
```
### 4、验证部署：
* 检查所有容器是否正常运行：docker-compose ps 
* 通过浏览器访问 Harbor 界面：http://your-server-ip 或 https://your-server-ip

### 5、停止 Harbor
```shell
docker-compose down
```
## 镜像上传
Harbor Web 界面是管理平台，负责仓库配置和镜像信息展示；而镜像的上传 / 下载等操作需要通过Docker 客户端完成。两者配合使用才能实现完整的镜像管理流程。
### 1、通过 Docker 客户端上传镜像：
```shell
# 1. 登录 Harbor（输入用户名密码）
docker login <harbor服务器地址>

# 2. 给本地镜像打标签（格式：harbor地址/项目名/镜像名:版本）
docker tag <本地镜像名:版本> <harbor服务器地址>/<项目名>/<镜像名:版本>

# 3. 上传镜像到 Harbor
docker push <harbor服务器地址>/<项目名>/<镜像名:版本>
```
### 2、通过 .tar 镜像包上传镜像
1. 本地加载 .tar 镜像文件
   将 .tar 格式的镜像包上传到安装了 Docker 的服务器，通过 Docker 命令加载为本地镜像：
   ```shell
    # 加载 .tar 镜像包（替换为实际文件路径）
    docker load -i /path/to/your/image.tar
    
    # 查看加载后的镜像（获取镜像名和标签）
    docker images
   ``` 
2. 为镜像打标签（符合 Harbor 格式）

   按照 Harbor 仓库要求为镜像打标签，格式为：

   [Harbor服务器地址]/[项目名]/[镜像名]:[版本]
    ```shell
    # 示例：将本地镜像打标签（替换为实际信息）
    docker tag local-image:tag <harbor服务器地址>/my-project/remote-image:tag
    ```
3. 推送镜像到 Harbor
   ```shell
    # 登录 Harbor（输入用户名和密码）
    docker <harbor服务器地址>
    
    # 推送镜像
    docker push <harbor服务器地址>/my-project/remote-image:tag
   ```
4. 简化操作：脚本自动化
   脚本内容：upload_tar_to_harbor.sh
   ```shell
    #!/bin/bash
    # 上传 .tar 镜像到 Harbor 的自动化脚本
    
    # 配置信息（替换为实际值）
    HARBOR_URL="<harbor服务器地址>"
    HARBOR_PROJECT="my-project"
    TAR_FILE_PATH="$1"  # 从命令行参数接收 .tar 文件路径
    
    # 检查参数
    if [ -z "$TAR_FILE_PATH" ]; then
    echo "请指定 .tar 镜像文件路径！用法：$0 /path/to/image.tar"
    exit 1
    fi
    
    # 加载镜像
    echo "正在加载镜像文件..."
    IMAGE_INFO=$(docker load -i "$TAR_FILE_PATH" | grep "Loaded image ID" | awk '{print $4}')
    if [ -z "$IMAGE_INFO" ]; then
    echo "镜像加载失败！"
    exit 1
    fi
    
    # 获取镜像名和标签（默认取最后一个标签）
    IMAGE_NAME_TAG=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v "<none>" | tail -n 1)
    if [ -z "$IMAGE_NAME_TAG" ]; then
    echo "未找到镜像信息！"
    exit 1
    fi
    
    # 拆分镜像名和标签
    IFS=':' read -r IMAGE_NAME IMAGE_TAG <<< "$IMAGE_NAME_TAG"
    
    # 打 Harbor 标签
    HARBOR_IMAGE="${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"
    echo "正在为镜像打标签: $HARBOR_IMAGE"
    docker tag "$IMAGE_NAME_TAG" "$HARBOR_IMAGE"
    
    # 推送镜像
    echo "正在推送镜像到 Harbor..."
    docker push "$HARBOR_IMAGE"
    
    # 清理临时标签（可选）
    docker rmi "$HARBOR_IMAGE"
    
    echo "镜像上传完成！可在 Harbor 项目 $HARBOR_PROJECT 中查看"

   ```
   使用方法：
   ```shell
    # 赋予执行权限
    chmod +x upload_tar_to_harbor.sh
    
    # 执行脚本（传入 .tar 文件路径）
    ./upload_tar_to_harbor.sh /path/to/your/image.tar
   ```
   5. 存在问题

      以上操作都是在 Harbor 服务器本地操作。如果其他客户端登录到 Harbor，就会报如下错误。出现这问题的原因为Docker Registry 交互默认使用的是 HTTPS，但是搭建私有镜像默认使用的是 HTTP 服务，所以与私有镜像交互时出现以下错误。
      ```shell
       docker login-u admin -p Harbor12345 http://192.168.30.102
       wARNING! Using--password via the CLIis insecure.Use --password-stdin.
       Error response from daemon:Get https://192.168.80.1o/v2/:dial tcp 192.168.30.102:443:connect: connection refused
      ```
      解决办法：
      * 修改 Docker 客户端配置
     
        在 Docker server 启动的时候，增加启动参数，默认使用 HTTP 访问。
        ```shell
           vim/usr/lib/systemd/system/docker.service
           --13行--修改
           Execstart=/usr/bin/dockerd -H fd:// --insecure-registry 192.168.30.102 --containerd=/run/containerd/containerd.sock
           或
           Execstart=/usr/bin/dockerd --insecure-registry 192.168.30.102
        ```
      * 重启 Docker，再次登录解决问题
        ```shell
           systemctl daemon-reload
           systemctl restart docker
          ```
### 2、在 Web 界面管理镜像：
上传完成后，可在 Harbor 网页端执行以下操作：
* 查看镜像的标签、大小、创建时间等信息
* 对镜像进行复制、删除、添加标签等操作
* 配置镜像的生命周期规则（如自动清理旧版本）
* 查看镜像的安全扫描报告（需启用 Trivy 等扫描工具）
