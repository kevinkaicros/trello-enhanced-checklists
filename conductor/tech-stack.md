# 技術棧：Enhanced Checklists

## 核心開發
*   **程式語言**：JavaScript (ES6+) - 採用現代 JavaScript 語法。
*   **前端架構**：純 HTML5 與 CSS3，無依賴大型框架（如 React/Vue），以保持外掛輕量。
*   **樣式處理**：自定義 CSS (`css/styles.css`)，遵循 Trello 視覺風格。

## Trello 整合
*   **SDK**：Trello Power-Up Client Library (`trello-power-up.js`)。
*   **資料儲存**：
    *   **機制**：Trello `pluginData` API。
    *   **範圍 (Scope)**：`card` (資料依附於個別卡片)。
    *   **權限 (Visibility)**：`shared` (看板成員皆可見)。
*   **功能權限 (Capabilities)**：
    *   `card-buttons`：在卡片背面提供「管理」按鈕。
    *   `card-badges`：在卡片正面顯示視覺徽章。
    *   `card-back-section`：在卡片背面顯示內容區塊。

## 專案結構與維護
*   **模組化設計**：
    *   `client.js`：外掛初始化與功能註冊。
    *   `storage.js`：封裝 `pluginData` 存取邏輯。
    *   `checklist-manager.js`：核心業務邏輯（描述、子清單運算）。
    *   `ui.js` / `section-ui.js`：負責介面渲染與事件監聽。
*   **靜態託管**：相容於所有靜態網站託管服務。
