import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Play, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { modules } from '../../data/modules';
import { useProgress } from '../../hooks/useProgress';
import { useTheme } from '../../hooks/useTheme';
import VideoPlayer from '../UI/VideoPlayer';

interface ModuleProps {
  moduleId: string;
  initialLessonIndex?: number;
  onBack: () => void;
  onSelectModule?: (moduleId: string, lessonIndex?: number) => void;
}

const Module: React.FC<ModuleProps> = ({ moduleId, initialLessonIndex = 0, onBack, onSelectModule }) => {
  const module = modules.find(m => m.id === moduleId);
  const { getModuleProgress, updateProgress } = useProgress();
  const { isDark } = useTheme();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(initialLessonIndex);
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const nextModuleButtonRef = useRef<HTMLDivElement>(null);
  const congratulationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedLessonIndex(initialLessonIndex);
    
    // Se estamos começando um novo módulo na aula 1, rolar para o player
    if (initialLessonIndex === 0) {
      setTimeout(() => {
        scrollToVideoPlayer();
      }, 300); // Delay para garantir que o componente foi renderizado
    }
  }, [initialLessonIndex, moduleId]);

  if (!module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={`transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-emerald-900'
        }`}>Módulo não encontrado</p>
      </div>
    );
  }

  const progress = getModuleProgress(moduleId);
  const completedLessons = progress?.completedLessons || 0;
  const completionPercentage = Math.round((completedLessons / module.lessons.length) * 100);
  
  // Verificar se todas as aulas foram completadas
  const isModuleCompleted = completedLessons >= module.lessons.length;
  
  // Encontrar o próximo módulo
  const currentModuleIndex = modules.findIndex(m => m.id === moduleId);
  const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null;
  const previousModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
  const nextModuleNumber = currentModuleIndex + 2; // +2 porque o índice começa em 0
  const isLastModule = currentModuleIndex === modules.length - 1;
  const isFirstModule = currentModuleIndex === 0;

  const scrollToVideoPlayer = () => {
    if (videoPlayerRef.current) {
      const headerHeight = 120; // Altura aproximada do header fixo
      const elementTop = videoPlayerRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToNextModuleButton = () => {
    if (nextModuleButtonRef.current) {
      const headerHeight = 120;
      const elementTop = nextModuleButtonRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToCongratulations = () => {
    if (congratulationsRef.current) {
      const headerHeight = 120;
      const elementTop = congratulationsRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLessonSelect = (index: number) => {
    setSelectedLessonIndex(index);
    // Marcar a aula como assistida quando selecionada
    const newCompletedLessons = Math.max(completedLessons, index + 1);
    updateProgress(moduleId, index, newCompletedLessons);
    
    // Scroll para o player de vídeo após uma pequena pausa para garantir que o estado foi atualizado
    setTimeout(() => {
      scrollToVideoPlayer();
    }, 100);
  };

  const handleLessonComplete = () => {
    // Marcar a aula atual como concluída
    const newCompletedLessons = Math.max(completedLessons, selectedLessonIndex + 1);
    updateProgress(moduleId, selectedLessonIndex, newCompletedLessons);
  };

  const handleNextModule = () => {
    if (nextModule && onSelectModule) {
      // Sempre começar do lesson index 0 (primeira aula) do próximo módulo
      onSelectModule(nextModule.id, 0);
    }
  };

  const handleNextLesson = () => {
    const isCurrentLessonLast = selectedLessonIndex === module.lessons.length - 1;
    
    if (isCurrentLessonLast) {
      // Se é a última aula do módulo
      if (isLastModule) {
        // Se é o último módulo, rolar para a mensagem de parabéns
        setTimeout(() => {
          scrollToCongratulations();
        }, 100);
      } else {
        // Se não é o último módulo, rolar para o botão "Seguir para o módulo X"
        setTimeout(() => {
          scrollToNextModuleButton();
        }, 100);
      }
    } else {
      // Se não é a última aula, ir para a próxima aula
      const nextLessonIndex = selectedLessonIndex + 1;
      handleLessonSelect(nextLessonIndex);
    }
  };

  const handlePreviousLesson = () => {
    const isCurrentLessonFirst = selectedLessonIndex === 0;
    
    if (isCurrentLessonFirst && !isFirstModule) {
      // Se é a primeira aula do módulo e não é o primeiro módulo, ir para o módulo anterior
      if (previousModule && onSelectModule) {
        // Ir para a última aula do módulo anterior
        const lastLessonIndex = previousModule.lessons.length - 1;
        onSelectModule(previousModule.id, lastLessonIndex);
      }
    } else if (!isCurrentLessonFirst) {
      // Se não é a primeira aula, ir para a aula anterior
      const previousLessonIndex = selectedLessonIndex - 1;
      handleLessonSelect(previousLessonIndex);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-emerald-200/50'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800 text-white' 
                  : 'hover:bg-emerald-100 text-emerald-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className={`text-lg font-bold line-clamp-1 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                {module.title}
              </h1>
              <div className={`flex items-center gap-4 text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-emerald-700'
              }`}>
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  <span>{module.lessons.length} aulas</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completionPercentage}% concluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`px-6 py-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-900/50' : 'bg-emerald-50/50'
      }`}>
        <div className={`rounded-full h-2 mb-2 transition-colors duration-300 ${
          isDark ? 'bg-slate-800' : 'bg-emerald-200/50'
        }`}>
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className={`text-sm text-center transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-emerald-700'
        }`}>
          {completedLessons} de {module.lessons.length} aulas concluídas
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Current Video */}
        <div ref={videoPlayerRef} className="mb-8 scroll-mt-32">
          <VideoPlayer
            lesson={module.lessons[selectedLessonIndex]}
            onProgress={handleLessonComplete}
            onNextLesson={handleNextLesson}
            onPreviousLesson={handlePreviousLesson}
            showNextArrow={true}
            showPreviousArrow={true}
            isLastLesson={selectedLessonIndex === module.lessons.length - 1}
            isLastModule={isLastModule}
            isFirstLesson={selectedLessonIndex === 0}
            isFirstModule={isFirstModule}
          />
        </div>

        {/* Lessons List */}
        <div className="space-y-4 mb-8">
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-emerald-900'
          }`}>
            <BookOpen className="w-5 h-5" />
            Aulas do Módulo
          </h2>
          
          {module.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => handleLessonSelect(index)}
              className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                index === selectedLessonIndex
                  ? isDark
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                    : 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/60 text-emerald-900 shadow-md'
                  : isDark
                    ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    : 'bg-white/70 border-emerald-200/50 text-emerald-800 hover:bg-emerald-50/50 hover:border-emerald-300/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < completedLessons
                      ? 'bg-emerald-500 text-white'
                      : index === selectedLessonIndex
                      ? isDark
                        ? 'bg-emerald-500/30 text-emerald-400'
                        : 'bg-emerald-600/30 text-emerald-700'
                      : isDark
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-emerald-200/50 text-emerald-600'
                  }`}>
                    {index < completedLessons ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{lesson.title}</p>
                    <div className="flex items-center gap-2 text-sm opacity-75">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  index < completedLessons
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : index === selectedLessonIndex
                    ? isDark
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-emerald-600/20 text-emerald-700'
                    : isDark
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-emerald-200/50 text-emerald-600'
                }`}>
                  {index < completedLessons ? 'Concluída' : index === selectedLessonIndex ? 'Assistindo' : 'Pendente'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Next Module Button - Only show if module is completed and there's a next module */}
        {isModuleCompleted && nextModule && (
          <div ref={nextModuleButtonRef} className={`rounded-2xl p-6 border text-center scroll-mt-32 transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' 
              : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-400/40 shadow-sm'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className={`w-6 h-6 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
              <h3 className={`text-lg font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>Módulo Concluído!</h3>
            </div>
            <p className={`text-sm mb-4 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-emerald-800'
            }`}>
              Parabéns! Você completou todas as aulas deste módulo.
            </p>
            <button
              onClick={handleNextModule}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto"
            >
              <span>Seguir para o Módulo {nextModuleNumber}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Module Completed - No Next Module */}
        {isModuleCompleted && !nextModule && (
          <div ref={congratulationsRef} className={`rounded-2xl p-6 border text-center scroll-mt-32 transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' 
              : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-400/40 shadow-sm'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className={`w-6 h-6 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
              <h3 className={`text-lg font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>Parabéns!</h3>
            </div>
            <p className={`text-sm mb-4 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-emerald-800'
            }`}>
              Você completou todos os módulos do Sleep Protocol! 🎉
            </p>
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-emerald-700'
            }`}>
              Continue praticando as técnicas aprendidas para manter uma rotina de sono saudável.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Module;