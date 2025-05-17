
// src/services/mathQuestionService.ts
import { callEdgeFunction } from './edgeFunctionService';

export async function getModelSatQuestions() {
  try {
    const { data, error } = await callEdgeFunction('get-sat-model-question');
    
    return { data, error: error ? error.message : null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : String(error) };
  }
}
