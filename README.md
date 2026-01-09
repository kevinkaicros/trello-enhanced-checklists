# Enhanced Checklists - Trello Power-Up

A powerful Trello Power-Up that enhances your checklist items with descriptions and sublists, allowing for better organization and hierarchical task management.

## Features

- **📝 Rich Descriptions**: Add detailed descriptions to any checklist item
- **📋 Nested Sublists**: Create unlimited sub-items under each checklist item
- **✅ Progress Tracking**: Track completion progress for sublists
- **👁️ Visual Badges**: See enhanced items at a glance on card fronts
- **💾 Automatic Sync**: All data is stored securely with Trello

## Preview

When enabled, the Power-Up adds:
- A "Manage Enhanced Checklists" button on every card
- Card badges showing enhanced item count and sublist progress
- An intuitive interface for managing descriptions and sublists

## Installation & Setup

### Prerequisites

1. A Trello account
2. Admin access to a Trello board
3. Web hosting for the Power-Up files (GitHub Pages, Netlify, Vercel, etc.)

### Step 1: Host the Power-Up

You need to host the Power-Up files on a public HTTPS server. Here are some free options:

#### Option A: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all files from `trello-enhanced-checklists/` to the repository
3. Go to repository Settings > Pages
4. Select "main" branch and "/ (root)" folder
5. Save and wait for deployment
6. Your Power-Up will be available at `https://[username].github.io/[repo-name]/`

#### Option B: Netlify

1. Create a Netlify account
2. Drag and drop the `trello-enhanced-checklists/` folder to Netlify
3. Your Power-Up will be deployed automatically
4. Note the URL (e.g., `https://[site-name].netlify.app/`)

#### Option C: Vercel

1. Create a Vercel account
2. Import the `trello-enhanced-checklists/` folder
3. Deploy and note the URL

### Step 2: Create Trello Power-Up

1. Go to [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
2. Click "Create new Power-Up"
3. Fill in the details:
   - **Name**: Enhanced Checklists
   - **Workspace**: Select your workspace
   - **Iframe connector URL**: `https://your-domain.com/index.html`
   - **Description**: Add sublists and descriptions to your Trello checklist items
4. Under "Capabilities", enable:
   - ✅ Card Buttons
   - ✅ Card Badges
   - ✅ Show Settings
5. Save the Power-Up

### Step 3: Get Your API Key

1. In the Power-Up admin page, find your **API Key**
2. Copy the API Key
3. Open `js/client.js` in your hosted files
4. Replace `'YOUR_APP_KEY_HERE'` with your actual API Key:
   ```javascript
   appKey: 'your-actual-api-key-here'
   ```
5. Redeploy/update the file on your hosting

### Step 4: Enable on Your Board

1. Open your Trello board
2. Click "Power-Ups" in the menu
3. Search for "Enhanced Checklists"
4. Click "Add" to enable it

## Usage Guide

### Adding Descriptions to Checklist Items

1. Open any card with checklists
2. Click the "Manage Enhanced Checklists" button
3. Select a checklist item from the list
4. Add your description in the text area
5. Click "Save Description"

### Creating Sublists

1. Open any card with checklists
2. Click the "Manage Enhanced Checklists" button
3. Select a checklist item from the list
4. Type a sublist item in the input field
5. Click "Add Item" or press Enter
6. Repeat to add more sublist items

### Managing Sublist Items

- **Check/Uncheck**: Click the checkbox next to a sublist item
- **Delete**: Click the × button next to the item
- **Track Progress**: View completion status in card badges

### Viewing Enhanced Items

Enhanced checklist items show badges on the card front:
- **📝 Icon**: Item has a description
- **📋 Count**: Number of completed/total sublist items
- **Blue Badge**: Number of enhanced items on the card

## File Structure

```
trello-enhanced-checklists/
├── manifest.json              # Power-Up configuration
├── index.html                 # Main entry point
├── README.md                  # This file
├── js/
│   ├── client.js             # Power-Up initialization
│   ├── storage.js            # Data persistence layer
│   ├── checklist-manager.js  # Business logic
│   └── ui.js                 # User interface
├── css/
│   └── styles.css            # Styling
└── icons/
    └── icon.svg              # Power-Up icon
```

## Technical Details

### Data Storage

The Power-Up uses Trello's `pluginData` API to store data:
- **Scope**: Card-level (data stored per card)
- **Visibility**: Shared (visible to all board members)
- **Format**: JSON objects keyed by checklist item ID

### Data Structure

```javascript
{
  "item-[checkItemId]": {
    "description": "Detailed description text",
    "sublist": [
      {
        "id": "sub-unique-id",
        "text": "Sublist item text",
        "completed": false,
        "createdAt": "2026-01-04T02:00:00.000Z"
      }
    ]
  }
}
```

### Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile: ⚠️ Limited (Trello's Power-Up support on mobile is limited)

## Troubleshooting

### Power-Up doesn't appear

1. Ensure files are hosted on HTTPS
2. Check that the iframe URL is correct in Power-Up settings
3. Clear browser cache and reload Trello
4. Verify API Key is correctly set in `client.js`

### Data not saving

1. Check browser console for errors
2. Verify you have edit permissions on the board
3. Ensure the Power-Up is enabled on the board
4. Try disabling and re-enabling the Power-Up

### Badges not showing

1. Create at least one enhanced item (description or sublist)
2. Refresh the board
3. Badges appear only when items are enhanced

## Customization

### Changing Colors

Edit `css/styles.css`:
- Primary color: `#0079bf` (Trello blue)
- Danger color: `#eb5a46` (red for delete)
- Success color: `#5aac44` (green for complete)

### Adding Features

The codebase is modular:
- **Storage**: Modify `storage.js` for different persistence
- **UI**: Update `ui.js` for new views
- **Logic**: Extend `checklist-manager.js` for new features
- **Capabilities**: Add to `client.js` for new Trello integrations

## Security & Privacy

- All data is stored in Trello's secure infrastructure
- No external servers or databases are used
- Data is only accessible to board members
- No analytics or tracking is implemented

## Development

### Local Development

1. Install a local web server:
   ```bash
   npm install -g http-server
   ```

2. Run the server:
   ```bash
   cd trello-enhanced-checklists
   http-server -p 8080
   ```

3. Use a tunneling service like ngrok for HTTPS:
   ```bash
   ngrok http 8080
   ```

4. Use the ngrok HTTPS URL in Trello Power-Up settings

### Testing

1. Create test checklists on a test board
2. Test all CRUD operations (Create, Read, Update, Delete)
3. Test with multiple users
4. Test data persistence across sessions

## Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork and customize for your needs

## License

MIT License - Feel free to use and modify as needed

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review [Trello Power-Up documentation](https://developer.atlassian.com/cloud/trello/)
3. Open an issue on GitHub

## Changelog

### Version 1.0.0 (2026-01-04)
- Initial release
- Description support for checklist items
- Sublist functionality with unlimited nesting
- Progress tracking and badges
- Settings panel

## Future Enhancements

Potential features for future versions:
- [ ] Drag and drop reordering of sublist items
- [ ] Due dates for sublist items
- [ ] Tags/labels for categorization
- [ ] Import/export functionality
- [ ] Templates for common sublists
- [ ] Keyboard shortcuts
- [ ] Rich text formatting in descriptions
- [ ] File attachments to sublist items

## Credits

Built with:
- [Trello Power-Up Client Library](https://developer.atlassian.com/cloud/trello/)
- Modern JavaScript (ES6+)
- CSS3

---

**Made with ❤️ for better Trello organization**
