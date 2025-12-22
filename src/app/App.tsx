import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import StarryNightBg from "../assets/starry-night-gradient.png";
import Sidebar from "./components/Sidebar";
import TasksSection from "./components/TasksSection";
import HabitsSection from "./components/HabitsSection";
import TimerSection from "./components/TimerSection";
import ScheduleSection from "./components/ScheduleSection";
import EventsSection from "./components/EventsSection";
import RoutineSection from "./components/RoutineSection";
import Auth from "./components/auth/Auth";
import { supabase } from "../lib/supabase";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const quotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "Success is the sum of small efforts repeated day in and day out.",
    "It’s not about having time. It’s about making time.",
    "The only way to do great work is to love what you do.",
    "Action is the foundational key to all success."
  ];

  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dailyQuote = quotes[getDayOfYear(currentTime) % quotes.length];

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-[#0a0a16] text-white">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  // Render full view for specific sections
  if (currentView === "tasks") {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute h-full w-full left-0 top-0">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute bg-black/15 inset-0" />

        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-12 text-white hover:text-white/70 transition-colors z-10"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="relative h-full">
          <TasksSection variant="full" userId={session?.user?.id} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    );
  }

  if (currentView === "habits") {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute h-full w-full left-0 top-0">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute bg-black/15 inset-0" />

        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-12 text-white hover:text-white/70 transition-colors z-10"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="relative h-full">
          <HabitsSection variant="full" userId={session?.user?.id} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    );
  }

  if (currentView === "timer") {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute h-full w-full left-0 top-0">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute bg-black/15 inset-0" />

        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-12 text-white hover:text-white/70 transition-colors z-10"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="relative h-full">
          <TimerSection variant="full" userId={session?.user?.id} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    );
  }

  if (currentView === "routines") {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute h-full w-full left-0 top-0">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute bg-black/15 inset-0" />

        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-12 text-white hover:text-white/70 transition-colors z-10"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="relative h-full">
          <RoutineSection variant="full" userId={session?.user?.id} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    );
  }

  if (currentView === "calendar") {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute h-full w-full left-0 top-0">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={StarryNightBg}
          />
        </div>
        <div className="absolute bg-black/15 inset-0" />

        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-12 text-white hover:text-white/70 transition-colors z-10"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="relative h-full">
          <ScheduleSection variant="full" userId={session?.user?.id} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    );
  }

  // Home view - dashboard with all sections
  return (
    <div className="bg-white relative size-full overflow-hidden">
      {/* Background images */}
      <div className="absolute h-full w-full left-0 top-0">
        <img
          alt=""
          className="absolute inset-0 object-cover size-full"
          src={StarryNightBg}
        />
      </div>
      <div className="absolute h-full w-full left-0 top-0 blur-[15px]">
        <img
          alt=""
          className="absolute inset-0 object-cover size-full"
          src={StarryNightBg}
        />
      </div>
      <div className="absolute bg-black/15 inset-0" />

      {/* Header */}
      <div className="absolute left-14 top-12 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white hover:text-white/70 transition-colors"
        >
          <div className="flex flex-col gap-2">
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-12 text-center z-10">
        <p className="font-['Be_Vietnam_Pro',sans-serif] text-white mb-1">
          {getGreeting()}, {session?.user?.user_metadata?.full_name || "Mahi"}
        </p>
        <p className="font-['Be_Vietnam_Pro',sans-serif] text-white/80">
          {formatDate(currentTime)}
        </p>
      </div>

      <div className="absolute right-14 top-12 z-10">
        <p className="font-['Be_Vietnam_Pro',sans-serif] text-white">
          {formatTime(currentTime)}
        </p>
      </div>

      {/* Main grid */}
      <div className="absolute inset-0 top-28 bottom-24 px-14 z-10">
        <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full">
          {/* Today's Tasks - spans 4 columns, 4 rows */}
          <div className="col-span-4 row-span-4">
            <TasksSection variant="compact" userId={session?.user?.id} />
          </div>

          {/* Habits - spans 8 columns, 2 rows */}
          <div className="col-span-8 row-span-2">
            <HabitsSection variant="compact" userId={session?.user?.id} />
          </div>

          {/* Routine Time - spans 4 columns, 2 rows */}
          <div className="col-span-4 row-span-2">
            <RoutineSection variant="compact" userId={session?.user?.id} />
          </div>

          {/* Timer - spans 4 columns, 2 rows */}
          <div className="col-span-4 row-span-2">
            <TimerSection variant="compact" userId={session?.user?.id} />
          </div>

          {/* Schedule - spans 6 columns, 2 rows */}
          <div className="col-span-6 row-span-2">
            <ScheduleSection variant="compact" userId={session?.user?.id} />
          </div>

          {/* Events - spans 6 columns, 2 rows */}
          <div className="col-span-6 row-span-2">
            <EventsSection variant="compact" userId={session?.user?.id} />
          </div>
        </div>
      </div>

      {/* Thought of the day */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="font-['Be_Vietnam_Pro',sans-serif] text-white/60 text-sm mb-1">
          Thought of the day
        </p>
        <p className="font-['Be_Vietnam_Pro',sans-serif] text-white italic">
          "{dailyQuote}"
        </p>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  );
}
