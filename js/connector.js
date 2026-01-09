/**
 * Trello Power-Up Connector
 * This file initializes the Power-Up capabilities (connector iframe)
 * It should NOT contain any UI rendering logic
 */

console.log('[CONNECTOR] Starting Enhanced Checklists Power-Up initialization');

// Initialize the Power-Up
window.TrelloPowerUp.initialize({
    /**
     * Card Buttons
     * Adds a button to the card back to manage enhanced checklists
     */
    'card-buttons': function(t, options) {
        console.log('[CONNECTOR] card-buttons capability called');
        try {
            return [{
                icon: 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png',
                text: 'Manage Enhanced Checklists',
                callback: function(t) {
                    console.log('[CONNECTOR] Button clicked! Opening popup...');
                    console.log('[CONNECTOR] Popup config:', {
                        title: 'Enhanced Checklists',
                        url: './index.html',
                        height: 400,
                        args: { view: 'checklist-selection' }
                    });
                    return t.popup({
                        title: 'Enhanced Checklists',
                        url: './index.html',
                        height: 400,
                        args: {
                            view: 'checklist-selection'
                        }
                    }).then(function() {
                        console.log('[CONNECTOR] Popup opened successfully');
                    }).catch(function(err) {
                        console.error('[CONNECTOR] Error opening popup:', err);
                    });
                },
                condition: 'always'
            }];
        } catch (error) {
            console.error('[CONNECTOR] Error in card-buttons:', error);
            return [];
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
     * Show Settings
     * Displays Power-Up settings and help
     */
    'show-settings': function(t, options) {
        console.log('[CONNECTOR] show-settings capability called');
        try {
            console.log('[CONNECTOR] Opening settings popup...');
            return t.popup({
                title: 'Enhanced Checklists Settings',
                url: './index.html',
                height: 300,
                args: {
                    view: 'settings'
                }
            }).then(function() {
                console.log('[CONNECTOR] Settings popup opened successfully');
            }).catch(function(err) {
                console.error('[CONNECTOR] Error opening settings popup:', err);
            });
        } catch (error) {
            console.error('[CONNECTOR] Error in show-settings:', error);
            return t.alert({
                message: 'Failed to open settings. Please try again.',
                duration: 5
            });
        }
    },

    /**
     * On Enable
     * Called when the Power-Up is enabled on a board
     */
    'on-enable': function(t, options) {
        try {
            console.log('[CONNECTOR] Enhanced Checklists Power-Up enabled');
            return t.alert({
                message: 'Enhanced Checklists Power-Up is now active! Click on any card to get started.',
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
