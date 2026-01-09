/**
 * Checklist Manager
 * Core business logic for managing enhanced checklist items
 */

const ChecklistManager = {
    /**
     * Add a sublist item to a checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Parent checklist item ID
     * @param {string} sublistItemText - Text for the new sublist item
     * @returns {Promise<Object>} Updated item data
     */
    async addSublistItem(t, checkItemId, sublistItemText) {
        const itemData = await StorageManager.getItemData(t, checkItemId);

        if (!itemData.sublist) {
            itemData.sublist = [];
        }

        const newSublistItem = {
            id: this._generateId(),
            text: sublistItemText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        itemData.sublist.push(newSublistItem);
        await StorageManager.setItemData(t, checkItemId, itemData);

        return itemData;
    },

    /**
     * Update a sublist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Parent checklist item ID
     * @param {string} sublistItemId - Sublist item ID to update
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated item data
     */
    async updateSublistItem(t, checkItemId, sublistItemId, updates) {
        const itemData = await StorageManager.getItemData(t, checkItemId);

        const sublistItem = itemData.sublist.find(item => item.id === sublistItemId);
        if (sublistItem) {
            Object.assign(sublistItem, updates);
            await StorageManager.setItemData(t, checkItemId, itemData);
        }

        return itemData;
    },

    /**
     * Delete a sublist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Parent checklist item ID
     * @param {string} sublistItemId - Sublist item ID to delete
     * @returns {Promise<Object>} Updated item data
     */
    async deleteSublistItem(t, checkItemId, sublistItemId) {
        const itemData = await StorageManager.getItemData(t, checkItemId);

        itemData.sublist = itemData.sublist.filter(item => item.id !== sublistItemId);
        await StorageManager.setItemData(t, checkItemId, itemData);

        return itemData;
    },


    /**
     * Get statistics for a checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Checklist item ID
     * @returns {Promise<Object>} Statistics object
     */
    async getItemStats(t, checkItemId) {
        const itemData = await StorageManager.getItemData(t, checkItemId);

        const totalSublistItems = itemData.sublist ? itemData.sublist.length : 0;
        const completedSublistItems = itemData.sublist
            ? itemData.sublist.filter(item => item.completed).length
            : 0;

        return {
            totalSublistItems,
            completedSublistItems,
            progress: totalSublistItems > 0
                ? Math.round((completedSublistItems / totalSublistItems) * 100)
                : 0
        };
    },

    /**
     * Get all enhanced items for checklists on a card
     * @param {Object} t - Trello Power-Up interface
     * @param {Array} checklists - Array of checklist objects from Trello
     * @returns {Promise<Object>} Map of checkItemId to enhanced data
     */
    async getEnhancedChecklistData(t, checklists) {
        const allData = await StorageManager.getAllCardData(t);
        const enhancedData = {};

        // Process all checklist items
        for (const checklist of checklists) {
            if (checklist.checkItems) {
                for (const checkItem of checklist.checkItems) {
                    const key = `item-${checkItem.id}`;
                    if (allData[key]) {
                        enhancedData[checkItem.id] = allData[key];
                    }
                }
            }
        }

        return enhancedData;
    },

    /**
     * Create a new checklist on a card
     * @param {Object} t - Trello Power-Up interface
     * @param {string} cardId - Card ID
     * @param {string} checklistName - Name of the new checklist
     * @returns {Promise<Object>} Created checklist data
     */
    async createChecklist(t, cardId, checklistName) {
        const restApi = t.getRestApi();
        const token = await restApi.getToken();

        const response = await fetch(
            `https://api.trello.com/1/checklists?idCard=${cardId}&name=${encodeURIComponent(checklistName)}&key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`,
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error(`Failed to create checklist: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Delete a checklist from a card
     * @param {Object} t - Trello Power-Up interface
     * @param {string} cardId - Card ID
     * @param {string} checklistId - Checklist ID to delete
     * @returns {Promise<void>}
     */
    async deleteChecklist(t, cardId, checklistId) {
        const restApi = t.getRestApi();
        const token = await restApi.getToken();

        const response = await fetch(
            `https://api.trello.com/1/cards/${cardId}/checklists/${checklistId}?key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete checklist: ${response.status}`);
        }
    },

    /**
     * Update checklist name
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checklistId - Checklist ID
     * @param {string} newName - New name for the checklist
     * @returns {Promise<Object>} Updated checklist data
     */
    async updateChecklistName(t, checklistId, newName) {
        const restApi = t.getRestApi();
        const token = await restApi.getToken();

        const response = await fetch(
            `https://api.trello.com/1/checklists/${checklistId}?name=${encodeURIComponent(newName)}&key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`,
            { method: 'PUT' }
        );

        if (!response.ok) {
            throw new Error(`Failed to update checklist name: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Add a new check item to a checklist
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checklistId - Checklist ID
     * @param {string} itemName - Name of the new check item
     * @returns {Promise<Object>} Created check item data
     */
    async addCheckItem(t, checklistId, itemName) {
        const restApi = t.getRestApi();
        const token = await restApi.getToken();

        const response = await fetch(
            `https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${encodeURIComponent(itemName)}&key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`,
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error(`Failed to add check item: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Delete a check item from a checklist
     * @param {Object} t - Trello Power-Up interface
     * @param {string} cardId - Card ID
     * @param {string} checkItemId - Check item ID to delete
     * @returns {Promise<void>}
     */
    async deleteCheckItem(t, cardId, checkItemId) {
        const restApi = t.getRestApi();
        const token = await restApi.getToken();

        const response = await fetch(
            `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete check item: ${response.status}`);
        }
    },

    /**
     * Generate a unique ID for sublist items
     * @private
     * @returns {string} Unique ID
     */
    _generateId() {
        return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Make available globally
window.ChecklistManager = ChecklistManager;
