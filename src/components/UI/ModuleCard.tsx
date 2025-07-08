import React from 'react';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { Module } from '../../types';
import { useProgress } from '../../hooks/useProgress';
import { useTheme } from '../../hooks/useTheme';

interface ModuleCardProps {
  module: Module;
  onSelect: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect }) => {
  const { getModuleProgress } = useProgress();
  const { isDark } = useTheme();
  const progress = getModuleProgress(module.id);
  const completionPercentage = progress ? Math.round((progress.completedLessons / module.lessons.length) * 100) : 0;

  const handleModuleClick = () => {
    onSelect(module.id);
  };

  return (
    <div 
      onClick={handleModuleClick}
      className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
      isDark 
        ? 'bg-slate-900 hover:shadow-emerald-500/20' 
        : 'bg-white/90 hover:shadow-emerald-500/10 border border-gray-200/50'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleModuleClick();
        }
      }}
      aria-label={`Acessar módulo: ${module.title}`}
    >
      <div className="aspect-[9/16] sm:aspect-[4/3] lg:aspect-[9/16] relative">
        <img
          src={module.coverImage}
          alt={module.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent' 
            : 'bg-gradient-to-t from-white via-white/70 to-transparent'
        }`} />
        
        {progress && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {completionPercentage}%
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{module.title}</h3>
        <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${
          isDark ? 'text-slate-300' : 'text-gray-700'
        }`}>{module.description}</p>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{module.lessons.length} aulas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~45 min</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitar duplo clique
              handleModuleClick();
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold transition-colors duration-200 text-sm sm:text-base"
          >
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;