
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

export async function getCustomFunction() {
  try {
    const { data, error } = await callEdgeFunction('my-function');
    
    if (error) {
      console.error('Error fetching from my-function endpoint:', error);
      return { data: null, error: error.message };
    }
    
    console.log('Successfully fetched data from my-function:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Exception when fetching from my-function:', error);
    return { data: null, error: error instanceof Error ? error.message : String(error) };
  }
}
