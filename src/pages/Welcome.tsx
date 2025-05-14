import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderTwo from '@/components/ui/HeaderTwo';
import ModuleCard, { Module } from '@/components/ui/ModuleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

// Mock data - keep the same modules data
const MODULES: Module[] = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    imageUrl: 'https://cdn.pixabay.com/photo/2021/10/01/03/57/mountain-6671289_960_720.jpg',
    category: 'Mathematics',
    questionsCount: 125,
    chaptersCount: 8,
    examsCount: 5,
    participantsCount: 1250,
    status: 'available',
    rating: 4.5,
    price: '€0.99/month',
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3',
    category: 'Chemistry',
    questionsCount: 98,
    chaptersCount: 6,
    examsCount: 4,
    participantsCount: 985,
    status: 'available',
    rating: 4.0,
    price: '€0.99/month',
  },
  {
    id: '3',
    title: 'World History: Ancient Civilizations',
    imageUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-4.0.3',
    category: 'History',
    questionsCount: 210,
    chaptersCount: 12,
    examsCount: 7,
    participantsCount: 1750,
    status: 'available',
    rating: 4.8,
    price: '€0.99/month',
  },
  {
    id: '4',
    title: 'Physics: Mechanics and Motion',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3',
    category: 'Physics',
    questionsCount: 156,
    chaptersCount: 10,
    examsCount: 6,
    participantsCount: 1420,
    status: 'available',
    rating: 4.2,
    price: '€0.99/month',
  },
  {
    id: '5',
    title: 'Introduction to Literature',
    imageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?ixlib=rb-4.0.3',
    category: 'Literature',
    questionsCount: 87,
    chaptersCount: 7,
    examsCount: 3,
    participantsCount: 890,
    status: 'available',
    rating: 3.9,
    price: '€0.99/month',
  },
  {
    id: '6',
    title: 'Advanced Quantum Physics',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3',
    category: 'Physics',
    questionsCount: 178,
    chaptersCount: 14,
    examsCount: 5,
    participantsCount: 0,
    status: 'coming-soon',
    rating: 0,
    price: '€0.99/month',
  },
  {
    id: '7',
    title: 'Molecular Biology Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1530026454774-50cce722a1fb?ixlib=rb-4.0.3',
    category: 'Biology',
    questionsCount: 132,
    chaptersCount: 9,
    examsCount: 4,
    participantsCount: 1100,
    status: 'available',
    rating: 4.6,
    price: '€0.99/month',
  },
  {
    id: '8',
    title: 'Statistical Analysis Methods',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
    category: 'Statistics',
    questionsCount: 110,
    chaptersCount: 11,
    examsCount: 2,
    participantsCount: 0,
    status: 'coming-soon',
    rating: 0,
    price: '€0.99/month',
  },
];

// Filter options based on module categories
const FILTER_OPTIONS = [
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Physics', label: 'Physics' },
  { id: 'Biology', label: 'Biology' },
  { id: 'History', label: 'History' },
  { id: 'Literature', label: 'Literature' },
  { id: 'Statistics', label: 'Statistics' },
  { id: 'available', label: 'Available Now' },
  { id: 'coming-soon', label: 'Coming Soon' },
];

// Featured modules - top 3 modules for showcase
const FEATURED_MODULES = MODULES.slice(0, 3);

const Welcome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>(MODULES);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Filter modules based on search query and selected filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      let result = MODULES;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(module => 
          module.title.toLowerCase().includes(query) || 
          module.category.toLowerCase().includes(query)
        );
      }
      
      // Apply category/status filters
      if (selectedFilters.length > 0) {
        result = result.filter(module => 
          selectedFilters.includes(module.category) || 
          selectedFilters.includes(module.status)
        );
      }

      // Apply tab filter
      if (activeCategory !== "all") {
        result = result.filter(module => module.category === activeCategory);
      }
      
      setFilteredModules(result);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilters, activeCategory]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  // Generate stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  // Get unique categories for tabs
  const uniqueCategories = Array.from(new Set(MODULES.map(module => module.category)));

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HeaderTwo 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        filterOptions={FILTER_OPTIONS}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Carousel Section - Streaming Style */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Courses</h2>
          
          {FEATURED_MODULES.map((module, index) => (
            <div key={`featured-${module.id}`} className="flex flex-col md:flex-row mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-white border border-gray-100 shadow-sm">
              {/* Left side - Details */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-center">
                    <div className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                      {module.status === "available" ? "Available" : "Coming Soon"}
                    </div>
                    
                    {module.status === "available" && (
                      <div className="flex items-center">
                        <div className="flex">
                          {renderStars(Math.round(module.rating))}
                        </div>
                        <span className="text-gray-700 text-xs ml-1">
                          {module.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{module.category}</p>
                  
                  <div className="text-sm text-gray-500 space-y-1 mb-6">
                    <p>{module.questionsCount} questions</p>
                    <p>{module.chaptersCount} chapters</p>
                    {module.examsCount && <p>{module.examsCount} exams</p>}
                    <p>{module.participantsCount.toLocaleString()} participants</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {module.status === "available" ? (
                    <>
                      <button 
                        onClick={() => navigate('/payment', { state: { module } })}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Watch now
                      </button>
                      <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors">
                        Add to my list
                      </button>
                    </>
                  ) : (
                    <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed">
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
              
              {/* Right side - Image */}
              <div className="md:w-1/2 relative h-48 md:h-auto">
                <img 
                  src={module.imageUrl} 
                  alt={module.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/30 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Category Pills */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="flex overflow-x-auto gap-2 pb-2 mb-4">
            <TabsTrigger value="all" className="rounded-full">
              All
            </TabsTrigger>
            {uniqueCategories.map(category => (
              <TabsTrigger key={category} value={category} className="rounded-full">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Academic Modules</h2>
        </div>
        
        {loading ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-5 mt-3 w-3/4" />
                <Skeleton className="h-4 mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-5 rounded-full mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-1">No modules found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any modules matching your search criteria. 
              Please try a different search term or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredModules.map((module) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );  
};

export default Welcome;
