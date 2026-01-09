/**
 * Trello Power-Up Connector
 * This file initializes the Power-Up capabilities (connector iframe)
 * It should NOT contain any UI rendering logic
 */

console.log('[CONNECTOR] Starting Enhanced Checklists Power-Up initialization');

var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

// Initialize the Power-Up
window.TrelloPowerUp.initialize({
    /**
     * Card Buttons - Returning empty array (deprecated)
     * Kept temporarily to avoid errors during transition
     */
    'card-buttons': function(t, options) {
        console.log('[CONNECTOR] card-buttons called (deprecated, returning empty)');
        return [];
    },

    /**
     * Card Back Section
     * Displays an iframe on the back of a card with checklist items and quick add functionality
     */
    'card-back-section': function(t, options) {
        console.log('[CONNECTOR] card-back-section capability called');
        try {
            return {
                title: 'Enhanced Checklists',
                icon: GRAY_ICON,
                content: {
                    type: 'iframe',
                    url: t.signUrl('./section.html'),
                    height: 400 // Will be dynamically adjusted by section content
                }
            };
        } catch (error) {
            console.error('[CONNECTOR] Error in card-back-section:', error);
            return null;
        }
    },

    /**
     * Card Badges
     * Shows badges on card front indicating enhanced checklist items
     */
    'card-badges': function(t, options) {
        return Promise.resolve()
            .then(async function() {
                // We need to load the managers first
                // For now, return empty badges
                // TODO: Implement badge logic after fixing the architecture
                return [];
            })
            .catch(function(error) {
                console.error('[CONNECTOR] Error in card-badges:', error);
                return [];
            });
    },

    /**
     * On Enable
     * Called when the Power-Up is enabled on a board
     */
    'on-enable': function(t, options) {
        try {
            console.log('[CONNECTOR] Enhanced Checklists Power-Up enabled');
            return t.alert({
                message: 'Enhanced Checklists Power-Up is now active! Open any card to see enhanced checklists.',
                duration: 5
            });
        } catch (error) {
            console.error('[CONNECTOR] Error in on-enable:', error);
        }
    }
}, {
    appKey: 'a3495d762586470e3473a32fcf0eb1f5',
    appName: 'Enhanced Checklists'
});

console.log('[CONNECTOR] Enhanced Checklists Power-Up initialized successfully');
