import { useState, useEffect, useRef } from "react";
import { Plus, Droplet, Sparkles, Footprints, Coffee, Book, Dumbbell, Music, Heart, Check, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import confetti from "canvas-confetti";
import { supabase } from "../../lib/supabase";

type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  daysOfWeek: boolean[];
  completedToday: boolean;
};

const ICON_OPTIONS = [
  { name: "droplet", Icon: Droplet, color: "#3b82f6" },
  { name: "sparkles", Icon: Sparkles, color: "#ec4899" },
  { name: "footprints", Icon: Footprints, color: "#10b981" },
  { name: "coffee", Icon: Coffee, color: "#f59e0b" },
  { name: "book", Icon: Book, color: "#8b5cf6" },
  { name: "dumbbell", Icon: Dumbbell, color: "#ef4444" },
  { name: "music", Icon: Music, color: "#06b6d4" },
  { name: "heart", Icon: Heart, color: "#f43f5e" },
];

const COLOR_OPTIONS = [
  "#60a5fa", // pastel blue
  "#f472b6", // pastel pink
  "#34d399", // pastel emerald
  "#fbbf24", // pastel amber
  "#a78bfa", // pastel violet
  "#f87171", // pastel red
  "#22d3ee", // pastel cyan
  "#fb7185", // pastel rose
];

type HabitsSectionProps = {
  variant?: "compact" | "full";
  userId?: string;
};

