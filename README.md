## BlockNote Portfolio Starter


### Features
- **Custom Project Card block**: Insert via slash menu and edit via a global modal
- **Local image upload**: Pick an image from your device; the image is embedded as base64
- **Short description editing**: Rich text using BlockNote in the modal
- **Content persistence**: Saves to an API endpoint with localStorage fallback and autosave
- **Export to PDF**: Capture the editor content and export as multipage PDF

### Tech Stack
- Next.js 15, React 18
- BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/mantine`)
- Tailwind CSS
- `html2canvas` + `jspdf` for PDF export

### Project Structure (key files)
- `src/app/blocknote-portfolio/components/BlockNoteEditor.tsx`
  - Main editor shell, Save button, Export to PDF, and global Project Card modal
- `src/app/blocknote-portfolio/components/ProjectCardBlock.tsx`
  - Custom BlockNote block spec for a Project Card
- `src/app/blocknote-portfolio/components/GlobalProjectCardModal.tsx`
  - Listens for a custom DOM event to open the modal for the selected card
- `src/app/blocknote-portfolio/components/ProjectCardModal.tsx`
  - Modal UI with local image upload and BlockNote mini-editor for short description
- `src/app/blocknote-portfolio/hooks/useContentManager.ts`
  - Persistence: serialize/deserialize, save/load via API + localStorage, autosave
- `src/app/api/save-content/route.ts`
  - Demo API route; logs saved content and returns stubbed responses

### Getting Started
1) Install dependencies
```bash
pnpm install
```

2) Run the dev server
```bash
pnpm dev
```

3) Open the editor
- Go to `/blocknote-portfolio`
- Use the slash menu (`/`) and select "Project Card" to insert a card

### Usage Guide

#### Insert a Project Card
- In the editor, type `/project card` or use the slash menu to insert

#### Edit a Project Card
- Click the card in the editor to open the modal
- In the modal:
  - **Project Image**: Use the file input to upload from your computer. The image is embedded as base64 and will persist with the document
  - **Project Title**: Update text field
  - **Short Description**: Rich text powered by BlockNote inside the modal
- Click "Save Project Card" to apply changes back to the block

#### Save Editor Content
- Click the "Save Content" button at the top of the editor
- Autosave runs every 30 seconds by default
- Persistence behavior:
  - Attempts to save to `/api/save-content` (POST)
  - On failure, falls back to `localStorage` under key `blocknote-content-portfolio-content`

#### Export to PDF
- Click "Export to PDF" in the editor header
- The visible editor area is captured with `html2canvas` and exported via `jspdf`
- Long documents paginate across multiple PDF pages

### How It Works

#### Custom Block: `projectCard`
- Defined in `ProjectCardBlock.tsx` using `createBlockSpec`
- Props: `title`, `imageUrl`, `shortDescription`
- Renders a card with image, title, and a preview of the first paragraph from the short description
  - Preview derived from the stored BlockNote blocks
  - Clicking the card dispatches a custom event `openProjectCardModal` with `block` and `editor`

#### Global Modal Flow
- `GlobalProjectCardModal.tsx` subscribes to `openProjectCardModal`
- When fired, it opens `ProjectCardModal` with the block’s current props
- On save, it updates the block via `editor.updateBlock(blockId, { props: newProps })`

#### Modal Editor
- `ProjectCardModal.tsx` hosts a mini BlockNote editor to edit `shortDescription`
- Local image upload reads the file as base64 (via `FileReader`) and sets `imageUrl`
- On submit, the modal passes updated props back to the editor and closes

#### Persistence Hook: `useContentManager`
- Serializes `editor.document` to JSON for saving
- `saveContent()` tries API first; on failure, writes to `localStorage`
- `loadContent()` loads from `localStorage` first; falls back to API
- Autosave: interval (default 30s) triggers `saveContent()`
- State exposed via `saveState` for UI (loading/success/error/lastSaved)

#### API Route: `/api/save-content`
- `POST` accepts `{ content: string, id?: string }`
  - Demo implementation logs and returns success
- `GET` accepts `?id=...`
  - Demo implementation returns `{ content: null }` (no DB wired yet)

### Configuration
- Tailwind is pre-configured in `tailwind.config.js` and `globals.css`
- The editor schema (with custom `projectCard`) is created in `BlockNoteEditor.tsx`
- Autosave interval and content id can be changed via `useContentManager` options

### Common Tasks
- Change autosave interval: update `autoSaveInterval` in `BlockNoteEditor.tsx`
- Disable autosave: set `autoSave: false` in `useContentManager` options
- Persist to a real database: replace logic in `src/app/api/save-content/route.ts` and in `useContentManager.saveToAPI`

### Troubleshooting
- "Image not showing": ensure uploaded file is a supported image and not too large; base64 embedding increases document size
- "Export to PDF cuts content": PDF export uses a canvas snapshot; very long or wide content may need margin/scale tweaks
- "Edits don’t save": check browser console for API errors; verify localStorage isn’t disabled and the key `blocknote-content-portfolio-content` exists

### Scripts
```bash
pnpm dev       # Start Next.js in development
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
pnpm type-check# TypeScript type check
```

### License
MIT


