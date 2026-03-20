# RMA Intelligence Platform

A production-grade React/TypeScript tool for RMA (Return Material Authorization) Engineers at water solutions companies.

## Overview

This tool supports the full RMA investigation workflow — from case intake through failure analysis to final report generation.

### Features

- **Dashboard** — Live KPI stats, top failure modes (Pareto preview), and open case tracker
- **RMA Cases** — Full case management: create, filter, search, track status
- **Case Detail** — Tabbed investigation view with:
  - Product & customer info
  - Findings log (component, category, severity, measurements, root cause flag)
  - Root cause determination, corrective & preventive actions, disposition
  - Case timeline
- **Analytics** — Pareto chart, monthly intake trends, disposition & origin breakdowns
- **Report Builder** — Generate structured, downloadable failure analysis reports

### Tech Stack

- **React 18** + **TypeScript**
- **Vite** for builds
- **Recharts** for all data visualizations
- **date-fns** for date handling
- **localStorage** for persistence (no backend required)

### Architecture

```
src/
├── types/          # All TypeScript interfaces and enums
├── utils/          # Pure logic: analytics, report generation, storage, seed data
├── hooks/          # useCases (central state), useLocalStorage
└── components/
    ├── layout/     # Sidebar, Header
    ├── ui/         # Button, Badge, Card, Modal, FormField, StatCard
    ├── cases/      # CaseFormModal, FindingFormModal
    └── pages/      # DashboardPage, CasesPage, CaseDetailPage, AnalyticsPage, ReportBuilderPage
```

### Getting Started

```bash
npm install
npm run dev
```

The app ships with 6 realistic demo cases. Use the **↺ Reset Demo Data** button in the top bar to restore them at any time.

### Deployment

```bash
npm run build
```

Output is in `dist/`. Deploy to Vercel, Netlify, or any static host. Add `VITE_` prefixed environment variables as needed.

### Environment Variables

No environment variables are required for the base build. All data is stored in the browser's `localStorage`.
