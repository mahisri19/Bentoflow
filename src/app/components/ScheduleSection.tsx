import { useState, useEffect } from "react";
import { Plus, Clock, MapPin, Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Types
type ScheduleItem = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  color: string;
  date?: string;
};

// Simplified types for cross-section compatibility
type Task = {
  id: string;
  title: string;
  desc?: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "med" | "high";
  category: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  location?: string;
  description?: string;
  color: string;
};

type ScheduleSectionProps = {
  variant?: "compact" | "full";
  userId?: string;
};

const COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f43f5e", // Red
  "#f59e0b", // Orange
  "#10b981", // Emerald
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleSection({ variant = "compact", userId }: ScheduleSectionProps) {
  const effectiveUserId = userId || "guest";
  const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  // State for different item types
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Item Creation State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<"schedule" | "task" | "event">("schedule");
  const [newItem, setNewItem] = useState<any>({});

  // --- Data Persistence ---

  // Load Data
  useEffect(() => {
    // Load Schedule
    const savedSchedule = localStorage.getItem(`bentoflow_schedule_${effectiveUserId}`);
    if (savedSchedule) {
      setScheduleItems(JSON.parse(savedSchedule));
    } else {
      setScheduleItems([
        {
          id: "1", title: "Team Standup", startTime: "09:00", endTime: "09:30",
          location: "Zoom", color: "#3b82f6", date: todayStr
        }
      ]);
    }

    // Load Tasks
    const savedTasks = localStorage.getItem(`bentoflow_tasks_${effectiveUserId}`);
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    // Load Events
    const savedEvents = localStorage.getItem(`bentoflow_events_${effectiveUserId}`);
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    setIsLoaded(true);
  }, [effectiveUserId, todayStr]);

  // Save Data
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`bentoflow_schedule_${effectiveUserId}`, JSON.stringify(scheduleItems));
  }, [scheduleItems, isLoaded, effectiveUserId]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`bentoflow_tasks_${effectiveUserId}`, JSON.stringify(tasks));
  }, [tasks, isLoaded, effectiveUserId]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`bentoflow_events_${effectiveUserId}`, JSON.stringify(events));
  }, [events, isLoaded, effectiveUserId]);


  // --- Calendar Logic ---

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Previous month padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      // Adjust for timezone to ensure string matches local date
      const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
      days.push(localDate.toISOString().split('T')[0]);
    }
    return days;
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCreateType("schedule");
    setEditingId(null);
    setNewItem({ date: dateStr, color: COLORS[0], startTime: "09:00", priority: "med" });
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!selectedDate || !newItem.title) return;

    if (createType === "schedule") {
      const item: ScheduleItem = {
        id: editingId || Date.now().toString(),
        title: newItem.title,
        startTime: newItem.startTime,
        endTime: newItem.endTime || newItem.startTime,
        location: newItem.location,
        description: newItem.description,
        color: newItem.color || COLORS[0],
        date: selectedDate
      };
      if (editingId) {
        setScheduleItems(scheduleItems.map(i => i.id === editingId ? item : i));
      } else {
        setScheduleItems([...scheduleItems, item]);
      }
    } else if (createType === "task") {
      const task: Task = {
        id: editingId || Date.now().toString(),
        title: newItem.title,
        desc: newItem.description,
        dueDate: selectedDate,
        completed: newItem.completed || false,
        priority: newItem.priority || "med",
        category: "General"
      };
      if (editingId) {
        setTasks(tasks.map(t => t.id === editingId ? task : t));
      } else {
        setTasks([...tasks, task]);
      }
    } else if (createType === "event") {
      const event: Event = {
        id: editingId || Date.now().toString(),
        title: newItem.title,
        date: selectedDate,
        startTime: newItem.startTime,
        location: newItem.location,
        description: newItem.description,
        color: newItem.color || COLORS[1]
      };
      if (editingId) {
        setEvents(events.map(e => e.id === editingId ? event : e));
      } else {
        setEvents([...events, event]);
      }
    }

    setIsDialogOpen(false);
    setNewItem({});
    setEditingId(null);
  };

  const handleDeleteItem = () => {
    if (!editingId) return;

    if (createType === "schedule") {
      setScheduleItems(scheduleItems.filter(i => i.id !== editingId));
    } else if (createType === "task") {
      setTasks(tasks.filter(t => t.id !== editingId));
    } else if (createType === "event") {
      setEvents(events.filter(e => e.id !== editingId));
    }
    setIsDialogOpen(false);
    setNewItem({});
    setEditingId(null);
  };

  // --- Rendering ---

  // Helper to render items in a calendar cell
  const renderCellItems = (dateStr: string) => {
    const cellSchedule = scheduleItems.filter(i => i.date === dateStr);
    const cellEvents = events.filter(e => e.date === dateStr);
    const cellTasks = tasks.filter(t => t.dueDate === dateStr);

    const allItems = [
      ...cellSchedule.map(i => ({ type: 'schedule', ...i })),
      ...cellEvents.map(i => ({ type: 'event', ...i })),
      ...cellTasks.map(i => ({ type: 'task', ...i }))
    ];

    return (
      <div className="flex flex-col gap-1 mt-1 overflow-hidden">
        {allItems.slice(0, 3).map((item: any, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(item.id);
              setCreateType(item.type as any);
              setNewItem({
                ...item,
                startTime: item.startTime, // Ensure specific fields map correctly
                endTime: item.endTime,
                description: item.desc || item.description // Handle task 'desc' vs others 'description'
              });
              setSelectedDate(dateStr);
              setIsDialogOpen(true);
            }}
            className={`text-[10px] truncate px-1 rounded-sm cursor-pointer hover:opacity-80 transition-opacity ${item.type === 'task' ? 'bg-green-500/20 text-green-200' :
              item.type === 'event' ? 'bg-purple-500/20 text-purple-200' :
                'bg-blue-500/20 text-blue-200'
              }`}
          >
            {item.type === 'task' && <span className="inline-block w-1 h-1 rounded-full bg-green-400 mr-1" />}
            {item.title}
          </div>
        ))}
        {allItems.length > 3 && (
          <div className="text-[9px] text-white/40 pl-1">+{allItems.length - 3} more</div>
        )}
      </div>
    );
  };

  // --- Compact View ---
  if (variant === "compact") {
    const todaysEvents = scheduleItems
      .filter(item => item.date === todayStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 3);

    return (
      <div className="backdrop-blur-[12.5px] backdrop-filter bg-white/15 border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Schedule</h2>
          <button
            onClick={() => { setSelectedDate(todayStr); setCreateType("schedule"); setEditingId(null); setNewItem({}); setIsDialogOpen(true); }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {todaysEvents.length === 0 ? (
            <div className="text-white/40 text-sm text-center py-4">No schedule items today</div>
          ) : (
            todaysEvents.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setEditingId(item.id);
                  setCreateType("schedule");
                  setNewItem({ ...item });
                  setSelectedDate(item.date || todayStr);
                  setIsDialogOpen(true);
                }}
                className="relative overflow-hidden flex items-stretch gap-3 rounded-xl p-3 group transition-all hover:scale-[1.02] duration-300 border shadow-md cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${item.color}25, ${item.color}10)`,
                  borderColor: `${item.color}40`,
                  boxShadow: `0 4px 15px -5px ${item.color}30`
                }}
              >
                {/* Striped Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.1] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(-45deg, ${item.color}, ${item.color} 1px, transparent 1px, transparent 10px)`
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center w-12 shrink-0 border-r border-white/10 pr-3">
                  <span className="text-white font-semibold text-sm">{item.startTime}</span>
                  {item.endTime && item.endTime !== item.startTime && (
                    <span className="text-white/40 text-[10px]">{item.endTime}</span>
                  )}
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{item.title || "Untitled"}</h3>
                  {item.location && <p className="text-white/40 text-xs truncate flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {item.location}</p>}
                </div>
                <div className="relative z-10 w-1 rounded-full self-stretch shrink-0" style={{ backgroundColor: item.color }} />
              </div>
            ))
          )}
        </div>
        {/* Reuse the same dialog for compact view adding */}
        {isDialogOpen && renderDialog()}
      </div>
    );
  }

  // Full View (Calendar)
  const days = getDaysInMonth(currentDate);

  function renderDialog() {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ... dialog content remains the same, assuming Dialog is responsive ... */}
        <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-4 sm:p-8 w-[90%] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">
              {editingId ? "Edit Item" : `Add to ${new Date(selectedDate || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </DialogTitle>
          </DialogHeader>

          {/* Type Selector - Hide if editing for simplicity, or allow changing */}
          {!editingId && (
            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 mb-4">
              {(['schedule', 'task', 'event'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setCreateType(type)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${createType === type ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4 w-full min-w-0">
            <Input
              placeholder="Title"
              value={newItem.title || ""}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 w-full max-w-full min-w-0"
              autoFocus
            />

            {(createType === "schedule" || createType === "event") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/60 ml-1">Start Time</label>
                  <Input
                    type="time"
                    value={newItem.startTime || ""}
                    onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 w-full"
                  />
                </div>
                {createType === "schedule" && (
                  <div className="space-y-1">
                    <label className="text-xs text-white/60 ml-1">End Time</label>
                    <Input
                      type="time"
                      value={newItem.endTime || ""}
                      onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {createType === "task" && (
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Priority</label>
                <div className="flex gap-2">
                  {['low', 'med', 'high'].map(p => (
                    <button
                      key={p}
                      onClick={() => setNewItem({ ...newItem, priority: p })}
                      className={`flex-1 py-2 rounded-xl text-xs uppercase font-bold border transition-all ${newItem.priority === p
                        ? p === 'high' ? 'bg-red-500/20 border-red-500 text-red-400'
                          : p === 'med' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                            : 'bg-green-500/20 border-green-500 text-green-400'
                        : 'border-white/10 text-white/40 hover:border-white/30'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(createType === "schedule" || createType === "event") && (
              <div className="space-y-2">
                <label className="text-xs text-white/60 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Add location"
                    value={newItem.location || ""}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-12 pl-10 pr-4 w-full"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {editingId && (
                <Button
                  onClick={handleDeleteItem}
                  className="flex-1 h-12 md:h-14 bg-red-500/10 text-red-400 text-base md:text-lg font-semibold rounded-2xl hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
              <Button
                onClick={handleSaveItem}
                className={`h-12 md:h-14 bg-white text-black text-base md:text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all ${editingId ? 'flex-[3]' : 'w-full'}`}
              >
                {editingId ? "Save Changes" : `Create ${createType}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="h-full md:min-h-full p-4 pt-20 md:p-8 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pl-0 md:pl-20 px-1 gap-4 md:gap-0">
        <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white text-2xl md:text-3xl font-light tracking-wide">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-2 self-end md:self-auto">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container (Scrollable on mobile) */}
      <div className="flex-1 overflow-auto rounded-[24px] border border-white/5 bg-[#13161f]/80 backdrop-blur-xl">
        <div className="min-w-[700px] md:min-w-0 h-full flex flex-col">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {WEEKDAYS.map(day => (
              <div key={day} className="py-3 text-center text-white/40 text-sm font-medium uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
            {days.map((day, idx) => {
              const isToday = day === todayStr;
              return (
                <div
                  key={idx}
                  onClick={() => day && handleDateClick(day)}
                  className={`
                                  min-h-[80px] border-r border-b border-white/5 p-2 transition-colors relative group
                                  ${!day ? 'bg-black/20 pointer-events-none' : 'hover:bg-white/5 cursor-pointer'}
                                  ${isToday ? 'bg-white/5' : ''}
                              `}
                >
                  {day && (
                    <>
                      <span className={`
                                          text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                          ${isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'text-white/60'}
                                      `}>
                        {new Date(day).getDate()}
                      </span>
                      {renderCellItems(day)}

                      {/* Hover Add Button */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-white/40" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {renderDialog()}
    </div>
  );
}
