
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

type SlideType = {
  id: number;
  title: string;
  image: string;
};

const SLIDES: SlideType[] = [
  {
    id: 1,
    title: "RUNNING WILD",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 2,
    title: "EXPLORING NATURE",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
  },
  {
    id: 3,
    title: "INTELLECTUAL GROWTH", 
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"
  },
  {
    id: 4,
    title: "LEARNING JOURNEY",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
  },
  {
    id: 5,
    title: "EXPANDING HORIZONS",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  }
];

export const PrinciplesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Our Guiding Principles</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe in creating a learning experience that challenges your mind and expands your horizons. 
              Our approach integrates rigorous academic standards with innovative teaching methodologies.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Each module is carefully designed to guide you through complex concepts and help you master them 
              at your own pace. We don't just prepare you for exams - we prepare you for intellectual growth.
            </p>
            <div className="font-medium text-[#8A0303] italic">gradient text area</div>
          </div>
          
          {/* Right column - Carousel */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Carousel
                className="w-full max-w-xl mx-auto"
                onSelect={(index) => setCurrentSlide(index)}
              >
                <CarouselContent>
                  {SLIDES.map((slide) => (
                    <CarouselItem key={slide.id}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                          <h3 className="text-white text-2xl font-bold">{slide.title}</h3>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 bg-white/80 hover:bg-white" />
                <CarouselNext className="absolute right-4 bg-white/80 hover:bg-white" />
              </Carousel>
              
              <div className="mt-4 flex justify-center space-x-2">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? 'bg-[#8A0303] w-4' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
