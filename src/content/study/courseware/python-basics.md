---
title: "Python 基础入门：数据结构与算法"
date: 2026-04-10
growthPhase: "2026"
tags: ["Python", "编程", "入门"]
category: "courseware"
subject: "计算机科学"
file: "quick_sort_demo.py"
format: "py"
source: "自学笔记"
---

## 快速排序算法

快速排序（Quick Sort）是一种经典的分治算法。

### 核心思想

1. 选择一个基准值（pivot）
2. 将数组分为小于和大于基准值的两部分
3. 对两部分递归应用相同操作

### 时间复杂度

- 平均情况：O(n log n)
- 最坏情况：O(n²)

### 代码示例

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

📥 点击上方下载按钮获取完整可运行代码。
