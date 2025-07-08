import React, { useState } from 'react';
import { Headphones, BookOpen, Brain, Gift, Star, ChevronRight, Calculator, HelpCircle, CheckSquare, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import SleepCalculator from './SleepCalculator';
import HelpCenterScreen from './HelpCenterScreen';
import QuickTipsScreen from './QuickTipsScreen';
import ContactScreen from './ContactScreen';
import DreamStoryGame from './DreamStoryGame';

const MoreContent: React.FC = () => {
  const [showSleepCalculator, setShowSleepCalculator] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showDreamStory, setShowDreamStory] = useState(false);
  const { isDark } = useTheme();

  const handleOpenSleepCalculator = () => {
    setShowSleepCalculator(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseSleepCalculator = () => {
    setShowSleepCalculator(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHelpCenter = () => {
    setShowHelpCenter(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseHelpCenter = () => {
    setShowHelpCenter(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickTips = () => {
    setShowQuickTips(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseQuickTips = () => {
    setShowQuickTips(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    setShowContact(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseContact = () => {
    setShowContact(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDreamStory = () => {
    setShowDreamStory(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDreamStory = () => {
    setShowDreamStory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (showSleepCalculator) {
    return <SleepCalculator onBack={handleCloseSleepCalculator} />;
  }

  if (showHelpCenter) {
    return <HelpCenterScreen onBack={handleCloseHelpCenter} />;
  }

  if (showQuickTips) {
    return <QuickTipsScreen onBack={handleCloseQuickTips} />;
  }

  if (showContact) {
    return <ContactScreen onBack={handleCloseContact} />;
  }

  if (showDreamStory) {
    return <DreamStoryGame onBack={handleCloseDreamStory} />;
  }
  const bonusContent = [
    {
      id: 'guided-meditation',
      title: 'Meditação Guiada para Relaxamento e Sono',
      description: 'Uma meditação guiada relaxante para ajudar a acalmar sua mente e preparar seu corpo para uma noite de sono profundo e reparador.',
      icon: Headphones,
      badge: 'Novo',
      color: 'bg-purple-500/20 text-purple-400',
      image: 'https://i.imgur.com/chlTBoA.jpg'
    },
    {
      id: 'sleep-hygiene-checklist',
      title: 'Checklist de Higiene do Sono',
      description: 'Certifique-se de que todas as condições ideais para um sono perfeito estão sendo atendidas. Um checklist simples para garantir noites de descanso ideais.',
      icon: CheckSquare,
      badge: 'Popular',
      color: 'bg-blue-500/20 text-blue-400',
      image: 'https://i.imgur.com/c3JS5Pg.jpg'
    }
  ];

  const resources = [
    {
      title: 'Calculadora de Sono',
      description: 'Descubra seu horário ideal para dormir',
      icon: '🕒',
      onClick: handleOpenSleepCalculator
    },
    {
      title: 'Central de Ajuda',
      description: 'Encontre respostas para suas dúvidas',
      icon: '❓',
      onClick: handleOpenHelpCenter
    },
    {
      title: 'Dicas Rápidas',
      description: 'Técnicas para implementar hoje',
      icon: '💡',
      onClick: handleOpenQuickTips
    },
    {
      title: 'Dream Story',
      description: 'Histórias relaxantes para dormir',
      icon: <Gamepad2 className="w-6 h-6 text-purple-400" />,
      onClick: handleOpenDreamStory
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
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-emerald-400" />
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Mais Conteúdos</h1>
        </div>
        <p className={`transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-gray-600'
        }`}>Recursos extras para aprimorar seu sono</p>
      </header>

      {/* Bonus Content */}
      <section className="px-6 mb-8">
        <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Conteúdo Bônus</h2>
        <div className="space-y-4">
          {bonusContent.map((item) => (
            <div
              key={item.id}
              className={`backdrop-blur-sm rounded-2xl border transition-colors cursor-pointer overflow-hidden ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Image for items that have one */}
              {item.image && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${
                    isDark 
                      ? 'bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent' 
                      : 'bg-gradient-to-t from-white/90 via-white/30 to-transparent'
                  }`} />
                  
                  {/* Icon and Badge positioned at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl backdrop-blur-sm ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon for items without image */}
                  {!item.image && (
                    <div className={`p-3 rounded-xl ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{item.title}</h3>
                      {item.badge && !item.image && (
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`}>{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <Star className="w-4 h-4" />
                        <span>Conteúdo premium</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="px-6 mb-8">
        <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Recursos Úteis</h2>
        <div className="grid grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <div
              key={index}
              onClick={resource.onClick || undefined}
              className={`backdrop-blur-sm rounded-xl p-4 border transition-colors ${
                resource.onClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              } ${
                isDark 
                  ? `bg-slate-900/50 border-slate-800 ${resource.onClick ? 'hover:border-slate-700' : ''}` 
                  : `bg-white/80 border-gray-200 ${resource.onClick ? 'hover:border-gray-300' : ''}`
              }`}
            >
              <div className="text-2xl mb-2">
                {typeof resource.icon === 'string' ? resource.icon : resource.icon}
              </div>
              <h3 className={`font-medium mb-1 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{resource.title}</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>{resource.description}</p>
              {!resource.onClick && (
                <div className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Em breve
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 mb-8">
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
        }`}>
          <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Unlock Premium Content
          </h2>
          <p className={`text-sm mb-4 transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Acesse todos os recursos premium e acelere sua jornada para um sono perfeito.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
            Fazer Upgrade
          </button>
        </div>
      </section>

      {/* Help Section */}
      <section className="px-6 pb-8">
        <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Precisa de Ajuda?</h2>
        <div className="space-y-3">
          <button 
            onClick={handleOpenHelpCenter}
            className={`w-full border rounded-xl p-4 text-left transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50' 
                : 'bg-white/80 border-gray-200 hover:bg-gray-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Central de Ajuda</span>
              <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`} />
            </div>
          </button>
          
          <button 
            onClick={handleOpenContact}
            className={`w-full border rounded-xl p-4 text-left transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50' 
                : 'bg-white/80 border-gray-200 hover:bg-gray-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Contato</span>
              <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`} />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default MoreContent;