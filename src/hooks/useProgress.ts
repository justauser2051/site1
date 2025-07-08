import { useState, useEffect } from 'react';
import { Progress } from '../types';

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('sleep-app-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (moduleId: string, currentLesson: number, completedLessons: number) => {
    const newProgress = progress.filter(p => p.moduleId !== moduleId);
    newProgress.push({
      moduleId,
      currentLesson,
      completedLessons,
      lastWatched: new Date()
    });
    
    setProgress(newProgress);
    localStorage.setItem('sleep-app-progress', JSON.stringify(newProgress));
  };

  const getModuleProgress = (moduleId: string): Progress | undefined => {
    return progress.find(p => p.moduleId === moduleId);
  };

  const getRecentlyWatched = (): Progress[] => {
    return progress
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
      .slice(0, 5);
  };

  const getLastWatchedVideo = (): { moduleId: string; lessonIndex: number } | null => {
    if (progress.length === 0) return null;
    
    const mostRecent = progress
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())[0];
    
    return {
      moduleId: mostRecent.moduleId,
      lessonIndex: mostRecent.currentLesson
    };
  };

  const hasAnyProgress = (): boolean => {
    return progress.length > 0;
  };

  const resetAllProgress = () => {
    setProgress([]);
    localStorage.removeItem('sleep-app-progress');
  };

  return {
    progress,
    updateProgress,
    getModuleProgress,
    getRecentlyWatched,
    getLastWatchedVideo,
    hasAnyProgress,
    resetAllProgress
  };
};