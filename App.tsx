import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { SearchWidget } from './components/search/SearchWidget';
import { LoginModal } from './components/auth/LoginModal';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { ConsultantRecommendation } from './components/search/ConsultantRecommendation';
import { OrganizerDashboard } from './components/dashboard/OrganizerDashboard';
import { Destinations } from './components/sections/Destinations';
import { Packages } from './components/sections/Packages';
import { AboutUs } from './components/sections/AboutUs';
import { User, SearchParams } from './types';
import { ShieldCheck, Globe, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  
  // State to hold the user's search intent to display to the consultant
  const [searchRequest, setSearchRequest] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setSearchRequest(params);
    // If user is logged in and on dashboard, switch to home to see results? 
    // Or just scroll. Since widget is on Home, we ensure we are on Home.
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
    if (!user) {
       // Optional logic
    }
    alert(`Redirecionando para o WhatsApp do consultor com os detalhes: ${searchRequest?.destination}`);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (!searchRequest) {
      setCurrentView('dashboard');
    }
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const handleLogout = () => {
    setUser(null);
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

  const handleNavigate = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      // Timeout to allow render before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-gray-800">
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigate}
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

          {/* New Content Sections */}
          <Destinations />
          <Packages />
          <AboutUs />

          {/* Institutional / Trust Section */}
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
          onEditProfile={() => setIsEditProfileOpen(true)}
        />
      )}
      
      {/* Simple Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 ViajaFácil Agência de Viagens Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;