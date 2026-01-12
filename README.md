
 # Bentoflow Productivity

## 1. Summary
**Product Name:** Bentoflow
**Description:** Pentoflow is an all-in-one personal productivity dashboard designed to unify tasks, habits, schedules, routines, and focus tools into a single, aesthetically pleasing interface. Built with a "Bento Grid" design philosophy, it offers a modular, responsive, and seamless experience across desktop and mobile devices.
**Goal:** To help users organize their life, improve focus, and build consistent habits through a gamified and visually engaging platform that synchronizes data across all user devices.

## 2. Technical Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** TypeScript (TSX)
- **Styling:** 
  - Tailwind CSS (Utility-first styling)
  - Custom CSS Modules (for specific animations/gradients)
  - Glassmorphism UI effects
- **Icons:** Lucide React
- **Animations:** Canvas Confetti, CSS Transitions
- **UI Components:** Radix UI (Dialogs, Primitives)

### Backend & Database
- **Platform:** Supabase (BaaS)
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth (Email/Password)
- **Security:** Row Level Security (RLS) policies for user data isolation
- **Storage:** LocalStorage (for Guest Mode persistence) and Supabase DB (for Cloud Sync)

### Infrastructure / Deployment
- **Hosting:** (Currently Local/Vite dev server, ready for Vercel/Netlify)
- **Environment Management:** `.env` variables for Supabase keys

## 3. Core Features & Functionalities

### 3.1. Authentication & User Management
- **Sign Up / Login:** Secure email and password authentication via Supabase.
- **Guest Mode:** Fully functional offline mode using LocalStorage for users trying out the app.
- **Device Sync:** Seamless real-time synchronization of all data (Tasks, Habits, etc.) across devices when logged in.

### 3.2. Dashboard (Bento Grid)
- **Responsive Layout:** Adaptive Bento Grid layout that stacks on mobile and expands on desktop.
- **Dynamic Greeting:** Personalized greetings (Morning, Afternoon, Evening) based on local time.
- **Daily Inspiration:** Rotating daily quotes to motivate users.

### 3.3. Task Management
- **CRUD Operations:** Create, Read, Update, and Delete tasks.
- **Categorization:** Tag tasks by category (Work, Personal, etc.).
- **Prioritization:** Set priority levels (Low, Medium, High) with visual indicators.
- **Optimistic UI:** Instant UI updates before database confirmation for a snappy feel.

### 3.4. Habit Tracking
- **Daily Tracker:** Visual toggle for daily habit completion.
- **Streak System:** Automatic calculation of current streaks.
- **Customization:** Assign unique colors and icons to each habit.
- **Scheduling:** Define specific days of the week for each habit.
- **Gamification:** Confetti celebration upon completing all daily habits.

### 3.5. Focus Timer (Pomodoro)
- **Timer Modes:** Pre-set Focus (25m) and Break (5m) modes.
- **Custom Duration:** Users can set custom timer lengths.
- **Focus Stats:** Tracks "Total Focus Time" and syncs this metric to the user profile.
- **Visual Feedback:** Progress rings and browser tab title updates.

### 3.6. Routines
- **Routine Builder:** Create multi-step routines (e.g., Morning Routine).
- **Checklists:** Nested checklist items within each routine.
- **Time Boxing:** Define start and end times for routines.

### 3.7. Schedule & Calendar
- **Unified View:** Aggregates Tasks, Events, and Schedule items into a single calendar view.
- **Monthly/Daily Views:** Interactive calendar grid.
- **Conflict Management:** Visual indicators for overlapping items.

### 3.8. Events
- **Event Tracking:** specific date/time events with location fields.
- **Visuals:** Color-coded event cards.

## 4. Database Schema
The application uses a relational schema in PostgreSQL (Supabase):

- **users:** Managed by Supabase Auth (`auth.users`).
- **user_stats:** Stores aggregated data like `total_focus_time`.
- **tasks:** Stores individual todo items.
- **habits:** Stores habit definitions and completion history (`completed_dates` array).
- **routines:** Stores routine metadata and checklist items (JSONB).
- **events:** Stores one-off calendar events.
- **schedule_items:** Stores recurring or specific schedule blocks.

## 5. Mobile Responsiveness
- **Mobile-First Design:** All components are optimized for touch targets and smaller screens.
- **Adaptive Navigation:** Sidebar menu transforms into a mobile drawer/overlay.
- **Scroll Handling:** Optimized overflow handling for individual bento boxes on mobile.

## 6. Future Roadmap (Potential)
- **Push Notifications:** Reminders for tasks and habits.
- **Pro Mode:** Advanced analytics and data export.
- **Social Features:** Habit sharing or leaderboards.
- **Integration:** Google Calendar / Outlook sync.
