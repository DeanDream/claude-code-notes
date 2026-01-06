# Slash Command 完整指南

Slash Command 是 Claude Code 的**快速指令系統**，讓你可以將常用的提示詞（Prompt）封裝成可重複使用的指令。

## 概述

### 什麼是 Slash Command？

```
┌─────────────────────────────────────────────────────────┐
│  你經常輸入的提示詞                                       │
│  "幫我審查這段程式碼，檢查邏輯錯誤、效能問題、安全漏洞..."   │
└─────────────────────────────────────────────────────────┘
                           ↓ 封裝成
┌─────────────────────────────────────────────────────────┐
│  Slash Command                                          │
│  /review                                                │
└─────────────────────────────────────────────────────────┘
```

### 核心特性

| 特性 | 說明 |
|------|------|
| **手動觸發** | 輸入 `/command` 才會執行（不像 Skill 自動判斷） |
| **參數支援** | 可傳遞動態參數（`$ARGUMENTS`, `$1`, `$2`...） |
| **動態內容** | 可執行 Bash 指令（`!`）、引用檔案（`@`） |
| **工具限制** | 可限制 Claude 只能使用特定工具 |

---

## 檔案結構

### 存放位置

| 層級 | 路徑 | 作用範圍 | 優先級 |
|------|------|----------|--------|
| **專案級** | `.claude/commands/<name>.md` | 此專案所有協作者 | 高（優先） |
| **個人級** | `~/.claude/commands/<name>.md` | 你自己，跨所有專案 | 低 |

> **優先級規則**：同名指令時，專案級覆蓋個人級。

### 命名規則

```
檔案名稱（不含 .md）= 指令名稱

.claude/commands/
├── review.md           → /review
├── code-review.md      → /code-review
├── git-commit.md       → /git-commit
└── frontend/
    └── component.md    → /component（子目錄不影響指令名）
```

**命名限制**：
- ✅ 小寫字母、數字、連字號（`-`）
- ❌ 空格、底線、特殊字元

### 完整檔案結構

```markdown
---
# ┌─────────────────────────────────────────┐
# │  Frontmatter 區塊（YAML 格式）           │
# │  定義指令的元資料和行為設定              │
# └─────────────────────────────────────────┘
description: 指令的簡短描述
argument-hint: [arg1] [arg2]
allowed-tools: Read, Write, Bash(git:*)
model: claude-sonnet-4-20250514
---

# ┌─────────────────────────────────────────┐
# │  指令內容區（Prompt Body）               │
# │  實際發送給 Claude 的提示詞內容          │
# └─────────────────────────────────────────┘

這裡是指令的主要內容...

可以使用特殊語法：
- !`bash command`  → 執行 Bash 並嵌入輸出
- @path/to/file    → 引用檔案內容
- $ARGUMENTS       → 使用者傳入的參數
```

---

## Frontmatter 區塊

Frontmatter 是檔案開頭的 YAML 區塊，用於定義指令的**元資料**和**行為設定**。

### 區塊格式

```yaml
---
key: value
key2: value2
---
```

> **注意**：`---` 必須在檔案的**第一行**，前面不能有空行或空格。

### 所有欄位說明

| 欄位 | 必填 | 說明 | 預設值 |
|------|------|------|--------|
| `description` | 否 | 指令描述，顯示在 `/help` 清單 | 內容區的第一行 |
| `argument-hint` | 否 | 參數提示，用於自動完成 | 無 |
| `allowed-tools` | 否 | 限制可使用的工具 | 繼承對話設定 |
| `model` | 否 | 指定使用的 Claude 模型 | 繼承對話設定 |

### 欄位詳細說明

#### `description`

```yaml
---
description: 審查程式碼的品質、安全性和效能
---
```

**行為**：
- 顯示在 `/help` 指令的清單中
- 幫助使用者了解指令用途
- 如果未設定，會使用內容區的第一行

#### `argument-hint`

```yaml
---
argument-hint: [file-path] [review-type]
---
```

**行為**：
- 在輸入 `/command ` 後顯示參數提示
- 純粹是**提示**，不會驗證參數

