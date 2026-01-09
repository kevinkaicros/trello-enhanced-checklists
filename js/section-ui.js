/**
 * Section UI Manager
 * Handles the card-back-section iframe rendering and interactions
 */

console.log('[SECTION-UI] Script loaded');

// Initialize the iframe context
var t = window.TrelloPowerUp.iframe({
    appKey: 'a3495d762586470e3473a32fcf0eb1f5',
    appName: 'Enhanced Checklists'
});
console.log('[SECTION-UI] TrelloPowerUp.iframe() initialized');

const SectionUI = {
    /**
     * Initialize the section UI
     */
    async init() {
        console.log('[SECTION-UI] Initializing section UI');
        try {
            await this.loadChecklists();
        } catch (error) {
            console.error('[SECTION-UI] Error initializing:', error);
            this.showError('Failed to load checklists. Please refresh the page.');
        }
    },

    /**
     * Load and render checklists from the card
     */
    async loadChecklists() {
        const container = document.getElementById('section-content');

        try {
            // Get card ID
            const cardData = await t.card('id');
            const cardId = cardData.id;
            console.log('[SECTION-UI] Card ID:', cardId);

            // Get REST API client
            const restApi = t.getRestApi();
            const isAuthorized = await restApi.isAuthorized();
            console.log('[SECTION-UI] Is authorized:', isAuthorized);

            if (!isAuthorized) {
                this.showAuthRequired(container);
                return;
            }

            // Fetch checklists with check items using REST API
            const token = await restApi.getToken();
            const response = await fetch(
                `https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&checkItem_fields=all&key=a3495d762586470e3473a32fcf0eb1f5&token=${token}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const checklists = await response.json();
            console.log('[SECTION-UI] Checklists loaded:', checklists);

            if (!checklists || checklists.length === 0) {
                container.innerHTML = '<div class="empty-state">No checklists found on this card.</div>';
                t.sizeTo('#section-content');
                return;
            }

            await this.renderChecklists(checklists);

        } catch (error) {
            console.error('[SECTION-UI] Error loading checklists:', error);
            this.showError('Error loading checklists: ' + error.message);
        }
    },

    /**
     * Show authorization required message
     */
    showAuthRequired(container) {
        container.innerHTML = `
            <div class="auth-required">
                <p>Authorization required to access checklist items.</p>
                <button id="authorize-btn" class="button primary">Authorize Access</button>
            </div>
        `;

        document.getElementById('authorize-btn').addEventListener('click', async () => {
            try {
                const restApi = t.getRestApi();
                await restApi.authorize({ scope: 'read,write' });
                console.log('[SECTION-UI] Authorization successful');
                await this.loadChecklists();
            } catch (error) {
                console.error('[SECTION-UI] Authorization failed:', error);
                this.showError('Authorization failed. Please try again.');
            }
        });

        t.sizeTo('#section-content');
    },

    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById('section-content');
        container.innerHTML = `<div class="error-state">${this._escapeHtml(message)}</div>`;
        t.sizeTo('#section-content');
    },

    /**
     * Render all checklists and their items
     */
    async renderChecklists(checklists) {
        const container = document.getElementById('section-content');
        let html = '<div class="section-checklists">';

        for (const checklist of checklists) {
            html += `<div class="checklist-group">
                <h3 class="checklist-title">${this._escapeHtml(checklist.name)}</h3>
                <div class="checklist-items-section">`;

            if (checklist.checkItems && checklist.checkItems.length > 0) {
                for (const item of checklist.checkItems) {
                    html += await this.renderChecklistItem(item);
                }
            } else {
                html += '<p class="empty-state">No items in this checklist</p>';
            }

            html += '</div></div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // Attach event listeners
        this.attachEventListeners();

        // Adjust iframe size
        t.sizeTo('#section-content');
    },

    /**
     * Render a single checklist item with its sublists
     */
    async renderChecklistItem(item) {
        const itemData = await ChecklistManager.getItemStats(t, item.id);
        const sublistData = await StorageManager.getItemData(t, item.id);
        const sublists = sublistData.sublist || [];

        const checkIcon = item.state === 'complete' ? '☑' : '☐';
        const itemClass = item.state === 'complete' ? 'completed' : '';

        let html = `
            <div class="checklist-item-card ${itemClass}" data-item-id="${item.id}">
                <div class="checklist-item-header">
                    <span class="check-icon">${checkIcon}</span>
                    <span class="item-name">${this._escapeHtml(item.name)}</span>
                    <button class="add-sublist-btn" data-item-id="${item.id}" data-item-name="${this._escapeHtml(item.name)}" title="Add sub-task">
                        + Add Sub-task
                    </button>
                </div>`;

        // Add input form (hidden by default)
        html += `
            <div class="quick-add-form" id="form-${item.id}" style="display: none;">
                <input type="text"
                       class="sublist-input"
                       id="input-${item.id}"
                       placeholder="Enter sub-task name..."
                       data-item-id="${item.id}">
                <div class="form-actions">
                    <button class="button primary save-sublist-btn" data-item-id="${item.id}">Add</button>
                    <button class="button cancel-sublist-btn" data-item-id="${item.id}">Cancel</button>
                </div>
            </div>`;

        // Render sublists
        if (sublists.length > 0) {
            html += '<div class="sublist-container">';
            for (const subitem of sublists) {
                html += `
                    <div class="sublist-item ${subitem.completed ? 'completed' : ''}" data-sublist-id="${subitem.id}">
                        <input type="checkbox"
                               class="sublist-checkbox"
                               ${subitem.completed ? 'checked' : ''}
                               data-item-id="${item.id}"
                               data-sublist-id="${subitem.id}">
                        <span class="sublist-text">${this._escapeHtml(subitem.text)}</span>
                        <button class="delete-sublist-btn"
                                data-item-id="${item.id}"
                                data-sublist-id="${subitem.id}"
                                title="Delete">×</button>
                    </div>`;
            }
            html += '</div>';
        }

        html += '</div>';
        return html;
    },

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Add sublist button
        document.querySelectorAll('.add-sublist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.showQuickAddForm(itemId);
            });
        });

        // Save sublist button
        document.querySelectorAll('.save-sublist-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = e.target.dataset.itemId;
                await this.addSublistItem(itemId);
            });
        });

        // Cancel button
        document.querySelectorAll('.cancel-sublist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.hideQuickAddForm(itemId);
            });
        });

        // Enter key to save
        document.querySelectorAll('.sublist-input').forEach(input => {
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const itemId = e.target.dataset.itemId;
                    await this.addSublistItem(itemId);
                }
            });
        });

        // Sublist checkbox toggle
        document.querySelectorAll('.sublist-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const itemId = e.target.dataset.itemId;
                const sublistId = e.target.dataset.sublistId;
                const completed = e.target.checked;
                await this.toggleSublistItem(itemId, sublistId, completed);
            });
        });

        // Delete sublist button
        document.querySelectorAll('.delete-sublist-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = e.target.dataset.itemId;
                const sublistId = e.target.dataset.sublistId;
                await this.deleteSublistItem(itemId, sublistId);
            });
        });
    },

    /**
     * Show quick add form for an item
     */
    showQuickAddForm(itemId) {
        const form = document.getElementById(`form-${itemId}`);
        const input = document.getElementById(`input-${itemId}`);

        if (form) {
            form.style.display = 'block';
            input.focus();
            t.sizeTo('#section-content');
        }
    },

    /**
     * Hide quick add form
     */
    hideQuickAddForm(itemId) {
        const form = document.getElementById(`form-${itemId}`);
        const input = document.getElementById(`input-${itemId}`);

        if (form) {
            form.style.display = 'none';
            input.value = '';
            t.sizeTo('#section-content');
        }
    },

    /**
     * Add a new sublist item
     */
    async addSublistItem(itemId) {
        const input = document.getElementById(`input-${itemId}`);
        const text = input.value.trim();

        if (!text) {
            return;
        }

        try {
            await ChecklistManager.addSublistItem(t, itemId, text);
            console.log('[SECTION-UI] Sublist item added');

            // Reload checklists to show the new item
            await this.loadChecklists();
        } catch (error) {
            console.error('[SECTION-UI] Error adding sublist item:', error);
            t.alert({
                message: 'Failed to add sub-task',
                duration: 3
            });
        }
    },

    /**
     * Toggle sublist item completion
     */
    async toggleSublistItem(itemId, sublistId, completed) {
        try {
            await ChecklistManager.updateSublistItem(t, itemId, sublistId, { completed });
            console.log('[SECTION-UI] Sublist item toggled');

            // Update UI without reloading
            const sublistDiv = document.querySelector(`.sublist-item[data-sublist-id="${sublistId}"]`);
            if (sublistDiv) {
                if (completed) {
                    sublistDiv.classList.add('completed');
                } else {
                    sublistDiv.classList.remove('completed');
                }
            }
        } catch (error) {
            console.error('[SECTION-UI] Error toggling sublist item:', error);
            t.alert({
                message: 'Failed to update sub-task',
                duration: 3
            });
        }
    },

    /**
     * Delete a sublist item
     */
    async deleteSublistItem(itemId, sublistId) {
        try {
            // Use t.popup with type: 'confirm' instead of t.confirm
            return t.popup({
                type: 'confirm',
                title: 'Delete Sub-task',
                message: 'Are you sure you want to delete this sub-task?',
                confirmText: 'Delete',
                confirmStyle: 'danger',
                onConfirm: async (t) => {
                    try {
                        await ChecklistManager.deleteSublistItem(t, itemId, sublistId);
                        console.log('[SECTION-UI] Sublist item deleted');

                        // Close popup and reload checklists
                        await t.closePopup();
                        await this.loadChecklists();
                    } catch (error) {
                        console.error('[SECTION-UI] Error deleting sublist item:', error);
                        t.alert({
                            message: 'Failed to delete sub-task',
                            duration: 3
                        });
                    }
                }
            });
        } catch (error) {
            console.error('[SECTION-UI] Error showing delete confirmation:', error);
            t.alert({
                message: 'Failed to show delete confirmation',
                duration: 3
            });
        }
    },

    /**
     * Escape HTML to prevent XSS
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when the window loads
window.addEventListener('load', function() {
    console.log('[SECTION-UI] Window load event fired');
    SectionUI.init();
});
