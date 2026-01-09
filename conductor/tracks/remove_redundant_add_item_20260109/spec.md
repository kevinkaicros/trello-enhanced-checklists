# Spec: UI/UX 優化：移除冗餘的 Add Item 功能

## 背景
目前的 Power-Up 介面中存在多個新增按鈕。使用者反應「Add Item」按鈕與「Add Sub-task」或原生 Trello 功能有重疊，導致介面過於複雜且容易混淆。

## 目標
1. 移除 `js/ui.js` 和 `js/section-ui.js` 中所有標示為 「Add Item」 的冗餘按鈕與輸入欄位。
2. 清理與「Add Item」相關的事件監聽器（Event Listeners）與處理函式。
3. 確保「Add Sub-task」功能不受影響，使用者仍能正常新增子任務項目。
4. 調整 UI 排版，確保移除按鈕後的視覺效果符合 Trello 原生風格。

## 技術細節
- **受影響檔案**：
    - `js/ui.js`: 包含 `#add-sublist-btn` 的按鈕定義。
    - `js/section-ui.js`: 包含 `+ Add Item` 的文字與相關邏輯。
    - `README.md`: 需更新使用教學說明。
- **資料影響**：僅涉及 UI 呈現，不影響 `pluginData` 的儲存結構。
