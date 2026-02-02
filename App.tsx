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
import { ShieldCheck, Globe, Heart, AlertCircle } from 'lucide-react';
import { 
  generateGroupCode, 
  subscribeToAuth,
  subscribeToTrips,
  logoutUser,
  createNewTrip,
  updateTripInDb,
  deleteTripFromDb,
  updateUserProfile
} from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'trip-details'>('home');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchRequest, setSearchRequest] = useState<SearchParams | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Trips Listener
  useEffect(() => {
    if (user) {
      setDbError(null); // Reset error on new user
      const unsubscribeTrips = subscribeToTrips(
        user.id, 
        (updatedTrips) => {
          setTrips(updatedTrips);
          setDbError(null);
          
          if (selectedTrip) {
              const updatedSelected = updatedTrips.find(t => t.id === selectedTrip.id);
              if (updatedSelected) {
                  setSelectedTrip(updatedSelected);
              } else if (currentView === 'trip-details') {
                  setCurrentView('dashboard');
                  setSelectedTrip(null);
              }
          }
        },
        (error) => {
            console.error("Trips access error:", error);
            if (error.code === 'permission-denied') {
                setDbError("Erro de Permissão: Configure as regras do Firestore no console do Firebase.");
            } else {
                setDbError("Erro de conexão com o banco de dados.");
            }
        }
      );
      return () => unsubscribeTrips();
    } else {
      setTrips([]);
      setDbError(null);
    }
  }, [user, selectedTrip?.id]);

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
    setIsLoginOpen(false);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (user) {
      await updateUserProfile(user.id, updatedData);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
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

  const handleCreateTrip = async () => {
      if (!user) return;
      const newTrip: Trip = {
          id: Date.now().toString(),
          code: generateGroupCode(),
          name: 'Nova Viagem em Grupo',
          dates: 'A definir',
          status: 'planning',
          budget: 0,
          spent: 0,
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
      
      await createNewTrip(newTrip);
      // Wait slightly or just let the subscription handle it. 
      // For immediate UI feedback, we can select it, but it might not be in 'trips' yet if offline.
      handleSelectTrip(newTrip); 
  };

  const handleJoinTrip = async (code: string) => {
      if (!user) return;
      alert("Para entrar em um grupo, peça ao administrador para adicionar seu email: " + user.email + "\n\n(A funcionalidade de entrar via código requer configuração de Regras Avançadas no Firebase)");
  };

  const handleUpdateTrip = async (updatedTrip: Trip) => {
      await updateTripInDb(updatedTrip);
  };

  const handleDeleteTrip = async (tripId: string) => {
    await deleteTripFromDb(tripId);
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
    }
  };

  if (authLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-primary">Carregando...</div>;
  }

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

      {/* Global Error Banner */}
      {dbError && (
        <div className="bg-red-50 border-b border-red-200 p-3 mt-20">
            <div className="container mx-auto px-4 flex items-center justify-between text-red-700">
                <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{dbError}</span>
                </div>
            </div>
        </div>
      )}

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
          trips={trips}
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