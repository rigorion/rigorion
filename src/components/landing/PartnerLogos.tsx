
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Trusted By Leading Educational Institutions
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Our comprehensive learning platform is used by schools and students worldwide to improve academic performance and test scores.
        </p>

        <div className="relative max-w-5xl mx-auto">
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
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div 
                        className="h-full p-4 cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="bg-white rounded-2xl overflow-hidden h-full transition-all duration-300 
                          shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                        >
                          <div className="relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${activeIndex === index ? 'bg-green-500 text-white' : 'bg-white/80 text-gray-800'}`}>
                                {activeIndex === index ? 'Active' : 'View Details'}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="flex justify-center mt-6 space-x-2">
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
      </div>
    </section>
  );
};
