# LNU-ORI Research Monitoring System

A comprehensive, multi-role web application engineered for the Leyte Normal University - Office of Research and Innovation (ORI) to streamline the submission, evaluation, and tracking of faculty research involvements. 

This system digitizes the Faculty Performance Evaluation Sheet (FPES) process, replacing static manual workflows with a dynamic, automated, and highly secure platform.

## 🚀 Core Features

* **Multi-Role Dashboards (RBAC):** Securely isolated workspaces and routing for Administrators, Research Coordinators, and Faculty members.
* **Dynamic Form Engineering:** Supports both legacy hardcoded monitoring forms and infinite Custom Types powered by a flexible JSON schema database architecture (`dynamic_data`).
* **Resubmission & Patching Loop:** A highly precise evaluation pipeline allowing Coordinators to request specific document updates without overriding the faculty member's entire submission payload.
* **Automated Points Distribution:** Calculates and distributes research points across multiple co-authors, automatically tracking thresholds and triggering milestone notifications (e.g., Special Citation Awards).
* **Enterprise PDF Reporting:** Generates clean, professional FPES Summary Reports featuring dynamic calculations and customizable university header assets.
* **Context-Aware Notifications:** A robust cross-role notification pipeline that filters alerts based on the user's currently active dashboard to prevent routing collisions.

## 🛠️ Tech Stack

**Backend Architecture**
* Laravel 11 (PHP)
* MySQL Database
* Eloquent ORM (Featuring custom accessors for absolute asset URLs)

**Frontend Architecture**
* React 18
* Vite (Build Tool)
* Tailwind CSS
* React Hook Form (for complex dynamic form state management)

## 💻 Local Development Setup

Follow these steps to run the application on your local machine:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laravel-backend
Install Backend Dependencies

Bash
composer install
Configure Environment
Duplicate the .env.example file and rename it to .env. Update your database credentials and ensure your local URL is set:

Code snippet
APP_URL=http://localhost:8000
Generate the application key:

Bash
php artisan key:generate
Run Migrations & Seeders

Bash
php artisan migrate --seed
Link Storage (Crucial for Image Assets)
Create the symbolic link to allow the frontend to access uploaded files, profile pictures, and report headers:

Bash
php artisan storage:link
Install Frontend Dependencies & Run Servers

Bash
npm install

# In terminal 1: Start Vite
npm run dev

# In terminal 2: Start Laravel
php artisan serve
