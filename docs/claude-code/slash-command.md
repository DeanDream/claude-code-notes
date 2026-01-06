# Slash Command 詳解

Slash Command 是 Claude Code 中預定義的 Markdown 文件，讓你可以通過 `/command` 快速執行常用指令。

## 核心概念

- **手動觸發**：需要輸入 `/command` 才會執行
- **支援參數**：可以傳遞動態參數
- **單檔結構**：一個 `.md` 檔案就是一個指令

## 建立指令

### 存放位置

| 位置 | 路徑 | 作用範圍 |
|------|------|----------|
| **專案級** | `.claude/commands/name.md` | 此專案所有人 |
| **個人級** | `~/.claude/commands/name.md` | 你自己，跨專案 |

### 基本範例

```markdown
# .claude/commands/review.md

審查這段程式碼，檢查：
1. 邏輯錯誤
2. 效能問題
3. 安全漏洞

使用方式：/review
```

## 參數傳遞

### $ARGUMENTS（所有參數）

```markdown
# fix-issue.md
修復 issue #$ARGUMENTS
```

使用：`/fix-issue 123`

### $1, $2, $3...（位置參數）

```markdown
# create-component.md
---
argument-hint: [name] [type]
---
建立 $2 元件，名稱為 $1
```

使用：`/create-component Button functional`

## Frontmatter 設定

```yaml
---
description: 指令描述
argument-hint: [arg1] [arg2]
allowed-tools: Read, Write, Bash(git:*)
model: claude-opus-4-5-20251101
---
```

## 動態內容

### Bash 執行（!語法）

```markdown
Git 狀態：!`git status --short`
```

### 檔案引用（@語法）

```markdown
比較這個檔案：@src/main.ts
```

## 常用範例

### Git Commit

```markdown
---
allowed-tools: Bash(git:*)
---

## 變更
!`git diff --cached`

建立 conventional commit 格式的提交訊息。
```

### Code Review

```markdown
---
argument-hint: [file-path]
---

審查 @$1，重點檢查：
- 邏輯正確性
- 錯誤處理
- 效能考量
```
