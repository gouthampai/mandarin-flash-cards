import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export const useSpeechRecognition = () => {
  const [state, setState] = useState('idle'); // idle | starting | listening | processing | done | no-speech | error
  const [heard, setHeard] = useState(null);
  const [volume, setVolume] = useState(-2);
  const [permissionGranted, setPermissionGranted] = useState(null);

  // supportsOnDeviceRecognition() confirms the device has any on-device capability.
  // We still optimistically try zh-CN and fall back via error if it's not available,
  // since Android 14+ doesn't expose per-locale on-device availability.
  const onDeviceAvailableRef = useRef(
    ExpoSpeechRecognitionModule.supportsOnDeviceRecognition()
  );

  // All transcripts seen during a session (interim + final).
  // Checked in aggregate at 'end' so an early correct interim isn't discarded
  // if a later interim or the final result drifts to something different.
  const allTranscriptsRef = useRef([]);

  useEffect(() => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync().then(({ granted }) => {
      setPermissionGranted(granted);
    });

    // On Android 14+, on-device models are delivered via Play system updates and
    // are not discoverable through getSupportedLocales/androidTriggerOfflineModelDownload.
    // We optimistically enable requiresOnDeviceRecognition and let the error handler
    // below disable it permanently if the device truly lacks the model.
  }, []);

  // Mic is confirmed live only when this event fires — safe to speak now
  useSpeechRecognitionEvent('start', () => {
    setState((prev) => (prev === 'starting' ? 'listening' : prev));
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    setVolume(event.value);
  });

  // Collect every transcript as it arrives — both interim and final,
  // across all alternatives. maxAlternatives > 1 means the correct character
  // may appear as the 2nd or 3rd result even when not ranked first.
  useSpeechRecognitionEvent('result', (event) => {
    (event.results ?? []).forEach((r) => {
      if (r?.transcript) allTranscriptsRef.current.push(r.transcript);
    });
  });

  // 'end' is always the last event in a session. Commit the full transcript
  // list so the caller can check any of them for a match.
  useSpeechRecognitionEvent('end', () => {
    setVolume(-2);
    const transcripts = allTranscriptsRef.current;
    console.log('done', transcripts);
    if (transcripts.length > 0) {
      setHeard(transcripts);
      setState('done');
    } else {
      setState((prev) =>
        prev === 'listening' || prev === 'processing' ? 'no-speech' : prev
      );
    }
  });

  // 'error' fires before 'end' and also triggers teardownAndEnd, so 'end'
  // will follow. We just mark the right state here; 'end' cleans up volume.
  useSpeechRecognitionEvent('error', (event) => {
    if (event.error === 'aborted') return;
    if (event.error === 'no-speech' || event.error === 'speech-timeout') {
      setState('no-speech');
    } else if (event.error === 'language-not-supported') {
      // On-device zh-CN model genuinely not available — fall back to network
      // recognition for all future attempts this session.
      onDeviceAvailableRef.current = false;
      setState('error');
    } else {
      setState('error');
    }
  });

  const start = useCallback(({ contextualStrings } = {}) => {
    allTranscriptsRef.current = [];
    setHeard(null);
    setVolume(-2);
    setState('starting');
    ExpoSpeechRecognitionModule.start({
      lang: 'zh-CN',
      // continuous: false → standard SpeechRecognizer, no segmented sessions.
      // Segmented sessions (continuous: true on API 33+) route audio through an
      // internal ExpoAudioRecorder and gated onset detection, which was causing
      // the "no result on stop" bug.
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
      // Bias the recognizer toward the specific character being practiced
      contextualStrings: contextualStrings ?? [],
      // "web_search" model is tuned for short isolated words; "free_form" (default)
      // is tuned for continuous speech and performs poorly on single syllables
      androidIntentOptions: { EXTRA_LANGUAGE_MODEL: 'web_search' },
      // Only enable on-device recognition once we've confirmed the model is installed;
      // passing true without the model installed causes an immediate failure
      requiresOnDeviceRecognition: onDeviceAvailableRef.current,
      volumeChangeEventOptions: { enabled: true, intervalMillis: 80 },
    });
  }, []);

  const stop = useCallback(() => {
    setState('processing');
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const reset = useCallback(() => {
    allTranscriptsRef.current = [];
    setHeard(null);
    setVolume(-2);
    setState('idle');
  }, []);

  return { state, heard, volume, permissionGranted, start, stop, reset };
};
