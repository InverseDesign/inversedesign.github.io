---
title: "Shortcodes 功能测试"
date: 2023-06-23
description: "测试所有 shortcodes 功能"
tags:
  - 测试
  - Shortcodes
categories:
  - 测试
---

# Shortcodes 功能测试

这个页面用于测试所有 shortcodes 是否正常工作。

## 1. 警告框测试

{{< warning type="info" title="信息提示" >}}
这是一个信息提示框。
{{< /warning >}}

{{< warning type="warning" title="警告提示" >}}
这是一个警告提示框。
{{< /warning >}}

{{< warning type="danger" title="危险提示" >}}
这是一个危险提示框。
{{< /warning >}}

{{< warning type="success" title="成功提示" >}}
这是一个成功提示框。
{{< /warning >}}

## 2. 可折叠内容测试

{{< collapse title="点击展开测试" >}}
这是可折叠内容的测试。
{{< /collapse >}}

## 3. 进度条测试

{{< progress value="75" label="测试进度" color="blue" >}}

## 4. 技能卡片测试

{{< skill-card name="测试技能" level="85" icon="🧪" color="green" description="这是一个测试技能" >}}

## 5. 密码保护测试

{{< password-protected password="test123" >}}
这是受密码保护的内容。
密码：`test123`
{{< /password-protected >}}

## 测试完成

所有 shortcodes 都应该正常工作！
