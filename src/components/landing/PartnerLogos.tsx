
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UseEmblaCarouselType } from 'embla-carousel-react';

type PromotionalItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  detailedDescription: string;
};

const PROMOTIONAL_ITEMS: PromotionalItem[] = Array.from({
  length: 12
}, (_, i) => ({
  id: `quiz-${i + 1}`,
  title: `Quiz Yourself ${i + 1}`,
  description: `Description for item ${i + 1}`,
  imageUrl: "https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389_1280.jpg",
  detailedDescription: `Detailed description for item ${i + 1}. Our Quiz feature helps students test their knowledge in a stress-free environment. Create custom quizzes based on specific topics or use our pre-made quizzes designed by education experts. Track your progress and identify areas that need more focus.`
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

  return <section className="overflow-hidden bg-gray-50 py-2 h-[500px]">
      <div className="container mx-auto mb-8 px-0">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-12" style={{
          fontFamily: 'cursive'
        }}>
          "Master Any Exam with Rigorion "
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Carousel with clean design showing 2 items at once */}
          <div className="lg:col-span-7 relative">
            <Carousel 
              opts={{
                loop: true,
                align: "start",
                slidesToScroll: 1,
                containScroll: "trimSnaps",
                dragFree: false,
                slidesToShow: 2
              }}
              onSelect={(api) => {
                const emblaApi = api as unknown as UseEmblaCarouselType[1];
                if (emblaApi?.selectedScrollSnap) {
                  const index = emblaApi.selectedScrollSnap();
                  handleCarouselSelect(index);
                }
              }}
              className="w-full h-[350px]"
            >
              <CarouselContent className="-ml-4">
                {PROMOTIONAL_ITEMS.map((item, index) => (
                  <CarouselItem key={item.id} className="pl-4 md:basis-1/2">
                    <Dialog open={selectedItem?.id === item.id} onOpenChange={handleDialogClose}>
                      <DialogTrigger asChild>
                        <div 
                          className="h-full cursor-pointer" 
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="relative h-[320px] overflow-hidden rounded-xl">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-white font-medium text-lg">{item.title}</h3>
                              <p className="text-white/90 text-sm">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-4">
                          <div className="rounded-xl overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-3">{item.description}</h4>
                            <p className="text-gray-600 mb-6">{item.detailedDescription}</p>
                            <Button className="w-full bg-[#8A0303] hover:bg-[#6a0202] text-white" onClick={handleDialogClose}>
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/90 hover:bg-white shadow-sm" />
              <CarouselNext className="right-2 bg-white/90 hover:bg-white shadow-sm" />
            </Carousel>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
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
            <div className="h-full flex flex-col justify-center mx-[24px]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {PROMOTIONAL_ITEMS[activeIndex].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {PROMOTIONAL_ITEMS[activeIndex].description}
              </p>
              <div className="prose prose-sm text-gray-500">
                <p>{PROMOTIONAL_ITEMS[activeIndex].detailedDescription}</p>
              </div>
              <Button onClick={() => handleItemClick(PROMOTIONAL_ITEMS[activeIndex])} className="mt-8 bg-[#8A0303] hover:bg-[#6a0202] text-white w-fit text-center rounded-full">See Details</Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
