# Production Deployment — Asset Checklist

This document outlines the **mandatory** steps required to properly configure images and uploaded files on a fresh production server. Following these steps prevents broken profile pictures, missing SDG/Agenda icons, and 404 errors on report headers.

---

## 1. Configure `APP_URL` in Production `.env`

Open your production `.env` file and set `APP_URL` to your **exact production domain**, without a trailing slash:

```env
#  Correct
APP_URL=https://your-production-domain.com

#  Wrong — trailing slash will cause double-slash in URLs
APP_URL=https://your-production-domain.com/

# Wrong — this is the development default, never use in production
APP_URL=http://localhost
```

> **Why this matters:** Laravel's `Storage::disk('public')->url()` uses `APP_URL` to generate absolute URLs for all user-uploaded images (profile pictures, SDG icons, report headers). If this value is wrong, every image in the application will return a broken URL.

After updating, clear the config cache:

```bash
php artisan config:clear
php artisan config:cache
```

---

## 2. Create the Storage Symlink

Laravel stores uploaded files in `storage/app/public/`. To make them accessible via the web, you **must** create a symbolic link from `public/storage` → `storage/app/public`:

```bash
php artisan storage:link
```

Verify it was created:

```bash
ls -la public/storage
# Should show: public/storage -> /path/to/your/project/storage/app/public
```

> **⚠️ Important:** On shared hosting where symlinks are restricted, you may need to create this link manually via your hosting panel's file manager, or ask your hosting provider to enable symlink support.

---

## 3. Seed or Upload Static Assets

### What IS tracked in Git (no action needed):

| Asset | Location | Notes |
|-------|----------|-------|
| SDG Icons (seeders) | `public/images/sdg/` | 17 SDG goal icons |
| Agenda Icons (seeders) | `public/images/agenda/` | 16 agenda category icons |
| Static UI assets | `resources/js/assets/` | Logos, hero images (bundled by Vite) |
| Favicon | `public/favicon.ico` | App icon |

### What is NOT tracked in Git (action required):

| Asset | Storage Location | How to Restore |
|-------|-----------------|----------------|
| User profile pictures | `storage/app/public/images/` | Users must re-upload via Settings page |
| Admin-uploaded report headers | `storage/app/public/reports/` | Admin must re-upload via Admin Settings |
| Admin-uploaded SDG/Agenda icons | `storage/app/public/images/` | Admin must re-upload via SDG/Agenda Mapping pages |
| Faculty research documents | `storage/app/public/documents/` | Faculty must re-submit monitoring forms |
| Temporary upload files | `storage/app/public/temp/` | Transient; no action needed |

> **⚠️ Warning:** The `storage/app/public/` directory is excluded from version control via `.gitignore`. This means that when you clone the repository on a fresh server, **all user-uploaded files will be missing**. This is by design — user uploads should never be committed to Git.

### Restoring SDG & Agenda Icons via Database Seeder

If you need the default SDG and Agenda icons to render on a fresh production database, run the seeders:

```bash
php artisan db:seed --class=SdgSeeder
php artisan db:seed --class=AgendaSeeder
```

Then ensure the corresponding icon files exist in `storage/app/public/images/sdg/` and `storage/app/public/images/agenda/`. You can copy them from the `public/images/` directory:

```bash
# Linux / macOS
cp -r public/images/sdg storage/app/public/images/sdg
cp -r public/images/agenda storage/app/public/images/agenda

# Windows (PowerShell)
Copy-Item -Recurse public\images\sdg storage\app\public\images\sdg
Copy-Item -Recurse public\images\agenda storage\app\public\images\agenda
```

---

## 4. Build Frontend Assets

Run the Vite production build to compile and hash all React/TypeScript assets:

```bash
npm install
npm run build
```

The compiled output will appear in `public/build/` (also git-ignored; must be built on the server or in CI/CD).

---

## 5. Final Verification Checklist

After completing all steps, verify the following:

- [ ] `APP_URL` is set correctly in `.env` (no trailing slash)
- [ ] `php artisan storage:link` has been executed
- [ ] `public/storage` symlink exists and points to `storage/app/public`
- [ ] `npm run build` completed without errors
- [ ] SDG icons render on the Faculty monitoring form submission page
- [ ] Agenda icons render on the Faculty monitoring form submission page
- [ ] Profile pictures render in the header dropdown
- [ ] The admin can upload a custom report header image via Settings
- [ ] PDF reports render the header image correctly

---

## Architecture Reference

```
project-root/
├── public/
│   ├── images/              ← Git-tracked static assets (SDG, Agenda icons)
│   │   ├── sdg/
│   │   └── agenda/
│   ├── storage/             ← Symlink → storage/app/public (git-ignored)
│   └── build/               ← Vite output (git-ignored, built on deploy)
├── storage/
│   └── app/
│       └── public/          ← User uploads live here (git-ignored)
│           ├── images/      ← Profile pictures, admin-uploaded icons
│           ├── reports/     ← Admin-uploaded report headers
│           ├── documents/   ← Faculty research documents
│           └── temp/        ← Temporary upload staging
└── resources/
    └── js/
        └── assets/          ← Static images imported by React (bundled by Vite)
```

> **How URLs are generated:** Laravel Eloquent models use `Storage::disk('public')->url($relativePath)` in their accessors. This reads the `url` key from `config/filesystems.php`, which is set to `env('APP_URL') . '/storage'`. The result is a fully-qualified URL like `https://your-domain.com/storage/images/profile.jpg`.
