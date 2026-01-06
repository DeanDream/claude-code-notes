# Skill 詳解

Skill 是 Claude Code 的**能力系統**，讓 Claude 可以自動判斷並應用複雜的工作流程。

## 核心概念

- **自動觸發**：Claude 根據你的請求自動判斷是否需要
- **多檔結構**：目錄 + `SKILL.md` + 支援檔案
- **漸進式載入**：只有需要時才載入詳細內容

## 與 Slash Command 的差異

| 特性 | Slash Command | Skill |
|------|---------------|-------|
| 觸發方式 | 手動 `/cmd` | 自動判斷 |
| 檔案結構 | 單一 `.md` | 目錄結構 |
| 複雜度 | 簡單 | 複雜 |
| 適用場景 | 快速提示 | 工作流程 |

## 目錄結構

### 最小結構

```
my-skill/
└── SKILL.md
```

### 完整結構

```
my-skill/
├── SKILL.md              # 必需：主要指示
├── REFERENCE.md          # 可選：詳細文件
├── EXAMPLES.md           # 可選：使用範例
└── scripts/              # 可選：輔助腳本
    └── helper.py
```

## SKILL.md 格式

```yaml
---
name: my-skill
description: 技能描述，包含觸發關鍵詞
allowed-tools: Read, Write
---

# 技能名稱

## 指示
詳細的執行步驟...

## 範例
使用範例...
```

## 存放位置

| 位置 | 路徑 | 作用範圍 |
|------|------|----------|
| **個人級** | `~/.claude/skills/name/` | 你自己，跨專案 |
| **專案級** | `.claude/skills/name/` | 此專案所有人 |

## 撰寫好的 description

```yaml
# ❌ 太模糊
description: 幫助處理文件

# ✅ 包含動作 + 關鍵詞
description: 從 PDF 提取文字和表格、填充表單。在處理 PDF 或提及文檔提取時使用。
```

## 完整範例

```yaml
---
name: code-review
description: 審查程式碼品質、安全性和風格。在審查 PR 或檢查程式碼時使用。
allowed-tools: Read, Bash(npm:lint)
---

# Code Review 工作流程

## 步驟

1. **執行 Linter**
   \`\`\`bash
   npm run lint
   \`\`\`

2. **檢查安全性**
   - 驗證輸入處理
   - 檢查認證邏輯

3. **評估效能**
   - 檢查演算法複雜度
   - 確認無不必要的迴圈

## 輸出格式

提供詳細報告，包括：
- 發現的問題
- 改進建議
- 程式碼範例
```
