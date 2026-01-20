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

## 了解 Skill 檔案結構

### 最小結構

```
skill-name/
└── SKILL.md
```

### 完整結構

```
skill-name/
├── SKILL.md             # 必需：主要指示
├── LICENSE.txt          # 可選： 授權條款
├── references/          # 可選：詳細文件，需要時載入  
├── assets/              # 可選：資源檔案 （模板、圖片等）
└── scripts/             # 可選：輔助腳本
```

### frontmatter 與 body 差異

```
Frontmatter（前置資料）：位於檔案開頭，用 --- 包圍的 YAML 區塊，包含：

name：技能名稱
description：描述技能用途，告訴 Claude 何時應該使用此技能

Body（主體）：frontmatter 之後的內容，包含詳細的指令說明，告訴 Claude 如何執行該技能。

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
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

## 了解 Skill 自動載入觸發條件

### 觸發機制
```
    - 根據 SKILL.md frontmatter 的 description 判斷
    - name 用於識別，不影響觸發 最多 64 個字元
    - description Skill 做什麼以及何時使用它（最多 1024 個字元）。Claude 使用此來決定何時應用 Skill。
    - allowed-tools 指定 Skill 可以使用的工具
    - model 指定 Skill 適用的模型
    - context 設定為 fork 以在具有自己對話歷史的分叉子代理上下文中執行 Skill
```

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
```

## 了解 Skill 漸進式揭露機制
### 1. 三層載入機制 SKILL.md 在 500 行以下以獲得最佳效能
```
    - 級別 1：中繼資料（始終載入）Metadata (name + description)
    
    name: pdf-processing
    description: 從 PDF 檔案中提取文字和表格、填寫表單、合併文件。在處理 PDF 檔案或使用者提及 PDF、表單或文件提取時使用。
    
    - 級別 2： 指令（觸發時載入） SKILL.md body (小於 5K TOKENS)
    
    觸發時載入
    
    - 級別 3： 資源和程式碼（根據需要載入） Bundled resources
    
    需要時載入，無大小限制 
```

### 2. 設計原則
```
   - 上下文窗口是共享資源
   - SKILL.md body 保持精簡（< 500 行）
   - 詳細內容拆到 references/ 按需載入 
```

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
