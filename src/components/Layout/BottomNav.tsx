import React from 'react';
import { Home, Play, BookOpen, Settings } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();
  
  const tabs = [
    { id: 'home', label: 'Principal', icon: Home },
    { id: 'continue', label: 'Continuar', icon: Play },
    { id: 'more', label: 'Mais conteúdos', icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    // Primeiro rolar para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Depois mudar a aba (com um pequeno delay para garantir que o scroll aconteça primeiro)
    setTimeout(() => {
      onTabChange(tabId);
    }, 50);
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 px-4 py-2 z-50 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-900 border-t border-slate-800' 
        : 'bg-white/90 backdrop-blur-sm border-t border-emerald-200/50 shadow-lg'
    }`}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? theme === 'dark'
                  ? 'text-emerald-400 bg-slate-800'
                  : 'text-emerald-600 bg-emerald-100/60'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-emerald-700 hover:text-emerald-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;