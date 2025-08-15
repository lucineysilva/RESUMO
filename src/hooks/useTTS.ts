import { useState, useEffect, useCallback } from 'react';
import { TTSSettings } from '../types';

export const useTTS = () => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<TTSSettings>({
    voice: null,
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const portugueseVoices = availableVoices.filter(voice => 
        voice.lang.includes('pt-BR') || voice.lang.includes('pt')
      );
      
      setVoices(portugueseVoices.length > 0 ? portugueseVoices : availableVoices);
      
      // Selecionar voz padrão em português brasileiro se disponível
      const defaultVoice = portugueseVoices.find(voice => 
        voice.lang === 'pt-BR' && voice.name.includes('Google')
      ) || portugueseVoices[0] || availableVoices[0];
      
      if (defaultVoice && !settings.voice) {
        setSettings(prev => ({ ...prev, voice: defaultVoice }));
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [settings.voice]);

  const speak = useCallback((text: string, onBoundary?: (event: SpeechSynthesisEvent) => void) => {
    if (!text.trim()) return;

    // Parar qualquer leitura em andamento
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = settings.voice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = 'pt-BR';

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    if (onBoundary) {
      utterance.onboundary = onBoundary;
    }

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  }, [settings]);

  const pause = useCallback(() => {
    if (isReading && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isReading, isPaused]);

  const resume = useCallback(() => {
    if (isReading && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isReading, isPaused]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<TTSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isReading,
    isPaused,
    voices,
    settings,
    speak,
    pause,
    resume,
    stop,
    updateSettings,
  };
};
