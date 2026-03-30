# AI 使用指南（Continue）

## 常用规则加载

### 1. 普通组件

@file rules/base.md
@file rules/react.md

---

### 2. UI组件（推荐）

@file rules/base.md
@file rules/react.md
@file rules/tailwind.md

---

### 3. 带图标 / 图片

@file rules/assets.md

---

### 4. 有文案

@file rules/i18n.md

---

## 使用原则（非常重要）

- ❌ 不要加载全部 rules
- ✅ 按需加载
- ✅ 优先最小规则集

---

## 常用命令

/ui → UI组件  
/code → 通用代码  
/figma-extract → 提取设计  
/figma-generate → 生成组件

---

## 推荐流程（Figma → 组件）

1. /figma-extract（每个 state）
2. 手动 merge
3. /figma-generate（一次生成）


