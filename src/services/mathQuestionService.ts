// src/api/getModelSatQuestions.ts
export async function getModelSatQuestions() {
  try {
    const response = await fetch(
      'https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-sat-model-question'
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
