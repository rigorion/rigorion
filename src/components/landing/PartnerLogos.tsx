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

// Create 12 items (all referencing the same image for demo purposes).
// Update the title, description, etc. as you wish.
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
    setAutoPlay(false); // Stop autoplay when an item is clicked
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setAutoPlay(true); // Resume autoplay when dialog is closed
  };

  return (
    <section className="overflow-hidden bg-gray-50 py-16">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Trusted By Leading Educational Institutions
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Carousel with full-sized images */}
          <div className="lg:col-span-7 relative">
            <Carousel
              // Example KeenSlider config for fade transition and autoplay
              opts={{
                loop: true,
                align: "start",
                containScroll: "trimSnaps",
                dragFree: false, // Usually 'false' for fade transitions
                mode: "free-snap", // Depending on your carousel library, you might need something like `mode: "fade"` or a plugin
                slides: {
                  perView: 1,
                },
                ...(autoPlay && { autoPlay: { delay: 4000, stopOnInteraction: true } })
              }}
              className="w-full"
              onSelectHandler={handleCarouselSelect}
            >
              <CarouselContent>
                {PROMOTIONAL_ITEMS.map((item, index) => (
                  <CarouselItem key={item.id} className="md:basis-full">
                    <Dialog open={selectedItem?.id === item.id} onOpenChange={handleDialogClose}>
                      <DialogTrigger asChild>
                        <div 
                          className="h-full cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          {/* Increased height by ~25% (from 350 to 440) */}
                          {/* Simplified shadow (removed extra shadow or double box shadows) */}
                          <div className="relative h-[440px] overflow-hidden rounded-md">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute bottom-3 right-3">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  activeIndex === index ? 'bg-green-500 text-white' : 'bg-white/80 text-gray-800'
                                }`}
                              >
                                {activeIndex === index ? 'Featured' : 'View'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      {/* Dialog Content */}
                      <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
                        </DialogHeader>
                        {/* Increased spacing between image and text with gap-8 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-4">
                          <div className="rounded-md overflow-hidden">
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
              <CarouselPrevious className="-left-4 bg-white/70 hover:bg-white" />
              <CarouselNext className="-right-4 bg-white/70 hover:bg-white" />
            </Carousel>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-5 space-x-2">
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
