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
     * Set description for a checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Checklist item ID
     * @param {string} description - Description text
     * @returns {Promise<Object>} Updated item data
     */
    async setDescription(t, checkItemId, description) {
        const itemData = await StorageManager.getItemData(t, checkItemId);
        itemData.description = description;
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
            hasDescription: !!itemData.description,
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
