import { useState } from "react"; // Import useState from React
import useSecureContent from "@/hooks/useSecureContent"; // Assuming this hook exists

function Questions({ id }: { id: string }) {
  const { decryptQuestion } = useSecureContent();
  const [answer, setAnswer] = useState<string>(''); // Type for answer as string
  
  const handleClick = async () => {
    const result = await decryptQuestion(id); // Assuming decryptQuestion returns a string
    setAnswer(result);
  };

  return (
    <div>
      <button onClick={handleClick}>Show Answer</button>
      <p className="secure-content">{answer}</p>
    </div>
  );
}

export default Questions;
