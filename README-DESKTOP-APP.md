# Sibaq Desktop App (.exe) & Mobile Responsive Guide

## 1. How to Build the Windows Executable (.exe)

You have two simple ways to generate the standalone `.exe` file:

### Option A: One-Click Windows Batch Script (Easiest)
Double-click:
```
build-exe.bat
```
This script will automatically:
1. Install dependencies (`electron` and `electron-builder`)
2. Package the app into:
   - **`dist/Sibaq-Portal-Portable.exe`** (Single-file portable executable, runs anywhere without installation)
   - **`dist/Sibaq Portal Setup 1.0.0.exe`** (Standard Windows installer)

---

### Option B: Using Command Line
Open a terminal in `d:\Github\Seebaq` and run:
```bash
# 1. Install dependencies
npm install

# 2. Package into .exe
npm run dist
```

To run and preview the desktop app without packaging:
```bash
npm start
```
or double-click `start-app.bat`.

---

## 2. Responsive Device Updates Implemented

All dashboard screens are now fully responsive across Mobile, Tablet, Laptop, and Desktop viewports:

1. **Mobile Top Navigation Bar**:
   - Sticky header with hamburger menu button (`#mobileMenuBtn`), Sibaq logo, portal name, and live status indicator.
2. **Slide-Out Sidebar Drawer**:
   - On screens `<= 992px` and mobile phones, the sidebar smoothly slides out from the left with a dark frosted backdrop (`#sidebarBackdrop`).
   - Includes a close button (`✕`) in the drawer header.
   - Automatically closes when any navigation tab or the backdrop is clicked.
3. **Table & Grid Responsiveness**:
   - All evaluation and monitoring tables wrap with touch-enabled horizontal scrolling (`-webkit-overflow-scrolling: touch;`).
   - Metric tickers and executive cards automatically adapt to 1-2 columns on mobile devices.
   - Form inputs, search fields, and modal popups dynamically adjust to 100% width on small screens.
4. **Login Screen (`index.html`)**:
   - Fluid margins, compact card padding, and scaled logo for smaller phone screens.
