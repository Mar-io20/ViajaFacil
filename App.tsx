import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SearchWidget } from './components/search/SearchWidget';
import { LoginModal } from './components/auth/LoginModal';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { ConsultantRecommendation } from './components/search/ConsultantRecommendation';
import { OrganizerDashboard } from './components/dashboard/OrganizerDashboard';
import { TripDetails } from './components/dashboard/TripDetails';
import { Destinations } from './components/sections/Destinations';
import { Packages } from './components/sections/Packages';
import { AboutUs } from './components/sections/AboutUs';
import { User, SearchParams, Trip } from './types';
import { ShieldCheck, Globe, Heart } from 'lucide-react';
import { 
  generateGroupCode, 
  getUserFromStorage, 
  saveUserToStorage, 
  removeUserFromStorage,
  getTripsFromStorage,
  saveTripsToStorage
} from './services/storageService';

// Initial Mock Data (Fallback if storage is empty)
const MOCK_TRIPS: Trip[] = [
  { 
    id: '1', 
    code: 'EURO24', 
    name: 'Eurotrip com a Galera', 
    dates: '10 - 25 Out, 2024', 
    status: 'planning', 
    budget: 15000, 
    ownerId: '1', 
    members: [
        { userId: '1', name: 'Organizador Demo', role: 'LEADER', canEdit: true, avatar: '' },
        { userId: '2', name: 'Alice Silva', role: 'MEMBER', canEdit: false }
    ],
    itinerary: []
  },
];

