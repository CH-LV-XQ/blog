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
* 下载Harbor官方安装包

  * 访问Harbor官方下载界面：[下载地址](https://github.com/goharbor/harbor/releases)

  * 选择适合的版本（推荐稳定版，如 `v2.8.4`），下载离线安装包（格式为 `harbor-offline-installer-<版本>.tgz`）：

    ```shell
    # 示例：下载 v2.8.4 版本（请替换为最新版本链接）
    wget https://github.com/goharbor/harbor/releases/download/v2.8.4/harbor-offline-installer-v2.8.4.tgz
    ```

* 解压安装包并生成配置文件

  * 解压安装包：

    ```shell
    tar zxvf harbor-offline-installer-<版本>.tgz
    # 样例
    [root@localhost Harbor]# tar zxvf harbor-offline-installer-v2.12.2.tgz 
    harbor/harbor.v2.12.2.tar.gz
    harbor/prepare
    harbor/LICENSE
    harbor/install.sh
    harbor/common.sh
    harbor/harbor.yml.tmpl
    ```

  * 复制配置模板并修改（核心步骤）：

    ```shell
    # 进入解压后的文件目录
    cd harbor
    # 复制默认配置模板
    cp harbor.yml.tmpl harbor.yml
    
    # 编辑配置文件（根据需求修改）
    vim harbor.yml
    ```

    ```yaml
     # 配置访问的IP，为部署的机器的IP
    hostname: 192.168.9.921
    # 配置方位的端口
    port: 9191
    # 配置admin用户的密码（默认的管理员用户名为 admin，管理员密码为 Harbor12345）
    # 不用修改（也没有修改的地方）管理员用户名，可以修改管理员密码，如下
    harbor_admin_password: 123456
    # 配置数据卷地址，为机器上的目录（用于挂载到容器中）
    data_volume: /data/harbor
    # 注释https（13行），主要是我们在局域网内，不需要一些需要注册的域名
    # https related config
    #https:
      # https port for harbor, default is 443
      # port: 443
      # The path of cert and key files for nginx
      # certificate: /your/certificate/path
      # private_key: /your/private/key/path
      # enable strong ssl ciphers (default: false)
       # strong_ssl_ciphers: false
    ```

    需修改的关键配置（根据实际环境调整）：

    - `hostname`: Harbor 服务器的 IP 或域名（必填）
    - `http.port`: HTTP 端口（默认 80）
    - `https`: 如需启用 HTTPS，需配置证书路径（可选）
    - `data_volume`: 数据存储目录（默认 `/data`，建议保持默认）
    - `admin_password`: 管理员初始密码（默认 `Harbor12345`）

* 执行准备脚本生成依赖文件

  Harbor 提供了 `prepare` 脚本，会根据 `harbor.yml` 自动生成所有必要的配置文件（包括 `docker-compose.yml` 和挂载所需的各类配置）：

  ```shell
  # 生成配置文件（会自动创建 common/config 目录及内部文件）
  ./prepare
  ```

  执行后，会自动生成：

  - 完整的 `docker-compose.yml`（无需手动编写）
  - `common/config` 目录（包含 Nginx、数据库、Core 等服务的配置文件）
  - 证书相关目录（如需 HTTPS）

* 启动 Harbor

  此时所有挂载文件已自动生成，直接通过官方脚本启动：

  ```shell
  # 第一次启动
   # 安装，启动 执行此步骤可以检验环境等
   ./install.sh
   # 检查是否成功
   docker-compose ps -a
  
  
  # 启动所有服务
  docker-compose up -d
  
  # 检查启动状态
  docker-compose ps
  ```

  在install.sh执行结束后，出现以下标识，成功。

  ```tex
   
  Note: stopping existing Harbor instance ...
  
  
  [Step 5]: starting Harbor ...
  [+] Running 10/10
   ✔ Network harbor_harbor        Created   0.0s 
   ✔ Container harbor-log         Started   0.7s 
   ✔ Container harbor-portal      Started   0.8s 
   ✔ Container redis              Started   0.8s 
   ✔ Container registryctl        Started   0.8s 
   ✔ Container harbor-db          Started   0.8s 
   ✔ Container registry           Started   0.7s 
   ✔ Container harbor-core        Started   1.0s 
   ✔ Container harbor-jobservice  Started   1.1s 
   ✔ Container nginx              Started   1.1s 
   ✔ ----Harbor has been installed and started successfully.----
  ```

### 2、配置 Harbor：

* 修改 docker-compose.yml 中的配置，如端口映射、数据存储路径等
* 默认用户名是 admin，密码是 Harbor12345
```yaml
version: '2.3'
services:
  log:
    image: goharbor/harbor-log:v2.8.4
    container_name: harbor-log
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - DAC_OVERRIDE
      - SETGID
      - SETUID
    volumes:
      - /var/log/harbor/:/var/log/docker/:z
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
  registry:
    image: goharbor/registry-photon:v2.8.4
    container_name: registry
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/registry:/storage:z
      - ./common/config/registry/:/etc/registry/:z
      - type: bind
        source: /data/harbor/secret/registry/root.crt
        target: /etc/registry/root.crt
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
        syslog-address: "tcp://localhost:1514"
        tag: "registry"
  registryctl:
    image: goharbor/harbor-registryctl:v2.8.4
    container_name: registryctl
    env_file:
      - ./common/config/registryctl/env
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/registry:/storage:z
      - ./common/config/registry/:/etc/registry/:z
      - type: bind
        source: ./common/config/registryctl/config.yml
        target: /etc/registryctl/config.yml
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
        syslog-address: "tcp://localhost:1514"
        tag: "registryctl"
  postgresql:
    image: goharbor/harbor-db:v2.8.4
    container_name: harbor-db
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - DAC_OVERRIDE
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/database:/var/lib/postgresql/data:z
    networks:
      harbor:
    env_file:
      - ./common/config/db/env
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "postgresql"
    shm_size: '1gb'
  core:
    image: goharbor/harbor-core:v2.8.4
    container_name: harbor-core
    env_file:
      - ./common/config/core/env
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/ca_download/:/etc/core/ca/:z
      - /data/harbor/:/data/:z
      - ./common/config/core/certificates/:/etc/core/certificates/:z
      - type: bind
        source: ./common/config/core/app.conf
        target: /etc/core/app.conf
      - type: bind
        source: /data/harbor/secret/core/private_key.pem
        target: /etc/core/private_key.pem
      - type: bind
        source: /data/harbor/secret/keys/secretkey
        target: /etc/core/key
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      harbor:
    depends_on:
      - log
      - registry
      - redis
      - postgresql
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "core"
  portal:
    image: goharbor/harbor-portal:v2.8.4
    container_name: harbor-portal
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - NET_BIND_SERVICE
    volumes:
      - type: bind
        source: ./common/config/portal/nginx.conf
        target: /etc/nginx/nginx.conf
    networks:
      - harbor
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "portal"

  jobservice:
    image: goharbor/harbor-jobservice:v2.8.4
    container_name: harbor-jobservice
    env_file:
      - ./common/config/jobservice/env
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/job_logs:/var/log/jobs:z
      - type: bind
        source: ./common/config/jobservice/config.yml
        target: /etc/jobservice/config.yml
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    depends_on:
      - core
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "jobservice"
  redis:
    image: goharbor/redis-photon:v2.8.4
    container_name: harborRedis
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    volumes:
      - /data/harbor/redis:/var/lib/redis
    networks:
      harbor:
    depends_on:
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "redis"
  proxy:
    image: goharbor/nginx-photon:v2.8.4
    container_name: nginx
    restart: always
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - NET_BIND_SERVICE
    volumes:
      - ./common/config/nginx:/etc/nginx:z
      - type: bind
        source: ./common/config/shared/trust-certificates
        target: /harbor_cust_cert
    networks:
      - harbor
    ports:
      - 9191:8080
    depends_on:
      - registry
      - core
      - portal
      - log
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://localhost:1514"
        tag: "proxy"
networks:
  harbor:
    external: false
```
### 3、验证部署：
* 检查所有容器是否正常运行：docker-compose ps 
* 通过浏览器访问 Harbor 界面：http://your-server-ip 或 https://your-server-ip

### 4、停止 Harbor
```shell
docker-compose down
```
## 配置docker服务

为了能够通过 IP:port 能够在局域网内访问，需要配置docker服务。

### 1、修改镜像仓库配置文件

```shell
vim /etc/docker/daemon.json
# 修改如下内容
{
    # 新增你的仓库地址
    "insecure-registries": ["192.168.1.100:9191"]
 }
```

### 2、重启 docker

```shell
# 重启docker
systemctl daemon-reload
systemctl restart docker
```

### 3、命令行登录

```shell
 # docker 登录方式
 docker login 192.168.9.921:9191
 
 # 或者使用账号密码登录 
 docker login -uadmin -p123456 192.168.9.921:9191
```



## 镜像上传

Harbor Web 界面是管理平台，负责仓库配置和镜像信息展示；而镜像的上传 / 下载等操作需要通过Docker 客户端完成。两者配合使用才能实现完整的镜像管理流程。
### 1、通过 Docker 客户端上传镜像：
```shell
# 1. 登录 Harbor（输入用户名密码）
docker login <harbor服务器地址>

# 2. 给本地镜像打标签（格式：harbor地址/项目名/镜像名:版本）
# docker tag mysql:8.0.40 192.168.1.100:9191/common/mysql:8.0.40
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

## 镜像拉取

### 1、修改镜像仓库配置文件

```shell
vim /etc/docker/daemon.json
# 修改如下内容
{
    # 新增你的仓库地址
    "insecure-registries": ["192.168.1.100:9191"]
 }
```

### 2、重启 docker

```shell
# 重启docker
systemctl daemon-reload
systemctl restart docker
```

### 3、在web界面复制拉取地址

```shell
docker pull 192.168.1.100:9191/common/mysql@sha256:ce327c13199b0f553b3f3f53f8f1eabd725e589ec4bd1a937095812288b33e24
```

