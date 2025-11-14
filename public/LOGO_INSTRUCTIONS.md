# Adding Your Company Logo

To add your company logo to the Ticket Checklist app:

## Steps:

1. **Prepare your logo file:**
   - Recommended format: PNG with transparent background
   - Recommended size: 240x80 pixels (or similar aspect ratio)
   - File name: `logo.png`

2. **Add the logo to the project:**
   - Place your `logo.png` file in the `public/` directory
   - The file path should be: `public/logo.png`

3. **The logo will automatically appear:**
   - On the initial screen (ticket name entry)
   - Centered at the top of the card

## Alternative formats:

If you want to use a different format (SVG, JPG, etc.):

1. Place your logo file in the `public/` directory (e.g., `logo.svg`)
2. Update the logo reference in `app/page.tsx`:
   - Find the line: `src="/logo.png"`
   - Change it to: `src="/logo.svg"` (or your file name)

## Adjusting logo size:

To change the logo dimensions, edit the `width` and `height` props in `app/page.tsx`:

```tsx
<Image 
  src="/logo.png" 
  alt="Company Logo" 
  width={120}  // Change this value
  height={40}  // Change this value
  className="object-contain"
/>
```

## No logo?

If you don't want to display a logo, you can remove the logo section from `app/page.tsx` (lines 102-110).

