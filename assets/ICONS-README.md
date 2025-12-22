# PWA Icons

## Current Icons

The app currently uses SVG placeholders for PWA icons:

- `icon-192.svg` - 192x192 SVG icon (sword + timer design)
- `icon-512.svg` - 512x512 SVG icon (sword + timer + text)

## Converting to PNG (Optional)

For better compatibility across all devices, you can convert the SVG files to PNG:

### Using Online Tools:

1. Visit: https://cloudconvert.com/svg-to-png
2. Upload `icon-192.svg` and convert to 192x192 PNG
3. Upload `icon-512.svg` and convert to 512x512 PNG
4. Save as `icon-192.png` and `icon-512.png` in the `assets/` folder

### Using ImageMagick (Command Line):

```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt install imagemagick

# Convert SVG to PNG
magick convert -background none -size 192x192 assets/icon-192.svg assets/icon-192.png
magick convert -background none -size 512x512 assets/icon-512.svg assets/icon-512.png
```

### Using GIMP (Free Software):

1. Download GIMP: https://www.gimp.org/
2. Open the SVG file in GIMP
3. Set render size to 192x192 (or 512x512)
4. Export as PNG with transparency

## Custom Icon Design

If you want to create a custom icon:

1. Design should be 512x512 pixels
2. Use transparent background
3. Keep design simple and recognizable
4. Include sword/timer elements to match the BNS theme
5. Save as both PNG and SVG for best compatibility

## Testing PWA Icons

After adding PNG icons:

1. Deploy to GitHub Pages
2. Open on mobile device
3. Add to home screen
4. Check if icon displays correctly
5. Test on both iOS and Android

## Icon Guidelines

- **Size**: 192x192 and 512x512 are standard PWA sizes
- **Format**: PNG with transparency or SVG
- **Purpose**: "maskable" allows OS to add padding/effects
- **Colors**: Use app theme colors (#667eea, #764ba2, #ff69b4)