**格式慣例**：
- `[required]`：必填參數
- `[optional?]`：可選參數
- `[...files]`：多個參數

#### `allowed-tools`

```yaml
---
allowed-tools: Read, Write, Bash(git:*)
---
```

**行為**：
- 限制 Claude 在執行此指令時只能使用指定的工具
- 未列出的工具會被**禁止使用**

**語法格式**：

| 格式 | 說明 | 範例 |
|------|------|------|
| `ToolName` | 允許整個工具 | `Read`, `Write`, `Grep` |
| `Bash(prefix:*)` | 只允許特定前綴的 Bash | `Bash(git:*)` 允許 `git status`, `git commit` 等 |
| `Bash(cmd1,cmd2)` | 只允許特定指令 | `Bash(npm run build, npm test)` |

**常用組合**：

```yaml
# 唯讀指令（只能讀取，不能修改）
allowed-tools: Read, Grep, Glob

# Git 操作指令
allowed-tools: Read, Bash(git:*)

# 檔案編輯指令
allowed-tools: Read, Write, Edit

# 完整開發指令
allowed-tools: Read, Write, Edit, Bash(npm:*, git:*)
```

#### `model`

```yaml
---
model: claude-sonnet-4-20250514
---
```

**行為**：
- 指定執行此指令時使用的 Claude 模型
- 可用於讓簡單指令使用較快的模型

**可用模型**：
- `claude-opus-4-5-20251101`（最強，較慢）
- `claude-sonnet-4-20250514`（平衡）

---

## 指令內容區（Prompt Body）

Frontmatter 之後的所有內容都是**指令內容區**，會被發送給 Claude 作為提示詞。

### 基本結構建議

```markdown
---
description: 指令描述
---

# 指令標題（可選）

## 背景/上下文
說明這個指令要做什麼...

## 具體任務
1. 第一步
2. 第二步
3. 第三步

## 輸出格式
期望的輸出格式...

## 注意事項
- 注意事項 1
- 注意事項 2
```

---

## 特殊語法

### `!` Bash 執行語法

**語法**：`` !`bash command` ``

**行為**：
1. 指令執行**之前**，Claude Code 會先執行所有 `` !`...` `` 區塊
2. 執行結果會**取代**原本的 `` !`...` `` 語法
3. 取代後的完整內容才會發送給 Claude

**執行流程圖**：

```
┌─────────────────────────────────────────────────────────┐
│  原始指令內容                                            │
│                                                         │
│  ## Git 狀態                                            │
│  !`git status --short`                                  │
│                                                         │
│  ## 最近提交                                            │
│  !`git log --oneline -5`                                │
└─────────────────────────────────────────────────────────┘
                           ↓ 執行 Bash
┌─────────────────────────────────────────────────────────┐
│  實際發送給 Claude 的內容                                │
│                                                         │
│  ## Git 狀態                                            │
│  M  src/main.ts                                         │
│  A  src/utils.ts                                        │
│                                                         │
│  ## 最近提交                                            │
│  a1b2c3d feat: add user authentication                  │
│  e4f5g6h fix: resolve memory leak                       │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

**完整範例**：

```markdown
---
description: 根據 Git 變更建立提交訊息
allowed-tools: Bash(git:*)
---

## 當前分支
!`git branch --show-current`

## 變更摘要
!`git status --short`

## 詳細差異
!`git diff --cached`

## 任務
根據上述變更，請建立一個符合 Conventional Commit 格式的提交訊息。
```

**注意事項**：
- Bash 指令在**指令載入時**執行，不是 Claude 回應時
- 如果 Bash 執行失敗，錯誤訊息會被嵌入
- 建議搭配 `allowed-tools` 確保 Claude 也能執行相關操作

---

### `@` 檔案引用語法

**語法**：`@path/to/file`

**行為**：
1. 指令執行**之前**，讀取指定檔案的內容
2. 檔案內容會**取代**原本的 `@path` 語法

**範例**：

```markdown
---
description: 審查指定檔案
argument-hint: [file-path]
---

