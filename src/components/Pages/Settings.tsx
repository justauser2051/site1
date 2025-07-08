import React, { useState } from 'react';
import { User, Bell, Moon, Sun, Shield, Info, LogOut, ChevronRight, BellRing, TestTube, CheckCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useProgress } from '../../hooks/useProgress';
import { useProfilePicture } from '../../hooks/useProfilePicture';
import { modules } from '../../data/modules';
import PrivacyScreen from './PrivacyScreen';
import DataStorageScreen from './DataStorageScreen';
import AboutScreen from './AboutScreen';
import HelpCenterScreen from './HelpCenterScreen';
import ProfileScreen from './ProfileScreen';

const Settings: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { logout, user } = useAuth();
  const { getRecentlyWatched } = useProgress();
  const { profilePicture, hasProfilePicture } = useProfilePicture();
  const { 
    notificationSettings, 
    toggleNotifications, 
    sendTestNotification,
    isNotificationSupported,
    hasPermission 
  } = useNotifications();

  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false);
  const [showDataStorageScreen, setShowDataStorageScreen] = useState(false);
  const [showAboutScreen, setShowAboutScreen] = useState(false);
  const [showHelpCenterScreen, setShowHelpCenterScreen] = useState(false);
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const [logoutStep, setLogoutStep] = useState<'confirm' | 'saving' | 'success'>('confirm');

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setLogoutStep('confirm');
  };

  // Calcular estatísticas reais do usuário
  const calculateUserStats = () => {
    const recentlyWatched = getRecentlyWatched();
    
    // Calcular total de aulas assistidas
    let totalLessonsWatched = 0;
    let totalLessonsAvailable = 0;
    let activeDays = 0;
    
    // Contar aulas assistidas e disponíveis
    modules.forEach(module => {
      totalLessonsAvailable += module.lessons.length;
      const progress = recentlyWatched.find(p => p.moduleId === module.id);
      if (progress) {
        totalLessonsWatched += progress.completedLessons;
      }
    });
    
    // Calcular dias ativos (baseado nas datas de visualização)
    const uniqueDates = new Set();
    recentlyWatched.forEach(progress => {
      const date = new Date(progress.lastWatched).toDateString();
      uniqueDates.add(date);
    });
    activeDays = uniqueDates.size;
    
    // Calcular porcentagem de progresso
    const progressPercentage = totalLessonsAvailable > 0 
      ? Math.round((totalLessonsWatched / totalLessonsAvailable) * 100)
      : 0;
    
    return {
      activeDays,
      lessonsWatched: totalLessonsWatched,
      progressPercentage
    };
  };

  const userStats = calculateUserStats();

  const handleConfirmLogout = async () => {
    try {
      // Passo 1: Mostrar que está salvando
      setLogoutStep('saving');
      
      // Simular processo de salvamento (o progresso já é salvo automaticamente via localStorage)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Passo 2: Mostrar sucesso brevemente
      setLogoutStep('success');
      
      // Aguardar apenas 800ms para mostrar a mensagem de sucesso
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Passo 3: Fazer logout imediatamente - isso deve redirecionar para a tela de login
      console.log('Executando logout...');
      logout();
      
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Em caso de erro, ainda fazer o logout
      logout();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
    setLogoutStep('confirm');
  };

  const handleToggleNotifications = async () => {
    setIsTogglingNotifications(true);
    try {
      await toggleNotifications();
    } catch (error) {
      console.error('Erro ao alterar configurações de notificação:', error);
    } finally {
      setIsTogglingNotifications(false);
    }
  };

  const handleTestNotification = () => {
    sendTestNotification();
  };

  const handlePrivacyClick = () => {
    setShowPrivacyScreen(true);
    // Rolar para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDataStorageClick = () => {
    setShowDataStorageScreen(true);
    // Rolar para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = () => {
    setShowAboutScreen(true);
    // Rolar para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHelpCenterClick = () => {
    setShowHelpCenterScreen(true);
    // Rolar para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    setShowProfileScreen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromPrivacy = () => {
    setShowPrivacyScreen(false);
    // Rolar para o topo quando voltar para as configurações
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDataStorage = () => {
    setShowDataStorageScreen(false);
    // Rolar para o topo quando voltar para as configurações
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromAbout = () => {
    setShowAboutScreen(false);
    // Rolar para o topo quando voltar para as configurações
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromHelpCenter = () => {
    setShowHelpCenterScreen(false);
    // Rolar para o topo quando voltar para as configurações
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProfile = () => {
    setShowProfileScreen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Se estiver mostrando a tela de privacidade, renderizar ela
  if (showPrivacyScreen) {
    return <PrivacyScreen onBack={handleBackFromPrivacy} />;
  }

  // Se estiver mostrando a tela de dados e armazenamento, renderizar ela
  if (showDataStorageScreen) {
    return <DataStorageScreen onBack={handleBackFromDataStorage} />;
  }

  // Se estiver mostrando a tela sobre o aplicativo, renderizar ela
  if (showAboutScreen) {
    return <AboutScreen onBack={handleBackFromAbout} />;
  }

  // Se estiver mostrando a tela da central de ajuda, renderizar ela
  if (showHelpCenterScreen) {
    return <HelpCenterScreen onBack={handleBackFromHelpCenter} />;
  }

  // Se estiver mostrando a tela de perfil, renderizar ela
  if (showProfileScreen) {
    return <ProfileScreen onBack={handleBackFromProfile} />;
  }

  // Modal de confirmação e processo de logout
  if (showLogoutConfirmation) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
      }`}>
        <div className={`backdrop-blur-sm rounded-2xl p-8 border max-w-md w-full transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800' 
            : 'bg-white/90 border-gray-200 shadow-lg'
        }`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {logoutStep === 'saving' ? (
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              ) : logoutStep === 'success' ? (
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              ) : (
                <LogOut className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            
            {logoutStep === 'success' ? (
              <>
                <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Progresso Salvo! ✅
                </h2>
                <p className={`text-sm mb-6 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Seu progresso foi salvo com sucesso! Redirecionando para o login...
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                  <span>Saindo da conta...</span>
                </div>
              </>
            ) : logoutStep === 'saving' ? (
              <>
                <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Salvando Progresso...
                </h2>
                <p className={`text-sm mb-6 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Aguarde enquanto salvamos seu progresso de forma segura.
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                  <span>Dados sendo preservados...</span>
                </div>
              </>
            ) : (
              <>
                <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Sair da Conta?
                </h2>
                <p className={`text-sm mb-6 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Tem certeza de que deseja sair? Seu progresso será salvo automaticamente 
                  e você poderá continuar de onde parou quando fizer login novamente.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelLogout}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Confirmar Saída
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const settingsGroups = [
    {
      title: 'Conta',
      items: [
        { 
          id: 'profile', 
          label: 'Perfil', 
          icon: User, 
          action: 'profile-click',
          description: 'Visualize suas informações de conta'
        }
      ]
    },
    {
      title: 'Notificações',
      items: [
        { 
          id: 'notifications', 
          label: 'Notificações de Progresso', 
          icon: Bell, 
          action: 'notification-toggle',
          description: 'Receba lembretes personalizados sobre seu progresso',
          value: notificationSettings.enabled,
          isLoading: isTogglingNotifications
        }
      ]
    },
    {
      title: 'Aparência',
      items: [
        { 
          id: 'theme', 
          label: 'Tema do Aplicativo', 
          icon: isDark ? Moon : Sun, 
          action: 'theme-slider',
          description: 'Escolha entre modo escuro e claro'
        }
      ]
    },
    {
      title: 'Privacidade',
      items: [
        { 
          id: 'privacy', 
          label: 'Privacidade', 
          icon: Shield, 
          action: 'privacy-click',
          description: 'Saiba como protegemos seus dados'
        },
        { 
          id: 'data', 
          label: 'Dados e armazenamento', 
          icon: Info, 
          action: 'data-storage-click',
          description: 'Entenda como seus dados são armazenados'
        }
      ]
    },
    {
      title: 'Suporte',
      items: [
        { 
          id: 'help', 
          label: 'Central de ajuda', 
          icon: Info, 
          action: 'help-center-click',
          description: 'Encontre respostas para suas dúvidas'
        },
        { 
          id: 'about', 
          label: 'Sobre o app', 
          icon: Info, 
          action: 'about-click',
          description: 'Conheça mais sobre o Sleep Protocol'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Header */}
      <header className={`px-6 py-8 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900/50 to-transparent' 
          : 'bg-gradient-to-b from-gray-100/50 to-transparent'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg">
            {hasProfilePicture ? (
              <img
                src={profilePicture!}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className={`text-xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Cliente Sleep Protocol</h1>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>{user?.email}</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/50 border-slate-800' 
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{userStats.activeDays}</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>Dias ativos</div>
          </div>
          <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/50 border-slate-800' 
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{userStats.lessonsWatched}</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>Aulas assistidas</div>
          </div>
          <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/50 border-slate-800' 
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{userStats.progressPercentage}%</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>Progresso</div>
          </div>
        </div>
      </header>

      {/* Settings Groups */}
      <div className="px-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{group.title}</h2>
            <div className={`backdrop-blur-sm rounded-2xl border overflow-hidden transition-colors duration-300 ${
              isDark 
                ? 'bg-slate-900/50 border-slate-800' 
                : 'bg-white/80 border-gray-200 shadow-sm'
            }`}>
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  onClick={
                    item.action === 'privacy-click' 
                      ? handlePrivacyClick 
                      : item.action === 'data-storage-click'
                        ? handleDataStorageClick
                        : item.action === 'about-click'
                          ? handleAboutClick
                          : item.action === 'help-center-click'
                            ? handleHelpCenterClick
                            : item.action === 'profile-click'
                              ? handleProfileClick
                            : undefined
                  }
                  className={`flex items-center justify-between p-4 transition-colors ${
                    itemIndex !== group.items.length - 1 
                      ? isDark 
                        ? 'border-b border-slate-800' 
                        : 'border-b border-gray-200'
                      : ''
                  } ${
                    item.action === 'navigate' || item.action === 'privacy-click' || item.action === 'data-storage-click' || item.action === 'about-click' || item.action === 'help-center-click' || item.action === 'profile-click'
                      ? isDark 
                        ? 'hover:bg-slate-800/50 cursor-pointer' 
                        : 'hover:bg-gray-100/50 cursor-pointer'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <span className={`font-medium transition-colors duration-300 block ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{item.label}</span>
                      {item.description && (
                        <span className={`text-sm transition-colors duration-300 ${
                          isDark ? 'text-slate-400' : 'text-gray-600'
                        }`}>{item.description}</span>
                      )}
                    </div>
                  </div>
                  
                  {item.action === 'notification-toggle' && (
                    <div className="flex items-center gap-3">
                      {/* Test Notification Button */}
                      {notificationSettings.enabled && hasPermission && (
                        <button
                          onClick={handleTestNotification}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                          title="Testar notificação"
                        >
                          <TestTube className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Toggle Button */}
                      <button
                        onClick={handleToggleNotifications}
                        disabled={isTogglingNotifications || !isNotificationSupported}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.enabled ? 'bg-emerald-500' : isDark ? 'bg-slate-600' : 'bg-gray-300'
                        } ${!isNotificationSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div
                          className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform flex items-center justify-center ${
                            notificationSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        >
                          {isTogglingNotifications ? (
                            <div className="w-2 h-2 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : notificationSettings.enabled ? (
                            <BellRing className="w-2 h-2 text-emerald-600" />
                          ) : (
                            <Bell className="w-2 h-2 text-slate-400" />
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                  
                  {item.action === 'theme-slider' && (
                    <div className="flex flex-col items-end gap-2">
                      {/* Theme Slider */}
                      <button
                        onClick={toggleTheme}
                        className={`relative w-20 h-10 rounded-full border-2 transition-all duration-300 overflow-hidden ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700' 
                            : 'bg-gray-200 border-gray-300'
                        }`}
                        title="Mude entre o modo escuro e claro para personalizar a sua experiência visual."
                      >
                        {/* Background gradient */}
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 bg-slate-800 flex items-center justify-center">
                            <Moon className="w-4 h-4 text-slate-300" />
                          </div>
                          <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                            <Sun className="w-4 h-4 text-gray-700" />
                          </div>
                        </div>
                        
                        {/* Sliding indicator */}
                        <div
                          className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border ${
                            isDark 
                              ? 'translate-x-1 border-slate-600' 
                              : 'translate-x-11 border-gray-300'
                          }`}
                        >
                          {isDark ? (
                            <Moon className="w-4 h-4 text-slate-700" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </button>
                      
                      {/* Current mode label */}
                      <span className={`text-xs font-medium transition-colors duration-300 ${
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {isDark ? 'Modo Escuro' : 'Modo Claro'}
                      </span>
                    </div>
                  )}
                  
                  {(item.action === 'navigate' || item.action === 'privacy-click' || item.action === 'data-storage-click' || item.action === 'about-click' || item.action === 'help-center-click' || item.action === 'profile-click') && (
                    <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notification Status Info */}
        {notificationSettings.enabled && (
          <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-emerald-100/80 border-emerald-300/50 shadow-sm'
          }`}>
            <div className="flex items-start gap-3">
              <BellRing className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={`font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Notificações Ativadas</h3>
                <div className={`text-sm space-y-1 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <p>✅ Lembretes de progresso incompleto</p>
                  <p>✅ Alertas de inatividade (após 24h)</p>
                  <p>✅ Mensagens motivacionais personalizadas</p>
                </div>
                {!hasPermission && (
                  <div className={`mt-3 p-3 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-amber-100/80 border-amber-300/50'
                  }`}>
                    <p className="text-amber-400 text-sm">
                      ⚠️ Permissão de notificação necessária. Clique no botão para ativar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isNotificationSupported && (
          <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-red-100/80 border-red-300/50 shadow-sm'
          }`}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className={`font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Notificações Não Suportadas</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Seu navegador não suporta notificações push. Para receber lembretes, 
                  use um navegador moderno como Chrome, Firefox ou Safari.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="px-6 py-8">
        <button 
          onClick={handleLogoutClick}
          className={`w-full border rounded-xl p-4 text-left transition-colors group ${
            isDark 
              ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30' 
              : 'bg-red-100/80 border-red-300/50 hover:bg-red-200/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
              <div>
                <span className="text-red-400 font-medium block">Sair da Conta</span>
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Seu progresso será salvo automaticamente</span>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`} />
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="px-6 pb-8">
        <div className={`text-center text-sm transition-colors duration-300 ${
          isDark ? 'text-slate-500' : 'text-gray-500'
        }`}>
          <p>Sleep Protocol App</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;