import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export const useSpeechRecognition = () => {
  const [state, setState] = useState('idle'); // 'idle' | 'starting' | 'listening' | 'processing' | 'done' | 'error'
  const [heard, setHeard] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const hasResultRef = useRef(false);

  useEffect(() => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync().then(({ granted }) => {
      setPermissionGranted(granted);
    });
  }, []);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results?.[0]?.transcript ?? null;
    if (transcript && !hasResultRef.current) {
      hasResultRef.current = true;
      setHeard(transcript);
      setState('processing');
      ExpoSpeechRecognitionModule.stop();
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setState((prev) => (['starting', 'listening', 'processing'].includes(prev) ? 'done' : prev));
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      setState('error');
    }
  });

  const start = useCallback(() => {
    hasResultRef.current = false;
    setHeard(null);
    setState('starting');
    ExpoSpeechRecognitionModule.start({
      lang: 'zh-CN',
      interimResults: true,
      continuous: true,
      maxAlternatives: 1,
    });
    setTimeout(() => {
      setState((prev) => (prev === 'starting' ? 'listening' : prev));
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
    setState((prev) => (prev === 'listening' ? 'processing' : prev));
  }, []);

  const reset = useCallback(() => {
    hasResultRef.current = false;
    setHeard(null);
    setState('idle');
  }, []);

  return { state, heard, permissionGranted, start, stop, reset };
};
