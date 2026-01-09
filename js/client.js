/**
 * Trello Power-Up Client - Popup/Modal Handler
 * This file handles routing and UI rendering for popups and modals
 * It should NOT call TrelloPowerUp.initialize() - that's done in connector.js
 */

console.log('[CLIENT] Client script loaded');

// Handle routing when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('[CLIENT] DOMContentLoaded event fired');

    // Check if we're in an iframe context (popup/modal)
    let t;
    try {
        console.log('[CLIENT] Attempting to initialize TrelloPowerUp.iframe()');
        t = window.TrelloPowerUp.iframe();
        console.log('[CLIENT] TrelloPowerUp.iframe() initialized successfully');
    } catch (error) {
        // If we're not in a Trello iframe context, do nothing
        console.log('[CLIENT] Not in iframe context:', error.message);
        return;
    }

    // Get the view type from args
    let view = null;
    try {
        console.log('[CLIENT] Attempting to get view from t.arg("view")');
        view = await t.arg('view');
        console.log('[CLIENT] Got view from t.arg:', view);
    } catch (argError) {
        console.log('[CLIENT] t.arg("view") failed:', argError.message);
        // If arg('view') fails, we're probably not in a popup/modal
        view = null;
    }

    console.log('[CLIENT] Final view value:', view);

    // Only render content if we have a specific view
    if (!view) {
        console.log('[CLIENT] No view specified - exiting');
        return;
    }

    // Check if required managers are available
    console.log('[CLIENT] Checking if managers are loaded...');
    console.log('[CLIENT] UIManager available:', typeof window.UIManager !== 'undefined');
    console.log('[CLIENT] ChecklistManager available:', typeof window.ChecklistManager !== 'undefined');
    console.log('[CLIENT] StorageManager available:', typeof window.StorageManager !== 'undefined');

    if (typeof window.UIManager === 'undefined') {
        console.error('[CLIENT] UIManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: UI Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    if (typeof window.ChecklistManager === 'undefined') {
        console.error('[CLIENT] ChecklistManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: Checklist Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    if (typeof window.StorageManager === 'undefined') {
        console.error('[CLIENT] StorageManager not loaded yet');
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div style="padding: 20px; color: red;">Error: Storage Manager not loaded. Please refresh the page.</div>';
        }
        return;
    }

    console.log('[CLIENT] All managers loaded successfully');
    console.log('[CLIENT] Routing to view:', view);

    try {
        // Route to the appropriate view
        if (view === 'item-detail') {
            console.log('[CLIENT] Matched view: item-detail');
            const checkItemId = await t.arg('checkItemId');
            const checkItemName = await t.arg('checkItemName');
            console.log('[CLIENT] checkItemId:', checkItemId);
            console.log('[CLIENT] checkItemName:', checkItemName);

            if (checkItemId && checkItemName) {
                console.log('[CLIENT] Rendering item detail view for:', checkItemName);
                await UIManager.renderItemDetailView(t, {
                    checkItemId,
                    checkItemName
                });
                console.log('[CLIENT] Item detail view rendered successfully');
            } else {
                console.error('[CLIENT] Missing required args for item-detail view');
                const content = document.getElementById('content');
                if (content) {
                    content.innerHTML = '<div style="padding: 20px; color: red;">Error: Missing item information. Please try again.</div>';
                }
            }
        } else if (view === 'checklist-selection') {
            console.log('[CLIENT] Matched view: checklist-selection');
            console.log('[CLIENT] Rendering checklist selection view');
            await UIManager.renderChecklistSelection(t);
            console.log('[CLIENT] Checklist selection view rendered successfully');
        } else if (view === 'settings') {
            console.log('[CLIENT] Matched view: settings');
            console.log('[CLIENT] Rendering settings view');
            await UIManager.renderSettingsView(t);
            console.log('[CLIENT] Settings view rendered successfully');
        } else {
            console.warn('[CLIENT] Unknown view:', view);
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = `<div style="padding: 20px; color: orange;">Unknown view: ${view}</div>`;
            }
        }

        // Size the iframe to fit content
        console.log('[CLIENT] Attempting to resize iframe to fit content');
        t.sizeTo('#content').catch(function(err) {
            console.warn('[CLIENT] Could not resize iframe:', err);
        });
    } catch (error) {
        console.error('[CLIENT] Error rendering view:', error);
        console.error('[CLIENT] Error stack:', error.stack);
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `<div style="padding: 20px; color: red;">Error: ${error.message}<br><br>Please check the console for details.</div>`;
        }
    }
});
