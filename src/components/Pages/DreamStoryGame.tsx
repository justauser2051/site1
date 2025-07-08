import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Calendar, Clock, Heart, Zap, Brain, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface DreamStoryGameProps {
  onBack: () => void;
}

interface GameState {
  energy: number;
  sleep: number;
  health: number;
  day: number;
  time: number; // em minutos desde 00:00 (450 = 07:30)
  gameSpeed: number;
  isPlaying: boolean;
  gameOver: boolean;
  gameWon: boolean;
  usedObjects: Set<string>;
  currentRoom: string;
  showWelcome: boolean;
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    effects: {
      energy?: number;
      sleep?: number;
      health?: number;
    };
  }[];
  condition?: (state: GameState) => boolean;
}

const DreamStoryGame: React.FC<DreamStoryGameProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    energy: 80,
    sleep: 70,
    health: 90,
    day: 1,
    time: 450, // 07:30 da manhã
    gameSpeed: 1,
    isPlaying: false, // Começa pausado
    gameOver: false,
    gameWon: false,
    usedObjects: new Set(),
    currentRoom: 'bedroom',
    showWelcome: true // Mostrar boas-vindas inicialmente
  });

  // Dias da semana
  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  // Calcular dia da semana atual (começando na segunda-feira)
  const getCurrentDayOfWeek = () => {
    const dayIndex = (gameState.day - 1) % 7;
    return daysOfWeek[dayIndex];
  };

  // Eventos do jogo com condições específicas
  const gameEvents: GameEvent[] = [
    {
      id: 'low-energy-morning',
      title: '😴 Manhã Difícil',
      description: 'Você acordou se sentindo muito cansado. O que fazer?',
      choices: [
        {
          text: 'Tomar um café forte',
          effects: { energy: 15, health: -5 }
        },
        {
          text: 'Fazer alongamentos leves',
          effects: { energy: 10, health: 5 }
        },
        {
          text: 'Voltar a dormir por mais 30min',
          effects: { energy: 20, sleep: 10, health: -10 }
        }
      ],
      condition: (state) => state.energy < 30 && state.time >= 420 && state.time <= 600
    },
    {
      id: 'afternoon-slump',
      title: '🥱 Sonolência da Tarde',
      description: 'Você está sentindo muito sono no meio da tarde.',
      choices: [
        {
          text: 'Tirar uma soneca de 20min',
          effects: { energy: 25, sleep: -5 }
        },
        {
          text: 'Beber água gelada',
          effects: { energy: 10, health: 5 }
        },
        {
          text: 'Fazer uma caminhada',
          effects: { energy: 15, health: 10, sleep: 5 }
        }
      ],
      condition: (state) => state.sleep < 40 && state.time >= 780 && state.time <= 960
    },
    {
      id: 'late-night-decision',
      title: '🌙 Decisão Noturna',
      description: 'Já é tarde e você ainda está acordado. O que fazer?',
      choices: [
        {
          text: 'Ir dormir imediatamente',
          effects: { sleep: 20, health: 5 }
        },
        {
          text: 'Assistir mais um episódio',
          effects: { energy: -15, sleep: -20, health: -5 }
        },
        {
          text: 'Ler um livro por 30min',
          effects: { energy: -5, sleep: 10, health: 5 }
        }
      ],
      condition: (state) => state.time >= 1380 && state.sleep < 50
    },
    {
      id: 'weekend-temptation',
      title: '🎉 Tentação do Fim de Semana',
      description: 'É fim de semana! Seus amigos te chamaram para sair até tarde.',
      choices: [
        {
          text: 'Sair e se divertir',
          effects: { energy: -20, sleep: -25, health: 10 }
        },
        {
          text: 'Sair mas voltar cedo',
          effects: { energy: -10, sleep: -10, health: 15 }
        },
        {
          text: 'Ficar em casa descansando',
          effects: { energy: 10, sleep: 15, health: 5 }
        }
      ],
      condition: (state) => (state.day % 7 === 6 || state.day % 7 === 0) && state.time >= 1080
    },
    {
      id: 'stress-situation',
      title: '😰 Situação Estressante',
      description: 'Você está passando por um momento estressante.',
      choices: [
        {
          text: 'Fazer exercícios de respiração',
          effects: { energy: 5, sleep: 10, health: 15 }
        },
        {
          text: 'Comer algo doce',
          effects: { energy: 15, sleep: -5, health: -10 }
        },
        {
          text: 'Conversar com um amigo',
          effects: { energy: 10, sleep: 5, health: 20 }
        }
      ],
      condition: (state) => state.health < 40
    },
    {
      id: 'exercise-motivation',
      title: '💪 Motivação para Exercitar',
      description: 'Você está pensando em fazer exercícios, mas está indeciso.',
      choices: [
        {
          text: 'Fazer um treino intenso',
          effects: { energy: -15, sleep: 15, health: 25 }
        },
        {
          text: 'Fazer uma caminhada leve',
          effects: { energy: -5, sleep: 10, health: 15 }
        },
        {
          text: 'Deixar para outro dia',
          effects: { energy: 5, sleep: -5, health: -10 }
        }
      ],
      condition: (state) => state.energy > 60 && state.health < 70
    },
    {
      id: 'meal-choice',
      title: '🍽️ Escolha da Refeição',
      description: 'Está na hora de comer. O que você vai escolher?',
      choices: [
        {
          text: 'Refeição saudável e balanceada',
          effects: { energy: 15, sleep: 5, health: 20 }
        },
        {
          text: 'Fast food rápido',
          effects: { energy: 20, sleep: -10, health: -15 }
        },
        {
          text: 'Lanche leve',
          effects: { energy: 10, sleep: 0, health: 5 }
        }
      ],
      condition: (state) => (state.time >= 720 && state.time <= 780) || (state.time >= 1080 && state.time <= 1140)
    },
    {
      id: 'screen-time',
      title: '📱 Tempo de Tela',
      description: 'Você percebe que está há muito tempo no celular/computador.',
      choices: [
        {
          text: 'Continuar usando por mais tempo',
          effects: { energy: -10, sleep: -15, health: -10 }
        },
        {
          text: 'Fazer uma pausa de 15min',
          effects: { energy: 5, sleep: 5, health: 10 }
        },
        {
          text: 'Desligar e fazer outra atividade',
          effects: { energy: 10, sleep: 10, health: 15 }
        }
      ],
      condition: (state) => state.time >= 1200 && state.sleep < 60
    },
    {
      id: 'hydration-reminder',
      title: '💧 Lembrete de Hidratação',
      description: 'Você percebe que não bebeu água há um tempo.',
      choices: [
        {
          text: 'Beber um copo grande de água',
          effects: { energy: 10, sleep: 5, health: 15 }
        },
        {
          text: 'Beber um pouco depois',
          effects: { energy: 0, sleep: 0, health: -5 }
        },
        {
          text: 'Beber algo com cafeína',
          effects: { energy: 15, sleep: -10, health: 5 }
        }
      ],
      condition: (state) => state.health < 80 && state.energy < 50
    },
    {
      id: 'social-interaction',
      title: '👥 Interação Social',
      description: 'Você tem a oportunidade de socializar com outras pessoas.',
      choices: [
        {
          text: 'Participar ativamente',
          effects: { energy: -5, sleep: 5, health: 20 }
        },
        {
          text: 'Participar moderadamente',
          effects: { energy: 0, sleep: 0, health: 10 }
        },
        {
          text: 'Evitar a interação',
          effects: { energy: 5, sleep: -5, health: -15 }
        }
      ],
      condition: (state) => state.health < 60 && state.time >= 600 && state.time <= 1200
    }
  ];

  // Objetos do jogo organizados por sala
  const gameObjects = {
    bedroom: [
      { id: 'bed', name: 'Cama', effects: { sleep: 30, energy: 25 }, className: 'pixel-bed' },
      { id: 'computer', name: 'Computador', effects: { energy: -10, sleep: -15 }, className: 'pixel-computer' },
      { id: 'wardrobe', name: 'Guarda-roupa', effects: { health: 5 }, className: 'pixel-wardrobe' },
      { id: 'bedroom-mirror', name: 'Espelho', effects: { health: 10 }, className: 'pixel-bedroom-mirror' }
    ],
    living: [
      { id: 'sofa', name: 'Sofá', effects: { energy: 15, sleep: 10 }, className: 'pixel-sofa' },
      { id: 'tv', name: 'TV', effects: { energy: -5, sleep: -10 }, className: 'pixel-tv' },
      { id: 'bookshelf', name: 'Estante', effects: { sleep: 15, health: 10 }, className: 'pixel-bookshelf' },
      { id: 'videogame', name: 'Videogame', effects: { energy: -15, sleep: -20 }, className: 'pixel-videogame' }
    ],
    kitchen: [
      { id: 'table', name: 'Mesa', effects: { health: 15, energy: 10 }, className: 'pixel-table' },
      { id: 'fridge', name: 'Geladeira', effects: { health: 20, energy: 15 }, className: 'pixel-fridge' },
      { id: 'stove', name: 'Fogão', effects: { health: 25, energy: 10 }, className: 'pixel-stove' },
      { id: 'microwave', name: 'Microondas', effects: { health: 10, energy: 5 }, className: 'pixel-microwave' },
      { id: 'water', name: 'Água', effects: { health: 15, energy: 10 }, className: 'pixel-water' }
    ],
    gym: [
      { id: 'exercise', name: 'Exercício', effects: { health: 25, sleep: 20, energy: -10 }, className: 'pixel-exercise' },
      { id: 'treadmill', name: 'Esteira', effects: { health: 30, sleep: 25, energy: -15 }, className: 'pixel-treadmill' },
      { id: 'dumbbells', name: 'Halteres', effects: { health: 20, sleep: 15, energy: -10 }, className: 'pixel-dumbbells' },
      { id: 'yoga-mat', name: 'Yoga', effects: { health: 15, sleep: 25, energy: -5 }, className: 'pixel-yoga-mat' }
    ],
    bathroom: [
      { id: 'shower', name: 'Chuveiro', effects: { health: 20, energy: 15 }, className: 'pixel-shower' },
      { id: 'bathroom-sink', name: 'Pia', effects: { health: 10, energy: 5 }, className: 'pixel-bathroom-sink' },
      { id: 'toilet', name: 'Banheiro', effects: { health: 5 }, className: 'pixel-toilet' },
      { id: 'skincare', name: 'Cuidados', effects: { health: 15, sleep: 10 }, className: 'pixel-skincare' }
    ]
  };

  const rooms = [
    { id: 'bedroom', name: 'Quarto', icon: '🛏️' },
    { id: 'living', name: 'Sala', icon: '🛋️' },
    { id: 'kitchen', name: 'Cozinha', icon: '🍽️' },
    { id: 'gym', name: 'Academia', icon: '💪' },
    { id: 'bathroom', name: 'Banheiro', icon: '🚿' }
  ];

  // Função para formatar tempo
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Função para verificar eventos
  const checkForEvents = () => {
    if (gameState.gameOver || gameState.gameWon || !gameState.isPlaying) return;

    // 80% de chance de evento acontecer se a condição for atendida
    const eventChance = Math.random();
    if (eventChance > 0.8) return; // 80% de chance

    const availableEvents = gameEvents.filter(event => 
      event.condition ? event.condition(gameState) : false
    );

    if (availableEvents.length > 0) {
      const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setCurrentEvent(randomEvent);
      setShowEventModal(true);
      setGameState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Função para lidar com escolhas de eventos
  const handleEventChoice = (choice: any) => {
    setGameState(prev => ({
      ...prev,
      energy: Math.max(0, Math.min(100, prev.energy + (choice.effects.energy || 0))),
      sleep: Math.max(0, Math.min(100, prev.sleep + (choice.effects.sleep || 0))),
      health: Math.max(0, Math.min(100, prev.health + (choice.effects.health || 0))),
      isPlaying: true
    }));
    setShowEventModal(false);
    setCurrentEvent(null);
  };

  // Função para lidar com cliques em objetos
  const handleObjectClick = (objectId: string) => {
    if (gameState.usedObjects.has(objectId) || gameState.gameOver || gameState.gameWon) return;

    const roomObjects = gameObjects[gameState.currentRoom as keyof typeof gameObjects];
    const object = roomObjects.find(obj => obj.id === objectId);
    
    if (object) {
      setGameState(prev => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + (object.effects.energy || 0))),
        sleep: Math.max(0, Math.min(100, prev.sleep + (object.effects.sleep || 0))),
        health: Math.max(0, Math.min(100, prev.health + (object.effects.health || 0))),
        usedObjects: new Set([...prev.usedObjects, objectId])
      }));
    }
  };

  // Função para mudar de sala
  const changeRoom = (roomId: string) => {
    setGameState(prev => ({ ...prev, currentRoom: roomId }));
  };

  // Função para iniciar o jogo (após boas-vindas)
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      isPlaying: true
    }));
  };

  // Função para reiniciar o jogo
  const resetGame = () => {
    setGameState({
      energy: 80,
      sleep: 70,
      health: 90,
      day: 1,
      time: 450, // 07:30 da manhã
      gameSpeed: 1,
      isPlaying: false,
      gameOver: false,
      gameWon: false,
      usedObjects: new Set(),
      currentRoom: 'bedroom',
      showWelcome: true // Mostrar boas-vindas novamente
    });
    setCurrentEvent(null);
    setShowEventModal(false);
  };

  // Função para alternar play/pause
  const togglePlayPause = () => {
    if (gameState.showWelcome) return; // Não permitir play/pause durante boas-vindas
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  // Função para alternar mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Effect para o loop do jogo
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver || gameState.gameWon || gameState.showWelcome) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        let newTime = prev.time + (2 * prev.gameSpeed); // 2 minutos por tick
        let newDay = prev.day;

        // Verificar se passou da meia-noite (1440 minutos = 24 horas)
        if (newTime >= 1440) {
          newTime = newTime - 1440; // Reset para 00:00
          newDay = prev.day + 1;
        }

        // Degradação natural dos stats ao longo do tempo
        let newEnergy = prev.energy - 0.3;
        let newSleep = prev.sleep - 0.2;
        let newHealth = prev.health - 0.1;

        // Regeneração durante o sono (entre 22:00 e 08:00)
        if (newTime >= 1320 || newTime <= 480) { // 22:00 às 08:00
          newEnergy += 0.5;
          newSleep += 0.8;
          newHealth += 0.3;
        }

        // Limitar valores entre 0 e 100
        newEnergy = Math.max(0, Math.min(100, newEnergy));
        newSleep = Math.max(0, Math.min(100, newSleep));
        newHealth = Math.max(0, Math.min(100, newHealth));

        // Verificar condições de game over
        const gameOver = newEnergy <= 0 || newSleep <= 0 || newHealth <= 0;
        
        // Verificar condições de vitória (7 dias completos)
        const gameWon = newDay > 7 && newEnergy > 50 && newSleep > 50 && newHealth > 50;

        return {
          ...prev,
          time: newTime,
          day: newDay,
          energy: newEnergy,
          sleep: newSleep,
          health: newHealth,
          gameOver,
          gameWon,
          isPlaying: !gameOver && !gameWon
        };
      });

      // Verificar eventos a cada tick
      checkForEvents();
    }, 1000 / gameState.gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, gameState.gameSpeed, gameState.gameOver, gameState.gameWon, gameState.showWelcome]);

  // Effect para música
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.muted = isMuted;
      
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.log('Autoplay prevented:', error);
        }
      };
      
      playAudio();
    }
  }, [isMuted]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="/[KAIROSOFT SOUNDTRACKS] Game Dev Story Working Hard (1) (2).mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Dream Story</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Mensagem de Boas-vindas */}
      {gameState.showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`max-w-md mx-4 p-8 rounded-2xl border text-center transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/95 border-slate-800' 
              : 'bg-white/95 border-gray-200 shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gamepad2 className="w-8 h-8 text-emerald-400" />
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              💤 Bem-vindo ao Dream Story!
            </h2>
            
            <p className={`text-base leading-relaxed mb-8 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Aqui você vai guiar Alex por uma jornada em busca de melhorar seu sono e sua saúde.
              <br /><br />
              Faça boas escolhas, mantenha o equilíbrio e cuide bem do corpo e da mente!
              <br /><br />
              Boa sorte!
            </p>
            
            <button
              onClick={startGame}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Vamos lá!
            </button>
          </div>
        </div>
      )}

      {/* Game Interface */}
      {!gameState.showWelcome && (
        <>
          {/* Game Stats */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {/* Dia da Semana */}
              <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}>
                <Calendar className={`w-5 h-5 mx-auto mb-2 transition-colors duration-300 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
                <div className={`text-sm font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{getCurrentDayOfWeek()}</div>
                <div className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Dia {gameState.day}</div>
              </div>

              {/* Tempo */}
              <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}>
                <Clock className={`w-5 h-5 mx-auto mb-2 transition-colors duration-300 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className={`text-sm font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{formatTime(gameState.time)}</div>
                <div className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Horário</div>
              </div>

              {/* Energia */}
              <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}>
                <Zap className={`w-5 h-5 mx-auto mb-2 transition-colors duration-300 ${
                  gameState.energy > 50 ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <div className={`text-sm font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{Math.round(gameState.energy)}</div>
                <div className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Energia</div>
              </div>

              {/* Sono */}
              <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}>
                <div className={`w-5 h-5 mx-auto mb-2 transition-colors duration-300 ${
                  gameState.sleep > 50 ? 'text-purple-400' : 'text-red-400'
                }`}>💤</div>
                <div className={`text-sm font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{Math.round(gameState.sleep)}</div>
                <div className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Sono</div>
              </div>

              {/* Saúde */}
              <div className={`backdrop-blur-sm rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}>
                <Heart className={`w-5 h-5 mx-auto mb-2 transition-colors duration-300 ${
                  gameState.health > 50 ? 'text-green-400' : 'text-red-400'
                }`} />
                <div className={`text-sm font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{Math.round(gameState.health)}</div>
                <div className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>Saúde</div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={togglePlayPause}
                className={`p-3 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                {gameState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={resetGame}
                className={`p-3 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Room Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => changeRoom(room.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    gameState.currentRoom === room.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {room.icon} {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Game Area */}
          <div className="px-6 pb-6">
            <div className={`relative h-96 rounded-2xl overflow-hidden border transition-colors duration-300 ${
              isDark 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-gray-200 shadow-sm'
            }`}>
              {/* Room Background */}
              <div className={`pixel-room pixel-game-container room-${gameState.currentRoom}`}>
                <div className={`pixel-room-bg room-bg-${gameState.currentRoom}`}></div>
                
                {/* Character */}
                <div className="pixel-character">
                  <div className="alex-sprite-2d alex-idle-2d"></div>
                  <div className="character-shadow-2d"></div>
                </div>

                {/* Room Objects */}
                {gameObjects[gameState.currentRoom as keyof typeof gameObjects].map((object) => (
                  <div
                    key={object.id}
                    className={`pixel-object ${object.className} ${
                      gameState.usedObjects.has(object.id) ? 'used' : 'available'
                    }`}
                    onClick={() => handleObjectClick(object.id)}
                    title={object.name}
                  >
                    {gameState.usedObjects.has(object.id) && (
                      <div className="pixel-completion">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Modal */}
          {showEventModal && currentEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className={`max-w-md mx-4 p-6 rounded-2xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-800' 
                  : 'bg-white/95 border-gray-200 shadow-xl'
              }`}>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentEvent.title}
                </h3>
                <p className={`mb-6 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {currentEvent.description}
                </p>
                <div className="space-y-3">
                  {currentEvent.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleEventChoice(choice)}
                      className={`w-full p-3 rounded-xl text-left transition-colors ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Game Over Modal */}
          {(gameState.gameOver || gameState.gameWon) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className={`max-w-md mx-4 p-8 rounded-2xl border text-center transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-800' 
                  : 'bg-white/95 border-gray-200 shadow-xl'
              }`}>
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {gameState.gameWon ? (
                    <span className="text-2xl">🎉</span>
                  ) : (
                    <span className="text-2xl">😴</span>
                  )}
                </div>
                
                <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {gameState.gameWon ? 'Parabéns!' : 'Game Over'}
                </h2>
                
                <p className={`mb-8 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {gameState.gameWon 
                    ? 'Você conseguiu manter uma rotina saudável por uma semana completa!'
                    : 'Seus níveis de energia, sono ou saúde chegaram a zero. Tente novamente!'
                  }
                </p>
                
                <button
                  onClick={resetGame}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reiniciar Jogo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DreamStoryGame;