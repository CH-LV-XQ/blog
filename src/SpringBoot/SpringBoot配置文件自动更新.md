---
icon: pen-to-square
date: 2025-05-24
category:
  - SpringBoot
---

# SpringBoot配置文件自动更新

## 前言
在开发和运维Spring Boot项目的过程中，application.yml或application.properties等配置文件是必不可少的组成部分。这些文件中包含了服务运行所必需的各种配置信息。然而，在不同环境中部署时，往往需要对这些配置进行相应的调整。传统上，一旦修改了配置文件中的内容，就需要重启整个服务以使更改生效。这种做法不仅浪费时间，而且在频繁调整配置参数的情况下，极大地降低了开发和运维效率。

为了解决这一痛点，本文将详细介绍如何实现在不重启服务的前提下动态更新配置文件中的内容，从而显著提高工作效率，减少不必要的等待时间。

要实现动态更新配置文件的方式有很多种，比如可以设置一个定时任务监听配置文件修改状态，当修改后触发更新操作。本文介绍的一种方式是基于SpringCloud提供的一个用于动态刷新配置的核心类ContextRefresher，其实现原理如下：

![application.png](images%2Fapplication.png)

明白原理后，接下来就是具体的实现过程了。

## 实现过程
### 一、pom.xml添加依赖
此处需要添加两个依赖，一个是监听文件的commons-io，一个是刷新并加载配置内容的spring-cloud-context