export default function HabitsSection({ variant = "compact", userId }: HabitsSectionProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveUserId = userId || "guest";
  const isGuest = !userId || userId === "guest";

  const storageMigrationAttempted = useRef(false);

  useEffect(() => {
    async function loadHabits() {
      const todayStr = new Date().toISOString().split('T')[0];

      if (!isGuest) {
        let dbHabitsList: Habit[] = [];

        // 1. Fetch existing DB habits first
        const { data, error } = await supabase.from('habits').select('*');
        if (!error && data) {
          dbHabitsList = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            icon: d.icon,
            color: d.color,
            streak: d.streak,
            daysOfWeek: d.days_of_week,
            completedToday: d.completed_dates?.includes(todayStr) || false
          }));
        }

        // 2. Check/Migrate Local Data (Only if DB is empty to avoid duplication)
        if (!storageMigrationAttempted.current && dbHabitsList.length === 0) {
          storageMigrationAttempted.current = true;
          const localData = localStorage.getItem(`bentoflow_habits_${effectiveUserId}`);

          if (localData) {
            try {
              const localHabits: Habit[] = JSON.parse(localData);
              if (localHabits.length > 0) {
                const habitsToInsert = localHabits.map(h => ({
                  user_id: userId,
                  name: h.name,
                  icon: h.icon,
                  color: h.color,
                  streak: h.streak,
                  days_of_week: h.daysOfWeek,
                  completed_dates: h.completedToday ? [todayStr] : []
                }));

                const { data: insertedData, error: insertError } = await supabase
                  .from('habits')
                  .insert(habitsToInsert)
                  .select();

                if (!insertError && insertedData) {
                  // Clean up local storage
                  localStorage.removeItem(`bentoflow_habits_${effectiveUserId}`);

                  // Add inserted habits to our list
                  const mappedInserted = insertedData.map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    icon: d.icon,
                    color: d.color,
                    streak: d.streak,
                    daysOfWeek: d.days_of_week,
                    completedToday: d.completed_dates?.includes(todayStr) || false
                  }));
                  dbHabitsList = [...dbHabitsList, ...mappedInserted];
                }
              }
            } catch (e) {
              console.error("Migration failed", e);
            }
          }
        }

        setHabits(dbHabitsList);
      } else {
        // Guest Mode
        const saved = localStorage.getItem(`bentoflow_habits_${effectiveUserId}`);
        if (saved) {
          setHabits(JSON.parse(saved));
        } else {
          setHabits([
            {
              id: "1",
              name: "Drink Water",
              icon: "droplet",
              color: "#93c5fd",
              streak: 5,
              daysOfWeek: [true, true, true, true, true, true, true],
              completedToday: false,
            },
            {
              id: "2",
              name: "Meditation",
              icon: "sparkles",
              color: "#f9a8d4",
              streak: 3,
              daysOfWeek: [true, true, true, true, true, false, false],
              completedToday: false,
            },
            {
              id: "3",
              name: "Evening Walk",
              icon: "footprints",
              color: "#6ee7b7",
              streak: 7,
              daysOfWeek: [false, true, false, true, false, true, true],
              completedToday: true,
            },
          ]);
        }
      }
      setIsLoaded(true);
    }
    loadHabits();
  }, [effectiveUserId, isGuest]);

  useEffect(() => {
    if (isLoaded && isGuest) {
      localStorage.setItem(`bentoflow_habits_${effectiveUserId}`, JSON.stringify(habits));
    }
  }, [habits, effectiveUserId, isLoaded, isGuest]);

  // Get habits for today
  const dayOfWeek = (new Date().getDay() + 6) % 7; // Convert Sunday=0...Saturday=6 to Monday=0...Sunday=6
  const todaysHabits = habits.filter(h => h.daysOfWeek[dayOfWeek]);

  // Confetti effect when all today's habits are done
  useEffect(() => {
    if (todaysHabits.length > 0 && todaysHabits.every(h => h.completedToday)) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"]
      });
    }
  }, [habits]);

  // Filter/Tab state
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    icon: "droplet",
    color: "#93c5fd",
    daysOfWeek: [true, true, true, true, true, true, true],
  });

  const handleAddHabit = async () => {
    if (!newHabit.name) return;

    const tempId = Date.now().toString();
    const habit: Habit = {
      id: tempId,
      name: newHabit.name,
      icon: newHabit.icon || "droplet",
      color: newHabit.color || "#93c5fd",
      streak: 0,
      daysOfWeek: newHabit.daysOfWeek || [true, true, true, true, true, true, true],
      completedToday: false,
    };

    setHabits([...habits, habit]);
    setNewHabit({ icon: "droplet", color: "#93c5fd", daysOfWeek: [true, true, true, true, true, true, true] });
    setIsAddingHabit(false);

    if (!isGuest) {
      const { data } = await supabase.from('habits').insert([{
        user_id: userId,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        streak: 0,
        days_of_week: habit.daysOfWeek,
        completed_dates: []
      }]).select();

      if (data && data[0]) {
        setHabits(prev => prev.map(h => h.id === tempId ? { ...h, id: data[0].id } : h));
      }
    }
  };

  const deleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHabits(habits.filter(h => h.id !== id));
    if (!isGuest) await supabase.from('habits').delete().eq('id', id);
  };

  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const startEditing = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewHabit({
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      daysOfWeek: habit.daysOfWeek,
    });
    setEditingHabitId(habit.id);
    setIsAddingHabit(true);
  };

  const saveHabit = async () => {
    if (!newHabit.name) return;

    if (editingHabitId) {
      setHabits(habits.map(h =>
        h.id === editingHabitId
          ? { ...h, ...newHabit } as Habit
          : h
      ));

      if (!isGuest) {
        await supabase.from('habits').update({
          name: newHabit.name,
          icon: newHabit.icon,
          color: newHabit.color,
          days_of_week: newHabit.daysOfWeek
        }).eq('id', editingHabitId);
      }

      setEditingHabitId(null);
    } else {
      handleAddHabit();
    }

    if (editingHabitId) {
      setIsAddingHabit(false);
      setNewHabit({ icon: "droplet", color: "#93c5fd", daysOfWeek: [true, true, true, true, true, true, true] });
    }
  };

  const toggleHabit = async (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const wasCompleted = habit.completedToday;
    const newCompleted = !wasCompleted;
    const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    setHabits(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completedToday: newCompleted,
          streak: newStreak
        };
      }
      return h;
    }));

    if (!isGuest) {
      // We need to fetch current completed_dates from DB or assume we have it. 
      // Simplest: Fetch current record to get array, then update.
      // OR: maintain a local cache of `completed_dates`. 
      // Our local `habit` object only has `completedToday`.
      // We really should strictly store `completed_dates` in local state if we want to update correctly without fetching.
      // However, fetching a single row is fast.

      const { data } = await supabase.from('habits').select('completed_dates').eq('id', id).single();
      if (data) {
        let dates = data.completed_dates || [];
        if (newCompleted) {
          if (!dates.includes(todayStr)) dates.push(todayStr);
        } else {
          dates = dates.filter((d: string) => d !== todayStr);
        }
        await supabase.from('habits').update({
          streak: newStreak,
          completed_dates: dates
        }).eq('id', id);
      }
    }
  };

  const getIcon = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(i => i.name === iconName);
    return iconOption ? iconOption.Icon : Droplet;
  };

  if (variant === "compact") {
    return (
      <div className="backdrop-blur-[12.5px] backdrop-filter bg-white/15 border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Habits</h2>
          <button
            onClick={() => setIsAddingHabit(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {todaysHabits.length === 0 ? (
            <div className="text-white/40 text-sm text-center w-full">No habits today</div>
          ) : (
            todaysHabits.map((habit) => {
              const Icon = getIcon(habit.icon);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="flex flex-col items-center gap-2 min-w-[70px] group shrink-0"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${habit.completedToday ? "scale-105 shadow-lg" : "hover:scale-105 hover:bg-white/10"
                      }`}
                    style={{
                      backgroundColor: habit.completedToday ? habit.color : `${habit.color}25`, // 25 is approx 15% opacity for pastel feel
                      border: `1px solid ${habit.completedToday ? "transparent" : `${habit.color}40`}`
                    }}
                  >
                    <Icon
                      className={`w-7 h-7 transition-colors duration-300`}
                      style={{ color: habit.completedToday ? "#ffffff" : habit.color }}
                    />
                  </div>
                  <span className={`text-[11px] font-medium text-center w-full px-1 break-words leading-tight transition-colors duration-300 ${habit.completedToday ? "text-white" : "text-white/80 group-hover:text-white"}`} style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    {habit.name}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <Dialog open={isAddingHabit} onOpenChange={(open) => {
          setIsAddingHabit(open);
          if (!open) {
            setEditingHabitId(null);
            setNewHabit({ icon: "droplet", color: "#93c5fd", daysOfWeek: [true, true, true, true, true, true, true] });
          }
        }}>
          <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-4 sm:p-8 w-[90%] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">
                {editingHabitId ? "Edit Habit" : "New Habit"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 w-full min-w-0">
              <Input
                placeholder="Habit Name"
                value={newHabit.name || ""}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full max-w-full min-w-0"
              />
              <div>
                <label className="text-sm font-medium text-white/60 mb-3 block">Icon</label>
                <div className="grid grid-cols-4 gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                  {ICON_OPTIONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      onClick={() => setNewHabit({ ...newHabit, icon: name })}
                      className={`p-3 rounded-xl transition-all duration-300 flex justify-center items-center ${newHabit.icon === name ? "bg-white text-black shadow-lg scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <Icon className={`w-6 h-6 ${newHabit.icon === name ? "text-black" : "text-current"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-3 block">Color</label>
                <div className="flex gap-3 justify-center bg-white/5 p-3 rounded-2xl border border-white/5 overflow-x-auto">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-8 h-8 rounded-full transition-all duration-300 shrink-0 ${newHabit.color === color ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-black" : "hover:scale-110 opacity-70 hover:opacity-100"
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-3 block">Days of the Week</label>
                <div className="flex gap-1 sm:gap-2 justify-between bg-white/5 p-2 rounded-2xl border border-white/5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const newDays = [...(newHabit.daysOfWeek || [true, true, true, true, true, true, true])];
                        newDays[index] = !newDays[index];
                        setNewHabit({ ...newHabit, daysOfWeek: newDays });
                      }}
                      className={`flex-1 h-8 sm:h-10 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:opacity-80 aspect-square flex items-center justify-center ${newHabit.daysOfWeek?.[index]
                        ? "bg-white text-black shadow-lg"
                        : "text-white/40 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={saveHabit}
                className="w-full h-12 md:h-14 bg-white text-black text-base md:text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
              >
                {editingHabitId ? "Save Changes" : "Create Habit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }



  // Full view
  return (
    <div className="min-h-screen p-4 pt-24 md:p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 mt-0 md:mt-4 md:ml-20">
          <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white text-2xl md:text-3xl font-light tracking-wide">HABITS</h1>
        </div>
        <button
          onClick={() => setIsAddingHabit(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm md:text-base shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 ml-0 md:ml-20 z-10 relative">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-6 py-2 rounded-full transition-all text-sm font-medium whitespace-nowrap shrink-0 ${activeTab === "today"
            ? "bg-white text-black shadow-lg"
            : "border border-white/20 bg-transparent text-white/70 hover:text-white"
            }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-full transition-all text-sm font-medium whitespace-nowrap shrink-0 ${activeTab === "all"
            ? "bg-white text-black shadow-lg"
            : "border border-white/20 bg-transparent text-white/70 hover:text-white"
            }`}
        >
          All Habits
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-0 md:px-20 pb-24 md:pb-0 md:overflow-y-auto">
        {(activeTab === "today" ? todaysHabits : habits).map((habit) => {
          const Icon = getIcon(habit.icon);
          return (
            <div
              key={habit.id}
              className="group relative bg-[#13161f]/80 backdrop-blur-xl rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-all hover:bg-[#1a1f2e]/80"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all mb-4 ${habit.completedToday ? "scale-105" : ""}`}
                style={{ backgroundColor: habit.completedToday ? habit.color : `${habit.color}20` }}
              >
                <Icon className={`w-8 h-8 ${habit.completedToday ? "text-white" : ""}`} style={{ color: habit.completedToday ? "white" : habit.color }} />
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">{habit.name}</h3>
                  <p className="text-white/40 text-xs">{habit.streak} day streak</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => startEditing(habit, e)}
                    className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => deleteHabit(habit.id, e)}
                    className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activeTab === "today" && (
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${habit.completedToday
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-white text-black hover:bg-white/90"
                    }`}
                >
                  {habit.completedToday ? (
                    <>
                      <Check className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    "Mark Done"
                  )}
                </button>
              )}

              {activeTab === "all" && (
                <div className="flex gap-1 mt-4">
                  {habit.daysOfWeek.map((active, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: active ? habit.color : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {activeTab === "today" && todaysHabits.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/40">
            No habits scheduled for today.
          </div>
        )}
      </div>

      <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
        <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-4 sm:p-8 w-[90%] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 w-full min-w-0">
            <Input
              placeholder="Habit Name"
              value={newHabit.name || ""}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full max-w-full min-w-0"
            />
            <div>
              <label className="text-sm font-medium text-white/60 mb-3 block">Icon</label>
              <div className="grid grid-cols-4 gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                {ICON_OPTIONS.map(({ name, Icon }) => (
                  <button
                    key={name}
                    onClick={() => setNewHabit({ ...newHabit, icon: name })}
                    className={`p-3 rounded-xl transition-all duration-300 flex justify-center items-center ${newHabit.icon === name ? "bg-white text-black shadow-lg scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${newHabit.icon === name ? "text-black" : "text-current"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 mb-3 block">Color</label>
              <div className="flex gap-3 justify-center bg-white/5 p-3 rounded-2xl border border-white/5 overflow-x-auto">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                    className={`w-8 h-8 rounded-full transition-all duration-300 shrink-0 ${newHabit.color === color ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-black" : "hover:scale-110 opacity-70 hover:opacity-100"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 mb-3 block">Days of the Week</label>
              <div className="flex gap-1 sm:gap-2 justify-between bg-white/5 p-2 rounded-2xl border border-white/5">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newDays = [...(newHabit.daysOfWeek || [true, true, true, true, true, true, true])];
                      newDays[index] = !newDays[index];
                      setNewHabit({ ...newHabit, daysOfWeek: newDays });
                    }}
                    className={`flex-1 h-8 sm:h-10 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:opacity-80 aspect-square flex items-center justify-center ${newHabit.daysOfWeek?.[index]
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={saveHabit}
              className="w-full h-14 bg-white text-black text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              {editingHabitId ? "Save Changes" : "Create Habit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
