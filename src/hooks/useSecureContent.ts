import { useState, useEffect } from 'react';

export default function useSecureContent() {
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const worker = new Worker(new URL('../workers/decrypt.worker.ts', import.meta.url), { type: 'module' });

  useEffect(() => {
    // Fetch encrypted data
    fetch(import.meta.env.VITE_SUPABASE_STORAGE_URL)
      .then((res) => {
        //console.log('Response Status:', res.status);  // Log the response status
        return res.text();  // Get the raw response as text
      })
      .then((text) => {
        //console.log('Raw Response Text:', text);  // Log the raw response text
        
        try {
          const data = JSON.parse(text);  // Attempt to parse the text as JSON
          //console.log('Parsed JSON Data:', data);  // Log the parsed JSON data
          setQuestions(data.questions);  // Set the questions from the parsed data
        } catch (error) {
          console.error('Error Parsing JSON:', error);  // Log any parsing error
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // Log any error that occurs during fetch
      });

    return () => worker.terminate();  // Clean up the worker when the component unmounts
  }, []);

  const decryptQuestion = (questionId: string): Promise<string> => {
    return new Promise((resolve) => {
      worker.postMessage({ cipherText: questions[questionId] });
      worker.onmessage = (e) => {
        if (e.data.success) resolve(e.data.result);
        else resolve('Unable to decrypt content');
      };
    });
  };

  return { decryptQuestion };
}
