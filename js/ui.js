/**
 * UI Manager
 * Handles all user interface rendering and interactions
 */

const UIManager = {
    /**
     * Render the checklist item detail view
     * Shows description and sublist for a specific checklist item
     * @param {Object} t - Trello Power-Up interface
     * @param {Object} options - Contains checkItemId and checkItemName
     * @returns {Promise<void>}
     */
    async renderItemDetailView(t, options) {
        const { checkItemId, checkItemName } = options;
        const itemData = await StorageManager.getItemData(t, checkItemId);

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="item-detail-view">
                <h2 class="item-title">${this._escapeHtml(checkItemName)}</h2>

                <!-- Description Section -->
                <div class="section">
                    <h3>Description</h3>
                    <textarea
                        id="description-input"
                        class="description-textarea"
                        placeholder="Add a description for this item..."
                    >${this._escapeHtml(itemData.description || '')}</textarea>
                    <button id="save-description-btn" class="button primary">Save Description</button>
                </div>

                <!-- Sublist Section -->
                <div class="section">
                    <h3>Sublist Items</h3>
                    <div id="sublist-container" class="sublist-container">
                        ${this._renderSublist(itemData.sublist || [])}
                    </div>
                    <div class="add-sublist-item">
                        <input
                            type="text"
                            id="new-sublist-input"
                            class="sublist-input"
                            placeholder="Add a new sublist item..."
                        />
                        <button id="add-sublist-btn" class="button primary">Add Item</button>
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        this._attachItemDetailListeners(t, checkItemId);
    },

    /**
     * Render sublist items
     * @private
     * @param {Array} sublist - Array of sublist items
     * @returns {string} HTML string
     */
    _renderSublist(sublist) {
        if (!sublist || sublist.length === 0) {
            return '<p class="empty-state">No sublist items yet. Add one above!</p>';
        }

        return sublist.map(item => `
            <div class="sublist-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <input
                    type="checkbox"
                    class="sublist-checkbox"
                    ${item.completed ? 'checked' : ''}
                    data-id="${item.id}"
                />
                <span class="sublist-text">${this._escapeHtml(item.text)}</span>
                <button class="delete-sublist-btn" data-id="${item.id}" title="Delete">×</button>
            </div>
        `).join('');
    },

    /**
     * Attach event listeners for item detail view
     * @private
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Checklist item ID
     */
    _attachItemDetailListeners(t, checkItemId) {
        // Save description
        document.getElementById('save-description-btn').addEventListener('click', async () => {
            const description = document.getElementById('description-input').value;
            await ChecklistManager.setDescription(t, checkItemId, description);
            t.alert({
                message: 'Description saved!',
                duration: 3
            });
        });

        // Add sublist item
        const addSublistItem = async () => {
            const input = document.getElementById('new-sublist-input');
            const text = input.value.trim();

            if (text) {
                const updatedData = await ChecklistManager.addSublistItem(t, checkItemId, text);
                input.value = '';

                // Re-render sublist
                const container = document.getElementById('sublist-container');
                container.innerHTML = this._renderSublist(updatedData.sublist);
                this._attachSublistListeners(t, checkItemId);
            }
        };

        document.getElementById('add-sublist-btn').addEventListener('click', addSublistItem);

        // Allow Enter key to add item
        document.getElementById('new-sublist-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addSublistItem();
            }
        });

        // Attach sublist item listeners
        this._attachSublistListeners(t, checkItemId);
    },

    /**
     * Attach listeners to sublist items
     * @private
     * @param {Object} t - Trello Power-Up interface
     * @param {string} checkItemId - Parent checklist item ID
     */
    _attachSublistListeners(t, checkItemId) {
        // Toggle completion
        document.querySelectorAll('.sublist-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const sublistItemId = e.target.dataset.id;
                const completed = e.target.checked;

                await ChecklistManager.updateSublistItem(t, checkItemId, sublistItemId, { completed });

                // Update UI
                const itemDiv = e.target.closest('.sublist-item');
                if (completed) {
                    itemDiv.classList.add('completed');
                } else {
                    itemDiv.classList.remove('completed');
                }
            });
        });

        // Delete sublist item
        document.querySelectorAll('.delete-sublist-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const sublistItemId = e.target.dataset.id;

                const confirmed = await t.confirm({
                    message: 'Delete this sublist item?',
                    confirmText: 'Delete',
                    confirmStyle: 'danger'
                });

                if (confirmed) {
                    const updatedData = await ChecklistManager.deleteSublistItem(t, checkItemId, sublistItemId);

                    // Re-render sublist
                    const container = document.getElementById('sublist-container');
                    container.innerHTML = this._renderSublist(updatedData.sublist);
                    this._attachSublistListeners(t, checkItemId);
                }
            });
        });
    },

    /**
     * Render the settings view
     * @param {Object} t - Trello Power-Up interface
     */
    async renderSettingsView(t) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="settings-view">
                <h2>Enhanced Checklists Settings</h2>
                <p>This Power-Up allows you to add descriptions and sublists to your checklist items.</p>

                <div class="section">
                    <h3>How to Use</h3>
                    <ol>
                        <li>Click the "Manage Enhanced Checklists" button on any card</li>
                        <li>Select a checklist item to add descriptions or sublists</li>
                        <li>Track your progress with enhanced item badges</li>
                    </ol>
                </div>

                <div class="section">
                    <h3>Features</h3>
                    <ul>
                        <li>✓ Add detailed descriptions to checklist items</li>
                        <li>✓ Create sublists with unlimited sub-items</li>
                        <li>✓ Track completion progress for sublists</li>
                        <li>✓ Visual badges showing enhanced items</li>
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Render checklist selection view
     * Lists all checklist items for selection
     * @param {Object} t - Trello Power-Up interface
     */
    async renderChecklistSelection(t) {
        const card = await t.card('checklists');
        const checklists = card.checklists || [];

        // Debug: Print card data
        console.log('[UI] Card data:', card);
        console.log('[UI] Checklists:', checklists);
        if (checklists && checklists.length > 0) {
            checklists.forEach((cl, index) => {
                console.log(`[UI] Checklist ${index}: ${cl.name}, Items:`, cl.checkItems);
            });
        }

        const content = document.getElementById('content');

        if (checklists.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <p>No checklists found on this card.</p>
                    <p>Please add a checklist first, then use this Power-Up to enhance it.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="checklist-selection"><h2>Select a Checklist Item</h2>';

        for (const checklist of checklists) {
            html += `<div class="checklist-group">
                <h3>${this._escapeHtml(checklist.name)}</h3>
                <div class="checklist-items">`;

            if (checklist.checkItems && checklist.checkItems.length > 0) {
                for (const item of checklist.checkItems) {
                    const stats = await ChecklistManager.getItemStats(t, item.id);
                    const badges = [];

                    if (stats.hasDescription) {
                        badges.push('<span class="badge">📝</span>');
                    }
                    if (stats.totalSublistItems > 0) {
                        badges.push(`<span class="badge">📋 ${stats.completedSublistItems}/${stats.totalSublistItems}</span>`);
                    }

                    html += `
                        <div class="checklist-item-row" data-item-id="${item.id}" data-item-name="${this._escapeHtml(item.name)}">
                            <span class="item-name">${this._escapeHtml(item.name)}</span>
                            <span class="item-badges">${badges.join(' ')}</span>
                        </div>
                    `;
                }
            } else {
                html += '<p class="empty-state">No items in this checklist</p>';
            }

            html += '</div></div>';
        }

        html += '</div>';
        content.innerHTML = html;

        // Attach click listeners
        document.querySelectorAll('.checklist-item-row').forEach(row => {
            row.addEventListener('click', () => {
                const itemId = row.dataset.itemId;
                const itemName = row.dataset.itemName;

                t.modal({
                    title: 'Enhanced Checklist Item',
                    url: './index.html',
                    height: 500,
                    args: {
                        view: 'item-detail',
                        checkItemId: itemId,
                        checkItemName: itemName
                    }
                });
            });
        });
    },

    /**
     * Escape HTML to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Make available globally
window.UIManager = UIManager;
