import React, { useState } from 'react';
import { Quote } from 'lucide-react';
type TestimonialType = {
  id: number;
  content: string;
  author: string;
  location: string;
  image?: string;
};
const TESTIMONIALS: TestimonialType[] = [{
  id: 1,
  content: "I am using Rigorion and I highly recommend it",
  author: "Jason",
  location: "Netherlands",
  image: "https://randomuser.me/api/portraits/men/32.jpg"
}, {
  id: 2,
  content: "Somebody tried to tell me that Rigorion is the best and yes it is",
  author: "Chad Yat",
  location: "Australia",
  image: "https://randomuser.me/api/portraits/men/43.jpg"
}, {
  id: 3,
  content: "I scored 1420 in My SAT, Thank you guys",
  author: "Annie",
  location: "Denver",
  image: "https://randomuser.me/api/portraits/women/26.jpg"
}];
export const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  return <section className="bg-white py-[12px]">
      <div className="container mx-auto px-[2px]">
        <h2 className="text-3xl text-center italic mb-16 text-slate-950 font-semibold tracking-wider">Our Practitioners' Testimonials</h2>
        
        <div className="max-w-3xl mx-auto relative">
          <div className="text-6xl text-gray-200 absolute -top-10 left-1/2 -translate-x-1/2">
            <Quote className="w-16 h-16 mx-auto text-gray-200" />
          </div>
          
          <div className="relative">
            {TESTIMONIALS.map((testimonial, index) => <div key={testimonial.id} className={`transition-all duration-500 ease-in-out ${index === activeIndex ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <blockquote className="text-center">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6 text-center lg:text-lg py-[6px]">
                    {testimonial.content}
                  </p>
                  
                  <footer className="mt-8">
                    {testimonial.image && <div className="mx-auto mb-4 w-16 h-16 rounded-full overflow-hidden shadow-md">
                        <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                      </div>}
                    <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </footer>
                </blockquote>
              </div>)}
          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {TESTIMONIALS.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? 'bg-[#8A0303] w-4' : 'bg-gray-300'}`} onClick={() => setActiveIndex(index)} aria-label={`View testimonial ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </section>;
};