## 待審查的檔案
@$1

## 審查重點
- 邏輯正確性
- 錯誤處理
- 程式碼風格
```

**使用方式**：
```bash
/review src/main.ts
```

**實際發送給 Claude 的內容**：
```markdown
## 待審查的檔案
// src/main.ts 的完整內容會出現在這裡
export function main() {
  // ...
}

## 審查重點
- 邏輯正確性
- 錯誤處理
- 程式碼風格
```

**支援的路徑格式**：
- 相對路徑：`@src/main.ts`
- 絕對路徑：`@/home/user/project/src/main.ts`
- 搭配參數：`@$1`、`@$2`

---

### `$` 參數語法

使用者輸入的參數可以在指令中使用。

#### `$ARGUMENTS`：所有參數

**行為**：取得使用者輸入的**所有參數**（以空格分隔的完整字串）

```markdown
---
description: 修復指定的 Issue
---

請修復 Issue #$ARGUMENTS

步驟：
1. 分析問題
2. 實作修復
3. 撰寫測試
```

**使用方式**：
```bash
/fix-issue 123 urgent
```

**`$ARGUMENTS` 的值**：`123 urgent`

---

#### `$1`, `$2`, `$3`...：位置參數

**行為**：取得特定位置的參數（以空格分隔）

```markdown
---
description: 建立新元件
argument-hint: [name] [type]
---

請建立一個 $2 類型的元件，名稱為 $1。

要求：
- 使用 TypeScript
- 包含 Props 介面定義
- 建立對應的測試檔案
```

**使用方式**：
```bash
/create-component Button functional
```

**參數對應**：
- `$1` = `Button`
- `$2` = `functional`

---

#### 參數語法比較

| 語法 | 適用場景 | 範例輸入 | 取得的值 |
|------|----------|----------|----------|
| `$ARGUMENTS` | 參數只用一次 | `/cmd a b c` | `a b c` |
| `$1`, `$2` | 參數用在多處 | `/cmd a b c` | `$1=a`, `$2=b`, `$3=c` |

---

## 執行流程

當你輸入 `/command args` 時，發生以下流程：

```
┌─────────────────────────────────────────────────────────┐
│ 1. 載入指令檔案                                          │
│    讀取 .claude/commands/command.md                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 解析 Frontmatter                                     │
│    提取 description, allowed-tools, model 等設定        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 替換參數                                             │
│    $ARGUMENTS → "args"                                  │
│    $1, $2... → 各位置參數                               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 執行 Bash（!語法）                                    │
│    !`git status` → 實際執行並取得輸出                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 讀取檔案（@語法）                                     │
│    @src/main.ts → 讀取檔案內容                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 套用 allowed-tools 限制                              │
│    限制 Claude 只能使用指定的工具                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 發送給 Claude                                        │
│    處理後的完整內容作為提示詞發送                         │
└─────────────────────────────────────────────────────────┘
```

---

## 完整範例

### 範例 1：Git Commit 指令

```markdown
---
description: 根據暫存的變更建立 Git commit
argument-hint: [commit-type?]
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*)
---

## 當前狀態

**分支**：!`git branch --show-current`

**暫存的檔案**：
!`git status --short`

**變更內容**：
!`git diff --cached --stat`

## 詳細差異

!`git diff --cached`

## 任務

請根據上述變更建立一個 Git commit。

### Commit 類型
$ARGUMENTS

如果未指定類型，請根據變更內容自動判斷：
- `feat`: 新功能
- `fix`: 修復 Bug
- `refactor`: 重構
- `docs`: 文件更新
- `test`: 測試相關
- `chore`: 維護任務

### 格式要求
- 標題不超過 50 字元
- 使用繁體中文或英文（與專案一致）
- 說明 what 和 why，而非 how
```

**使用方式**：
```bash
/commit
/commit feat
/commit fix
```

---

### 範例 2：Code Review 指令

```markdown
---
description: 審查指定檔案的程式碼品質
argument-hint: [file-path]
allowed-tools: Read, Grep, Glob
---

## 待審查的檔案

