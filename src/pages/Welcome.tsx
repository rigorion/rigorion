
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('welcome');
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to SAT Math Prep</h1>
          
          <div className="mb-12 p-6 bg-white rounded-xl shadow-sm">
            <p className="text-xl mb-6">
              Thank you for joining our platform! We're excited to help you 
              prepare for the SAT Math section and achieve your target score.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition">
                <h2 className="text-xl font-semibold mb-2">Practice Questions</h2>
                <p className="mb-4">Start practicing with our extensive question bank.</p>
                <Link to="/practice">
                  <Button>Start Practice</Button>
                </Link>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition">
                <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
                <p className="mb-4">Monitor your performance and identify areas for improvement.</p>
                <Link to="/progress">
                  <Button>View Progress</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition">
                <h2 className="text-xl font-semibold mb-2">AI Chat Assistant</h2>
                <p className="mb-4">Get help with specific questions from our AI tutor.</p>
                <Link to="/chat">
                  <Button>Open Chat</Button>
                </Link>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition">
                <h2 className="text-xl font-semibold mb-2">API Endpoints</h2>
                <p className="mb-4">Explore all available API endpoints and their responses.</p>
                <Link to="/endpoints">
                  <Button>View Endpoints</Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4">
              Need help getting started? Check out our <Link to="/about" className="text-blue-600 hover:underline">About page</Link> for tips and resources.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
