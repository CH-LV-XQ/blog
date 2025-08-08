---
icon: pen-to-square
date: 2025-05-16
category:
  - Linux
---

# 防火墙配置

##  检查防火墙状态

```sh
# centos
sudo systemctl status firewalld

# ubantu
sudo ufw status
```

## 开启防火墙

```sh
# centos
sudo systemctl start firewalld

# ubantu
sudo ufw enable
```

## 关闭防火墙

```sh
# centos
sudo systemctl stop firewalld

# ubantu
sudo ufw disable
```

## 开放端口

```sh
# centos
# 例：sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=端口号/协议
# 规则开放 指定IP访问所有端口
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.100.130" accept'
# 规则开放 指定IP访问指定端口
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.100.130" port protocol="tcp" port="22" accept'


# ubantu
# 允许22端口访问
sudo ufw allow 22/tcp
# 允许Nginx Full服务，这将自动允许Nginx需要的所有端口
sudo ufw allow 'Nginx Full'
# 允许特定IP访问特定端口
sudo ufw allow from 192.168.1.100 to any port 22
sudo ufw allow from 192.168.52.137 to any port 3307/tcp
```
详细参数说明
* --permanent：永久生效（不加此参数则临时生效，重启 firewalld 后失效）
* family="ipv4"：指定 IP 协议版本（ipv4 或 ipv6）
* source address="192.168.1.100"：允许访问的来源 IP 地址
* port protocol="tcp" port="3306"：指定允许访问的端口和协议（tcp/udp）
* accept：动作（允许访问）

## 关闭端口

```sh
# centos
sudo firewall-cmd --permanent --remove-port=端口号/协议
sudo firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address="192.168.1.100" accept'
sudo firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address="192.168.1.100" port protocol="tcp" port="3306" accept'

# ubantu

# 删除允许端口80的规则
sudo ufw delete allow 80/tcp

# 拒绝通过端口53的DNS查询
sudo ufw deny 53
```

## 重新加载防火墙规则以应用更改

```sh
# centos
sudo firewall-cmd --reload
```



## 查看已开放端口

```sh
# centos
sudo firewall-cmd --list-ports
# 已开放规则
sudo firewall-cmd --list-rich-rules

# ubantu
sudo ufw status verbose
```



