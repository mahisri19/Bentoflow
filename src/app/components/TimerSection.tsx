import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, X, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { Input } from "./ui/input";

type TimerSectionProps = {
  variant?: "compact" | "full";
  userId?: string;
};

export default function TimerSection({ variant = "compact" }: TimerSectionProps) {
  const [seconds, setSeconds] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [isEditing, setIsEditing] = useState(false);
  const [customInput, setCustomInput] = useState("25");
  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    const saved = localStorage.getItem("bentoflow_focus_time");
    const savedDate = localStorage.getItem("bentoflow_focus_date");
    const today = new Date().toDateString();
    if (saved && savedDate === today) {
      return parseInt(saved);
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem("bentoflow_focus_time", totalFocusTime.toString());
    localStorage.setItem("bentoflow_focus_date", new Date().toDateString());
  }, [totalFocusTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Browser tab title update
    if (isRunning) {
      document.title = `${formatTime(seconds)} - ${mode === 'work' ? 'Work' : 'Break'} | Bentoflow`;
    } else {
      document.title = "Bentoflow";
    }

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
        if (mode === "work") {
          setTotalFocusTime((t) => t + 1);
        }
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: mode === "work" ? ["#ec4899", "#f43f5e", "#8b5cf6"] : ["#10b981", "#34d399", "#06b6d4"]
      });

      // Auto-switch modes
      if (mode === "work") {
        setMode("break");
        setSeconds(300); // 5 minute break
        setCustomInput("5");
      } else {
        setMode("work");
        setSeconds(1500); // 25 minute work
        setCustomInput("25");
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, mode]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const formatFocusTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const parseToSeconds = (input: string): number => {
    const normalized = input.toLowerCase().replace(/\s+/g, '');
    if (/^\d+$/.test(normalized)) return parseInt(normalized) * 60;

    let totalSeconds = 0;
    const hoursMatch = normalized.match(/(\d*\.?\d+)h/);
    if (hoursMatch) totalSeconds += parseFloat(hoursMatch[1]) * 3600;

    const minsMatch = normalized.match(/(\d*\.?\d+)m/);
    if (minsMatch) totalSeconds += parseFloat(minsMatch[1]) * 60;

    return Math.floor(totalSeconds) || (parseFloat(normalized) * 60) || 0;
  };

  const handleReset = () => {
    setIsRunning(false);
    const time = parseToSeconds(customInput);
    setSeconds(time > 0 ? time : (mode === "work" ? 1500 : 300));
  };

  const handleSaveTime = () => {
    const newSeconds = parseToSeconds(customInput);
    if (newSeconds > 0) {
      setSeconds(newSeconds);
      setIsEditing(false);
      setIsRunning(false);
    }
  };

  const progress = mode === "work"
    ? ((1500 - seconds) / 1500) * 100
    : ((300 - seconds) / 300) * 100;

  if (variant === "compact") {
    return (
      <div
        className="backdrop-blur-[12.5px] backdrop-filter border border-white/30 rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)] p-6 h-full flex flex-col items-center justify-between relative overflow-hidden transition-all duration-1000"
        style={{
          background: mode === 'work'
            ? 'radial-gradient(circle at top right, rgba(236,72,153,0.15), rgba(76,29,149,0.2) 60%, rgba(15,23,42,0.6))'
            : 'radial-gradient(circle at top right, rgba(16,185,129,0.15), rgba(6,182,212,0.2) 60%, rgba(15,23,42,0.6))'
        }}
      >
        {/* Hexagon Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10s-10 4.477-10 10v20c0 5.523 4.477 10 10 10zM24 40c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10s-10 4.477-10 10v20c0 5.523 4.477 10 10 10z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '24px 40px'
          }}
        />
        <div className="w-full flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-['Be_Vietnam_Pro',sans-serif] text-white opacity-85">Timer</h2>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  const h = Math.floor(seconds / 3600);
                  const m = Math.floor((seconds % 3600) / 60);
                  setCustomInput(h > 0 ? `${h}h ${m}m` : m.toString());
                }
              }}
              className="text-white/40 hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => {
              const newMode = mode === 'work' ? 'break' : 'work';
              setMode(newMode);
              setSeconds(newMode === 'work' ? 1500 : 300);
              setCustomInput(newMode === 'work' ? "25" : "5");
              setIsRunning(false);
            }}
            className="text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white cursor-pointer transition-colors"
          >
            {mode}
          </button>
        </div>

        <div className="flex-1 flex flex-row items-center justify-center gap-6 z-10 w-full pl-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                type="text"
                placeholder="25, 1h, 90m"
                className="w-28 bg-white/10 border-white/20 text-white text-center text-sm h-10 font-bold"
                autoFocus
              />
              <div className="flex flex-col gap-1">
                <button onClick={handleSaveTime} className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-4xl font-bold text-white tracking-tight font-['Be_Vietnam_Pro',sans-serif]">
              {formatTime(seconds)}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="group relative w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 border border-white/10"
            >
              <div className={`absolute inset-0 opacity-20 ${mode === 'work' ? 'bg-pink-500' : 'bg-green-500'}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                {isRunning ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
              </div>
            </button>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>


      </div>
    );
  }

  // Full view
  return (
    <div className="h-full md:min-h-full p-4 pt-20 md:p-8 flex flex-col items-center justify-center min-h-[600px]">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-['Be_Vietnam_Pro',sans-serif] text-white text-2xl md:text-3xl font-light tracking-wide">TIMER</h1>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              const h = Math.floor(seconds / 3600);
              const m = Math.floor((seconds % 3600) / 60);
              setCustomInput(h > 0 ? `${h}h ${m}m` : m.toString());
            }
          }}
          className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 288 288">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke={mode === "work" ? "#ec4899" : "#10b981"}
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isEditing ? (
            <div className="flex flex-col items-center gap-4 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                type="text"
                placeholder="25, 1h"
                className="w-32 bg-white/10 border-white/20 text-white text-center text-2xl h-14 font-bold rounded-xl"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveTime} className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 flex justify-center">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 flex justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="font-['Be_Vietnam_Pro',sans-serif] text-white text-5xl md:text-6xl font-bold tracking-tight mb-2">
                {formatTime(seconds)}
              </span>
              <span className="text-white/40 uppercase tracking-[0.2em] text-sm">{mode}</span>
            </>
          )}
        </div>
      </div>

      {/* Daily Focus Stat */}
      <div className="mt-8 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        <span className="text-white/60 text-sm">Focused Today: <span className="text-white font-medium ml-1">{formatFocusTime(totalFocusTime)}</span></span>
      </div>

      <div className="flex gap-6 mt-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          {isRunning ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-2" />
          )}
        </button>
        <button
          onClick={handleReset}
          className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
        >
          <RotateCcw className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
        </button>
      </div>
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <button
          onClick={() => {
            setMode("work");
            setSeconds(1500);
            setIsRunning(false);
          }}
          className={`px-6 py-3 rounded-full transition-colors ${mode === "work"
            ? "bg-pink-500/50 text-white"
            : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
        >
          Work (25m)
        </button>
        <button
          onClick={() => {
            setMode("break");
            setSeconds(300);
            setIsRunning(false);
          }}
          className={`px-6 py-3 rounded-full transition-colors ${mode === "break"
            ? "bg-green-500/50 text-white"
            : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
        >
          Break (5m)
        </button>
      </div>
    </div>
  );
}
