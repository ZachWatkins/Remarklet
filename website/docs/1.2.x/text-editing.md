# Text Editing

Remarklet's text editing feature allows you to modify the content of any text element on a web page safely and intuitively. This feature is designed to work seamlessly even with interactive elements like buttons and links, preventing accidental triggering of their event handlers.

## How Text Editing Works

When you activate Remarklet on a web page, any element you click becomes editable. The library intelligently handles the transition between different editing modes to provide a smooth user experience.

### Editing Modes

Remarklet operates in several modes that determine how elements behave:

- **Editing Mode**: The default mode where elements can be selected and prepared for modification
- **Text Editing Mode**: Active when you're actively typing or modifying text content
- **Dragging Mode**: When elements are being repositioned
- **Resizing Mode**: When elements are being resized

### Mode Transitions

The text editing system automatically transitions between modes based on user interaction:

1. **Selecting an Element**: When you click on an element, Remarklet enters **editing mode** and prepares the element for text editing
2. **Starting to Edit**: When you focus on the element (click to start typing), it switches to **text editing mode**
3. **Finishing Editing**: When you click elsewhere or the element loses focus, it returns to **editing mode**

## Safety Features

### Event Suppression

One of Remarklet's key features is its ability to prevent accidental activation of existing page functionality while editing. When an element is being edited:

- **Click events are suppressed**: You can safely click on buttons, links, and other interactive elements without triggering their normal behavior
- **Event handlers remain intact**: The original functionality is preserved and will work normally when Remarklet is deactivated
- **Content becomes editable**: Elements gain the `contenteditable="true"` attribute, allowing direct text modification

### Example Scenario

Consider a button with a click handler that shows an alert dialog:

```html
<button onclick="alert('Button clicked!')">Click Me</button>
```

With Remarklet active:
1. You can click on the button to select it for editing
2. The alert dialog will **not** appear because click events are suppressed
3. You can modify the button text from "Click Me" to "Save Changes"
4. When you're done editing and deactivate Remarklet, the button's original functionality is restored

## Text Editing Process

### Step-by-Step Workflow

1. **Activate Remarklet**: Initialize the library on your target page
2. **Select Element**: Click on any text element you want to modify
3. **Start Editing**: Click again or press a key to begin typing
4. **Make Changes**: Edit the text using normal keyboard input
5. **Finish Editing**: Click elsewhere or press Tab to complete your changes

### Keyboard Navigation

While editing text, you can use standard keyboard shortcuts:

- **Arrow keys**: Navigate through the text
- **Home/End**: Jump to beginning/end of the text
- **Ctrl+A**: Select all text
- **Backspace/Delete**: Remove characters
- **Enter**: Create line breaks (where applicable)

## Persistence

When persistence is enabled, your text changes are automatically saved:

### Automatic Saving

- **Real-time tracking**: Changes are captured as you type
- **Local storage**: Modifications are saved to the browser's local storage
- **Session restoration**: Changes are automatically restored when you reload the page
- **Selective persistence**: Only text modifications are persisted, not structural changes

### Configuration

Persistence can be controlled through Remarklet's options:

```javascript
remarklet.options({
    persist: true  // Enable automatic saving and restoration
});
```

## Technical Implementation

### Content Editability

When an element is selected for text editing:

1. The `contenteditable="true"` attribute is added
2. Event listeners are attached for input, focus, and blur events
3. The element's original state is preserved for restoration

### Change Tracking

The system tracks modifications through:

- **Element identification**: Each edited element is identified by its CSS selector
- **Content storage**: The modified HTML content is stored
- **State management**: Changes are synchronized with the internal state system

### Cleanup Process

When editing is complete or Remarklet is deactivated:

1. The `contenteditable` attribute is removed
2. Event listeners are detached
3. Original element state is restored (if not persisting changes)

## Best Practices

### Effective Text Editing

- **Single-click to select**: One click selects an element for editing
- **Double-click or type to edit**: Begin actual text modification
- **Click elsewhere to finish**: Complete your changes by focusing on another element
- **Use keyboard shortcuts**: Leverage familiar text navigation shortcuts

### Avoiding Issues

- **Don't edit while dragging**: Complete any drag operations before starting text editing
- **Test interactive elements**: Verify that suppressed events work correctly after deactivation
- **Consider responsive design**: Text changes may affect layout on different screen sizes

## Troubleshooting

### Common Issues

**Text editing doesn't start**:
- Ensure Remarklet is properly activated
- Check that the element contains editable text content
- Verify that the element is not in a dragging or resizing state

**Original functionality doesn't return**:
- Make sure to properly deactivate Remarklet using `remarklet.deactivate()`
- Check browser console for any JavaScript errors
- Refresh the page to restore the original state

**Changes aren't persisting**:
- Verify that persistence is enabled in the configuration
- Check browser settings to ensure local storage is allowed
- Clear local storage if corruption is suspected

## Browser Support

Text editing functionality works in all modern browsers that support:

- `contenteditable` attribute
- DOM event handling
- Local storage (for persistence features)

The feature gracefully degrades in older browsers, maintaining basic functionality while some advanced features may not be available.