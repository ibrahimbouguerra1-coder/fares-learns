/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLearning } from '../context/LearningContext.tsx';

export function useAudioSpeaker() {
  const { progress } = useLearning();
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = useCallback(
    (id?: string) => {
      if (!id) return !!currentAudioId;
      return currentAudioId === id;
    },
    [currentAudioId]
  );

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentAudioId(null);
  }, []);

  const playSpeech = useCallback(
    (text: string, id?: string, customRate?: number) => {
      if (!text || typeof window === 'undefined') return;

      stopCurrent();
      const activeId = id || `audio-${Date.now()}`;
      setCurrentAudioId(activeId);

      const cleanText = text.replace(/[*_#`~[\]()]/g, '').trim();
      const targetRate = customRate ?? progress.speechPace ?? 0.9;
      const targetLang = progress.preferredAccent === 'UK' ? 'en-GB' : 'en-US';

      // 1. Try SpeechSynthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = targetRate;
        utterance.lang = targetLang;

        // Try to pick a natural English voice matching target accent
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith(targetLang.slice(0, 2)) &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen'))
        ) || voices.find((v) => v.lang.startsWith(targetLang.slice(0, 2)));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          setCurrentAudioId((prev) => (prev === activeId ? null : prev));
        };

        utterance.onerror = () => {
          setCurrentAudioId((prev) => (prev === activeId ? null : prev));
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setCurrentAudioId(null);
      }
    },
    [progress.speechPace, progress.preferredAccent, stopCurrent]
  );

  useEffect(() => {
    // Pre-populate speech voices on load if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => {
        stopCurrent();
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
      };
    }

    return () => {
      stopCurrent();
    };
  }, [stopCurrent]);

  return {
    isPlaying,
    playSpeech,
    stopCurrent,
    currentAudioId,
  };
}
