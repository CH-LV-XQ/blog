---
icon: pen-to-square
date: 2022-01-09
category:
  - Nginx
---
# Nginx 反向代理规则匹配

在 Nginx 反向代理中，匹配规则最后是否带 / 会影响路径的处理方式，具体表现为：
## 1、当匹配规则末尾带 / 时：
会将匹配到的路径部分（包括末尾的 /）从请求中移除，然后拼接代理目标的路径。
例如：
```nginx
 location /api/ {
    proxy_pass http://backend/;
}
```
此时，访问 http://example.com/api/user 会被代理到 http://backend/user

## 2、当匹配规则末尾不带 / 时：
会将完整的匹配路径保留，并拼接在代理目标之后。
例如：
```nginx
location /api {
    proxy_pass http://backend/;
}
```
此时，访问 http://example.com/api/user 会被代理到 http://backend//api/user（注意这里多了一个 /）

## 3、特殊情况：
如果 proxy_pass 末尾不带 /，无论 location 是否带 /，都会将完整路径传递过去
例如：
```nginx
location /api/ {
    proxy_pass http://backend;  # 末尾没有 /
}
```
访问 http://example.com/api/user 会被代理到 http://backend/api/user

总结：location 规则末尾的 / 决定了是否在转发时 "清空"（移除）匹配到的路径前缀部分，而 proxy_pass 末尾的 / 也会影响最终拼接的路径。实际配置时需要根据后端服务的路径要求来决定是否添加 /。
