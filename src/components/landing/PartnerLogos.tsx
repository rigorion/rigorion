import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PromotionalItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  detailedDescription: string;
};

const PROMOTIONAL_ITEMS: PromotionalItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `quiz-${i + 1}`,
  title: `Quiz Yourself ${i + 1}`,
  description: `Description for item ${i + 1}`,
  imageUrl: "https://cdn.pixabay.com/photo/2016/11/29/08/41/apple-1868496_960_720.jpg",
  detailedDescription: `Detailed description for item ${i + 1}. Our Quiz feature helps students test their knowledge in a stress-free environment. Create custom quizzes based on specific topics or use our pre-made quizzes designed by education experts. Track your progress and identify areas that need more focus.`,
}));

export const PartnerLogos = () => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PromotionalItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCarouselSelect = (index: number) => {
    setActiveIndex(index);
  };

  const handleItemClick = (item: PromotionalItem) => {
    setSelectedItem(item);
    setAutoPlay(false);
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setAutoPlay(true);
  };

  return (
    <section className="overflow-hidden bg-gray-50 py-16">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Trusted By Leading Educational Institutions
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Carousel with 3D effect */}
          <div className="lg:col-span-7 relative">
            <Carousel
              opts={{
                loop: true,
                slides: {
                  origin: 'center',
                  perView: 1.3, // Shows 1 full slide and 15% of the next/previous
                  spacing: 24, // Space between slides
                },
                breakpoints: {
                  '(min-width: 768px)': {
                    slides: {
                      perView: 1.2,
                      spacing: 32,
                    },
                  },
                },
                ...(autoPlay && { 
                  autoplay: { 
                    delay: 4000, 
                    disableOnInteraction: false 
                  } 
                })
              }}
              plugins={[
                // Add any necessary plugins for your carousel library
              ]}
              className="w-full"
              onSelect={handleCarouselSelect}
            >
              <CarouselContent className="-ml-4">
                {PROMOTIONAL_ITEMS.map((item, index) => (
                  <CarouselItem 
                    key={item.id} 
                    className={`pl-4 transition-all duration-300 ${
                      activeIndex === index ? 'scale-100 z-10' : 'scale-90 opacity-80'
                    }`}
                  >
                    <Dialog open={selectedItem?.id === item.id} onOpenChange={handleDialogClose}>
                      <DialogTrigger asChild>
                        <div 
                          className="h-full cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="relative h-[550px] overflow-hidden rounded-xl shadow-lg">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-4 right-4">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  activeIndex === index ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-800'
                                }`}
                              >
                                {activeIndex === index ? 'Featured' : 'View'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-3">{item.description}</h4>
                            <p className="text-gray-600 mb-6">{item.detailedDescription}</p>
                            <Button 
                              className="w-full bg-[#8A0303] hover:bg-[#6a0202] text-white"
                              onClick={handleDialogClose}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 bg-white/90 hover:bg-white shadow-md" />
              <CarouselNext className="-right-4 bg-white/90 hover:bg-white shadow-md" />
            </Carousel>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {PROMOTIONAL_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCarouselSelect(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index ? "bg-[#8A0303] w-4" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text content on the right side */}
          <div className="lg:col-span-5">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {PROMOTIONAL_ITEMS[activeIndex].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {PROMOTIONAL_ITEMS[activeIndex].description}
              </p>
              <div className="prose prose-sm text-gray-500">
                <p>{PROMOTIONAL_ITEMS[activeIndex].detailedDescription}</p>
              </div>
              <Button 
                className="mt-8 bg-[#8A0303] hover:bg-[#6a0202] text-white w-fit"
                onClick={() => handleItemClick(PROMOTIONAL_ITEMS[activeIndex])}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
