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
        try {
            return [{
                icon: 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png',
                text: 'Manage Enhanced Checklists',
                callback: function(t) {
                    return t.popup({
                        title: 'Enhanced Checklists',
                        url: './index.html',
                        height: 400,
                        args: {
                            view: 'checklist-selection'
                        }
                    });
                },
                condition: 'always'
            }];
        } catch (error) {
            console.error('Error in card-buttons:', error);
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
                // Check if ChecklistManager is available
                if (typeof window.ChecklistManager === 'undefined') {
                    console.warn('ChecklistManager not available yet');
                    return [];
                }

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
                            try {
                                const stats = await ChecklistManager.getItemStats(t, item.id);

                                if (stats.hasDescription || stats.totalSublistItems > 0) {
                                    totalEnhanced++;
                                }

                                totalSublistItems += stats.totalSublistItems;
                                completedSublistItems += stats.completedSublistItems;
                            } catch (error) {
                                console.error('Error getting item stats:', error);
                            }
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
            })
            .catch(function(error) {
                console.error('Error in card-badges:', error);
                return [];
            });
    },

    /**
     * Show Settings
     * Displays Power-Up settings and help
     */
    'show-settings': function(t, options) {
        try {
            return t.popup({
                title: 'Enhanced Checklists Settings',
                url: './index.html',
                height: 300,
                args: {
                    view: 'settings'
                }
            });
        } catch (error) {
            console.error('Error in show-settings:', error);
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
            console.log('Enhanced Checklists Power-Up enabled');
            return t.alert({
                message: 'Enhanced Checklists Power-Up is now active! Click on any card to get started.',
                duration: 5
            });
        } catch (error) {
            console.error('Error in on-enable:', error);
        }
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
    let t;
    try {
        t = window.TrelloPowerUp.iframe();
    } catch (error) {
        // If we're not in a Trello iframe context, do nothing
        // This is expected for the connector iframe
        console.log('Running as connector iframe (not a popup)');
        return;
    }

    // Get the view type from args
    let view = null;
    try {
        view = await t.arg('view');
    } catch (argError) {
        // If arg('view') fails, try to get it from context
        try {
            const context = t.getContext();
            view = context && context.view ? context.view : null;
        } catch (contextError) {
            // Context doesn't exist or doesn't have view
            view = null;
        }
    }

    // Only render content if we have a specific view (i.e., opened as popup/modal)
    if (!view) {
        // This is the connector iframe, no content should be rendered
        console.log('No view specified - running as connector iframe');
        return;
    }

    // Check if required managers are available
    if (typeof window.UIManager === 'undefined') {
        console.error('UIManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: UI Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    if (typeof window.ChecklistManager === 'undefined') {
        console.error('ChecklistManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: Checklist Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    if (typeof window.StorageManager === 'undefined') {
        console.error('StorageManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: Storage Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    console.log('Routing to view:', view);

    try {
        // Route to the appropriate view
        if (view === 'item-detail') {
            const checkItemId = await t.arg('checkItemId');
            const checkItemName = await t.arg('checkItemName');

            if (checkItemId && checkItemName) {
                console.log('Rendering item detail view for:', checkItemName);
                await UIManager.renderItemDetailView(t, {
                    checkItemId,
                    checkItemName
                });
            } else {
                console.error('Missing required args for item-detail view');
                const content = document.getElementById('content');
                if (content) {
                    content.innerHTML = '<div style="padding: 20px; color: red;">Error: Missing item information. Please try again.</div>';
                }
            }
        } else if (view === 'checklist-selection') {
            console.log('Rendering checklist selection view');
            await UIManager.renderChecklistSelection(t);
        } else if (view === 'settings') {
            console.log('Rendering settings view');
            await UIManager.renderSettingsView(t);
        } else {
            console.warn('Unknown view:', view);
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = `<div style="padding: 20px; color: orange;">Unknown view: ${view}</div>`;
            }
        }

        // Size the iframe to fit content
        t.sizeTo('#content').catch(function(err) {
            console.warn('Could not resize iframe:', err);
        });
    } catch (error) {
        console.error('Error rendering view:', error);
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `<div style="padding: 20px; color: red;">Error: ${error.message}<br><br>Please check the console for details.</div>`;
        }
    }
});
