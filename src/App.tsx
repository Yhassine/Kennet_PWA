import { useEffect, useState } from "react";
import Header from "./components/Header";
import BottomNav, { type NavTab } from "./components/BottomNav";
import FilterTabs from "./components/FilterTabs";
import AccommodationModal from "./components/AccommodationModal";
import BookingDrawer from "./components/BookingDrawer";
import MapView from "./components/MapView";
import InstallPwaBanner from "./components/InstallPwaBanner";

import ExploreView from "./views/ExploreView";
import SavedView from "./views/SavedView";
import BookingsView from "./views/BookingsView";
import ProfileView from "./views/ProfileView";
import GuestAuthView from "./views/GuestAuthView";

import { ACCOMMODATIONS } from "./data/accommodations";
import type { Accommodation, Booking, CategoryId, GuestUser } from "./types/guest";
import { supabase } from "./lib/supabaseClient";
import { toGuestUser } from "./lib/guestUser";

export default function App() {
  const [currentUser, setCurrentUser] = useState<GuestUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(
        session?.user?.phone_confirmed_at ? toGuestUser(session.user) : null,
      );
      setIsLoadingAuth(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Falha ao carregar sessão do hóspede:", error.message);
        setCurrentUser(null);
      } else {
        setCurrentUser(
          data.session?.user?.phone_confirmed_at
            ? toGuestUser(data.session.user)
            : null,
        );
      }
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLogoutError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Falha ao terminar sessão do hóspede:", error.message);
      setLogoutError("Não foi possível terminar a sessão. Tente novamente.");
    }
  };

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>("explore");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [rentalFilter, setRentalFilter] = useState<"all" | "monthly" | "daily">("all");

  // Saved / Favorites
  const [savedIds, setSavedIds] = useState<string[]>(["acc-1", "acc-4"]);

  // Bookings / Scheduled Visits
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "RES-10441",
      accommodationId: "acc-4",
      accommodationTitle: "Pensão Central Baixa Maputo",
      accommodationImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      city: "Baixa",
      province: "maputo_cidade",
      startDate: "2026-11-20",
      endDate: "2026-11-22",
      type: "diaria",
      totalPriceMZN: 4900,
      status: "confirmado",
      paymentMethod: "mpesa",
      clientCode: "KEN-MZ-1044",
      createdAt: new Date().toISOString(),
    },
  ]);

  // Modals & Drawers
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [bookingAccommodation, setBookingAccommodation] = useState<Accommodation | null>(null);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setBookingAccommodation(null);
    setSelectedAccommodation(null);
    setCurrentTab("bookings");
  };

  // Filter accommodations
  const filteredAccommodations = ACCOMMODATIONS.filter((acc) => {
    // Category filter
    if (selectedCategory !== "all" && acc.category !== selectedCategory) {
      return false;
    }

    // Rental type filter (all | monthly | daily)
    if (rentalFilter === "monthly" && !acc.isHouseRental) {
      return false;
    }
    if (rentalFilter === "daily" && acc.isHouseRental) {
      return false;
    }

    // Province filter
    if (selectedProvince !== "all" && acc.province !== selectedProvince) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = acc.title.toLowerCase().includes(q);
      const matchCity = acc.city.toLowerCase().includes(q);
      const matchAddress = acc.address.toLowerCase().includes(q);
      const matchTypology = acc.typology.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress && !matchTypology) {
        return false;
      }
    }

    return true;
  });

  // If user is logged out, show dedicated Guest Auth view
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center">
        <p role="status" className="text-sm text-neutral-300">A verificar a sua sessão...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <GuestAuthView onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white flex flex-col pb-20">
      {logoutError && (
        <p role="alert" className="fixed top-3 left-3 right-3 z-50 rounded-lg border border-red-500/60 bg-red-950/90 p-3 text-center text-sm text-red-200">
          {logoutError}
        </p>
      )}
      {/* Install PWA Prompt Banner */}
      <InstallPwaBanner />

      {/* Main Header */}
      <Header
        user={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter Tabs (only on Explore and Map views) */}
      {(currentTab === "explore" || currentTab === "map") && (
        <FilterTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
          rentalFilter={rentalFilter}
          onSelectRentalFilter={setRentalFilter}
        />
      )}

      {/* Views Router */}
      <main className="flex-1">
        {currentTab === "explore" && (
          <ExploreView
            accommodations={filteredAccommodations}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectAccommodation={setSelectedAccommodation}
          />
        )}

        {currentTab === "map" && (
          <MapView
            accommodations={filteredAccommodations}
            onSelectAccommodation={setSelectedAccommodation}
          />
        )}

        {currentTab === "saved" && (
          <SavedView
            accommodations={ACCOMMODATIONS}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectAccommodation={setSelectedAccommodation}
            onGoToExplore={() => setCurrentTab("explore")}
          />
        )}

        {currentTab === "bookings" && (
          <BookingsView
            bookings={bookings}
            onGoToExplore={() => setCurrentTab("explore")}
          />
        )}

        {currentTab === "profile" && (
          <ProfileView
            user={currentUser}
            onLogout={() => void handleLogout()}
          />
        )}
      </main>

      {/* Detail Modal */}
      {selectedAccommodation && (
        <AccommodationModal
          accommodation={selectedAccommodation}
          onClose={() => setSelectedAccommodation(null)}
          onStartBooking={(acc) => {
            setSelectedAccommodation(null);
            setBookingAccommodation(acc);
          }}
        />
      )}

      {/* Booking / Lease Drawer */}
      {bookingAccommodation && (
        <BookingDrawer
          accommodation={bookingAccommodation}
          user={currentUser}
          onClose={() => setBookingAccommodation(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Bottom PWA Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        savedCount={savedIds.length}
        bookingsCount={bookings.length}
      />
    </div>
  );
}
