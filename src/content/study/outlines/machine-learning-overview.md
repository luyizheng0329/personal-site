---
title: "机器学习知识体系总览"
date: 2026-05-20
growthPhase: "2026"
tags: ["机器学习", "AI", "学习路线"]
category: "outline"
subject: "人工智能"
source: "课程总结"
---

## 机器学习三大范式

### 1. 监督学习（Supervised Learning）

有标签数据，学习输入到输出的映射。

- **分类**：逻辑回归、SVM、决策树、随机森林、神经网络
- **回归**：线性回归、岭回归、Lasso、XGBoost

### 2. 无监督学习（Unsupervised Learning）

无标签数据，发现数据内在结构。

- **聚类**：K-Means、DBSCAN、层次聚类
- **降维**：PCA、t-SNE、UMAP
- **关联规则**：Apriori、FP-Growth

### 3. 强化学习（Reinforcement Learning）

智能体通过与环境交互学习最优策略。

- Q-Learning、DQN、PPO
- 应用：游戏AI、机器人控制、推荐系统

## 推荐学习路径

```
数学基础 → Python编程 → 经典算法 → 深度学习 → 项目实战
  ↓           ↓           ↓           ↓           ↓
线性代数    NumPy      sklearn     PyTorch    Kaggle
概率统计    Pandas     调参技巧    TensorFlow  开源项目
```

## 核心参考书

| 书名 | 作者 | 难度 |
|------|------|------|
| 《统计学习方法》 | 李航 | ⭐⭐ |
| 《机器学习》 | 周志华 | ⭐⭐⭐ |
| 《深度学习》 | Goodfellow | ⭐⭐⭐⭐ |
