# 最佳實踐

整理 Claude Code 客製化機制的最佳實踐與常見錯誤。

## CLAUDE.md 最佳實踐

### ✅ 做法

1. **保持簡潔**
   ```markdown
   # 好的做法：具體明確
   - 使用 2 空格縮排
   - 變數命名用 camelCase
   ```

2. **分層管理**
   ```
   個人級：語言、風格偏好
   專案級：團隊標準、架構
   專案本地：個人測試設定
   ```

3. **模組化大型規則**
   ```
   .claude/
   ├── CLAUDE.md
   └── rules/
       ├── typescript.md
       └── testing.md
   ```

### ❌ 避免

| 錯誤 | 問題 |
|------|------|
| 太籠統 | "寫好的程式碼" → 沒有具體標準 |
| 太冗長 | 500+ 行 → 難以維護 |
| 過時資訊 | 舊指令/架構 → 誤導 Claude |
| 敏感資訊 | 密碼/API Key → 安全風險 |

---

## Slash Command 最佳實踐

### ✅ 做法

1. **命名清晰**
   ```
   /review        ← 清楚
   /code-review   ← 清楚
   /r             ← 太短，不清楚
   ```

2. **善用 frontmatter**
   ```yaml
   ---
   description: 清楚說明用途
   argument-hint: [file] [type]
   allowed-tools: Read, Write
   ---
   ```

3. **提供範例**
   ```markdown
   使用方式：
   /create-component Button functional
   /create-component Modal class
   ```

### ❌ 避免

| 錯誤 | 問題 |
|------|------|
| 沒有 description | `/help` 時不知道用途 |
| 參數不明確 | 不知道要傳什麼 |
| 太複雜 | 應該用 Skill |

---

## Skill 最佳實踐

### ✅ 做法

1. **寫好的 description**
   ```yaml
   # 包含動作 + 關鍵詞
   description: 審查程式碼品質。在審查 PR 或 code review 時使用。
   ```

2. **漸進式揭露**
   ```
   SKILL.md       → 概述（快速載入）
   REFERENCE.md   → 詳細（需要時載入）
   ```

3. **限制工具使用**
   ```yaml
   # 唯讀 Skill
   allowed-tools: Read, Grep, Glob

   # 可執行 Skill
   allowed-tools: Read, Bash(npm:*), Write
   ```

### ❌ 避免

| 錯誤 | 問題 |
|------|------|
| description 太模糊 | Claude 不知道何時觸發 |
| SKILL.md 太長 | 載入效能差 |
| 沒有範例 | 不知道怎麼使用 |

---

## 通用原則

### 1. 具體優於抽象

```markdown
# ❌ 抽象
程式碼要寫好

# ✅ 具體
- 函數不超過 50 行
- 變數命名要有意義
- 所有 API 都要有錯誤處理
```

### 2. 可執行優於建議

```markdown
# ❌ 建議
測試要完整

# ✅ 可執行
- 測試覆蓋率 > 80%
- 所有公開 API 都要有測試
- 執行 npm test 確認通過
```

### 3. 定期維護

- 專案架構改變 → 更新 CLAUDE.md
- 新增工具/流程 → 新增對應指令
- 移除過時內容 → 定期審查

---

## 常見問題排查

### Skill 沒有被觸發

- 檢查 description 是否包含關鍵詞
- 試著用 description 中的詞彙重新描述請求

### Slash Command 找不到

- 確認檔案位置正確
- 確認檔案名稱沒有特殊字元
- 執行 `/help` 確認是否列出

### CLAUDE.md 沒有生效

- 執行 `/memory` 確認是否載入
- 檢查檔案語法是否正確
- 確認工作目錄正確
