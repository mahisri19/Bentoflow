import { useState, useEffect } from "react";
import { Plus, X, Sun, Moon, Calendar, CheckCircle, Circle, Maximize2, Clock, Trash2, Briefcase, Code, Utensils, Zap, Tv, Wifi, Home, Car, Smile, BookOpen, Coffee, Music, Heart, Dumbbell } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type Routine = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  days: string[];
  icon: string;
  color?: string;
  checklist: ChecklistItem[];
};

type RoutineSectionProps = {
  variant?: "compact" | "full";
  userId?: string;
};

const ICONS = ["sun", "moon", "calendar", "coffee", "book", "dumbbell", "music", "heart", "briefcase", "code", "utensils", "zap", "tv", "wifi", "home", "car", "smile"];
const COLORS = [
  "#facc15", // Yellow
  "#a855f7", // Purple
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#22c55e", // Green
  "#f97316", // Orange
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RoutineSection({ variant = "compact", userId }: RoutineSectionProps) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveUserId = userId || "guest";

  // Load from localStorage on mount or when userId changes
  useEffect(() => {
    const saved = localStorage.getItem(`bentoflow_routines_${effectiveUserId}`);
    if (saved) {
      setRoutines(JSON.parse(saved));
    } else {
      // Default routines if nothing saved
      setRoutines([
        {
          id: "1",
          title: "Morning Routine",
          startTime: "7:00 AM",
          endTime: "9:00 AM",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          icon: "sun",
          color: "#facc15",
          checklist: [
            { id: "1", text: "Wake up", completed: false },
            { id: "2", text: "Shower", completed: false },
            { id: "3", text: "Prayer", completed: false },
            { id: "4", text: "Breakfast", completed: false },
          ],
        },
      ]);
    }
    setIsLoaded(true);
  }, [effectiveUserId]);

  // Save to localStorage when routines change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`bentoflow_routines_${effectiveUserId}`, JSON.stringify(routines));
    }
  }, [routines, effectiveUserId, isLoaded]);

  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  // New Routine State
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    days: [],
    checklist: [],
    icon: "sun",
    color: COLORS[0]
  });
  const [newChecklistInput, setNewChecklistInput] = useState("");
  const [editChecklistInput, setEditChecklistInput] = useState("");

  const handleAddRoutine = () => {
    if (!newRoutine.title || !newRoutine.startTime || !newRoutine.endTime) {
      alert("Please fill in all routine details (title, start time, end time).");
      return;
    }
    if (!newRoutine.checklist || newRoutine.checklist.length === 0) {
      alert("Please add at least one checklist item.");
      return;
    }

    const routine: Routine = {
      id: Date.now().toString(),
      title: newRoutine.title,
      startTime: newRoutine.startTime,
      endTime: newRoutine.endTime,
      days: newRoutine.days || [],
      icon: newRoutine.icon || "sun",
      color: newRoutine.color || COLORS[0],
      checklist: newRoutine.checklist || [],
    };

    setRoutines([...routines, routine]);
    setNewRoutine({ days: [], checklist: [], icon: "sun", color: COLORS[0] });
    setNewChecklistInput("");
    setIsAddingRoutine(false);
  };

  const toggleChecklistItem = (routineId: string, itemId: string) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          checklist: r.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return r;
    }));
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "sun": return Sun;
      case "moon": return Moon;
      case "calendar": return Calendar;
      case "coffee": return Coffee;
      case "book": return BookOpen;
      case "dumbbell": return Dumbbell;
      case "music": return Music;
      case "heart": return Heart;
      case "briefcase": return Briefcase;
      case "code": return Code;
      case "utensils": return Utensils;
      case "zap": return Zap;
      case "tv": return Tv;
      case "wifi": return Wifi;
      case "home": return Home;
      case "car": return Car;
      case "smile": return Smile;
      default: return Sun;
    }
  };

  const renderIcon = (name: string, className = "w-6 h-6", color = "") => {
    const Icon = getIcon(name);
    return <Icon className={className} style={{ color: color }} />;
  };

  const getDaysLabel = (days: string[]) => {
    if (days.length === 7) return "All Week";
    if (days.length === 0) return "No Days";
    if (days.length <= 3) return days.join(", ");
    return `${days.length} Days`;
  };

  const renderAddModal = () => (
    <Dialog open={isAddingRoutine} onOpenChange={setIsAddingRoutine}>
      <DialogContent className="bg-[#0f1219]/90 backdrop-blur-3xl border-white/5 text-white rounded-[32px] shadow-2xl p-0 overflow-hidden max-w-md w-[90vw] mx-auto max-h-[85vh] flex flex-col [&>button]:hidden">
        <div className="p-6 pb-2 flex justify-between items-center shrink-0">
          <button onClick={() => setIsAddingRoutine(false)} className="text-white/40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-medium font-['Be_Vietnam_Pro',sans-serif] absolute left-1/2 -translate-x-1/2">New Routine</h2>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Routine Name</label>
            <Input
              placeholder="Morning Routine"
              value={newRoutine.title || ""}
              onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
              className="bg-white/5 border-none text-white placeholder:text-white/20 rounded-2xl h-14 px-4 text-lg focus:ring-0"
            />
          </div>

          <div className="flex gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <label className="text-xs text-white/60 ml-1">Start Time</label>
              <div className="relative">
                <Input
                  type="time"
                  value={newRoutine.startTime || ""}
                  onChange={(e) => setNewRoutine({ ...newRoutine, startTime: e.target.value })}
                  className="bg-white/5 border-none text-white rounded-2xl h-14 px-4 focus:ring-0 w-full"
                />
              </div>
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <label className="text-xs text-white/60 ml-1">End Time</label>
              <div className="relative">
                <Input
                  type="time"
                  value={newRoutine.endTime || ""}
                  onChange={(e) => setNewRoutine({ ...newRoutine, endTime: e.target.value })}
                  className="bg-white/5 border-none text-white rounded-2xl h-14 px-4 focus:ring-0 w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Days of the Week</label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const currentDays = newRoutine.days || [];
                    const newDays = currentDays.includes(day)
                      ? currentDays.filter(d => d !== day)
                      : [...currentDays, day];
                    setNewRoutine({ ...newRoutine, days: newDays });
                  }}
                  className={`h-10 w-full rounded-xl text-xs font-medium transition-all ${newRoutine.days?.includes(day)
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Icon</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewRoutine({ ...newRoutine, icon })}
                  className={`h-10 w-10 min-w-[40px] rounded-xl flex items-center justify-center transition-all ${newRoutine.icon === icon ? "bg-white/20 border border-white/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                    }`}
                >
                  {renderIcon(icon, "w-5 h-5", newRoutine.icon === icon ? "#fff" : "rgba(255,255,255,0.6)")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Color Theme</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewRoutine({ ...newRoutine, color })}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${newRoutine.color === color
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Checklist</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add checklist item..."
                value={newChecklistInput}
                onChange={(e) => setNewChecklistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newChecklistInput.trim()) {
                    setNewRoutine({
                      ...newRoutine,
                      checklist: [...(newRoutine.checklist || []), { id: Date.now().toString(), text: newChecklistInput, completed: false }]
                    });
                    setNewChecklistInput("");
                  }
                }}
                className="bg-white/5 border-none text-white placeholder:text-white/20 rounded-2xl h-12 px-4 focus:ring-0 flex-1"
              />
              <Button
                onClick={() => {
                  if (newChecklistInput.trim()) {
                    setNewRoutine({
                      ...newRoutine,
                      checklist: [...(newRoutine.checklist || []), { id: Date.now().toString(), text: newChecklistInput, completed: false }]
                    });
                    setNewChecklistInput("");
                  }
                }}
                className="h-12 w-12 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/30"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {newRoutine.checklist && newRoutine.checklist.length > 0 && (
              <div className="mt-2 space-y-1 bg-white/5 rounded-2xl p-2">
                {newRoutine.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                    <span className="text-sm text-white/80 flex-1">{item.text}</span>
                    <button
                      onClick={() => {
                        setNewRoutine({
                          ...newRoutine,
                          checklist: newRoutine.checklist?.filter(i => i.id !== item.id)
                        });
                      }}
                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-2 shrink-0">
          <Button
            onClick={handleAddRoutine}
            className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-2xl h-12 md:h-14 text-base md:text-lg font-medium shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
          >
            Create Routine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedRoutine, setEditedRoutine] = useState<Partial<Routine>>({});

  const handleStartEdit = (routine: Routine) => {
    setEditedRoutine({ ...routine });
    setIsEditing(true);
    setEditChecklistInput(""); // Clear input when starting edit
  };

  const handleSaveEdit = () => {
    if (!editedRoutine.title || !editingRoutineId) return;

    setRoutines(routines.map((r: Routine) =>
      r.id === editingRoutineId ? { ...r, ...editedRoutine } as Routine : r
    ));
    setIsEditing(false);
    setEditingRoutineId(null);
  };

  const handleDeleteRoutine = () => {
    if (!editingRoutineId) return;
    setRoutines(routines.filter((r: Routine) => r.id !== editingRoutineId));
    setIsEditing(false);
    setEditingRoutineId(null);
  };

  const renderEditModal = () => (
    <Dialog open={!!editingRoutineId} onOpenChange={(open) => {
      if (!open) {
        setEditingRoutineId(null);
        setIsEditing(false);
      }
    }}>
      <DialogContent className="bg-[#1a1f2e]/95 backdrop-blur-3xl border-white/5 text-white rounded-[32px] shadow-2xl p-0 overflow-hidden max-w-md w-[90vw] mx-auto max-h-[85vh] flex flex-col [&>button]:hidden">
        {editingRoutineId && (() => {
          const routine = routines.find((r: Routine) => r.id === editingRoutineId);
          if (!routine) return null;

          if (isEditing) {
            return (
              <>
                <div className="p-6 pb-2 flex justify-between items-center shrink-0">
                  <button onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-medium font-['Be_Vietnam_Pro',sans-serif] absolute left-1/2 -translate-x-1/2">Edit Routine</h2>
                  <div className="w-6" /> {/* Spacer for centering */}
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 ml-1">Routine Name</label>
                    <Input
                      value={editedRoutine.title || ""}
                      onChange={(e) => setEditedRoutine({ ...editedRoutine, title: e.target.value })}
                      className="bg-white/5 border-none text-white rounded-2xl h-12 px-4 focus:ring-0"
                    />
                  </div>

                  {/* Time Inputs */}
                  <div className="flex gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <label className="text-xs text-white/60 ml-1">Start Time</label>
                      <Input
                        type="time"
                        value={editedRoutine.startTime || ""}
                        onChange={(e) => setEditedRoutine({ ...editedRoutine, startTime: e.target.value })}
                        className="bg-white/5 border-none text-white rounded-2xl h-12 px-4 focus:ring-0 w-full"
                      />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <label className="text-xs text-white/60 ml-1">End Time</label>
                      <Input
                        type="time"
                        value={editedRoutine.endTime || ""}
                        onChange={(e) => setEditedRoutine({ ...editedRoutine, endTime: e.target.value })}
                        className="bg-white/5 border-none text-white rounded-2xl h-12 px-4 focus:ring-0 w-full"
                      />
                    </div>
                  </div>

                  {/* Days */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 ml-1">Days</label>
                    <div className="grid grid-cols-7 gap-1">
                      {DAYS.map((day) => (
                        <button
                          key={day}
                          onClick={() => {
                            const currentDays = editedRoutine.days || [];
                            const newDays = currentDays.includes(day)
                              ? currentDays.filter(d => d !== day)
                              : [...currentDays, day];
                            setEditedRoutine({ ...editedRoutine, days: newDays });
                          }}
                          className={`h-10 w-full rounded-xl text-xs font-medium transition-all ${editedRoutine.days?.includes(day)
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 ml-1">Icon</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                      {ICONS.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setEditedRoutine({ ...editedRoutine, icon })}
                          className={`h-10 w-10 min-w-[40px] rounded-xl flex items-center justify-center transition-all ${editedRoutine.icon === icon ? "bg-white/20 border border-white/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                            }`}
                        >
                          {renderIcon(icon, "w-5 h-5", editedRoutine.icon === icon ? "#fff" : "rgba(255,255,255,0.6)")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 ml-1">Color Theme</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditedRoutine({ ...editedRoutine, color })}
                          className={`h-8 w-8 rounded-full border-2 transition-all ${editedRoutine.color === color
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 ml-1">Checklist</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add checklist item..."
                        value={editChecklistInput}
                        onChange={(e) => setEditChecklistInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editChecklistInput.trim()) {
                            setEditedRoutine({
                              ...editedRoutine,
                              checklist: [...(editedRoutine.checklist || []), { id: Date.now().toString(), text: editChecklistInput, completed: false }]
                            });
                            setEditChecklistInput("");
                          }
                        }}
                        className="bg-white/5 border-none text-white placeholder:text-white/20 rounded-2xl h-12 px-4 focus:ring-0 flex-1"
                      />
                      <Button
                        onClick={() => {
                          if (editChecklistInput.trim()) {
                            setEditedRoutine({
                              ...editedRoutine,
                              checklist: [...(editedRoutine.checklist || []), { id: Date.now().toString(), text: editChecklistInput, completed: false }]
                            });
                            setEditChecklistInput("");
                          }
                        }}
                        className="h-12 w-12 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/30"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    {editedRoutine.checklist && editedRoutine.checklist.length > 0 && (
                      <div className="mt-2 space-y-1 bg-white/5 rounded-2xl p-2">
                        {editedRoutine.checklist.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                            <span className="text-sm text-white/80 flex-1">{item.text}</span>
                            <button
                              onClick={() => {
                                setEditedRoutine({
                                  ...editedRoutine,
                                  checklist: editedRoutine.checklist?.filter(i => i.id !== item.id)
                                });
                              }}
                              className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>


                <div className="p-6 pt-2 shrink-0 flex gap-3">
                  <Button
                    onClick={handleDeleteRoutine}
                    className="flex-1 h-12 md:h-14 bg-red-500/10 text-red-400 text-base md:text-lg font-semibold rounded-2xl hover:bg-red-500/20 transition-all shadow-none"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-[2] h-12 md:h-14 bg-white text-black text-base md:text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            );
          }

          // View Mode
          return (
            <div className="p-6 relative">
              {/* Close Button - Top Right */}


              {/* Edit Trigger - Top Left */}
              <button
                onClick={() => handleStartEdit(routine)}
                className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] text-sm font-medium hover:bg-[#8b5cf6]/30 transition-colors z-20"
              >
                Edit
              </button>

              <div className="mt-8 flex flex-col items-center">
                <div
                  className="p-4 rounded-2xl mb-4 transition-colors duration-300"
                  style={{ backgroundColor: `${routine.color}20` }}
                >
                  {renderIcon(routine.icon, "w-10 h-10", routine.color)}
                </div>
                <h3 className="text-xl font-semibold mb-1">{routine.title}</h3>
                <div className="text-white/40 text-xs mb-6">
                  {routine.startTime} - {routine.endTime}
                </div>
              </div>

              <div className="space-y-3">
                {routine.checklist.length > 0 ? routine.checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(routine.id, item.id)}
                    className="w-full bg-black/20 hover:bg-black/30 text-left p-4 rounded-2xl flex items-center gap-4 transition-all"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                    <span className={`text-sm ${item.completed ? "text-white/40 line-through" : "text-white"}`}>
                      {item.text}
                    </span>
                  </button>
                )) : (
                  <div className="text-center text-white/40 text-sm py-4">No checklist items</div>
                )}
              </div>
            </div>
          );
        })()}
      </DialogContent>
    </Dialog >
  );

  // Compact View
  if (variant === "compact") {
    // Filter routines for today
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const todaysRoutines = routines.filter(routine => routine.days.includes(todayName));

    return (
      <div className="backdrop-blur-[12.5px] backdrop-filter bg-white/15 border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Routines</h2>
          <button
            onClick={() => setIsAddingRoutine(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {todaysRoutines.length === 0 ? (
            <div className="text-white/40 text-sm text-center py-4">No routines today</div>
          ) : (
            todaysRoutines.map((routine) => (
              <button
                key={routine.id}
                onClick={() => setEditingRoutineId(routine.id)}
                className="w-full relative overflow-hidden text-left backdrop-blur-md rounded-xl p-3 border transition-all group hover:scale-[1.02] duration-300"
                style={{
                  background: `linear-gradient(to right, ${routine.color}15, ${routine.color}05)`,
                  borderColor: `${routine.color}20`
                }}
              >
                {/* Stripe Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${routine.color}, ${routine.color} 2px, transparent 2px, transparent 8px)`
                  }}
                />
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
                    style={{ color: routine.color }}
                  >
                    {renderIcon(routine.icon, "w-4 h-4", routine.color)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{routine.title}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{routine.startTime} - {routine.endTime}</p>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/50 border border-white/5">
                    {getDaysLabel(routine.days)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        {renderAddModal()}
        {renderEditModal()}
      </div>
    );
  }


  // Full View
  return (
    <div className="h-full md:min-h-full p-4 pt-20 md:p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 mt-0 md:mt-4 md:ml-20">
          {/* Keeping spacing consistent with other pages */}
          <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white text-2xl md:text-3xl font-light tracking-wide">ROUTINES</h1>
        </div>
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-2xl text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Routine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-0 md:px-20 pb-24 md:pb-0">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="group relative bg-[#13161f]/80 backdrop-blur-xl rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-all hover:bg-[#1a1f2e]/80 overflow-hidden"
          >
            {/* Background Gradient Blob */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: routine.color }}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-105 transition-transform duration-300"
                >
                  {renderIcon(routine.icon, "w-8 h-8", routine.color)}
                </div>
                <button
                  onClick={() => setEditingRoutineId(routine.id)}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-medium text-white mb-1 transition-colors">{routine.title}</h3>
              <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
                <Clock className="w-3 h-3" />
                {routine.startTime} - {routine.endTime}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/60 text-xs font-medium border border-white/5">
                  {getDaysLabel(routine.days)}
                </span>

                {routine.checklist.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <span className="font-medium" style={{ color: routine.color }}>{routine.checklist.filter(i => i.completed).length}</span>
                    <span>/</span>
                    <span>{routine.checklist.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderAddModal()}
      {renderEditModal()}
    </div>
  );
}
