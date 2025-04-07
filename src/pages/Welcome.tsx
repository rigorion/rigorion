import React, { useState, useEffect } from 'react';
import HeaderTwo from '@/components/ui/HeaderTwo';
import ModuleCard, { Module } from '@/components/ui/ModuleCard';

// Mock data
const MODULES: Module[] = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3',
    category: 'Mathematics',
    questionsCount: 125,
    chaptersCount: 8,
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
    chaptersCount: 12,
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
    chaptersCount: 15,
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>(MODULES);
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
      
      setFilteredModules(result);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeaderTwo 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        filterOptions={FILTER_OPTIONS}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">Academic Modules</h2>
          <p className="text-slate-500">Browse our collection of academic modules and start learning</p>
        </div>
        
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-blue-light/30 p-5 rounded-full mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-blue-dark/70" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-1">No modules found</h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any modules matching your search criteria. 
              Please try a different search term or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredModules.map((module, index) => (
              <div 
                key={module.id} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ModuleCard module={module} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );  
};

export default Index;


