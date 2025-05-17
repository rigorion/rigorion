import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { BookOpen, Layout, Layers, BookText } from 'lucide-react';
import ModuleCard from '@/components/ui/ModuleCard';
import { CategoryCard } from '@/components/CategoryCard';

// Sample module data for the course cards
const modules = [
  {
    id: "sat-math",
    title: "SAT Math Preparation",
    imageUrl: "https://cdn.pixabay.com/photo/2015/04/20/18/58/student-732012_1280.jpg",
    category: "Mathematics",
    questionsCount: 500,
    chaptersCount: 12,
    participantsCount: 3500,
    status: "available",
    rating: 4.8,
    price: "$49.99",
    examsCount: 10
  },
  {
    id: "act-math",
    title: "ACT Math Complete Course",
    imageUrl: "https://cdn.pixabay.com/photo/2020/02/13/16/11/street-4846133_1280.jpg",
    category: "Mathematics",
    questionsCount: 450,
    chaptersCount: 10,
    participantsCount: 2800,
    status: "available",
    rating: 4.7,
    price: "$49.99",
    examsCount: 8
  },
  {
    id: "gre-quantitative",
    title: "GRE Quantitative Reasoning",
    imageUrl: "https://cdn.pixabay.com/photo/2017/10/01/14/14/street-2805643_1280.jpg",
    category: "Graduate Exam",
    questionsCount: 600,
    chaptersCount: 14,
    participantsCount: 4200,
    status: "available",
    rating: 4.9,
    price: "$59.99",
    examsCount: 12
  },
  {
    id: "ap-calculus",
    title: "AP Calculus AB & BC",
    imageUrl: "https://cdn.pixabay.com/photo/2019/09/22/16/18/bicycle-4496443_640.jpg",
    category: "Advanced Placement",
    questionsCount: 420,
    chaptersCount: 15,
    participantsCount: 2200,
    status: "coming-soon",
    rating: 4.5,
    price: "$49.99",
    examsCount: 8
  }
];

// Categories section data
const categories = [
  {
    title: "Practice Questions",
    description: "Access our extensive bank of SAT math practice questions organized by topic and difficulty.",
    icon: BookOpen
  },
  {
    title: "Full-Length Tests",
    description: "Take timed, full-length SAT math section tests that simulate the real exam experience.",
    icon: Layout
  },
  {
    title: "Topic Review",
    description: "Comprehensive review materials covering all SAT math topics and concepts.",
    icon: Layers
  },
  {
    title: "Study Guides",
    description: "Structured study plans and guides to optimize your SAT math preparation.",
    icon: BookText
  }
];

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('welcome');
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome to SAT Math Prep</h1>
          
          {/* Featured course section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>

          {/* Categories section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Study Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                />
              ))}
            </div>
          </section>
          
          {/* Quick links section - keeping the original navigation cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
            <div className="p-6 bg-white rounded-xl shadow-sm">              
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
          </section>
          
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
