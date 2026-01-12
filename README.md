
# 🚀 Web App Builder – Advanced Low-Code Platform

Welcome to the most advanced drag-and-drop web app builder, powered by [Next.js](https://nextjs.org) and the ultra-flexible [react-web-white-label](https://www.npmjs.com/package/react-web-white-label) UI kit! Build, preview, and export beautiful UIs with zero code. Perfect for rapid prototyping, MVPs, and enterprise-grade dashboards.

---

## ✨ Key Features

🎨 **Drag & Drop UI** – Instantly compose interfaces from a rich palette of [react-web-white-label](https://www.npmjs.com/package/react-web-white-label) components: Buttons, Cards, Alerts, Tooltips, Navbars, Steppers, and more!

🧩 **Multiple Grid Layouts** – Switch between single, double, triple column, or freeform (wrap) layouts. Responsive and flexible for any use case.

🛠️ **Properties Panel** – Select any component to edit its props live (labels, icons, colors, etc). All changes are reflected in real time.

📦 **Artifacts: JSON Import/Export** – Save your entire UI (including layout and all component props) as a portable JSON artifact. Import JSON to instantly restore or share your design.

👀 **Live Preview** – See your app update as you build. No reloads, no waiting.

🧑‍💻 **White Label Ready** – All UI elements are from `react-web-white-label`, making your artifacts compatible with any project using this library.

---

## ⚡️ Quick Start

```bash
pnpm dev # or npm run dev / yarn dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) and start building!

---

## 🏗️ How to Use

1. **Drag Components** from the left palette onto the canvas.
2. **Change Layout** using the grid selector above the canvas (single, double, triple, freeform).
3. **Edit Properties** in the right panel for any selected component.
4. **Export JSON** to save your UI as an artifact, or **Import JSON** to restore/share a design (layout included!).

---

## 📝 JSON Artifact Example

```json
{
	"layout": "triple",
	"components": [
		{ "name": "Button", "props": { "label": "🚀 Launch" } },
		{ "name": "Card", "props": { "title": "Welcome", "content": "Drag and drop!" } },
		{ "name": "Alert", "props": { "severity": "info", "message": "All changes saved!" } }
	]
}
```

---

## 🧩 Powered by react-web-white-label

All UI components are imported from [`react-web-white-label`](https://www.npmjs.com/package/react-web-white-label):

- MWLButton, MWLCard, MWLAlert, MWLTooltip, MWLAvatar, MWLBadge, MWLChip, MWLDivider, MWLList, MWLStepper, MWLTransferList, MWLFileUploader, MWLTopNavbar, MWLSidebar, MWLFileList, MWLScrollSpy, MWLRichTextEditor, MWLImagePopupViewer, MWLPdfViewer, MWLIconography, MWLBreakPoints, MWLErrorBoundary, MWLLogin, MWLLoginBase, MWLOtpInput, MWLLogo, MWLSlidingPane, MWLThemes, MWLLayout, MWLMultiSelectAutocomplete, and more!

You can add or remove components in `src/app/components/DragDropComponentPage.tsx` by editing the `availableComponents` array.

---

## 🛡️ License

MIT License
