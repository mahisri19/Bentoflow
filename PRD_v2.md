# Product Requirements Document (PRD) - Bentoflow

**Version:** 2.0  
**Status:** In Development  
**Last Updated:** February 18, 2026

---

## 1. Executive Summary

**Bentoflow** is a premium, all-in-one personal productivity workspace designed to unify scattered productivity tools into a single, cohesive "Bento Grid" interface. It targets users who value aesthetics as much as functionality, offering a visually stunning, "alive" dashboard that consolidates tasks, habits, routines, schedules, and focus tools.

Unlike traditional utilitarian productivity apps, Bentoflow leverages rich visuals (starry night themes, glassmorphism), micro-interactions, and AI-driven insights to make the act of organizing one's life feel rewarding and engaging.

**Mission:** To transform personal productivity from a chore into a delightful, fluid experience.

---

## 2. Core Features

### 2.1 Workspace & Navigation
*   **Unified Dashboard (Bento Grid):** A responsive grid layout that provides a high-level overview of the user's day. It features "compact" widgets for Tasks, Habits, Timer, and Schedule.
*   **Sidebar Navigation:** A collapsible, glassmorphic sidebar for quick access to detailed views of each module.
*   **Multi-Workspace Support:** Users can create and switch between different workspaces (e.g., "Personal", "Work", "Side Project") to keep contexts separate.

### 2.2 Task Management
*   **Quick Capture:** Add tasks instantly from the dashboard.
*   **Kanban & List Views:** Flexible visualization for task progression.
*   **Prioritization:** Visual flags (High, Medium, Low) to highlight urgent items.
*   **Progress Tracking:** Visual progress bars indicating completion rates.

### 2.3 Habit Tracking
*   **Daily Streaks:** Visual indicators of consecutive days completed to gamify consistency.
*   **Interactive Toggles:** One-click completion directly from the dashboard widget.
*   **Heatmaps:** Visual history of habit performance over time.

### 2.4 Focus Timer (Pomodoro)
*   **Integrated Timer:** A dedicated focus timer that can be overlayed or accessed via the grid.
*   **Custom Modes:** Presets for Focus (25m), Short Break (5m), and Long Break (15m).
*   **Stats:** Tracking total focused hours to provide productivity insights.

### 2.5 Schedule & Calendar
*   **Unified Timeline:** Aggregates time-specific tasks, routine blocks, and calendar events into a single vertical timeline.
*   **Event Management:** Create and edit events with location and time details.
*   **Conflict Detection:** specific visual cues for overlapping commitments.

### 2.6 Routines
*   **Morning/Night Routines:** Structured checklists for start-of-day and end-of-day rituals.
*   **Time-Boxing:** allocate specific durations for routine sets.

### 2.7 Automated Reports & AI
*   **Productivity Reports:** Automated generation of daily/weekly summaries showing tasks completed, focus time, and habit streaks.
*   **AI Summaries:** Intelligent generation of project status and productivity insights (using Generative AI).
*   **Visual Analytics:** Rich charts (Line, Bar) visualizing productivity trends over time.

---

## 3. User Flow

1.  **Onboarding/Auth:** User logs in via Email/Password (Supabase Auth).
2.  **Home Dashboard:** User lands on the "Starry Night" personalized dashboard.
    *   *Greeting:* "Good Morning, [Name]" + Daily Quote.
    *   *Quick Actions:* User checks off a morning habit, starts a focus timer, or reviews today's schedule.
3.  **Deep Work:** User clicks "Tasks" in the sidebar to enter the **Full View**.
    *   User organizes tasks, drags them between statuses, and selects a task to work on.
4.  **Focus Mode:** User activates the Focus Timer. The interface minimizes distractions.
5.  **Review:** At the end of the day, user checks the "Reports" section to see a summary of their achievements and AI-generated insights.

---

## 4. Design Principles

*   **Bento Modularity:** Everything is a "box" or widget. The interface is composed of self-contained, functional units that stack beautifully on mobile and expand on desktop.
*   **Premium Aesthetic:**
    *   **Theme:** Deep "Starry Night" backgrounds, dark slate gradients.
    *   **Materials:** High-quality Glassmorphism (blur, translucency) for depth.
    *   **Typography:** Modern, sans-serif fonts (`Be Vietnam Pro`) for readability and elegance.
*   **"Alive" Interface:**
    *   **Motion:** Smooth transitions (Framer Motion) when switching views or completing items.
    *   **Feedback:** Interactive hover states, satisfying click responses, and confetti effects for achievements.
*   **Mobile-First:** The Bento grid naturally reflows into a specific vertical stack on mobile devices, ensuring a compromise-free experience on phones.

---

## 5. Technology Stack

### Frontend
*   **Core:** `React 18` + `TypeScript` (Robust component architecture).
*   **Build Tool:** `Vite` (Fast HMR and optimized production builds).
*   **Styling:**
    *   `Tailwind CSS` (Utility-first, rapid styling).
    *   `Tailwind Merge` & `clsx` (Dynamic class handling).
*   **UI Libraries:**
    *   `Radix UI` (Accessible, unstyled primitives for Dialogs, Popovers, etc.).
    *   `Lucide React` (Consistent, clean iconography).
    *   `Sonner` (Premium toast notifications).
    *   `Vaul` (Mobile-friendly drawers).
*   **Animation:** `Framer Motion` (Complex layout animations and gestures).
*   **Data Visualization:** `Recharts` (Responsive, composable charts for reports).

### Backend & Infrastructure
*   **BaaS (Backend-as-a-Service):** `Supabase`.
    *   **Database:** PostgreSQL (Relational data for meaningful connections between tasks, users, and stats).
    *   **Auth:** Supabase Auth (Secure, handled session management).
    *   **Realtime:** (Potential future use for collaborative workspaces).

### Utilities
*   **Date Handling:** `date-fns` (Lightweight date manipulation).
*   **Forms:** `react-hook-form` (Performant form validation).

---

## 6. Success Metrics (KPIs)

*   **North Star:** **Daily Active Users (DAU)** - The number of users who log in and perform at least one "active" action (complete task, toggle habit, start timer).
*   **Engagement:**
    *   **Task Completion Rate:** % of created tasks marked as done.
    *   **Habit Consistency:** Average length of habit streaks.
    *   **Focus Volume:** Total hours of focus time logged per user/week.
*   **Retention:**
    *   **D7 Retention:** % of users returning 7 days after signup.
*   **Performance:**
    *   **Time to Interactive (TTI):** < 1.0s.
    *   **Lighthouse Score:** > 90 across all categories (Performance, Accessibility, SEO).

---

## 7. Future Roadmap
*   **Integration:** Two-way sync with Google Calendar and Outlook.
*   **Gamification 2.0:** Unlockable themes and badges based on productivity scores.
*   **Collaboration:** Shared workspaces for teams.
*   **Native Apps:** React Native / Electron wrappers for dedicated desktop/mobile apps.
