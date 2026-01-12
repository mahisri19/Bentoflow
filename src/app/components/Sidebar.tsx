import { X, CheckSquare, Target, Calendar, Clock, Repeat, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSignOut?: () => void;
};

export default function Sidebar({ isOpen, onClose, currentView, onViewChange, onSignOut }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: null },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "habits", label: "Habits", icon: Target },
    { id: "routines", label: "Routines", icon: Repeat },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "timer", label: "Timer", icon: Clock },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onSignOut?.();
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 transition-transform flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Bento Flow</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${currentView === item.id
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10"
                  }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-['Be_Vietnam_Pro',sans-serif]">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-['Be_Vietnam_Pro',sans-serif] font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
