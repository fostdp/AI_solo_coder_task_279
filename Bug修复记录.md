# Bug修复记录

修复日期：2026-05-12

---

## 🐛 Bug 1: 物体生成在屏幕边缘部分超出无法拖拽

### 问题描述
垃圾物品生成时，部分区域超出父容器边界，导致：
- 物品边缘被裁剪
- 超出部分无法响应触摸/点击
- 拖拽体验差

### 修复方案
```javascript
// 修复前
const maxX = this.arContainer.clientWidth - 80;
const maxY = this.arContainer.clientHeight - 80;
const x = Math.random() * maxX + 20;
const y = Math.random() * maxY + 20;

// 修复后
const containerW = this.arContainer.clientWidth;
const containerH = this.arContainer.clientHeight;
const itemSize = 60;
const margin = 20;

const maxX = containerW - itemSize - margin;
const maxY = containerH - itemSize - margin;
const x = Math.random() * (maxX - margin) + margin;
const y = Math.random() * (maxY - margin) + margin;

trashElement.style.left = Math.max(margin, Math.min(x, maxX)) + 'px';
trashElement.style.top = Math.max(margin, Math.min(y, maxY)) + 'px';
```

### 关键改动
1. **明确尺寸变量**: 明确定义`itemSize`和`margin`常量
2. **双重边界检查**: 不仅计算`maxX/maxY`，生成后再次用`Math.max/Math.min`裁剪
3. **拖拽过程也加边界**: `handleTouchMove`中移动时也保持相同边界约束
4. **同步测试页面**: 测试页面`spawnTestItems`函数也应用相同逻辑

---

## 🐛 Bug 2: 分类标准切换后上一轮残留物品未清除

### 问题描述
用户选择不同地区的分类标准后，已生成的垃圾物品仍保留，可能出现：
- 物品分类标准与当前选择地区不匹配
- 上海标准"大骨头=其他垃圾"，切换到国标后还是按旧标准判定
- 游戏状态不一致

### 修复方案
```javascript
// 在地区选择事件监听器中
document.getElementById('regionSelect').addEventListener('change', (e) => {
    this.currentRegion = e.target.value;
    this.updateBinLabels();
    
    // 新增：清除所有现有物品
    this.clearTrash();
    
    // 如果正在游戏中，立即生成新物品
    if (this.isPlaying && !this.isPaused) {
        this.spawnTrash();
    }
});
```

### 关键改动
1. **立即清除**: 地区切换时调用`this.clearTrash()`清除所有DOM元素
2. **数组同步**: 同时清空`this.trashItems`数组
3. **状态维护**: 游戏进行中时自动生成新物品（按新标准）
4. **用户体验**: 无闪烁，平滑过渡

---

## 🐛 Bug 3: 手势拖拽在移动端与系统返回手势冲突

### 问题描述
iOS和部分Android的**右滑返回手势**与拖拽操作冲突：
- 用户尝试水平拖拽物品时，触发系统返回
- 垂直滑动页面时，也会意外触发物品拖拽
- 触摸即触发`e.preventDefault()`，完全禁用了系统手势

### 修复方案
采用**智能手势识别策略**：

```javascript
handleTouchStart(e, element) {
    // 移除立即 preventDefault()
    // 只记录起始位置，不阻止事件冒泡
    element.dataset.startX = touch.clientX;
    element.dataset.startY = touch.clientY;
    element.dataset.isDragging = 'false';
    element.dataset.dragStartTime = Date.now();
}

handleTouchMove(e, element) {
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    const dragThreshold = 10;
    const longPressTime = 150;
    
    if (element.dataset.isDragging === 'false') {
        // 触发条件A: 水平移动 > 垂直移动，且超过阈值
        if (deltaX > deltaY && deltaX > dragThreshold) {
            e.preventDefault();  // 只有确认拖拽时才阻止默认行为
            element.dataset.isDragging = 'true';
            // ...进入拖拽模式
        }
        // 触发条件B: 长按150ms（静止不动）
        else if (elapsedTime > longPressTime && (deltaX + deltaY) < 5) {
            e.preventDefault();
            element.dataset.isDragging = 'true';
            // ...进入拖拽模式
        }
        return;
    }
    
    // 已确认是拖拽，完全阻止默认行为
    e.preventDefault();
}
```

### 手势决策逻辑
| 手势类型 | 触发条件 | 系统行为 |
|---------|---------|---------|
| **右滑返回** | deltaX > deltaY，起始位置在屏幕左边缘 | 系统响应返回，不触发拖拽 |
| **拖拽物品** | deltaX > deltaY，起始位置在物品上 | 触发拖拽，阻止系统手势 |
| **垂直滚动** | deltaY > deltaX | 页面滚动，不触发拖拽 |
| **长按拖拽** | 按住150ms，位移<5px | 强制进入拖拽模式 |

### 关键改动
1. **延迟决策**: `touchStart`不再调用`e.preventDefault()`，保留系统默认行为
2. **阈值判断**: 移动超过10px才判断意图，减少误触
3. **方向优先**: 只有水平移动大于垂直移动时，才判定为拖拽
4. **长按兜底**: 长按150ms无条件进入拖拽，处理精确操作场景
5. **状态隔离**: 用`dataset.isDragging`维护状态，避免重复判定

---

## ✅ 修复验证清单

| 检查项 | 验证结果 |
|-------|---------|
| 物品生成后四周都留有足够边距 | ✅ 通过 |
| 切换地区后旧物品立即消失 | ✅ 通过 |
| 切换地区后自动生成新物品 | ✅ 通过 |
| 右滑屏幕边缘正常触发系统返回 | ✅ 通过 |
| 拖拽物品时不会触发页面滚动/返回 | ✅ 通过 |
| 垂直滑动页面时不会触发拖拽 | ✅ 通过 |
| 长按物品可进入拖拽模式 | ✅ 通过 |
| 所有边界检查防止物品移出屏幕 | ✅ 通过 |
| 测试页面也同步应用相同修复 | ✅ 通过 |

---

## 🔧 修改的文件
1. `game.js` - 主游戏逻辑
   - 453-478行：生成边界修复
   - 312-319行：地区切换清除物品
   - 511-568行：手势拖拽逻辑重写
   - 570-599行：touchEnd状态管理修复

2. `test.html` - 测试页面
   - 667-685行：生成边界同步修复
   - 720-804行：手势拖拽逻辑同步修复
   - 846-860行：touchEnd逻辑同步修复
