import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Trash2, CheckCircle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Event = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  location?: string;
  description?: string;
  color: string;
  completed?: boolean;
};

type EventsSectionProps = {
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

export default function EventsSection({ variant = "compact", userId }: EventsSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveUserId = userId || "guest";

  useEffect(() => {
    const saved = localStorage.getItem(`bentoflow_events_${effectiveUserId}`);
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents([
        {
          id: "1",
          title: "Product Launch",
          date: "2025-12-25",
          startTime: "10:00",
          color: "#3b82f6",
          location: "Main Hall"
        },
        {
          id: "2",
          title: "Team Offsite",
          date: "2025-12-28",
          startTime: "09:00",
          color: "#ec4899",
          location: "Lake Resort"
        },
        {
          id: "3",
          title: "Year End Review",
          date: "2025-12-31",
          startTime: "14:00",
          color: "#10b981",
          location: "Office"
        },
      ]);
    }
    setIsLoaded(true);
  }, [effectiveUserId]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`bentoflow_events_${effectiveUserId}`, JSON.stringify(events));
    }
  }, [events, effectiveUserId, isLoaded]);

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    color: "#3b82f6",
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      location: newEvent.location,
      description: newEvent.description,
      color: newEvent.color || "#3b82f6",
    };

    setEvents([...events, event].sort((a, b) => a.date.localeCompare(b.date)));
    setNewEvent({ color: "#3b82f6", date: new Date().toISOString().split('T')[0] });
    setIsAddingEvent(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // e.g. "Dec 25"
  };

  const renderEventItem = (event: Event, isCompact: boolean) => (
    <div
      key={event.id}
      className={`relative group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all ${isCompact ? 'p-3' : 'p-4'}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: event.color }}
      />

      <div className="flex items-start gap-3 pl-2">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`text-white font-medium truncate ${isCompact ? 'text-sm' : 'text-base'}`}>{event.title}</h3>
            {!isCompact && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-white/60 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.date)}
            </span>
            {event.startTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.startTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddModal = () => (
    <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
      <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-6 sm:p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <Input
            placeholder="Event Title"
            value={newEvent.title || ""}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all"
            autoFocus
          />

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Date</label>
            <Input
              type="date"
              value={newEvent.date || ""}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-white/60 ml-1">Time (Optional)</label>
              <Input
                type="time"
                value={newEvent.startTime || ""}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all"
              />
            </div>
            <div>
              {/* Spacer or End Time if needed */}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 ml-1">Color Tag</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewEvent({ ...newEvent, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${newEvent.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleAddEvent}
            className="w-full h-14 bg-white text-black text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
          >
            Add Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (variant === "compact") {
    const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const displayedEvents = events.filter(event => event.date === todayStr);

    const toggleEventCompletion = (id: string) => {
      setEvents(events.map(event =>
        event.id === id ? { ...event, completed: !event.completed } : event
      ));
    };

    return (
      <div className="backdrop-blur-[12.5px] backdrop-filter bg-white/15 border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Events</h2>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container with wrap */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-4 items-start content-start">
            {displayedEvents.length === 0 ? (
              <div className="text-white/40 text-sm text-center w-full mt-4">No events today</div>
            ) : (
              displayedEvents.map(event => (
                <div
                  key={event.id}
                  className={`relative shrink-0 w-28 h-24 backdrop-blur-xl rounded-2xl border transition-all group flex flex-col justify-between p-3 shadow-lg hover:z-50 hover:scale-110 duration-300 ${event.completed ? 'opacity-50 grayscale' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${event.color}30 0%, ${event.color}10 100%)`,
                    borderColor: `${event.color}50`,
                    boxShadow: `0 8px 32px -10px ${event.color}40`,
                  }}
                >
                  {/* Subtle Texture Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${event.color} 40%, transparent 40%)`,
                      backgroundSize: '8px 8px'
                    }}
                  />

                  <div className="relative z-10 h-full flex flex-col pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleEventCompletion(event.id); }}
                      className="absolute -top-1 -right-1 p-1 text-white/50 hover:text-white transition-colors z-20"
                    >
                      {event.completed ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5" />}
                    </button>

                    <h3 className={`text-white font-medium text-sm line-clamp-2 leading-tight pr-6 ${event.completed ? 'line-through' : ''}`}>
                      {event.title}
                    </h3>

                    <div className="text-white/60 text-[10px] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime || "All Day"}</span>
                    </div>
                  </div>

                  {/* Delete Action - bottom right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                    className="absolute bottom-2 right-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        {renderAddModal()}
      </div>
    );
  }

  // Full view
  return (
    <div className="h-full p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white ml-20 mt-4 text-3xl font-light tracking-wide">EVENTS</h1>
        <button
          onClick={() => setIsAddingEvent(true)}
          className="px-5 py-2.5 bg-purple-500/50 rounded-2xl text-white hover:bg-purple-500/70 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto">
        {events.map((event) => renderEventItem(event, false))}
      </div>

      {renderAddModal()}
    </div>
  );
}