@$1

## 審查清單

請依照以下清單進行審查：

### 1. 邏輯正確性
- [ ] 邏輯流程是否正確
- [ ] 邊界情況是否處理
- [ ] 錯誤處理是否完整

### 2. 程式碼品質
- [ ] 命名是否清晰
- [ ] 函數是否過長（建議 < 50 行）
- [ ] 是否有重複的程式碼

### 3. 效能考量
- [ ] 是否有不必要的迴圈
- [ ] 是否有 N+1 查詢問題
- [ ] 記憶體使用是否合理

### 4. 安全性
- [ ] 輸入是否有驗證
- [ ] 是否有 SQL Injection 風險
- [ ] 敏感資料是否有保護

## 輸出格式

請用以下格式回報：

| 問題 | 嚴重性 | 位置 | 建議 |
|------|--------|------|------|
| ... | 高/中/低 | 行號 | ... |
```

**使用方式**：
```bash
/review src/services/user-service.ts
```

---

### 範例 3：生成測試指令

```markdown
---
description: 為指定檔案生成單元測試
argument-hint: [file-path]
allowed-tools: Read, Write
---

## 原始碼

@$1

## 任務

請為上述程式碼生成單元測試。

## 測試要求

1. **框架**：使用專案現有的測試框架
2. **覆蓋率**：覆蓋所有公開函數
3. **情境**：包含正常情況和邊界情況
4. **格式**：遵循 AAA 模式（Arrange, Act, Assert）

## 測試檔案位置

測試檔案應放在原始碼旁邊：
- 原始碼：`src/services/user.ts`
- 測試檔：`src/services/user.test.ts`

## 輸出

請直接建立測試檔案。
```

---

## 最佳實踐

### ✅ 應該做的

#### 1. 清晰的 Frontmatter

```yaml
---
description: 簡短但完整地描述指令用途
argument-hint: [required-arg] [optional-arg?]
allowed-tools: 只列出必要的工具
---
```

#### 2. 結構化的內容

```markdown
## 上下文
說明背景...

## 任務
具體要做什麼...

## 格式要求
期望的輸出格式...

## 注意事項
特別要注意的地方...
```

#### 3. 限制工具使用

```yaml
# 只需要讀取的指令
allowed-tools: Read, Grep, Glob

# 需要執行 Git 的指令
allowed-tools: Read, Bash(git:*)
```

#### 4. 提供範例

```markdown
## 使用方式

/create-component Button functional
/create-component Modal class
```

---

### ❌ 應該避免的

#### 1. 沒有 description

```yaml
# ❌ 不好：/help 時不知道用途
---
allowed-tools: Read
---
```

```yaml
# ✅ 好：清楚說明用途
---
description: 審查程式碼品質並提供改進建議
allowed-tools: Read
---
```

#### 2. 過於寬鬆的工具權限

```yaml
# ❌ 不好：允許所有操作
---
allowed-tools: Read, Write, Edit, Bash
---
```

```yaml
# ✅ 好：只允許必要的操作
---
allowed-tools: Read, Grep
---
```

#### 3. 內容過於簡略

```markdown
# ❌ 不好
審查這段程式碼
```

```markdown
# ✅ 好
## 任務
審查這段程式碼，重點檢查：
1. 邏輯正確性
2. 錯誤處理
3. 效能考量

## 輸出格式
| 問題 | 嚴重性 | 建議 |
```

---

## Quick Reference

```
檔案位置：
  .claude/commands/<name>.md    專案級
  ~/.claude/commands/<name>.md  個人級

Frontmatter：
  description:      指令描述
  argument-hint:    參數提示
  allowed-tools:    工具限制
  model:            指定模型

特殊語法：
  !`command`        執行 Bash，嵌入輸出
  @path/to/file     引用檔案內容
  $ARGUMENTS        所有參數
  $1, $2, $3        位置參數

執行順序：
  1. 解析 Frontmatter
  2. 替換 $參數
  3. 執行 !Bash
  4. 讀取 @檔案
  5. 套用工具限制
  6. 發送給 Claude
```
