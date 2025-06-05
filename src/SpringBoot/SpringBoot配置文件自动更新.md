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
```xml
<dependency>    
	<groupId>commons-io</groupId>    
	<artifactId>commons-io</artifactId>    
	<version>2.11.0</version>
</dependency>
<dependency>    
	<groupId>org.springframework.cloud</groupId>    
	<artifactId>spring-cloud-context</artifactId>    
	<version>4.1.0</version>
</dependency>
```
### 二、管理配置文件
```yml
server:
  # 应用服务 WEB 访问端口
  port: 8080
app:
  name: auto-config-demo
  version: 1.0.0
  description: 这是一个配置自动更新的示例应用
```
### 三、创建配置类
此处需要注意的是，配置类必须声明@ConfigurationProperties(prefix = "xxx")，同时需要增加@RefreshScope注解，在刷新时只有声明了这个注解的Bean才会生效。
```java
package com.hxkr.updateapplication.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

/**
 * app 配置自动更新类
 */
@Component
@RefreshScope
@ConfigurationProperties(prefix = "app")
public class AutoUpdateConfig {

    private String name;

    private String version;

    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

```
### 四、创建配置文件监听
```java
package com.hxkr.updateapplication.config;


import jakarta.annotation.PostConstruct;
import org.apache.commons.io.monitor.FileAlterationListener;
import org.apache.commons.io.monitor.FileAlterationListenerAdaptor;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.refresh.ContextRefresher;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;


import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class ConfigFileChangeListener {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private ContextRefresher contextRefresher;

    @PostConstruct
    public void init() throws Exception {
        // 获取配置文件路径
        Environment env = applicationContext.getEnvironment();
        String configPath = null;
        boolean useClassPath = false;

        boolean runningInJar = isRunningInJar();

        // 1. 尝试从spring.config.location加载配置文件
        if (configPath == null) {
            String location = env.getProperty("spring.config.location");
            if (location != null && !location.isEmpty()) {
                if (location.endsWith(".yml")) {
                    configPath = location;
                    System.out.println("使用配置文件: " + configPath);
                } else if (location.endsWith(".properties")) {
                    configPath = location;
                    System.out.println("使用配置文件: " + configPath);
                }
            }
        }

        // 2. 如果spring.config.location没有配置，使用默认的application.yml或application.properties
        if (configPath == null) {
            configPath = "classpath:application.yml";
            if (applicationContext.getResource(configPath).exists()) {
                System.out.println("使用默认配置文件: " + configPath);
                useClassPath = true;
            } else {
                configPath = "classpath:application.properties";
                if (applicationContext.getResource(configPath).exists()) {
                    System.out.println("使用默认配置文件: " + configPath);
                    useClassPath = true;
                } else {
                    System.out.println("未找到配置文件");
                    configPath = null;
                }
            }
        }

        // 将内部配置文件复制到外部config目录下
        if (useClassPath && runningInJar) {
            System.out.println("当前运行环境为Jar包，将内部配置文件复制到外部config目录下");
            // 创建外部配置目录
            Path externalConfigDir = Paths.get(System.getProperty("user.dir"), "config");
            System.out.println("外部配置目录: " + externalConfigDir);
            if (!Files.exists(externalConfigDir)) {
                Files.createDirectories(externalConfigDir);
            }
            String fileName = configPath.substring("classpath:".length());
            Path externalConfigFile = externalConfigDir.resolve(fileName);
            if (!Files.exists(externalConfigFile)) {
                try (InputStream inputStream = applicationContext.getResource(configPath).getInputStream()) {
                    Files.copy(inputStream, externalConfigFile);
                }
            }
            configPath = externalConfigFile.toString();
        }

        // 创建文件监听器
        FileAlterationMonitor monitor = new FileAlterationMonitor(1000);

        // 监听yml文件
        if (configPath != null) {
            File configFile;
            if (runningInJar) {
                configFile = new File(configPath);
            } else {
                Resource resource = applicationContext.getResource(configPath);
                configFile = resource.getFile();
            }
            FileAlterationObserver observer = new FileAlterationObserver(configFile.getParentFile());
            FileAlterationListener listener = new FileAlterationListenerAdaptor() {
                @Override
                public void onFileChange(File file) {
                    if (file.getName().equals(configFile.getName())) {
                        System.out.println("配置文件 {} 已更新，正在刷新配置... " + file.getAbsolutePath());
                        contextRefresher.refresh();
                        System.out.println("配置刷新完成！");
                    }
                }
            };
            observer.addListener(listener);
            monitor.addObserver(observer);
            System.out.println("开始监听配置文件: {}" + configFile.getAbsolutePath());
        }
        monitor.start();
        System.out.println("配置文件监听器已启动");
    }


    private boolean isRunningInJar() {
        try {
            URL location = getClass().getProtectionDomain().getCodeSource().getLocation();
            String path = location.toString().replace("/!BOOT-INF/classes/!/", "");
            return path.endsWith(".jar");
        } catch (Exception e) {
            return false;
        }
    }
}

```
这里的逻辑是监听启动参数--spring.config.location=xxx的配置项，如果有则从这里获取，如果没有则取默认路径也就是classpath:application.yml或application.properties配置文件。
当然如果你还有其他的启动参数配置，比如--spring.profiles.active=xxx，你可以自行修改这里监听类中的逻辑。
### 五、创建测试类
```java
package com.hxkr.updateapplication.controller;

import com.hxkr.updateapplication.config.AutoUpdateConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.StringJoiner;

@RestController
@RequestMapping(value = "/config")
public class ConfigController {

    @Autowired
    private AutoUpdateConfig autoUpdateConfig;

    @GetMapping("/info")
    public String getConfigInfo() {
        String name = autoUpdateConfig.getName();
        String version = autoUpdateConfig.getVersion();
        String desc = autoUpdateConfig.getDescription();
        StringJoiner sj = new StringJoiner(",", "{", "}");
        sj.add(name);
        sj.add(version);
        sj.add(desc);
        return sj.toString();
    }
}

```
### 六、注意事项
* 1、配置类中必须是@ConfigurationProperties(prefix = "xxx")注解的配置类
* 2、配置类上必须加@RefreshScope注解
* 3、自动更新的配置需与服务启动不相关的配置，如涉及到服务端口、数据库连接等配置是不生效的
