
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, SkipForward, Settings, Clock, Volume2, VolumeX } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  // Timer settings
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  
  // Timer state
  const [mode, setMode] = useState<'pomodoro' | 'short-break' | 'long-break'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(pomodoroMinutes * 60);
  const [isPaused, setIsPaused] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/timer-complete.mp3');
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update timer display when settings change
  useEffect(() => {
    switch (mode) {
      case 'pomodoro':
        setSecondsLeft(pomodoroMinutes * 60);
        break;
      case 'short-break':
        setSecondsLeft(shortBreakMinutes * 60);
        break;
      case 'long-break':
        setSecondsLeft(longBreakMinutes * 60);
        break;
    }
  }, [mode, pomodoroMinutes, shortBreakMinutes, longBreakMinutes]);

  // Timer logic
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    
    switch (mode) {
      case 'pomodoro':
        setSessionsCompleted(prev => {
          const newCount = prev + 1;
          
          // Notify session complete
          toast({
            title: 'Session terminée !',
            description: 'Vous avez terminé une session de travail'
          });
          
          if (onSessionComplete) {
            onSessionComplete();
          }
          
          // Determine next break type
          if (newCount % longBreakInterval === 0) {
            setMode('long-break');
            toast({
              description: 'Prenez une longue pause, vous l\'avez bien méritée !'
            });
          } else {
            setMode('short-break');
            toast({
              description: 'Prenez une courte pause'
            });
          }
          
          return newCount;
        });
        break;
        
      case 'short-break':
      case 'long-break':
        setMode('pomodoro');
        toast({
          title: 'Pause terminée',
          description: 'C\'est reparti pour une nouvelle session de travail !'
        });
        break;
    }
    
    setIsPaused(true);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const skipToNextPhase = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    handleTimerComplete();
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateProgress = () => {
    let totalSeconds;
    switch (mode) {
      case 'pomodoro':
        totalSeconds = pomodoroMinutes * 60;
        break;
      case 'short-break':
        totalSeconds = shortBreakMinutes * 60;
        break;
      case 'long-break':
        totalSeconds = longBreakMinutes * 60;
        break;
    }
    
    return 100 - (secondsLeft / totalSeconds * 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pomodoro Timer</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showSettings ? (
          <>
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                <TabsTrigger value="short-break">Pause courte</TabsTrigger>
                <TabsTrigger value="long-break">Pause longue</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-bold mb-6">
                {formatTime(secondsLeft)}
              </div>
              
              <Progress value={calculateProgress()} className="w-full h-2 mb-6" />
              
              <div className="flex gap-3">
                <Button onClick={togglePause}>
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Démarrer
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={skipToNextPhase}>
                  <SkipForward className="mr-2 h-4 w-4" /> Passer
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Sessions complétées aujourd'hui: <span className="font-medium">{sessionsCompleted}</span>
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Paramètres du timer</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Durée du Pomodoro: {pomodoroMinutes} min
                  </label>
                </div>
                <Slider
                  value={[pomodoroMinutes]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={(v) => setPomodoroMinutes(v[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Pause courte: {shortBreakMinutes} min
                  </label>
                </div>
                <Slider
                  value={[shortBreakMinutes]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(v) => setShortBreakMinutes(v[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Pause longue: {longBreakMinutes} min
                  </label>
                </div>
                <Slider
                  value={[longBreakMinutes]}
                  min={5}
                  max={60}
                  step={1}
                  onValueChange={(v) => setLongBreakMinutes(v[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Longue pause après: {longBreakInterval} sessions
                  </label>
                </div>
                <Slider
                  value={[longBreakInterval]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(v) => setLongBreakInterval(v[0])}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => setShowSettings(false)}
              >
                Appliquer les paramètres
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-center justify-center text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          La technique Pomodoro permet d'améliorer votre concentration et votre productivité
        </div>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
