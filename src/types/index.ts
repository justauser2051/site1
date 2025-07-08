export interface Module {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  completed: boolean;
}

export interface Progress {
  moduleId: string;
  currentLesson: number;
  completedLessons: number;
  lastWatched: Date;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  notifications: boolean;
  darkMode: boolean;
}