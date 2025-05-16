
import { useState, useRef, useEffect, TouchEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";

type PromotionalItem = {
  id: string;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  isFeatured?: boolean;
};

const PROMOTIONAL_ITEMS: PromotionalItem[] = [
  {
    id: "quiz-1",
    title: "Personalized Study Plans",
    brand: "Rigorion Learning",
    description: "AI-driven study plans tailored to your specific learning needs, with real-time adjustments based on your performance and progress tracking.",
    tags: ["Personalized", "AI-Powered", "Study Plans", "Performance Tracking"],
    imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
    link: "/study-plans",
    isFeatured: true
  },
  {
    id: "quiz-2",
    title: "Interactive Quiz System",
    brand: "Rigorion Quizzes",
    description: "Engage with our advanced interactive quiz system that adapts to your knowledge level and helps identify areas that need improvement.",
    tags: ["Interactive", "Adaptive", "Quizzes", "Learning"],
    imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
    link: "/quiz-system"
  },
  {
    id: "quiz-3",
    title: "Video Tutorials",
    brand: "Rigorion Media",
    description: "Comprehensive video tutorials covering complex topics with expert instructors and visual aids to enhance understanding and retention.",
    tags: ["Video", "Tutorials", "Visual Learning", "Expert Guidance"],
    imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
    link: "/video-tutorials"
  },
  {
    id: "quiz-4",
    title: "Practice Exams",
    brand: "Rigorion Testing",
    description: "Full-length practice exams that simulate the actual test environment, helping you build confidence and improve time management skills.",
    tags: ["Practice", "Exam Prep", "Time Management", "Simulation"],
    imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
    link: "/practice-exams"
  },
  {
    id: "quiz-5",
    title: "Discussion Forums",
    brand: "Rigorion Community",
    description: "Connect with fellow students and instructors in our moderated discussion forums to ask questions, share insights, and collaborate.",
    tags: ["Community", "Discussion", "Collaboration", "Support"],
    imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
    link: "/forums"
  }
];

export const PartnerLogos = () => {
  const [activeProject, setActiveProject] = useState(0);
  const projectsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const minSwipeDistance = 50;

  useEffect(() => {
    if (isInView && !isHovering) {
      const interval = setInterval(() => {
        setActiveProject(prev => (prev + 1) % PROMOTIONAL_ITEMS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
      } else {
        setIsInView(false);
      }
    }, {
      threshold: 0.2
    });
    
    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveProject(prev => (prev + 1) % PROMOTIONAL_ITEMS.length);
    } else if (isRightSwipe) {
      setActiveProject(prev => (prev - 1 + PROMOTIONAL_ITEMS.length) % PROMOTIONAL_ITEMS.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === activeProject) return "scale-100 opacity-100 z-20";
    if (index === (activeProject + 1) % PROMOTIONAL_ITEMS.length) return "translate-x-[60%] scale-95 opacity-60 z-10";
    if (index === (activeProject - 1 + PROMOTIONAL_ITEMS.length) % PROMOTIONAL_ITEMS.length) return "translate-x-[-60%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };
  
  return <section id="products" ref={projectsRef} className="bg-gray-50 py-[50px] w-full h-[600px] overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`text-center mb-10 max-w-3xl mx-auto transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Our Products
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Master Any Exam with Rigorion
          </h2>
          <p className="text-gray-600">
            Explore our comprehensive suite of learning tools designed to help you succeed in any academic challenge.
          </p>
          {isMobile && (
            <div className="flex items-center justify-center mt-4 animate-pulse-slow">
              <div className="flex items-center text-[#8A0303]">
                <ChevronLeft size={16} />
                <p className="text-sm mx-1">Swipe to navigate</p>
                <ChevronRight size={16} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex">
          {/* Text Column - Only visible on desktop */}
          {!isMobile && (
            <div className="w-1/4 pr-8 hidden lg:block">
              <div className={`transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'}`}>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{PROMOTIONAL_ITEMS[activeProject].title}</h3>
                <p className="text-gray-600 mb-6">{PROMOTIONAL_ITEMS[activeProject].description}</p>
                <div className="flex flex-col space-y-2 mb-6">
                  {PROMOTIONAL_ITEMS[activeProject].tags.map((tag, idx) => (
                    <span key={idx} className="text-sm text-gray-600">• {tag}</span>
                  ))}
                </div>
                <Link 
                  to={PROMOTIONAL_ITEMS[activeProject].link}
                  className="text-[#8A0303] inline-flex items-center font-medium hover:underline group"
                >
                  <span>Explore {PROMOTIONAL_ITEMS[activeProject].title}</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )}
          
          {/* Carousel */}
          <div 
            className={`relative ${!isMobile ? 'w-3/4' : 'w-full'} h-[500px] overflow-hidden`} 
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={carouselRef}
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              {PROMOTIONAL_ITEMS.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`absolute top-0 w-full max-w-lg transform transition-all duration-500 ${getCardAnimationClass(index)}`} 
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Card className="overflow-hidden h-[460px] border-none rounded-lg shadow-lg hover:shadow-xl flex flex-col bg-white">
                    <div 
                      className="relative bg-black flex items-center justify-center h-64 overflow-hidden"
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center p-6">
                        <h3 className="text-3xl font-bold text-white mb-3">{item.brand.toUpperCase()}</h3>
                        <div className="w-16 h-1 bg-white mb-3"></div>
                        <p className="text-white text-lg font-medium text-center">{item.title}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="mb-4 block lg:hidden">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium animate-pulse-slow" 
                              style={{ animationDelay: `${idx * 300}ms` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link 
                          to={item.link} 
                          className="text-[#8A0303] flex items-center hover:underline relative overflow-hidden group"
                          onClick={() => {
                            if (item.link.startsWith('/')) {
                              window.scrollTo(0, 0);
                            }
                          }}
                        >
                          <span className="relative z-10">Learn more</span>
                          <ArrowRight className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#8A0303] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {!isMobile && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 z-30 shadow-md transition-all duration-300 hover:scale-110" 
                  onClick={() => setActiveProject(prev => (prev - 1 + PROMOTIONAL_ITEMS.length) % PROMOTIONAL_ITEMS.length)}
                  aria-label="Previous product"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 z-30 shadow-md transition-all duration-300 hover:scale-110" 
                  onClick={() => setActiveProject(prev => (prev + 1) % PROMOTIONAL_ITEMS.length)}
                  aria-label="Next product"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
              {PROMOTIONAL_ITEMS.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeProject === idx ? 'bg-[#8A0303] w-6' : 'bg-gray-200 hover:bg-gray-300'}`} 
                  onClick={() => setActiveProject(idx)}
                  aria-label={`Go to product ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
