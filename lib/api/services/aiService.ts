import { apiClient } from '../client';

export const aiService = {
  // Isyarat (Sign Language) AI
  isyarat: {
    recognize: async (image: File) => {
      return await apiClient.aiIsyarat.recognize(image);
    },
    recognizeSequence: async (images: File[]) => {
      return await apiClient.aiIsyarat.recognizeSequence(images);
    },
    dictionary: async (query?: string) => {
      return await apiClient.aiIsyarat.dictionary(query);
    },
    dictionaryGet: async (key: string) => {
      return await apiClient.aiIsyarat.dictionaryGet(key);
    },
    tts: async (text: string) => {
      return await apiClient.aiIsyarat.tts(text);
    },
  },

  // Vision AI
  vision: {
    detect: async (image: File) => {
      return await apiClient.aiVision.detect(image);
    },
    ocr: async (image: File) => {
      return await apiClient.aiVision.ocr(image);
    },
    describe: async (image: File) => {
      return await apiClient.aiVision.describe(image);
    },
    tts: async (text: string) => {
      return await apiClient.aiVision.tts(text);
    },
  },

  // Health check
  health: async () => {
    return await apiClient.aiHealth();
  },
};
