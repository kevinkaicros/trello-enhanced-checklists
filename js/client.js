/**
 * Trello Power-Up Client - Popup/Modal Handler
 * This file handles routing and UI rendering for popups and modals
 * It should NOT call TrelloPowerUp.initialize() - that's done in connector.js
 */

console.log('[CLIENT] Client script loaded');

// Initialize the iframe context immediately
// This MUST be called synchronously when the script loads to prevent timeout
var t = window.TrelloPowerUp.iframe({
    appKey: 'a3495d762586470e3473a32fcf0eb1f5',
    appName: 'Enhanced Checklists'
});
console.log('[CLIENT] TrelloPowerUp.iframe() initialized');

// Handle routing and rendering
window.addEventListener('load', async function() {
    console.log('[CLIENT] Window load event fired');

    try {
        // Get the view type from args
        var view = await t.arg('view');
        console.log('[CLIENT] View from args:', view);

        if (!view) {
            console.log('[CLIENT] No view specified');
            return;
        }

        // Check if required managers are available
        if (typeof window.UIManager === 'undefined' ||
            typeof window.ChecklistManager === 'undefined' ||
            typeof window.StorageManager === 'undefined') {
            console.error('[CLIENT] Required managers not loaded');
            document.getElementById('content').innerHTML =
                '<div style="padding: 20px; color: red;">Error: Required components not loaded. Please refresh the page.</div>';
            return;
        }

        console.log('[CLIENT] All managers loaded, routing to view:', view);

        // Route to the appropriate view
        if (view === 'item-detail') {
            var checkItemId = await t.arg('checkItemId');
            var checkItemName = await t.arg('checkItemName');
            console.log('[CLIENT] Item detail:', checkItemId, checkItemName);

            if (checkItemId && checkItemName) {
                await UIManager.renderItemDetailView(t, {
                    checkItemId: checkItemId,
                    checkItemName: checkItemName
                });
                console.log('[CLIENT] Item detail view rendered');
            } else {
                document.getElementById('content').innerHTML =
                    '<div style="padding: 20px; color: red;">Error: Missing item information.</div>';
            }
        } else if (view === 'checklist-selection') {
            console.log('[CLIENT] Rendering checklist selection');
            await UIManager.renderChecklistSelection(t);
            console.log('[CLIENT] Checklist selection rendered');
        } else if (view === 'settings') {
            console.log('[CLIENT] Rendering settings');
            await UIManager.renderSettingsView(t);
            console.log('[CLIENT] Settings rendered');
        } else {
            console.warn('[CLIENT] Unknown view:', view);
            document.getElementById('content').innerHTML =
                '<div style="padding: 20px; color: orange;">Unknown view: ' + view + '</div>';
        }

        // Size the iframe to fit content
        t.sizeTo('#content').catch(function(err) {
            console.warn('[CLIENT] Could not resize iframe:', err);
        });
    } catch (error) {
        console.error('[CLIENT] Error:', error);
        document.getElementById('content').innerHTML =
            '<div style="padding: 20px; color: red;">Error: ' + error.message + '</div>';
    }
});
