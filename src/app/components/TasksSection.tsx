import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Trash2, CheckCircle, Circle, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import confetti from "canvas-confetti";

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority: "low" | "med" | "high";
  completed: boolean;
  category: string;
};

type TasksSectionProps = {
  variant?: "compact" | "full";
  userId?: string;
};

export default function TasksSection({ variant = "compact", userId }: TasksSectionProps) {
  // Get today's date in YYYY-MM-DD format for comparison using local timezone
  const now = new Date();
  const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const todayStr = today.toISOString().split('T')[0];

  // Get tomorrow and yesterday for dummy data
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveUserId = userId || "guest";

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`bentoflow_tasks_${effectiveUserId}`);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      // Default tasks only if nothing saved
      setTasks([
        {
          id: "1",
          title: "Review Morning Emails",
          category: "Work",
          dueTime: "9:00 AM",
          dueDate: todayStr,
          priority: "high",
          completed: false,
        },
        {
          id: "2",
          title: "Team Meeting",
          category: "Work",
          dueTime: "11:00 AM",
          dueDate: tomorrowStr,
          priority: "high",
          completed: false,
        },
        {
          id: "3",
          title: "Workout",
          category: "Personal",
          dueTime: "6:00 PM",
          dueDate: todayStr,
          priority: "med",
          completed: false,
        },
        {
          id: "4",
          title: "Project Deadline",
          category: "Work",
          dueTime: "5:00 PM",
          dueDate: yesterdayStr,
          priority: "high",
          completed: false,
        },
        {
          id: "5",
          title: "Buy Groceries",
          category: "Personal",
          dueTime: "7:00 PM",
          dueDate: yesterdayStr,
          priority: "low",
          completed: true,
        }
      ]);
    }
    setIsLoaded(true);
  }, [effectiveUserId, todayStr, tomorrowStr, yesterdayStr]);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`bentoflow_tasks_${effectiveUserId}`, JSON.stringify(tasks));
    }
  }, [tasks, effectiveUserId, isLoaded]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: "med",
    completed: false,
    dueDate: todayStr // Default to today
  });
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "overdue" | "completed">("today");

  // Calculate Daily Progress (Fixed to Today's Tasks)
  const todaysTasks = tasks.filter(t => t.dueDate === todayStr);
  const totalTodaysTasks = todaysTasks.length;
  const completedTodaysTasks = todaysTasks.filter(t => t.completed).length;
  const progress = totalTodaysTasks === 0 ? 0 : Math.round((completedTodaysTasks / totalTodaysTasks) * 100);

  // Filter Tasks for Display
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return !task.completed;
    if (filter === "today") return task.dueDate === todayStr && !task.completed;
    if (filter === "upcoming") return task.dueDate && task.dueDate > todayStr && !task.completed;
    if (filter === "overdue") return !task.completed && task.dueDate && task.dueDate < todayStr;
    if (filter === "completed") return task.completed;
    return !task.completed;
  });

  useEffect(() => {
    if (progress === 100 && totalTodaysTasks > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6'] // purple, pink, blue
      });
    }
  }, [progress, totalTodaysTasks]);

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || todayStr,
      dueTime: newTask.dueTime,
      priority: newTask.priority || "med",
      completed: false,
      category: newTask.category || "General",
    };

    setTasks([...tasks, task]);
    setNewTask({ priority: "med", completed: false, dueDate: todayStr });
    setIsAddingTask(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  if (variant === "compact") {
    // Compact view logic (usually shows top 3 for today)
    const compactTasks = tasks.filter(t => t.dueDate === todayStr && !t.completed).slice(0, 3);

    return (
      <div className="backdrop-blur-[12.5px] backdrop-filter bg-white/15 border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Today's Tasks</h2>
          <button
            onClick={() => setIsAddingTask(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {compactTasks.length === 0 ? (
            <div className="text-white/40 text-sm text-center py-4">All caught up for today!</div>
          ) : (
            compactTasks.map((task) => (
              <div
                key={task.id}
                className={`relative overflow-hidden backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${task.priority === 'high' ? 'from-red-500/10 to-rose-500/5 border-red-500/20 shadow-red-900/10' :
                  task.priority === 'med' ? 'from-amber-500/10 to-orange-500/5 border-amber-500/20 shadow-amber-900/10' :
                    'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 shadow-emerald-900/10'
                  }`}
              >
                {/* Grid Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-white ${task.completed ? "line-through opacity-50" : ""}`}>
                      {task.title}
                    </p>
                    {task.dueTime && (
                      <p className="text-xs text-white/60 mt-1">{task.dueTime}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${task.priority === "high" ? "bg-red-500/30 text-red-200" :
                    task.priority === "med" ? "bg-yellow-500/30 text-yellow-200" :
                      "bg-green-500/30 text-green-200"
                    }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-6 sm:p-8 w-[90%] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <Input
                placeholder="Task Name"
                value={newTask.title || ""}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full max-w-full min-w-0"
              />
              <Textarea
                placeholder="Description"
                value={newTask.description || ""}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl min-h-[100px] p-4 focus:bg-white/10 focus:border-white/20 transition-all resize-none w-full max-w-full min-w-0"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={newTask.dueDate || ""}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="time"
                    value={newTask.dueTime || ""}
                    onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-3 block">Priority</label>
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                  {(["low", "med", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewTask({ ...newTask, priority })}
                      className={`flex-1 py-2.5 rounded-xl capitalize text-sm font-medium transition-all duration-300 ${newTask.priority === priority
                        ? priority === "high" ? "bg-red-500/80 text-white shadow-lg shadow-red-500/20" :
                          priority === "med" ? "bg-yellow-500/80 text-white shadow-lg shadow-yellow-500/20" :
                            "bg-green-500/80 text-white shadow-lg shadow-green-500/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleAddTask}
                className="w-full h-12 md:h-14 bg-white text-black text-base md:text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Full view
  return (
    <div className="h-full md:min-h-full p-4 pt-20 md:p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mt-0 md:mt-4 md:ml-20">
          <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white text-2xl md:text-3xl font-light tracking-wide">TASKS</h1>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-purple-500/50 rounded-full text-white hover:bg-purple-500/70 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          + Add Task
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "today", "upcoming", "overdue", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full capitalize ${filter === f
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 h-auto md:h-full md:overflow-hidden pb-20 md:pb-0">
        {/* Task List - Width 2/3 */}
        <div className="w-full flex-1 md:overflow-y-auto pr-0 md:pr-2 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-white/40 text-center py-10">No tasks in this category.</div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transition-all hover:bg-white/15"
              >
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-white truncate ${task.completed ? "line-through opacity-50" : ""}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex gap-2 mt-3 text-xs flex-wrap">
                      {task.category && (
                        <span className={`px-2 py-0.5 rounded-full border ${task.category === 'Work' ? 'bg-blue-500/20 text-blue-200 border-blue-500/30' :
                          task.category === 'Personal' ? 'bg-green-500/20 text-green-200 border-green-500/30' :
                            task.category === 'Health' ? 'bg-red-500/20 text-red-200 border-red-500/30' :
                              'bg-slate-500/20 text-slate-200 border-slate-500/30'
                          }`}>
                          {task.category}
                        </span>
                      )}
                      {task.dueTime && (
                        <span className="flex items-center gap-1 text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> {task.dueTime}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                          <Calendar className="w-3 h-3" /> {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded text-xs ${task.priority === "high" ? "bg-red-500/30 text-red-200" :
                      task.priority === "med" ? "bg-yellow-500/30 text-yellow-200" :
                        "bg-green-500/30 text-green-200"
                      }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Sidebar - Width 1/3 */}
        <div className="w-full md:w-80 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center shrink-0 h-fit">
          <h3 className="text-white font-medium mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Daily Progress
          </h3>

          {/* Circular Progress */}
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#ec4899"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white mb-1">{progress}%</span>
              <span className="text-sm text-white/60">Completed</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-white/60 text-sm mb-1">Today's Tasks Done</div>
              <div className="text-2xl font-bold text-white">{completedTodaysTasks} <span className="text-white/40 text-base font-normal">/ {totalTodaysTasks}</span></div>
            </div>
            {progress === 100 && totalTodaysTasks > 0 && (
              <div className="bg-green-500/20 text-green-200 p-3 rounded-xl text-center text-sm animate-pulse">
                🎉 All tasks completed! Great job!
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="bg-black/60 backdrop-blur-3xl border-white/10 text-white rounded-[32px] shadow-2xl p-4 sm:p-8 w-[90%] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="font-['Be_Vietnam_Pro',sans-serif] text-2xl font-semibold text-center mb-2">New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 w-full min-w-0">
            <Input
              placeholder="Task Name"
              value={newTask.title || ""}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl h-12 px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full max-w-full min-w-0"
            />
            <Textarea
              placeholder="Description"
              value={newTask.description || ""}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl min-h-[100px] p-4 focus:bg-white/10 focus:border-white/20 transition-all resize-none w-full max-w-full min-w-0"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="date"
                  value={newTask.dueDate || ""}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full text-sm"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="time"
                  value={newTask.dueTime || ""}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  className="bg-white/5 border-white/10 text-white rounded-2xl h-12 px-2 sm:px-4 focus:bg-white/10 focus:border-white/20 transition-all w-full text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 mb-3 block">Category</label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto scrolbar-hide w-full">
                {(["Work", "Personal", "Health", "General"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewTask({ ...newTask, category: cat })}
                    className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${newTask.category === cat
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 mb-3 block">Priority</label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {(["low", "med", "high"] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setNewTask({ ...newTask, priority })}
                    className={`flex-1 py-2.5 rounded-xl capitalize text-sm font-medium transition-all duration-300 ${newTask.priority === priority
                      ? priority === "high" ? "bg-red-500/80 text-white shadow-lg shadow-red-500/20" :
                        priority === "med" ? "bg-yellow-500/80 text-white shadow-lg shadow-yellow-500/20" :
                          "bg-green-500/80 text-white shadow-lg shadow-green-500/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddTask}
              className="w-full h-14 bg-white text-black text-lg font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
