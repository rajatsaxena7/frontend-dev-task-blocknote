# Frontend Developer Technical Assessment – BlockNote ProjectCard

## 📌 Overview

This repository contains the starter code for the Frontend Developer technical assessment at **Unimad**.

Your task is to create a custom **ProjectCard block** inside a BlockNote editor.

## 🚀 Quick Start

1. **Fork this repository**

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/frontend-dev-task-blocknote.git
   cd frontend-dev-task-blocknote
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   # or npm run dev
   ```

5. **Visit:** `http://localhost:3000/blocknote-portfolio`

## ✅ What's Already Set Up

- ✅ **Next.js 15** (App Router)
- ✅ **BlockNote Editor** with default blocks (heading, paragraph, lists, image)
- ✅ **Tailwind CSS** styling
- ✅ **TypeScript** configuration
- ✅ **Dynamic imports** to prevent SSR issues

## 🎯 Your Task: ProjectCard Block

### What is a ProjectCard?

Think of it as a mini BlockNote editor inside a card, similar to how Notion pages work:

- **Main Editor** → Shows a card preview with title + first image
- **Modal Editor** → Clicking the card opens a full nested BlockNote editor  
- **Data Sync** → Changes made inside the modal are saved back to the main editor

## 📝 Requirements

### 1. Custom ProjectCard Block (70%)

- [ ] Display project title + preview image in the main editor
- [ ] Open modal with a nested BlockNote editor on click
- [ ] Include in slash menu (`/project card`)
- [ ] Support drag-and-drop within the main editor
- [ ] Responsive UI (Tailwind CSS)

### 2. Data Handling (10%)

- [ ] Implement a way to serialize and persist the entire editor content, including ProjectCard data:
  - On save → send JSON via an API route (Next.js App Router)
  - Backend persistence → use LocalStorage, cookies, or an in-memory store (minimum requirement)
  - On reload → restore the editor state from persisted data
- [ ] Key point → show you can handle custom block data beyond default BlockNote serialization

### 3. Code Quality (10%)

- [ ] Clean, readable, well-structured code
- [ ] Clear component separation
- [ ] Good use of comments & documentation
- [ ] TypeScript (optional but encouraged)

## 🎁 Bonus (Optional)

Stand out by attempting any one of the following:

- **PDF Export** → Export editor canvas to PDF using `@react-pdf/renderer`
- **Multi-column Support** → Add multi-column layouts inside the editor
- **Creative Custom Block** → Build another custom block of your choice

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Editor:** BlockNote
- **Styling:** Tailwind CSS
- **UI Components:** Mantine
- **Language:** TypeScript
- **Deployment:** Vercel/Netlify (optional, encouraged)

## 📚 Resources

- [BlockNote Custom Blocks Guide](https://www.blocknotejs.org/docs/features/custom-schemas)
- [BlockNote Next.js Setup](https://www.blocknotejs.org/docs/getting-started/nextjs)
- [React PDF Documentation](https://react-pdf.org/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 📤 Submission

When done, reply to the assessment email with:

1. **GitHub repo link** (required)
2. **Live demo link** (optional but encouraged)
3. **Brief note** on your implementation approach & challenges faced

## ⏰ Timeline

- **Duration:** 7 days from receiving the task
- **Effort:** ~16–20 hours

## 🔗 Reference

You can check the behavior of the ProjectCard block in our product here:
👉 [unimad.ai/uniboard/portfolio](https://unimad.ai/uniboard/portfolio) (signup required)

---

**Good luck! We're looking forward to seeing your work.** 🚀

*Questions? Feel free to reach out to me varun@unimad.ai.*
