import { Compass, Map, Heart, CalendarCheck, User } from "lucide-react";

export type NavTab = "explore" | "map" | "saved" | "bookings" | "profile";

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
  bookingsCount: number;
}

export default function BottomNav({
  currentTab,
  onTabChange,
  savedCount,
  bookingsCount,
}: BottomNavProps) {
  const tabs = [
    { id: "explore" as const, label: "Explorar", icon: Compass },
    { id: "map" as const, label: "Mapa", icon: Map },
    { id: "saved" as const, label: "Salvos", icon: Heart, badge: savedCount },
    { id: "bookings" as const, label: "Reservas", icon: CalendarCheck, badge: bookingsCount },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0B0D]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#D95A1A]" : "text-neutral-400 hover:text-white"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#D95A1A] text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-semibold mt-1 ${isActive ? "text-[#D95A1A]" : ""}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D95A1A] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
