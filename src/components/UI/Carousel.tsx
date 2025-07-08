import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Module } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import ModuleCard from './ModuleCard';

interface CarouselProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({ modules, onSelectModule }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % modules.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [modules.length, isAutoPlaying, isDragging]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTranslateX(0);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % modules.length);
    setIsAutoPlaying(false);
    setTranslateX(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + modules.length) % modules.length);
    setIsAutoPlaying(false);
    setTranslateX(0);
  };

  // Touch/Mouse events for swipe functionality
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setIsAutoPlaying(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const diff = clientX - startX;
    const maxTranslate = carouselRef.current?.offsetWidth || 0;
    const clampedTranslate = Math.max(-maxTranslate * 0.3, Math.min(maxTranslate * 0.3, diff));
    setTranslateX(clampedTranslate);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = 50;
    
    if (translateX > threshold) {
      prevSlide();
    } else if (translateX < -threshold) {
      nextSlide();
    } else {
      setTranslateX(0);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  return (
    <div className="relative w-full max-w-sm mx-auto sm:max-w-md">
      <div 
        ref={carouselRef}
        className="overflow-hidden rounded-2xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex transition-transform duration-300 ease-out ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            transitionDuration: isDragging ? '0ms' : '300ms'
          }}
        >
          {modules.map((module) => (
            <div key={module.id} className="w-full flex-shrink-0">
              <ModuleCard module={module} onSelect={onSelectModule} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 z-10 backdrop-blur-sm ${
          isDark 
            ? 'bg-slate-800/80 hover:bg-slate-700 text-white' 
            : 'bg-white/90 hover:bg-gray-100 text-gray-900 border border-gray-200/50'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 z-10 backdrop-blur-sm ${
          isDark 
            ? 'bg-slate-800/80 hover:bg-slate-700 text-white' 
            : 'bg-white/90 hover:bg-gray-100 text-gray-900 border border-gray-200/50'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {modules.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-emerald-500 w-8'
                : isDark
                  ? 'bg-slate-600 hover:bg-slate-500 w-3'
                  : 'bg-gray-300 hover:bg-gray-400 w-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;