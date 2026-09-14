# 💼 Job Application Tracker

A modern, responsive web application for managing and tracking your job search, interviews, and follow-ups. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and local storage persistence.

🌐 **Live Demo:** [https://job-tracker-plum-two.vercel.app](https://job-tracker-plum-two.vercel.app)

---

## ✨ Features

- **📊 Live Dashboard Metrics:** Real-time summary stat cards for Total Applications, Active Applications, Interviews in Progress, and Response Rate percentage.
- **➕ Add Application Form:** Log company name, role/title, date applied, posting URL, and status.
- **🔄 Dual Views:**
  - **List View:** Filterable list with colored status badges (`Applied`, `Interview`, `Offer`, `Rejected`, `no response`), quick status updater, and delete actions.
  - **Pipeline View:** Kanban-style columns tracking progress across hiring stages with responsive mobile swiping.
- **⏰ Follow-up Reminder System:**
  - Automatically flags applications in `Applied` status past a configurable threshold (default: 5 days).
  - Dedicated "Follow-ups Needed" section sorted by overdue days.
  - Visual pulsing follow-up badges on cards.
- **📝 Interview Notes & Detail View:** Click any card to open a modal view with editable notes for interviewer names, salary discussion, and interview questions.
- **🌓 Dark / Light Mode:** Native theme switcher with zero flash on initial load.
- **💾 LocalStorage Persistence:** All data persists locally in the browser with no backend setup required.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/priyayadav240804-sys/job-tracker.git
   cd job-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
