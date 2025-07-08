import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface QuoteData {
  text: string;
  author: string;
}

const QuotesCarousel: React.FC = () => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const quotes: QuoteData[] = [
    {
      text: "A técnica militar que ensina soldados a dormir em 2 minutos, mesmo em condições extremas.",
      author: "Protocolo das Forças Armadas"
    },
    {
      text: "O sono é tão importante quanto a comida e a água. Ele é fundamental para o bom funcionamento do cérebro e para a manutenção da saúde.",
      author: "William Dement"
    },
    {
      text: "O sono reparador não é um luxo, é uma necessidade biológica. É um pilar essencial para a saúde mental, emocional e física.",
      author: "Matthew Walker"
    },
    {
      text: "A melhor maneira de passar o tempo é dormir bem, porque quando você acorda, o mundo está pronto para você.",
      author: "Thomas Edison"
    },
    {
      text: "A ciência do sono nos ensina que, quando negligenciamos o sono reparador, estamos comprometendo nossa saúde física e mental a longo prazo.",
      author: "Roger Ekirch"
    },
    {
      text: "O sono é a melhor medicação para o corpo e a mente.",
      author: "Hippocrates"
    },
    {
      text: "O controle da mente começa com o controle do corpo. Quando você controla sua respiração, você controla sua mente.",
      author: "Jocko Willink"
    },
    {
      text: "Controlar a respiração desbloqueia o potencial da mente e do corpo.",
      author: "Wim Hof"
    },
    {
      text: "Em momentos de estresse, controlar a mente e a respiração é essencial.",
      author: "Admiral William H. McRaven"
    },
    {
      text: "Controlar a respiração acalma a mente e traz presença.",
      author: "Shunryu Suzuki"
    },
    {
      text: "A atenção plena e o controle da respiração trazem clareza e tranquilidade.",
      author: "Jon Kabat-Zinn"
    }
  ];

  // Auto-play functionality - Updated to 10 seconds
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // Changed from 5000 to 10000 (10 seconds)

    return () => clearInterval(interval);
  }, [quotes.length, isAutoPlaying, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 15 seconds of manual interaction
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className={`rounded-2xl p-4 lg:p-6 border relative transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-900/30 to-slate-900/30 border-emerald-800/30' 
          : 'bg-gradient-to-r from-emerald-200/40 to-white/60 border-emerald-300/40 shadow-sm backdrop-blur-sm'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Quote Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/30'
        }`}>
          <Quote className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`} />
        </div>
      </div>

      {/* Current Quote Display */}
      <div className="text-center min-h-[100px] lg:min-h-[120px] flex items-center justify-center">
        <blockquote>
          <p className={`font-medium mb-3 italic text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-emerald-900'
          }`}>
            "{quotes[currentIndex].text}"
          </p>
          <footer className={`text-xs lg:text-sm font-bold transition-colors duration-300 ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            — {quotes[currentIndex].author}
          </footer>
        </blockquote>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevSlide}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDark 
              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
              : 'bg-white/60 hover:bg-emerald-100/60 text-emerald-700 hover:text-emerald-800 border border-emerald-200/30'
          }`}
          aria-label="Frase anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots indicator for larger screens */}
        <div className="hidden lg:flex space-x-1">
          {quotes.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex % 5
                  ? isDark ? 'bg-emerald-500' : 'bg-emerald-600'
                  : isDark
                    ? 'bg-slate-600 hover:bg-slate-500'
                    : 'bg-emerald-300 hover:bg-emerald-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDark 
              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
              : 'bg-white/60 hover:bg-emerald-100/60 text-emerald-700 hover:text-emerald-800 border border-emerald-200/30'
          }`}
          aria-label="Próxima frase"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuotesCarousel;