import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Moon, Sun, Coffee, Smartphone, Bed, Volume2, VolumeX, Star, Award, Heart, Users, Briefcase, Home, Dumbbell, Utensils, Droplets, Bath, Tv, Book, ChevronLeft, ChevronRight, Clock, Save, Pause, Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface Situacao {
  id: number;
  titulo: string;
  mensagem: string;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  opcoes: {
    sim: {
      efeitos: {
        saude?: number;
        sono?: number;
        energia?: number;
        produtividade?: number;
        social?: number;
      };
      pontuacao: number;
      mensagem: string;
    };
    nao: {
      efeitos: {
        saude?: number;
        sono?: number;
        energia?: number;
        produtividade?: number;
        social?: number;
      };
      pontuacao: number;
      mensagem: string;
    };
  };
}

interface DreamStoryGameProps {
  onBack: () => void;
}

interface GameState {
  score: number;
  currentDay: number;
  currentWeek: number;
  gameTime: Date; // Game time (24h cycle, 7 weeks total)
  gameCompleted: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  isPaused: boolean;
  currentRoom: string;
  alex: {
    health: number;
    energy: number;
    sleepQuality: number;
    relationships: number;
    productivity: number;
    mood: 'happy' | 'tired' | 'stressed' | 'relaxed';
  };
  dailyActions: {
    sleep: boolean;
    eat: boolean;
    exercise: boolean;
    relax: boolean;
    drinkWater: boolean;
    shower: boolean;
  };
  lastActionTime: Date;
  situacoesOcorridas: number[];
}

interface Room {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  actions: RoomAction[];
  description: string;
  background: string;
}

interface RoomAction {
  id: keyof GameState['dailyActions'];
  name: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  description: string;
}

const DreamStoryGame: React.FC<DreamStoryGameProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showConfirmation, setShowConfirmation] = useState<{
    show: boolean;
    action: string;
    actionId: keyof GameState['dailyActions'];
    room: string;
  }>({ show: false, action: '', actionId: 'sleep', room: '' });
  
  const [showFeedback, setShowFeedback] = useState<{
    show: boolean;
    message: string;
    type: 'positive' | 'negative';
  }>({ show: false, message: '', type: 'positive' });
  
  const [alexAnimation, setAlexAnimation] = useState<string>('idle');
  const [musicLoaded, setMusicLoaded] = useState(false);
  
  const [showSituacao, setShowSituacao] = useState<{
    show: boolean;
    situacao: Situacao | null;
  }>({ show: false, situacao: null });
  
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const [showCriticalState, setShowCriticalState] = useState<{
    show: boolean;
    factor: string;
    message: string;
  }>({ show: false, factor: '', message: '' });
  
  const [lastDegradationDay, setLastDegradationDay] = useState(1);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentDay: 1,
    currentWeek: 1,
    gameTime: new Date(2024, 0, 1, 7, 0, 0), // Start at 7:00 AM, Week 1 (2 weeks total)
    gameCompleted: false,
    soundEnabled: true,
    musicEnabled: true,
    isPaused: false,
    currentRoom: 'bedroom',
    alex: {
      health: 50,
      energy: 50,
      sleepQuality: 50,
      relationships: 50,
      productivity: 50,
      mood: 'happy'
    },
    dailyActions: {
      sleep: false,
      eat: false,
      exercise: false,
      relax: false,
      drinkWater: false,
      shower: false
    },
    lastActionTime: new Date(),
    situacoesOcorridas: []
  });

  // 10 situações únicas distribuídas ao longo de 2 semanas
  const situacoes: Situacao[] = [
    {
      id: 1,
      titulo: "Almoço pesado na segunda",
      mensagem: "Segunda-feira no início da tarde. Alex está cansado e pensa em pedir uma feijoada no delivery para animar o dia.",
      dia_semana: "segunda",
      horario_inicio: "12:00",
      horario_fim: "13:00",
      opcoes: {
        sim: {
          efeitos: { saude: -1, energia: 1, sono: -1 },
          pontuacao: -15,
          mensagem: "A comida estava saborosa, mas Alex ficou sonolento e pesado pelo resto do dia."
        },
        nao: {
          efeitos: { saude: 1, produtividade: 1 },
          pontuacao: 15,
          mensagem: "Alex optou por uma refeição leve e se sentiu mais disposto e focado depois."
        }
      }
    },
    {
      id: 2,
      titulo: "Aula de yoga no parque",
      mensagem: "Terça-feira ao amanhecer. Um grupo está fazendo yoga no parque perto da casa de Alex. Ele pode se juntar?",
      dia_semana: "terça",
      horario_inicio: "06:30",
      horario_fim: "07:30",
      opcoes: {
        sim: {
          efeitos: { saude: 2, sono: -1, energia: -1 },
          pontuacao: 15,
          mensagem: "Alex se alongou e sentiu o corpo mais leve, mesmo com um pouco de sono."
        },
        nao: {
          efeitos: { sono: 1, energia: 1 },
          pontuacao: 20,
          mensagem: "Alex dormiu mais uma hora e começou o dia bem descansado."
        }
      }
    },
    {
      id: 3,
      titulo: "Reunião estressante no trabalho",
      mensagem: "Quarta-feira à tarde. O chefe de Alex marcou uma reunião extra e opcional sobre metas. Alex pode participar ou ignorar.",
      dia_semana: "quarta",
      horario_inicio: "15:00",
      horario_fim: "16:30",
      opcoes: {
        sim: {
          efeitos: { produtividade: 2, saude: -1 },
          pontuacao: -10,
          mensagem: "Alex entendeu melhor as metas, mas saiu da reunião com dor de cabeça."
        },
        nao: {
          efeitos: { produtividade: -1, saude: 1 },
          pontuacao: 15,
          mensagem: "Alex usou o tempo para relaxar e cuidar de si mesmo, e não se arrependeu."
        }
      }
    },
    {
      id: 4,
      titulo: "Convite para sair com amigos",
      mensagem: "Quinta à noite. Os amigos de Alex mandam mensagem chamando para um happy hour no bar da esquina.",
      dia_semana: "quinta",
      horario_inicio: "19:00",
      horario_fim: "22:30",
      opcoes: {
        sim: {
          efeitos: { social: 2, sono: -2, saude: -1 },
          pontuacao: -15,
          mensagem: "A noite foi divertida, mas Alex dormiu tarde, exagerou nas bebidas e acordou mal."
        },
        nao: {
          efeitos: { sono: 2, saude: 1 },
          pontuacao: 25,
          mensagem: "Alex ficou em casa, dormiu cedo e acordou com disposição e clareza."
        }
      }
    },
    {
      id: 5,
      titulo: "Caminhada com o cachorro do vizinho",
      mensagem: "Sexta de manhã. O vizinho de Alex pediu um favor: passear com seu cachorro enquanto ele viaja.",
      dia_semana: "sexta",
      horario_inicio: "08:00",
      horario_fim: "09:00",
      opcoes: {
        sim: {
          efeitos: { social: 1, saude: 1, energia: -1 },
          pontuacao: 15,
          mensagem: "A caminhada foi agradável e Alex sentiu-se mais disposto apesar do cansaço."
        },
        nao: {
          efeitos: { social: -1 },
          pontuacao: 0,
          mensagem: "Alex recusou. O vizinho entendeu, mas ficou um pouco decepcionado."
        }
      }
    },
    {
      id: 6,
      titulo: "Maratona de série",
      mensagem: "Sexta-feira à noite. Uma nova temporada da série favorita de Alex lançou hoje. Ele pensa em assistir tudo de uma vez.",
      dia_semana: "sexta",
      horario_inicio: "21:00",
      horario_fim: "01:30",
      opcoes: {
        sim: {
          efeitos: { sono: -2, produtividade: -1 },
          pontuacao: -15,
          mensagem: "Alex perdeu a noção do tempo e dormiu tarde. No dia seguinte estava exausto."
        },
        nao: {
          efeitos: { sono: 1, produtividade: 1 },
          pontuacao: 20,
          mensagem: "Alex resistiu à tentação e dormiu cedo. No dia seguinte, maratonou com mais calma."
        }
      }
    },
    {
      id: 7,
      titulo: "Feirinha de orgânicos",
      mensagem: "Sábado de manhã. Está acontecendo uma feira com alimentos frescos e saudáveis perto da praça.",
      dia_semana: "sábado",
      horario_inicio: "09:00",
      horario_fim: "10:30",
      opcoes: {
        sim: {
          efeitos: { saude: 2, energia: 1, social: 1 },
          pontuacao: 20,
          mensagem: "Alex aproveitou a manhã, comprou bem e trocou boas conversas."
        },
        nao: {
          efeitos: { saude: -1 },
          pontuacao: -5,
          mensagem: "Alex ficou em casa e almoçou mal, se sentindo um pouco desmotivado."
        }
      }
    },
    {
      id: 8,
      titulo: "Jogatina online com os amigos",
      mensagem: "Sábado à noite. Os amigos de Alex o chamam para uma jogatina até de madrugada.",
      dia_semana: "sábado",
      horario_inicio: "22:00",
      horario_fim: "02:00",
      opcoes: {
        sim: {
          efeitos: { social: 2, sono: -2 },
          pontuacao: -10,
          mensagem: "Foi divertido, mas Alex acordou no domingo completamente esgotado."
        },
        nao: {
          efeitos: { sono: 1 },
          pontuacao: 15,
          mensagem: "Alex foi dormir cedo. Perdeu a jogatina, mas ganhou descanso e energia."
        }
      }
    },
    {
      id: 9,
      titulo: "Chamada de vídeo da família",
      mensagem: "Domingo à tarde. A mãe de Alex chama para uma videochamada com a família.",
      dia_semana: "domingo",
      horario_inicio: "16:00",
      horario_fim: "17:00",
      opcoes: {
        sim: {
          efeitos: { social: 2, energia: -1 },
          pontuacao: 0,
          mensagem: "Alex ficou feliz em ver todos, mesmo saindo da call um pouco cansado."
        },
        nao: {
          efeitos: { social: -1 },
          pontuacao: 0,
          mensagem: "Alex ignorou a ligação. Depois, bateu um arrependimento leve."
        }
      }
    },
    {
      id: 10,
      titulo: "Dormir cedo no domingo",
      mensagem: "Domingo à noite. Alex pode dormir cedo para começar bem a semana, ou assistir mais alguns vídeos no celular.",
      dia_semana: "domingo",
      horario_inicio: "20:30",
      horario_fim: "21:30",
      opcoes: {
        sim: {
          efeitos: { sono: 2 },
          pontuacao: 25,
          mensagem: "Alex dormiu cedo, descansou bem e acordou segunda com energia total."
        },
        nao: {
          efeitos: { sono: -1, produtividade: -1 },
          pontuacao: -10,
          mensagem: "Alex ficou rolando o feed até tarde e acordou na segunda atrasado e sonolento."
        }
      }
    }
  ];

  const rooms: Room[] = [
    {
      id: 'bedroom',
      name: 'Quarto',
      icon: Bed,
      description: 'O quarto aconchegante de Alex com uma cama confortável',
      background: 'from-purple-900/20 to-blue-900/20',
      actions: [
        {
          id: 'sleep',
          name: 'Cama',
          icon: Bed,
          position: { x: 70, y: 60 },
          description: 'Dormir'
        }
      ]
    },
    {
      id: 'living',
      name: 'Sala de Estar',
      icon: Tv,
      description: 'Sala confortável com sofá e TV para relaxar',
      background: 'from-emerald-900/20 to-teal-900/20',
      actions: [
        {
          id: 'relax',
          name: 'Sofá',
          icon: Tv,
          position: { x: 30, y: 50 },
          description: 'Relaxar'
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Cozinha',
      icon: Utensils,
      description: 'Cozinha equipada para preparar refeições saudáveis',
      background: 'from-orange-900/20 to-red-900/20',
      actions: [
        {
          id: 'eat',
          name: 'Mesa',
          icon: Utensils,
          position: { x: 50, y: 40 },
          description: 'Comer'
        },
        {
          id: 'drinkWater',
          name: 'Água',
          icon: Droplets,
          position: { x: 80, y: 30 },
          description: 'Beber água'
        }
      ]
    },
    {
      id: 'gym',
      name: 'Academia',
      icon: Dumbbell,
      description: 'Academia bem equipada para exercícios',
      background: 'from-gray-900/20 to-slate-900/20',
      actions: [
        {
          id: 'exercise',
          name: 'Equipamentos',
          icon: Dumbbell,
          position: { x: 60, y: 50 },
          description: 'Exercitar-se'
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Banheiro',
      icon: Bath,
      description: 'Banheiro limpo e relaxante',
      background: 'from-blue-900/20 to-cyan-900/20',
      actions: [
        {
          id: 'shower',
          name: 'Chuveiro',
          icon: Bath,
          position: { x: 40, y: 60 },
          description: 'Tomar banho'
        }
      ]
    }
  ];

  // Initialize audio context and background music
  useEffect(() => {
    if (gameState.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Initialize background music with correct URL
    if (!backgroundMusicRef.current) {
      const audio = new Audio('/[KAIROSOFT SOUNDTRACKS] Game Dev Story Working Hard (1) (2).mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        setMusicLoaded(true);
        console.log('Background music loaded successfully');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Error loading background music:', e);
        setMusicLoaded(false);
      });

      backgroundMusicRef.current = audio;
    }

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Game time progression (1 second real = 15 minutes game time, 2 weeks total)
  useEffect(() => {
    if (gameState.isPaused) return; // Don't progress time when paused
    
    gameTimeIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.isPaused) return prev; // Double check pause state
        
        const newGameTime = new Date(prev.gameTime);
        newGameTime.setMinutes(newGameTime.getMinutes() + 15); // Add 15 minutes every second
        
        // Calculate current week and day
        const startDate = new Date(2024, 0, 1, 7, 0, 0); // Week 1, Day 1, 7:00 AM (2 weeks total)
        const timeDiff = newGameTime.getTime() - startDate.getTime();
        const totalDays = Math.floor(timeDiff / (24 * 60 * 60 * 1000)) + 1;
        const currentWeek = Math.min(Math.ceil(totalDays / 7), 2);
        const currentDay = ((totalDays - 1) % 7) + 1;
        
        // Check if game completed (2 weeks)
        if (currentWeek > 2) {
          return {
            ...prev,
            gameCompleted: true,
            isPaused: true
          };
        }
        
        // Check if it's a new day (past midnight)
        if (newGameTime.getDate() !== prev.gameTime.getDate()) {
          return {
            ...prev,
            gameTime: newGameTime,
            currentDay,
            currentWeek,
            dailyActions: {
              sleep: false,
              eat: false,
              exercise: false,
              relax: false,
              drinkWater: false,
              shower: false
            }
          };
        }
        
        return {
          ...prev,
          gameTime: newGameTime,
          currentDay,
          currentWeek
        };
      });
    }, 1000);

    return () => {
      if (gameTimeIntervalRef.current) {
        clearInterval(gameTimeIntervalRef.current);
      }
    };
  }, []);

  // Check for random situations - 10 situações distribuídas em 2 semanas
  useEffect(() => {
    const checkForSituacao = () => {
      if (gameState.isPaused) return; // Don't check situations when paused
      if (showSituacao.show) return; // Don't show if already showing one
      
      const currentTime = gameState.gameTime;
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Get current day of week in Portuguese
      const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      const currentDayOfWeek = daysOfWeek[currentTime.getDay()];
      
      // Filter available situations
      const availableSituacoes = situacoes.filter((situacao: Situacao) => {
        // Check if already occurred
        if (gameState.situacoesOcorridas.includes(situacao.id)) return false;
        
        // Check day of week
        if (situacao.dia_semana !== currentDayOfWeek) return false;
        
        // Check time range
        const startTime = situacao.horario_inicio;
        const endTime = situacao.horario_fim;
        
        if (currentTimeString >= startTime && currentTimeString <= endTime) {
          return true;
        }
        
        return false;
      });
      
      // Random chance to trigger a situation (20% chance every check for 2 weeks, 10 situations)
      if (availableSituacoes.length > 0 && Math.random() < 0.50) {
        const randomSituacao = availableSituacoes[Math.floor(Math.random() * availableSituacoes.length)];
        setShowSituacao({ show: true, situacao: randomSituacao });
      }
    };

    const interval = setInterval(checkForSituacao, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [gameState.gameTime, gameState.situacoesOcorridas, showSituacao.show, gameState.isPaused]);

  // Progressive factor degradation system
  useEffect(() => {
    const checkDailyDegradation = () => {
      if (gameState.isPaused || gameState.gameCompleted) return;
      
      const currentDay = gameState.currentDay;
      
      // Check if we've moved to a new day and need to apply degradation
      if (currentDay > lastDegradationDay) {
        setLastDegradationDay(currentDay);
        
        setGameState(prev => {
          const newAlex = { ...prev.alex };
          
          // Apply daily degradation rates
          newAlex.energy = Math.max(0, newAlex.energy - 5); // -5 per day
          newAlex.sleepQuality = Math.max(0, newAlex.sleepQuality - 4); // -4 per day
          newAlex.health = Math.max(0, newAlex.health - 3); // -3 per day
          
          // Social and productivity degrade every 2 days
          if (currentDay % 2 === 0) {
            newAlex.relationships = Math.max(0, newAlex.relationships - 1); // -1 every 2 days
            newAlex.productivity = Math.max(0, newAlex.productivity - 1); // -1 every 2 days
          }
          
          // Update mood based on new stats
          newAlex.mood = updateAlexMood(newAlex);
          
          return {
            ...prev,
            alex: newAlex
          };
        });
      }
    };
    
    const interval = setInterval(checkDailyDegradation, 1000); // Check every second
    return () => clearInterval(interval);
  }, [gameState.currentDay, gameState.isPaused, gameState.gameCompleted, lastDegradationDay]);

  // Check for critical states
  useEffect(() => {
    if (gameState.isPaused || gameState.gameCompleted || showCriticalState.show) return;
    
    const { alex } = gameState;
    
    // Priority order: energy, sleep, health (most critical first)
    if (alex.energy <= 0) {
      setShowCriticalState({
        show: true,
        factor: 'energy',
        message: '🛑 "Ah não! Alex está sem energia! Ele não come há dias e desmaiou por exaustão."'
      });
      setGameState(prev => ({ ...prev, isPaused: true }));
    } else if (alex.sleepQuality <= 0) {
      setShowCriticalState({
        show: true,
        factor: 'sleep',
        message: '🛑 "Alex está em colapso. Dias sem dormir afetaram sua mente e corpo."'
      });
      setGameState(prev => ({ ...prev, isPaused: true }));
    } else if (alex.health <= 0) {
      setShowCriticalState({
        show: true,
        factor: 'health',
        message: '🛑 "A saúde de Alex chegou ao limite. Seu corpo não aguentou o ritmo."'
      });
      setGameState(prev => ({ ...prev, isPaused: true }));
    }
  }, [gameState.alex, gameState.isPaused, gameState.gameCompleted, showCriticalState.show]);

  // Handle music play/pause
  useEffect(() => {
    if (backgroundMusicRef.current && musicLoaded) {
      if (gameState.musicEnabled) {
        const playPromise = backgroundMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Auto-play prevented. Music will start after user interaction.');
          });
        }
      } else {
        backgroundMusicRef.current.pause();
      }
    }
  }, [gameState.musicEnabled, musicLoaded]);

  const handleFirstInteraction = () => {
    if (backgroundMusicRef.current && gameState.musicEnabled && musicLoaded) {
      const playPromise = backgroundMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Could not start background music:', error);
        });
      }
    }
  };

  // 8-bit sound generation
  const playSound = (type: 'positive' | 'negative' | 'button') => {
    if (!gameState.soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'button':
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'positive':
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });
        break;
      case 'negative':
        [392, 349, 311, 262].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.4);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.4);
        });
        break;
    }
  };

  const updateAlexMood = (alex: any) => {
    const avgStats = (alex.health + alex.energy + alex.sleepQuality + alex.relationships) / 4;
    if (avgStats >= 70) return 'happy';
    if (avgStats >= 50) return 'relaxed';
    if (avgStats >= 30) return 'tired';
    return 'stressed';
  };

  const navigateRoom = (direction: 'left' | 'right') => {
    handleFirstInteraction();
    playSound('button');
    
    const currentIndex = rooms.findIndex(room => room.id === gameState.currentRoom);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : rooms.length - 1;
    } else {
      newIndex = currentIndex < rooms.length - 1 ? currentIndex + 1 : 0;
    }
    
    setGameState(prev => ({
      ...prev,
      currentRoom: rooms[newIndex].id
    }));
  };

  const handleActionClick = (action: RoomAction) => {
    handleFirstInteraction();
    
    // Prevent actions when game is paused
    if (gameState.isPaused) return;
    
    playSound('button');
    
    // Check if action already performed today
    if (gameState.dailyActions[action.id]) {
      setShowFeedback({
        show: true,
        message: `Alex já ${action.description.toLowerCase()} hoje! Tente novamente amanhã.`,
        type: 'negative'
      });
      setTimeout(() => setShowFeedback({ show: false, message: '', type: 'positive' }), 3000);
      return;
    }

    setShowConfirmation({
      show: true,
      action: action.description,
      actionId: action.id,
      room: getCurrentRoom().name
    });
  };

  const confirmAction = (confirmed: boolean) => {
    handleFirstInteraction();
    
    // Prevent actions when game is paused
    if (gameState.isPaused) return;
    
    if (!confirmed) {
      setShowConfirmation({ show: false, action: '', actionId: 'sleep', room: '' });
      return;
    }

    const actionId = showConfirmation.actionId;
    const actionEffects = getActionEffects(actionId);
    
    // Play animation
    setAlexAnimation(actionId);
    
    // Play sound
    playSound(actionEffects.points > 0 ? 'positive' : 'negative');

    // Update game state
    setGameState(prev => {
      const newAlex = { ...prev.alex };
      
      // Apply effects
      Object.entries(actionEffects.effects).forEach(([key, value]) => {
        if (key in newAlex) {
          (newAlex as any)[key] = Math.max(0, Math.min(100, (newAlex as any)[key] + value));
        }
      });

      newAlex.mood = updateAlexMood(newAlex);

      const newScore = Math.max(0, prev.score + actionEffects.points);

      return {
        ...prev,
        score: newScore,
        alex: newAlex,
        dailyActions: {
          ...prev.dailyActions,
          [actionId]: true
        },
        lastActionTime: new Date()
      };
    });

    // Show feedback
    setShowFeedback({
      show: true,
      message: actionEffects.message,
      type: actionEffects.points > 0 ? 'positive' : 'negative'
    });

    // Hide confirmation
    setShowConfirmation({ show: false, action: '', actionId: 'sleep', room: '' });

    // Reset animation after 2 seconds
    setTimeout(() => {
      setAlexAnimation('idle');
      setShowFeedback({ show: false, message: '', type: 'positive' });
    }, 3000);
  };

  const handleSituacaoResponse = (escolha: 'sim' | 'nao') => {
    if (!showSituacao.situacao) return;
    
    // Prevent actions when game is paused
    if (gameState.isPaused) return;

    const situacao = showSituacao.situacao;
    const opcao = situacao.opcoes[escolha];
    
    // Apply effects to Alex
    setGameState(prev => {
      const newAlex = { ...prev.alex };
      
      // Apply effects from the situation
      Object.entries(opcao.efeitos).forEach(([key, value]) => {
        switch (key) {
          case 'saude':
            newAlex.health = Math.max(0, Math.min(100, newAlex.health + (value * 10)));
            break;
          case 'sono':
            newAlex.sleepQuality = Math.max(0, Math.min(100, newAlex.sleepQuality + (value * 10)));
            break;
          case 'energia':
            newAlex.energy = Math.max(0, Math.min(100, newAlex.energy + (value * 10)));
            break;
          case 'social':
            newAlex.relationships = Math.max(0, Math.min(100, newAlex.relationships + (value * 10)));
            break;
          case 'produtividade':
            newAlex.productivity = Math.max(0, Math.min(100, newAlex.productivity + (value * 10)));
            break;
        }
      });

      newAlex.mood = updateAlexMood(newAlex);

      return {
        ...prev,
        score: Math.max(0, prev.score + opcao.pontuacao),
        alex: newAlex,
        situacoesOcorridas: [...prev.situacoesOcorridas, situacao.id]
      };
    });

    // Show feedback
    setShowFeedback({
      show: true,
      message: opcao.mensagem,
      type: opcao.pontuacao >= 0 ? 'positive' : 'negative'
    });

    // Play sound
    playSound(opcao.pontuacao >= 0 ? 'positive' : 'negative');

    // Hide situation modal
    setShowSituacao({ show: false, situacao: null });

    // Hide feedback after 4 seconds
    setTimeout(() => {
      setShowFeedback({ show: false, message: '', type: 'positive' });
    }, 4000);
  };

  const getActionEffects = (action: keyof GameState['dailyActions']) => {
    const effects: Record<string, any> = {
      sleep: {
        points: 20,
        message: "Parabéns! Alex dormiu bem e recuperou energia. Ganhou 20 pontos!",
        effects: { sleepQuality: 25, energy: 20, health: 10 }
      },
      eat: {
        points: 15,
        message: "Parabéns! Alex fez uma refeição saudável. Ganhou 15 pontos!",
        effects: { health: 20, energy: 15 }
      },
      exercise: {
        points: 18,
        message: "Parabéns! Alex se exercitou e melhorou sua saúde. Ganhou 18 pontos!",
        effects: { health: 25, energy: -5, sleepQuality: 10 }
      },
      relax: {
        points: 12,
        message: "Parabéns! Alex relaxou e reduziu o estresse. Ganhou 12 pontos!",
        effects: { relationships: 15, health: 10, energy: 10 }
      },
      drinkWater: {
        points: 8,
        message: "Parabéns! Alex se hidratou bem. Ganhou 8 pontos!",
        effects: { health: 10, energy: 5 }
      },
      shower: {
        points: 10,
        message: "Parabéns! Alex tomou banho e se sente renovado. Ganhou 10 pontos!",
        effects: { health: 15, relationships: 10 }
      }
    };

    return effects[action] || { points: 0, message: '', effects: {} };
  };

  const getCurrentRoom = () => {
    return rooms.find(room => room.id === gameState.currentRoom) || rooms[0];
  };

  const getScoreColor = () => {
    if (gameState.score >= 100) return 'text-green-400';
    if (gameState.score >= 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'text-green-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMoodEmoji = () => {
    switch (gameState.alex.mood) {
      case 'happy': return '😊';
      case 'relaxed': return '😌';
      case 'tired': return '😴';
      case 'stressed': return '😰';
      default: return '😊';
    }
  };

  const formatGameTime = () => {
    return gameState.gameTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const resetGame = () => {
    handleFirstInteraction();
    
    setLastDegradationDay(1);
    setShowCriticalState({ show: false, factor: '', message: '' });
    
    setGameState({
      score: 0,
      currentDay: 1,
      currentWeek: 1,
      gameTime: new Date(2024, 0, 1, 7, 0, 0),
      gameCompleted: false,
      soundEnabled: gameState.soundEnabled,
      musicEnabled: gameState.musicEnabled,
      isPaused: false,
      currentRoom: 'bedroom',
      alex: {
        health: 50,
        energy: 50,
        sleepQuality: 50,
        relationships: 50,
        productivity: 50,
        mood: 'happy'
      },
      dailyActions: {
        sleep: false,
        eat: false,
        exercise: false,
        relax: false,
        drinkWater: false,
        shower: false
      },
      lastActionTime: new Date(),
      situacoesOcorridas: []
    });
    setAlexAnimation('idle');
    setShowFeedback({ show: false, message: '', type: 'positive' });
    setShowConfirmation({ show: false, action: '', actionId: 'sleep', room: '' });
    setShowSituacao({ show: false, situacao: null });
  };
  
  const handleCriticalStateRestart = () => {
    resetGame();
    setShowCriticalState({ show: false, factor: '', message: '' });
  };

  const saveGame = () => {
    try {
      const saveData = {
        gameState,
        savedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      localStorage.setItem('dream-story-save', JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar o jogo:', error);
      return false;
    }
  };

  const loadGame = () => {
    try {
      const saveData = localStorage.getItem('dream-story-save');
      if (saveData) {
        const parsed = JSON.parse(saveData);
        if (parsed.gameState) {
          setGameState({
            ...parsed.gameState,
            gameTime: new Date(parsed.gameState.gameTime),
            lastActionTime: new Date(parsed.gameState.lastActionTime)
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao carregar o jogo:', error);
      return false;
    }
  };

  const handleSaveGame = () => {
    const success = saveGame();
    setShowSaveConfirmation(false);
    
    if (success) {
      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2000);
    }
  };

  // Carregar jogo salvo ao inicializar
  useEffect(() => {
    loadGame();
  }, []);

  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const toggleMusic = () => {
    setGameState(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  };

  const currentRoom = getCurrentRoom();

  // Critical state screen
  if (showCriticalState.show) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
      }`}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <div className={`relative text-center p-8 rounded-2xl border max-w-md mx-4 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/90 border-red-500/50' 
            : 'bg-white/90 border-red-400/50 shadow-lg'
        }`}>
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">💀</div>
          </div>
          
          <h2 className={`text-2xl font-bold mb-4 text-red-400 transition-colors duration-300`}>
            Game Over
          </h2>
          
          <p className={`text-lg mb-6 leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {showCriticalState.message}
          </p>
          
          <div className={`text-sm mb-6 p-4 rounded-lg transition-colors duration-300 ${
            isDark 
              ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
              : 'bg-red-100/80 border border-red-300/50 text-red-700'
          }`}>
            <p className="font-medium mb-2">💡 Dica para próxima vez:</p>
            <p>
              {showCriticalState.factor === 'energy' && 'Lembre-se de comer regularmente! A energia cai 5 pontos por dia.'}
              {showCriticalState.factor === 'sleep' && 'Durma bem todas as noites! O sono cai 4 pontos por dia.'}
              {showCriticalState.factor === 'health' && 'Cuide da sua saúde! Ela diminui 3 pontos por dia.'}
            </p>
          </div>
          
          <button
            onClick={handleCriticalStateRestart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            🔁 Reiniciar Jogo
          </button>
        </div>
      </div>
    );
  }

  // Game completion screen
  if (gameState.gameCompleted) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
      }`}>
        <div className={`text-center p-8 rounded-2xl border max-w-md transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800' 
            : 'bg-white/90 border-gray-200 shadow-lg'
        }`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Parabéns! Jogo Concluído! 🎉
          </h2>
          <p className={`text-lg mb-4 transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Você completou as 2 semanas do Dream Story!
          </p>
          <div className={`text-center mb-6 transition-colors duration-300 ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            <div className="text-3xl font-bold">{gameState.score}</div>
            <div className="text-sm">Pontos Finais</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              Jogar Novamente
            </button>
            <button
              onClick={onBack}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 overflow-hidden pixel-game-container ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Header */}
      <header className={`flex-shrink-0 backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <h1 className={`text-base font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Dream Story</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Game Clock */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-900'
              }`}>
                <Clock className="w-3 h-3" />
                <span className="text-xs font-mono">{formatGameTime()}</span>
              </div>

              {/* Week indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-900'
              }`}>
                <span className="text-xs font-mono">Semana {gameState.currentWeek}/2</span>
              </div>

              {/* Save Game Button */}
              <button
                onClick={() => setShowSaveConfirmation(true)}
                disabled={gameState.isPaused}
                className={`p-2 rounded-lg transition-colors ${
                  gameState.isPaused
                    ? isDark 
                      ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' 
                      : 'bg-gray-200/50 text-gray-500 cursor-not-allowed'
                    : isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                title={gameState.isPaused ? "Não é possível salvar durante o pause" : "Salvar jogo"}
              >
                <Save className="w-4 h-4" />
              </button>

              {/* Pause/Play Button */}
              <button
                onClick={togglePause}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                title={gameState.isPaused ? 'Retomar jogo' : 'Pausar jogo'}
              >
                {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              {/* Music Toggle */}
              <button
                onClick={toggleMusic}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                title={gameState.musicEnabled ? 'Desativar música' : 'Ativar música'}
              >
                {gameState.musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Stats Bar */}
        <div className={`flex-shrink-0 px-3 py-2 border-b transition-colors duration-300 ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div>
              <div className={`text-base font-bold ${getScoreColor()}`}>
                {gameState.score}
              </div>
              <div className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-emerald-700'
              }`}>Pontos</div>
            </div>
            
            <div>
              <div className={`text-base font-bold transition-colors duration-300 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                Dia {gameState.currentDay}
              </div>
              <div className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-emerald-700'
              }`}>Atual</div>
            </div>

            <div>
              <div className="text-base">{getMoodEmoji()}</div>
              <div className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-emerald-700'
              }`}>Humor</div>
            </div>

            <div>
              <div className={`text-sm font-bold transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                {currentRoom.name}
              </div>
              <div className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-emerald-700'
              }`}>Local</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* 2D Platform Room Container */}
          <div className={`absolute inset-0 transition-all duration-500 overflow-hidden room-transition room-${currentRoom.id}`}>
            <div className="pixel-room w-full h-full relative">
              {/* Room Background */}
              <div className={`pixel-room-bg room-bg-${currentRoom.id}`}></div>
              
              {/* Interactive Objects */}
              <div className={`pixel-object pixel-bed ${gameState.dailyActions.sleep ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'sleep', name: 'Cama', icon: Bed, position: { x: 70, y: 60 }, description: 'Dormir' })}>
                {gameState.dailyActions.sleep && <div className="pixel-completion">✓</div>}
              </div>
              
              <div className={`pixel-object pixel-sofa ${gameState.dailyActions.relax ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'relax', name: 'Sofá', icon: Tv, position: { x: 30, y: 50 }, description: 'Relaxar' })}>
                {gameState.dailyActions.relax && <div className="pixel-completion">✓</div>}
              </div>
              
              <div className={`pixel-object pixel-table ${gameState.dailyActions.eat ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'eat', name: 'Mesa', icon: Utensils, position: { x: 50, y: 40 }, description: 'Comer' })}>
                {gameState.dailyActions.eat && <div className="pixel-completion">✓</div>}
              </div>
              
              <div className={`pixel-object pixel-water ${gameState.dailyActions.drinkWater ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'drinkWater', name: 'Água', icon: Droplets, position: { x: 80, y: 30 }, description: 'Beber água' })}>
                {gameState.dailyActions.drinkWater && <div className="pixel-completion">✓</div>}
              </div>
              
              <div className={`pixel-object pixel-exercise ${gameState.dailyActions.exercise ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'exercise', name: 'Equipamentos', icon: Dumbbell, position: { x: 60, y: 50 }, description: 'Exercitar-se' })}>
                {gameState.dailyActions.exercise && <div className="pixel-completion">✓</div>}
              </div>
              
              <div className={`pixel-object pixel-shower ${gameState.dailyActions.shower ? 'used' : 'available'}`}
                   onClick={() => handleActionClick({ id: 'shower', name: 'Chuveiro', icon: Bath, position: { x: 40, y: 60 }, description: 'Tomar banho' })}>
                {gameState.dailyActions.shower && <div className="pixel-completion">✓</div>}
              </div>
              
              {/* Room Decorations */}
              <div className="pixel-decoration pixel-bookshelf"></div>
              <div className="pixel-decoration pixel-lamp"></div>
              <div className="pixel-decoration pixel-window"></div>
              <div className="pixel-decoration pixel-plant"></div>
              <div className="pixel-decoration pixel-rug"></div>
              <div className="pixel-decoration pixel-wardrobe"></div>
              <div className="pixel-decoration pixel-mirror"></div>
              <div className="pixel-decoration pixel-fridge"></div>
              <div className="pixel-decoration pixel-weights"></div>
              <div className="pixel-decoration pixel-towels"></div>
            </div>
          </div>

          {/* Room Navigation */}
          <button
            onClick={() => navigateRoom('left')}
            disabled={gameState.isPaused}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 hover:scale-110 z-30 backdrop-blur-sm ${
              gameState.isPaused
                ? isDark 
                  ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700' 
                  : 'bg-white/50 text-gray-500 cursor-not-allowed border border-gray-300 shadow-lg'
                : isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600' 
                  : 'bg-white/90 hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-lg'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateRoom('right')}
            disabled={gameState.isPaused}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 hover:scale-110 z-30 backdrop-blur-sm ${
              gameState.isPaused
                ? isDark 
                  ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700' 
                  : 'bg-white/50 text-gray-500 cursor-not-allowed border border-gray-300 shadow-lg'
                : isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600' 
                  : 'bg-white/90 hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-lg'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pause Overlay */}
          {gameState.isPaused && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 backdrop-blur-sm">
              <div className={`text-center p-8 rounded-2xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-700 text-white' 
                  : 'bg-white/90 border-gray-200 text-gray-900 shadow-lg'
              }`}>
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pause className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Jogo Pausado</h3>
                <p className={`text-sm mb-6 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Clique no botão de play para continuar
                </p>
                <button
                  onClick={togglePause}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Alex Character */}
          <div className="pixel-character">
            <div className="text-center relative">
              <div className={`alex-sprite-2d alex-${alexAnimation} alex-idle-2d relative ${alexAnimation === 'sleep' ? 'sleeping' : ''}`}>
                {/* Character shadow */}
                <div className="character-shadow-2d absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                isDark ? 'bg-slate-800 text-white' : 'bg-white text-emerald-900'
              }`}>
                Alex
              </div>
            </div>
          </div>

          {/* Room Title */}
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 rounded-lg backdrop-blur-sm border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/80 border-slate-700 text-white' 
              : 'bg-white/80 border-gray-200 text-gray-900'
          }`}>
            <div className="flex items-center gap-2">
              <currentRoom.icon className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">{currentRoom.name}</span>
            </div>
            <p className="text-xs text-center mt-1 opacity-75">{currentRoom.description}</p>
          </div>

          {/* Confirmation Modal */}
          {showConfirmation.show && !gameState.isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`backdrop-blur-sm rounded-2xl p-6 border max-w-sm mx-4 transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800' 
                  : 'bg-white/90 border-gray-200 shadow-lg'
              }`}>
                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Confirmar Ação
                  </h3>
                  <p className={`text-sm mb-6 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Você deseja fazer Alex {showConfirmation.action.toLowerCase()}?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => confirmAction(false)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      onClick={() => confirmAction(true)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                    >
                      Sim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Situação Modal */}
          {showSituacao.show && showSituacao.situacao && !gameState.isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`backdrop-blur-sm rounded-2xl p-6 border max-w-md mx-4 transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800' 
                  : 'bg-white/90 border-gray-200 shadow-lg'
              }`}>
                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {showSituacao.situacao.titulo}
                  </h3>
                  <p className={`text-sm mb-6 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {showSituacao.situacao.mensagem}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSituacaoResponse('nao')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      onClick={() => handleSituacaoResponse('sim')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                    >
                      Sim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showSaveConfirmation && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`backdrop-blur-sm rounded-2xl p-6 border max-w-sm mx-4 transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800' 
                  : 'bg-white/90 border-gray-200 shadow-lg'
              }`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Save className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Salvar Jogo
                  </h3>
                  <p className={`text-sm mb-6 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Você deseja salvar o jogo?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSaveConfirmation(false)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      onClick={handleSaveGame}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                    >
                      Sim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Success Modal */}
          {showSaveSuccess && (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <div className={`backdrop-blur-sm rounded-2xl p-6 border max-w-sm mx-4 transition-colors duration-300 ${
                isDark 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : 'bg-green-100/80 border-green-300/50 text-green-700'
              }`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Save className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Jogo Salvo!</h3>
                  <p className="text-sm">Seu progresso foi salvo com sucesso.</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Modal */}
          {showFeedback.show && !gameState.isPaused && (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <div className={`backdrop-blur-sm rounded-2xl p-6 border max-w-sm mx-4 transition-colors duration-300 ${
                showFeedback.type === 'positive'
                  ? isDark
                    ? 'bg-green-500/20 border-green-500/30 text-green-400'
                    : 'bg-green-100/80 border-green-300/50 text-green-700'
                  : isDark
                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-red-100/80 border-red-300/50 text-red-700'
              }`}>
                <p className="text-center font-medium">{showFeedback.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div className={`flex-shrink-0 px-4 py-3 border-t transition-colors duration-300 ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: 'Saúde', value: gameState.alex.health, icon: Heart, color: 'text-red-400' },
              { label: 'Energia', value: gameState.alex.energy, icon: Award, color: 'text-yellow-400' },
              { label: 'Sono', value: gameState.alex.sleepQuality, icon: Bed, color: 'text-purple-400' },
              { label: 'Social', value: gameState.alex.relationships, icon: Users, color: 'text-blue-400' },
              { label: 'Produtividade', value: gameState.alex.productivity, icon: Briefcase, color: 'text-green-400' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex items-center justify-center gap-0.5 mb-1">
                  <stat.icon className={`w-2.5 h-2.5 ${stat.color}`} />
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{stat.label}</span>
                </div>
                <div className={`text-xs font-bold ${getStatColor(stat.value)}`}>
                  {stat.value}%
                </div>
                <div className={`w-full rounded-full h-0.5 mt-1 transition-colors duration-300 ${
                  isDark ? 'bg-slate-800' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      stat.value >= 70 ? 'bg-green-400' :
                      stat.value >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamStoryGame;