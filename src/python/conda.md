---
icon: pen-to-square
date: 2022-01-01
category:
  - Python
tag:
  - conda
---

# Conda 使用

## 常用命令

```shell
# 查看版本
conda --version

# 查看所有虚拟环境
conda env list

# 创建虚拟环境
# rag为当前虚拟环境名称
conda create -n rag python=3.10
# 删除虚拟环境
conda remove --name rag --all


# 切换激活环境
# windows
conda activate rag
# Linux/Unix
source activate rag
# 返回base环境
conda deactivate


# 下载（卸载）库
# 下载安装
conda install scipy
# 卸载
conda remove scipy


# 切换镜像源
# 添加清华镜像源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
# 设置安装包时，显示源
conda config --set show_channel_urls yes
# 删除清华镜像源
conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
# 看现在使用了哪些源
conda config --show channels
```
