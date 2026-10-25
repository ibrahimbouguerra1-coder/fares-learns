/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VoiceRecorderSession {
  stop: () => void;
  cancel: () => void;
}

export async function startUniversalVoiceCapture(
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onStateChange: (state: 'idle' | 'recording' | 'transcribing') => void,
  onInterim?: (liveText: string) => void,
  preferredLang: string = 'en-US'
): Promise<VoiceRecorderSession> {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (SpeechRecognition) {
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = preferredLang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let finalTranscript = '';
      let isStopped = false;

      recognition.onstart = () => {
        onStateChange('recording');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (onInterim && (interim || finalTranscript)) {
          onInterim(finalTranscript || interim);
        }
      };

      recognition.onerror = (event: any) => {
        if (isStopped) return;
        if (event.error === 'no-speech') {
          onError('لم يتم التقاط أي صوت، يرجى المحاولة مرة أخرى.');
        } else if (event.error === 'not-allowed') {
          onError('يرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح.');
        } else {
          onError(`خطأ في التعرف على الصوت: ${event.error}`);
        }
        onStateChange('idle');
      };

      recognition.onend = () => {
        if (!isStopped) {
          onStateChange('idle');
          if (finalTranscript.trim()) {
            onResult(finalTranscript.trim());
          }
        }
      };

      recognition.start();

      return {
        stop: () => {
          isStopped = true;
          try {
            recognition.stop();
          } catch {}
          onStateChange('idle');
          if (finalTranscript.trim()) {
            onResult(finalTranscript.trim());
          }
        },
        cancel: () => {
          isStopped = true;
          try {
            recognition.abort();
          } catch {}
          onStateChange('idle');
        },
      };
    } catch (err: any) {
      onError('تعذر تشغيل الميكروفون: ' + (err.message || 'خطأ غير متوقع'));
      onStateChange('idle');
      return { stop: () => {}, cancel: () => {} };
    }
  }

  // Fallback if browser lacks Web Speech API
  onError('متصفحك لا يدعم التعرف الصوتي المباشر. يرجى تجربة Google Chrome أو Edge.');
  onStateChange('idle');
  return { stop: () => {}, cancel: () => {} };
}