const App: React.FC = () => {
  // Initialize state from Storage
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [trips, setTrips] = useState<Trip[]>(() => getTripsFromStorage() || MOCK_TRIPS);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'trip-details'>('home');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchRequest, setSearchRequest] = useState<SearchParams | null>(null);

  // If user is already logged in on load, check if we need to redirect
  useEffect(() => {
    // If we have a user and we are on the root, maybe we stay on home or go to dashboard?
    // For now, let's respect the current view state initialization which is 'home' unless changed.
    // But if we wanted to auto-redirect to dashboard:
    // if (user) setCurrentView('dashboard');
  }, [user]);

  // Helper to persist trips
  const updateTripsState = (newTrips: Trip[]) => {
      setTrips(newTrips);
      saveTripsToStorage(newTrips);
  };

  const handleSearch = async (params: SearchParams) => {
    setSearchRequest(params);
    if (currentView !== 'home') {
        setCurrentView('home');
    }
    setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
  };

  const handleContactClick = () => {
    alert(`Redirecionando para o WhatsApp do consultor com os detalhes: ${searchRequest?.destination}`);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    // Generate ID based on email to ensure returning users get the same ID
    const isDemoUser = loggedInUser.email === 'organizador@viajafacil.com';
    const generatedId = isDemoUser ? '1' : `user-${loggedInUser.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    let finalUser = { 
      ...loggedInUser, 
      id: generatedId 
    };

    // Attempt to recover user details (Name/Avatar) from existing trips if this is a simple login (not registration)
    // The LoginModal sends 'Organizador Demo' as a default name for logins.
    if (finalUser.name === 'Organizador Demo' && !isDemoUser) {
        const existingMemberInfo = trips
            .flatMap(t => t.members)
            .find(m => m.userId === generatedId);
            
        if (existingMemberInfo) {
            finalUser.name = existingMemberInfo.name;
            finalUser.avatar = existingMemberInfo.avatar;
        }
    }
    
    setUser(finalUser);
    saveUserToStorage(finalUser);

    if (!searchRequest) {
      setCurrentView('dashboard');
    }
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      saveUserToStorage(newUser); // Save persistence

      // Synchronize profile changes with all trips where the user is a member
      const updatedTrips = trips.map(trip => {
          const memberIndex = trip.members.findIndex(m => m.userId === newUser.id);
          if (memberIndex >= 0) {
              const updatedMembers = [...trip.members];
              updatedMembers[memberIndex] = {
                  ...updatedMembers[memberIndex],
                  name: newUser.name,
                  avatar: newUser.avatar,
                  email: newUser.email
              };
              return { ...trip, members: updatedMembers };
          }
          return trip;
      });

      // Only update state if something changed to avoid unnecessary re-renders/saves
      if (JSON.stringify(updatedTrips) !== JSON.stringify(trips)) {
          updateTripsState(updatedTrips);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    removeUserFromStorage(); // Clear persistence
    setCurrentView('home');
    setSearchRequest(null);
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Trip Logic ---

  const handleSelectTrip = (trip: Trip) => {
      setSelectedTrip(trip);
      setCurrentView('trip-details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTrip = () => {
      if (!user) return;
      const newTrip: Trip = {
          id: Date.now().toString(),
          code: generateGroupCode(),
          name: 'Nova Viagem em Grupo',
          dates: 'A definir',
          status: 'planning',
          budget: 0,
          ownerId: user.id,
          members: [{ 
              userId: user.id, 
              name: user.name, 
              email: user.email, 
              avatar: user.avatar, 
              role: 'LEADER', 
              canEdit: true 
          }],
          itinerary: []
      };
      
      const newTripsList = [...trips, newTrip];
      updateTripsState(newTripsList);
      
      // Auto select newly created trip
      handleSelectTrip(newTrip);
  };

  const handleJoinTrip = (code: string) => {
      if (!user) return;
      
      const trip = trips.find(t => t.code === code);
      if (trip) {
          const isMember = trip.members.some(m => m.userId === user.id);
          if (isMember) {
              alert("Você já faz parte deste grupo!");
              return;
          }

          const updatedTrip = {
              ...trip,
              members: [
                  ...trip.members, 
                  { 
                      userId: user.id, 
                      name: user.name, 
                      email: user.email,
                      avatar: user.avatar, 
                      role: 'MEMBER' as const, 
                      canEdit: false 
                  }
              ]
          };
          
          const newTripsList = trips.map(t => t.id === trip.id ? updatedTrip : t);
          updateTripsState(newTripsList);
          
          alert(`Você entrou no grupo "${trip.name}" com sucesso!`);
          handleSelectTrip(updatedTrip);
      } else {
          alert("Código de grupo inválido.");
      }
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
      const newTripsList = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
      updateTripsState(newTripsList);
      setSelectedTrip(updatedTrip);
  };

  const handleDeleteTrip = (tripId: string) => {
    const newTripsList = trips.filter(t => t.id !== tripId);
    updateTripsState(newTripsList);
    
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
    }
  };

  // Filter trips specific to the logged-in user
  const userTrips = user ? trips.filter(trip => 
    trip.members.some(member => member.userId === user.id)
  ) : [];

  return (
    <div className="min-h-screen bg-surface font-sans text-gray-800">
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onNavigate={(sectionId) => {
             if (currentView !== 'home') setCurrentView('home');
             setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        onDashboardClick={handleDashboardClick}
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {user && (
        <EditProfileModal 
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentUser={user}
          onSave={handleUpdateProfile}
        />
      )}

      {currentView === 'home' && (
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex flex-col items-center justify-center bg-gray-900 overflow-hidden pt-20 pb-10">
            <div className="absolute inset-0 opacity-50">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
                alt="Travel Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            
            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center gap-8">
              <div className="text-center max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                  Organize sua viagem em grupo<br />
                  <span className="text-primary-light text-teal-400">sem dor de cabeça.</span>
                </h1>
                <p className="text-lg text-gray-200 drop-shadow-sm max-w-2xl mx-auto">
                  Segurança para o organizador e transparência para os viajantes. Fale gratuitamente com nossos especialistas.
                </p>
              </div>

              <div className="w-full">
                <SearchWidget onSearch={handleSearch} />
              </div>
            </div>
          </section>

          {/* Results / Consultant Section */}
          <div id="results-section" className="bg-surface">
            {searchRequest && (
              <ConsultantRecommendation 
                params={searchRequest} 
                onContactClick={handleContactClick}
              />
            )}
          </div>

          <Destinations />
          <Packages />
          <AboutUs />

          <section className="bg-white py-20 border-t border-gray-100">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="bg-primary/10 p-4 rounded-full text-primary mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Segurança Total</h3>
                  <p className="text-gray-600">Ambiente criptografado para pagamentos e dados sensíveis dos viajantes. Acesso restrito ao organizador.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="bg-primary/10 p-4 rounded-full text-primary mb-6">
                    <Globe size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Tudo em Um Lugar</h3>
                  <p className="text-gray-600">Pesquise voos, alugue carros e reserve estadias sem sair da plataforma. Sincronize tudo no dashboard.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="bg-primary/10 p-4 rounded-full text-primary mb-6">
                    <Heart size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Para Grupos</h3>
                  <p className="text-gray-600">Ferramentas especializadas para dividir contas, votações de roteiro e gestão de documentos do grupo.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentView === 'dashboard' && user && (
        <OrganizerDashboard 
          user={user} 
          trips={userTrips}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onSelectTrip={handleSelectTrip}
          onCreateTrip={handleCreateTrip}
          onJoinTrip={handleJoinTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      )}

      {currentView === 'trip-details' && selectedTrip && user && (
          <TripDetails 
            trip={selectedTrip}
            currentUser={user}
            onBack={handleDashboardClick}
            onUpdateTrip={handleUpdateTrip}
          />
      )}
      
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 ViajaFácil Agência de Viagens Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;