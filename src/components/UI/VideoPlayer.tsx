import React, { useEffect, useRef } from 'react';
import { Play, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Lesson } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface VideoPlayerProps {
  lesson: Lesson;
  onProgress?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  showNextArrow?: boolean;
  showPreviousArrow?: boolean;
  isLastLesson?: boolean;
  isLastModule?: boolean;
  isFirstLesson?: boolean;
  isFirstModule?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  lesson, 
  onProgress, 
  onNextLesson, 
  onPreviousLesson,
  showNextArrow = false,
  showPreviousArrow = false,
  isLastLesson = false,
  isLastModule = false,
  isFirstLesson = false,
  isFirstModule = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    // Add YouTube API script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getNextArrowTooltip = () => {
    if (isLastLesson && isLastModule) {
      return 'Ver mensagem de parabéns';
    } else if (isLastLesson) {
      return 'Ir para próximo módulo';
    } else {
      return 'Próxima aula';
    }
  };

  const getPreviousArrowTooltip = () => {
    if (isFirstLesson && !isFirstModule) {
      return 'Voltar ao módulo anterior';
    } else if (!isFirstLesson) {
      return 'Aula anterior';
    } else {
      return 'Primeira aula';
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg relative transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white/90 border border-emerald-200/30'
    }`}>
      <div className="aspect-video relative">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${lesson.videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=0&mute=0&loop=0&color=white&iv_load_policy=3&fs=1&hl=pt&cc_lang_pref=pt&cc_load_policy=1`}
          title={lesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
        {/* Previous Lesson Arrow Popup */}
        {showPreviousArrow && onPreviousLesson && !(isFirstLesson && isFirstModule) && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <div className="group relative">
              <button
                onClick={onPreviousLesson}
                className="bg-black/20 hover:bg-black/40 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className={`text-sm px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm border ${
                  isDark 
                    ? 'bg-slate-800/95 text-white border-slate-700' 
                    : 'bg-white/95 text-emerald-900 border-emerald-200'
                }`}>
                  {getPreviousArrowTooltip()}
                  <div className={`absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 ${
                    isDark 
                      ? 'border-r-4 border-r-slate-800/95 border-t-4 border-t-transparent border-b-4 border-b-transparent' 
                      : 'border-r-4 border-r-white/95 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Next Lesson Arrow Popup */}
        {showNextArrow && onNextLesson && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <div className="group relative">
              <button
                onClick={onNextLesson}
                className="bg-black/20 hover:bg-black/40 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className={`text-sm px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm border ${
                  isDark 
                    ? 'bg-slate-800/95 text-white border-slate-700' 
                    : 'bg-white/95 text-emerald-900 border-emerald-200'
                }`}>
                  {getNextArrowTooltip()}
                  <div className={`absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 ${
                    isDark 
                      ? 'border-l-4 border-l-slate-800/95 border-t-4 border-t-transparent border-b-4 border-b-transparent' 
                      : 'border-l-4 border-l-white/95 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-emerald-900'
          }`}>{lesson.title}</h3>
          {lesson.completed && (
            <CheckCircle className={`w-6 h-6 transition-colors duration-300 ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`} />
          )}
        </div>
        
        <div className={`flex items-center gap-4 text-sm transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-emerald-700'
        }`}>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            lesson.completed
              ? isDark
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-500/20 text-emerald-600'
              : isDark
                ? 'bg-slate-700 text-slate-300'
                : 'bg-emerald-200/50 text-emerald-700'
          }`}>
            {lesson.completed ? 'Concluída' : 'Não assistida'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;