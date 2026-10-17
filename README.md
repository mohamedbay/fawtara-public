# فوترة · Fawtara

A mobile-first Arabic invoice image archive. This public edition runs entirely in the browser, with no database, backend service, account or API key to configure.

نسخة عامة لحفظ صور الفواتير وتنظيمها والبحث فيها. الفواتير محفوظة على المتصفح نفسه فقط، من غير قاعدة بيانات أو ربط تخزين خارجي.

<p align="center">
<img src="docs/home.jpg" height="400" alt="Fawtara mobile invoice archive preview" />
<img src="docs/add-invoice.jpg" height="400" alt="Fawtara mobile invoice form preview" />
</p>

## Features

- Capture an invoice photo or select an image from the device.
- Compress images locally and add a client name, date and notes.
- Browse, search, filter by date, edit and delete invoice records.
- Keep the archive in the current browser's local storage between visits.
- Start with an empty archive; no customer records or credentials are included.

## Run locally

Requires Node.js 22.18 or newer.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

The build output is `dist/`. A static host must serve `index.html` for application routes such as `/add`, `/search` and `/invoice/:id`. Use HTTPS for camera support on devices.

## Storage

Images and invoice details are stored in `localStorage` under `fawtara-public-invoices`. They stay in that browser and are not uploaded by this application. Clearing site data removes the archive. Browser storage has a size limit; this edition does not provide cloud backup or synchronization between devices.

The interface downloads the Cairo font from Google Fonts. Image processing runs locally without downloading a compression worker.

## Technology

React · TypeScript · Material UI · Zustand · Vite

This repository starts from a reviewed source snapshot with fresh history. It contains no database configuration, remote invoice storage integration, fixed access PIN or operational invoice data. The original private application is maintained separately.

Dependency and template attributions are preserved in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
