'use client';

import { useState, useCallback } from 'react';
import { aiService } from '@/lib/api/services/aiService';
import type {
  SignRecognitionResult,
  DictionaryEntry,
  ObjectDetectionResult,
  OCRResult,
  SceneDescription,
  AIHealthStatus,
} from '@/lib/api/types';

interface AIState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useIsyaratAI() {
  const [recognitionState, setRecognitionState] = useState<AIState<SignRecognitionResult>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [dictionaryState, setDictionaryState] = useState<AIState<DictionaryEntry[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [ttsState, setTtsState] = useState<AIState<Blob>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const recognize = useCallback(async (image: File) => {
    setRecognitionState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.isyarat.recognize(image);
    if (response.error) {
      setRecognitionState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setRecognitionState(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  const recognizeSequence = useCallback(async (images: File[]) => {
    setRecognitionState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.isyarat.recognizeSequence(images);
    if (response.error) {
      setRecognitionState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setRecognitionState(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  const searchDictionary = useCallback(async (query?: string) => {
    setDictionaryState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.isyarat.dictionary(query);
    if (response.error) {
      setDictionaryState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    // API returns { entries: [...], total: N } — unwrap entries
    const raw = response.data as unknown as { entries?: DictionaryEntry[] } | DictionaryEntry[] | null;
    const entries = Array.isArray(raw) ? raw : (raw?.entries ?? []);
    setDictionaryState(prev => ({
      ...prev,
      isLoading: false,
      data: entries,
    }));
    return { data: entries };
  }, []);

  const speak = useCallback(async (text: string) => {
    setTtsState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.isyarat.tts(text);
    if (response.error) {
      setTtsState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    const blob = response.data as Blob;
    setTtsState(prev => ({ ...prev, isLoading: false, data: blob }));
    return { data: blob };
  }, []);

  return {
    recognition: recognitionState,
    dictionary: dictionaryState,
    tts: ttsState,
    recognize,
    recognizeSequence,
    searchDictionary,
    speak,
  };
}

export function useVisionAI() {
  const [detectionState, setDetectionState] = useState<AIState<ObjectDetectionResult>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [ocrState, setOcrState] = useState<AIState<OCRResult>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [sceneState, setSceneState] = useState<AIState<SceneDescription>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [ttsState, setTtsState] = useState<AIState<Blob>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const detect = useCallback(async (image: File) => {
    setDetectionState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.vision.detect(image);
    if (response.error) {
      setDetectionState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setDetectionState(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  const extractText = useCallback(async (image: File) => {
    setOcrState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.vision.ocr(image);
    if (response.error) {
      setOcrState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setOcrState(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  const describe = useCallback(async (image: File) => {
    setSceneState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.vision.describe(image);
    if (response.error) {
      setSceneState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setSceneState(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  const speak = useCallback(async (text: string) => {
    setTtsState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.vision.tts(text);
    if (response.error) {
      setTtsState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    const blob = response.data as Blob;
    setTtsState(prev => ({ ...prev, isLoading: false, data: blob }));
    return { data: blob };
  }, []);

  return {
    detection: detectionState,
    ocr: ocrState,
    scene: sceneState,
    tts: ttsState,
    detect,
    extractText,
    describe,
    speak,
  };
}

export function useAIHealth() {
  const [health, setHealth] = useState<AIState<AIHealthStatus>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const checkHealth = useCallback(async () => {
    setHealth(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await aiService.health();
    if (response.error) {
      setHealth(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
      return { error: response.error };
    }
    setHealth(prev => ({ ...prev, isLoading: false, data: response.data }));
    return { data: response.data };
  }, []);

  return { ...health, checkHealth };
}
