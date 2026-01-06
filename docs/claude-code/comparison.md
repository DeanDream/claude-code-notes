# 三者比較

完整比較 CLAUDE.md、Slash Command、Skill 三種機制。

## 核心差異表

| 比較維度 | CLAUDE.md | Slash Command | Skill |
|----------|-----------|---------------|-------|
| **觸發方式** | 🔄 自動（每次對話） | 👆 手動（`/command`） | 🤖 自動（Claude 判斷） |
| **檔案結構** | 📄 單檔或模組化 | 📄 單一 `.md` | 📁 目錄 + `SKILL.md` |
| **複雜度** | ⭐⭐ 中等 | ⭐ 簡單 | ⭐⭐⭐ 複雜 |
| **參數支援** | ❌ 不支援 | ✅ `$ARGUMENTS`, `$1`... | ❌ 依賴請求上下文 |
| **主要用途** | 全局指令、標準 | 重複使用的提示 | 複雜工作流程 |

## 功能特性對比

| 特性 | CLAUDE.md | Slash Command | Skill |
|------|-----------|---------------|-------|
| 檔案導入 (`@`) | ✅ | ✅ | ✅ |
| Bash 執行 (`!`) | ❌ | ✅ | ✅ |
| 工具限制 | ❌ | ✅ `allowed-tools` | ✅ `allowed-tools` |
| 模型指定 | ❌ | ✅ `model` | ✅ `model` |
| YAML frontmatter | ❌ | ✅ | ✅（必要） |

## 存放位置對比

| 範圍 | CLAUDE.md | Slash Command | Skill |
|------|-----------|---------------|-------|
| **個人級** | `~/.claude/CLAUDE.md` | `~/.claude/commands/` | `~/.claude/skills/` |
| **專案級** | `./CLAUDE.md` | `.claude/commands/` | `.claude/skills/` |

## 選擇決策流程

```
你的需求是什麼？
│
├─ 每次對話都要生效的規則？
│  └─ ✅ CLAUDE.md
│
├─ 偶爾使用的快速指令？
│  ├─ 需要傳參數？
│  │  └─ ✅ Slash Command
│  └─ 不需要參數？
│     └─ ✅ Slash Command（簡單）或 Skill（複雜）
│
└─ 讓 Claude 自動判斷？
   └─ ✅ Skill
```

## 場景對照表

| 場景 | 推薦選擇 | 原因 |
|------|----------|------|
| 設定專案編碼標準 | CLAUDE.md | 每次對話都要遵循 |
| 快速程式碼審查 | Slash Command | 手動觸發，可傳檔案路徑 |
| Git commit 範本 | Slash Command | 需要傳參數 |
| 複雜 PDF 處理流程 | Skill | 多步驟工作流 |
| 自動化部署檢查 | Skill | 複雜邏輯，自動觸發 |

## 組合使用

三種機制可以**互相搭配**：

```
CLAUDE.md
├── 定義全局標準
├── 引用 @.claude/rules/*.md

Slash Command
├── 快速觸發常用操作
├── 使用 !`` 執行 bash

Skill
├── 自動應用複雜流程
├── 遵循 CLAUDE.md 的標準
```

## 學習順序建議

1. **CLAUDE.md**（最簡單）
   - 單檔案、自動載入、沒有觸發機制

2. **Slash Command**（過渡）
   - 引入手動觸發、參數傳遞、frontmatter

3. **Skill**（最複雜）
   - 多檔案結構、自動觸發、漸進式載入
