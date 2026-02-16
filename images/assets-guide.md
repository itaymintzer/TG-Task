# Image Assets Folder

This directory is designated for all visual assets used in the Necklace Story-Builder.

## Organization
To maintain a clean project structure, consider organizing assets into subfolders:
- `chains/`: High-resolution textures and base images for necklace styles (e.g., Cable, Box, Snake).
- `charms/`: Individual transparent PNGs for charms, stones, and beads.
- `ui/`: Custom interface icons, cursors, or branded decorative elements.

## Implementation Note
When adding new local assets, update the `constants.ts` file to reference these paths. 

Example:
```typescript
imageUrl: './images/chains/cable-chain.png'
```

Currently, the application uses external URLs for high-availability of the mockup assets, but these can be migrated here for production offline support.
