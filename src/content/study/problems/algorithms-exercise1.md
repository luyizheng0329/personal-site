---
title: "算法习题集 #1：排序与搜索"
date: 2026-06-02
growthPhase: "2026"
tags: ["算法", "排序", "搜索", "习题"]
category: "problem"
subject: "计算机科学"
source: "LeetCode + 自编"
---

## 题目 1：两数之和

**描述**：给定一个整数数组 `nums` 和一个目标值 `target`，找出数组中和为目标值的两个数的索引。

**示例**：
```
输入: nums = [2, 7, 11, 15], target = 9
输出: [0, 1]
解释: nums[0] + nums[1] = 2 + 7 = 9
```

**解法一：哈希表 O(n)**

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```

---

## 题目 2：二分查找变体

**描述**：在一个旋转过的有序数组中查找目标值。

**关键点**：需要判断 mid 落在左半段还是右半段。

---

## 题目 3：合并 K 个有序链表

**描述**：合并 k 个已排序的链表。

**解法思路**：
1. 优先队列（最小堆） — O(N log k)
2. 分治法两两合并 — O(N log k)
3. 全部展开排序 — O(N log N)，不推荐

> 💡 重点掌握堆解法和分治思想。
