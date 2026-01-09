# Plan: UI/UX 優化：移除冗餘的 Add Item 功能

## Phase 1: 分析與定位
- [x] Task: 深入分析 `js/ui.js` 中 `#add-sublist-btn` 的邏輯鏈結
- [x] Task: 分析 `js/section-ui.js` 中 `+ Add Item` 按鈕在不同視圖下的呈現邏輯
- [ ] Task: Conductor - User Manual Verification '分析與定位' (Protocol in workflow.md)

## Phase 2: 執行移除與清理
- [x] Task: 從 `js/ui.js` 中移除「Add Item」按鈕與其對應的 Enter 鍵監聽邏輯 [0655eae]
- [x] Task: 從 `js/section-ui.js` 中移除 `+ Add Item` 相關的 DOM 生成與點擊事件 [0bb81f4]
- [x] Task: 清理 `js/checklist-manager.js` 中僅被「Add Item」呼叫的內部函式（若有） [35a1c6b]
- [ ] Task: Conductor - User Manual Verification '執行移除與清理' (Protocol in workflow.md)

## Phase 3: 驗證與文件更新
- [ ] Task: 在 Trello 環境中手動驗證「Add Sub-task」功能是否依然運作正常
- [ ] Task: 檢查移除後的 UI 排版是否出現跑版現象
- [ ] Task: 更新 `README.md` 中的「Usage Guide」區塊，移除對「Add Item」按鈕的描述
- [ ] Task: Conductor - User Manual Verification '驗證與文件更新' (Protocol in workflow.md)
