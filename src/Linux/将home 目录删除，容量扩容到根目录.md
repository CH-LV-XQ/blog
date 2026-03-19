---
title: 磁盘操作
index: false
icon: laptop-code
category:
  - Linux
---

# 将 home 目录删除，容量扩容到根目录

## 1. 先卸载 /home 分区
```shell
# 1. 检查是否有进程占用 /home
fuser -m /home

# 2. 若有进程，终止占用进程（可选，也可直接强制卸载）
# 强制卸载（如果普通 umount 失败）
umount -lf /home
```

## 2. 从 /etc/fstab 移除 /home 挂载项
避免开机自动挂载导致再次被占用：
```shell
# 编辑 fstab，删除包含 /home 的行
vi /etc/fstab
```
找到类似这一行并删除：
```shell
/dev/mapper/uos-home /home ext4 defaults 0 0
```

## 3. 再次执行删除逻辑卷命令
```shell
lvremove /dev/mapper/uos-home
```
输入 y 确认删除，此时就能成功移除 /home 逻辑卷。

## 4. 扩容根目录
```shell
# 1. 确认文件系统类型,Type 字段会显示为 xfs
# 查看根分区文件系统类型
df -T /
# 或
blkid /dev/mapper/uos-root



# xfs 文件系统扩容命令
xfs_growfs /


# ext 系列文件系统
lvextend -l +100%FREE /dev/mapper/uos-root
resize2fs /dev/mapper/uos-root
```

## 5. 验证结果
```shell
df -h /
```
此时根目录容量会显示为约 183.25G，扩容成功。
