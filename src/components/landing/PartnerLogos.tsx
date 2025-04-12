
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

const PROMOTIONAL_ITEMS: PromotionalItem[] = [
  {
    id: "quiz",
    title: "Quiz Yourself",
    description: "Take a break from your notes to see what you've learned",
    imageUrl: "public/lovable-uploads/2a802479-06b1-45c1-ba44-dbce5f3f2dc1.png",
    detailedDescription: "Our Quiz feature helps students test their knowledge in a stress-free environment. Create custom quizzes based on specific topics or use our pre-made quizzes designed by education experts. Track your progress and identify areas that need more focus."
  },
  {
    id: "help",
    title: "Help You Pass the Exam",
    description: "Provide practice for all exam subjects",
    imageUrl: "public/lovable-uploads/2a802479-06b1-45c1-ba44-dbce5f3f2dc1.png",
    detailedDescription: "Our comprehensive exam preparation system covers all subject areas with practice questions similar to what you'll find on your actual exam. With detailed explanations for every answer, you'll understand not just what is correct, but why."
  },
  {
    id: "sat",
    title: "Pass Your SAT® Exam",
    description: "Easy Prep, Easy to Pass!",
    imageUrl: "public/lovable-uploads/2a802479-06b1-45c1-ba44-dbce5f3f2dc1.png",
    detailedDescription: "Our specialized SAT® prep materials help students achieve their target scores through proven study methods, personalized learning paths, and thousands of practice questions with detailed explanations. Students using our platform see an average score increase of 100+ points."
  },
  {
    id: "questions",
    title: "Over 1,300+ Questions",
    description: "With Explanations",
    imageUrl: "public/lovable-uploads/2a802479-06b1-45c1-ba44-dbce5f3f2dc1.png",
    detailedDescription: "Access our extensive library of over 1,300 professionally written questions across all subjects. Each question comes with a detailed explanation to help you understand concepts better, not just memorize answers."
  },
  {
    id: "customize",
    title: "Customize Your Quiz",
    description: "Take any quiz anytime, anywhere",
    imageUrl: "public/lovable-uploads/2a802479-06b1-45c1-ba44-dbce5f3f2dc1.png",
    detailedDescription: "Create completely customized quizzes based on your specific needs. Choose topics, difficulty levels, and question types. Our mobile-friendly platform lets you study effectively whether you're at home, on the bus, or in between classes."
  }
];

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
              opts={{
                loop: true,
                align: "start",
                containScroll: "trimSnaps",
                dragFree: true,
                ...(autoPlay && { autoPlay: { delay: 4000, stopOnInteraction: true } })
              }}
              className="w-full"
              onSelectHandler={handleCarouselSelect}
            >
              <CarouselContent>
                {PROMOTIONAL_ITEMS.map((item, index) => (
                  <CarouselItem key={item.id} className="md:basis-full">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div 
                          className="h-full cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="relative h-[350px] overflow-hidden rounded-xl shadow-sm">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute bottom-3 right-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                activeIndex === index ? 'bg-green-500 text-white' : 'bg-white/80 text-gray-800'
                              }`}>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="rounded-lg overflow-hidden">
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

            <div className="flex justify-center mt-5 space-x-2">
              {PROMOTIONAL_ITEMS.map((_, index) => (
                <button
                  key={index}
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
