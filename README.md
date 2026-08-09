# Luyiz · 记忆中枢

个人记忆中枢 —— 用电流连接每一个瞬间。

## 模块

| 模块 | 颜色 | 内容 |
|------|------|------|
| 📷 照片墙 | 暖橙 `#ff6b6b` | 日常生活记录 |
| 📘 学习笔记 | 冷静蓝 `#4dabf7` | 课件 / 提纲 / 题目 |
| 🗺️ 旅行日记 | 浪漫紫 `#cc5de8` | 世界地图 · 城市足迹 |
| 🍜 美食日记 | 温暖金 `#ffd43b` | 美食测评 · 食谱 |
| ✉️ 随笔散记 | 清新绿 `#69db7c` | 信笺 · 写给某人 |
| ⚡ 成长轨迹 | 五色彩虹 | 时间线聚合 |

## 技术栈

- **框架**：Astro 7 + React
- **样式**：Tailwind CSS 4
- **地图**：Leaflet.js
- **内容**：Markdown / MDX
- **部署**：GitHub Pages

## 开发

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (localhost:4321)
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

## 添加内容

所有内容都在 `src/content/` 目录下，以 Markdown 文件形式管理。

### 照片墙
在 `src/content/photos/` 下创建文件夹，放入 `index.md` + 照片：
```md
---
title: "标题"
date: 2026-03-25
growthPhase: "2026"
cover: "./cover.jpg"
description: "简短描述"
location: "地点"
mood: "开心"
---
正文...
```

### 学习笔记
在 `src/content/study/courseware|outlines|problems/` 下创建 `.md`：
```md
---
title: "标题"
date: 2026-04-10
growthPhase: "2026"
category: "courseware"
subject: "学科"
file: "文件名.pdf"
---
正文...
```

### 其他模块类似，参考已有示例。
