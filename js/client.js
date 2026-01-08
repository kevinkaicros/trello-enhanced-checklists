/**
 * Trello Power-Up Client Initialization
 * Main entry point for the Enhanced Checklists Power-Up
 */

// Initialize the Power-Up when DOM is ready
window.TrelloPowerUp.initialize({
    /**
     * Card Buttons
     * Adds a button to the card back to manage enhanced checklists
     */
    'card-buttons': function(t, options) {
        return [{
            icon: 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png',
            text: 'Manage Enhanced Checklists',
            callback: async function(t) {
                return t.popup({
                    title: 'Enhanced Checklists',
                    url: './index.html',
                    height: 400,
                    args: {
                        view: 'checklist-selection'
                    }
                });
            }
        }];
    },

    /**
     * Card Badges
     * Shows badges on card front indicating enhanced checklist items
     */
    'card-badges': async function(t, options) {
        const card = await t.card('checklists');
        const checklists = card.checklists || [];

        if (checklists.length === 0) {
            return [];
        }

        let totalEnhanced = 0;
        let totalSublistItems = 0;
        let completedSublistItems = 0;

        // Count enhanced items
        for (const checklist of checklists) {
            if (checklist.checkItems) {
                for (const item of checklist.checkItems) {
                    const stats = await ChecklistManager.getItemStats(t, item.id);

                    if (stats.hasDescription || stats.totalSublistItems > 0) {
                        totalEnhanced++;
                    }

                    totalSublistItems += stats.totalSublistItems;
                    completedSublistItems += stats.completedSublistItems;
                }
            }
        }

        const badges = [];

        // Show badge if there are enhanced items
        if (totalEnhanced > 0) {
            badges.push({
                icon: 'https://cdn-icons-png.flaticon.com/512/4697/4697260.png',
                text: `${totalEnhanced} enhanced`,
                color: 'blue'
            });
        }

        // Show sublist progress badge
        if (totalSublistItems > 0) {
            const progress = Math.round((completedSublistItems / totalSublistItems) * 100);
            badges.push({
                text: `Sublist: ${completedSublistItems}/${totalSublistItems}`,
                color: progress === 100 ? 'green' : 'yellow'
            });
        }

        return badges;
    },

    /**
     * Show Settings
     * Displays Power-Up settings and help
     */
    'show-settings': function(t, options) {
        return t.popup({
            title: 'Enhanced Checklists Settings',
            url: './index.html',
            height: 300,
            args: {
                view: 'settings'
            }
        });
    },

    /**
     * On Enable
     * Called when the Power-Up is enabled on a board
     */
    'on-enable': function(t, options) {
        console.log('Enhanced Checklists Power-Up enabled');
        return t.alert({
            message: 'Enhanced Checklists Power-Up is now active! Click on any card to get started.',
            duration: 5
        });
    }
}, {
    appKey: 'a3495d762586470e3473a32fcf0eb1f5', // Replace with your actual app key from Trello
    appName: 'Enhanced Checklists'
});

/**
 * Route handler for different views
 * Determines which UI to render based on the args passed
 * This section handles popup/modal content rendering using t.iframe()
 */

// Handle routing when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're in an iframe context (popup/modal) vs connector context
    try {
        const t = window.TrelloPowerUp.iframe();

        // Get the view type from args
        const context = t.getContext();
        const args = await t.arg('view');
        const view = args || context.view;

        // Only render content if we have a specific view (i.e., opened as popup/modal)
        if (!view) {
            // This is the connector iframe, no content should be rendered
            return;
        }

        // Route to the appropriate view
        if (view === 'item-detail') {
            const checkItemId = await t.arg('checkItemId');
            const checkItemName = await t.arg('checkItemName');

            await UIManager.renderItemDetailView(t, {
                checkItemId,
                checkItemName
            });
        } else if (view === 'checklist-selection') {
            await UIManager.renderChecklistSelection(t);
        } else if (view === 'settings') {
            await UIManager.renderSettingsView(t);
        }

        // Size the iframe to fit content
        t.sizeTo('#content');
    } catch (error) {
        // If we're not in a Trello iframe context, do nothing
        console.error('Not in a Trello Power-Up context:', error);
    }
});
