/**
 * Storage Manager for Enhanced Checklists
 * Handles data persistence using Trello's pluginData API
 */

const StorageManager = {
    // Storage scope - 'card' means data is stored per card
    SCOPE: 'card',
    VISIBILITY: 'shared', // 'shared' makes data visible to all board members

    /**
     * Get enhanced data for a specific checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - The ID of the checklist item
     * @returns {Promise<Object>} Enhanced data (sublist, description, etc.)
     */
    async getItemData(t, checkItemId) {
        try {
            const key = `item-${checkItemId}`;
            const data = await t.get(this.SCOPE, this.VISIBILITY, key);
            return data || { sublist: [], description: '' };
        } catch (error) {
            console.error('Error getting item data:', error);
            return { sublist: [], description: '' };
        }
    },

    /**
     * Save enhanced data for a checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - The ID of the checklist item
     * @param {Object} data - Data to save (sublist, description)
     * @returns {Promise<void>}
     */
    async setItemData(t, checkItemId, data) {
        try {
            const key = `item-${checkItemId}`;
            await t.set(this.SCOPE, this.VISIBILITY, key, data);
        } catch (error) {
            console.error('Error saving item data:', error);
            throw error;
        }
    },

    /**
     * Get all enhanced checklist data for the current card
     * @param {Object} t - Trello Power-Up interface
     * @returns {Promise<Object>} All enhanced item data
     */
    async getAllCardData(t) {
        try {
            const allData = await t.getAll(this.SCOPE, this.VISIBILITY);
            return allData || {};
        } catch (error) {
            console.error('Error getting all card data:', error);
            return {};
        }
    },

    /**
     * Delete enhanced data for a checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - The ID of the checklist item
     * @returns {Promise<void>}
     */
    async deleteItemData(t, checkItemId) {
        try {
            const key = `item-${checkItemId}`;
            await t.remove(this.SCOPE, this.VISIBILITY, key);
        } catch (error) {
            console.error('Error deleting item data:', error);
            throw error;
        }
    }
};

// Make available globally
window.StorageManager = StorageManager;
