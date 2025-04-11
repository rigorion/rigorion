
import React from 'react';
import { Badge } from '@/components/ui/badge';

type ProductType = {
  id: number;
  name: string;
  image: string;
  badge: string;
};

const PRODUCTS: ProductType[] = [
  {
    id: 1,
    name: "Strawberry",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    badge: "BESTSELLER"
  },
  {
    id: 2,
    name: "Raspberry",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    badge: "POPULAR"
  },
  {
    id: 3,
    name: "Caramel",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    badge: "NEW"
  },
  {
    id: 4,
    name: "Chocolate",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    badge: "LIMITED"
  }
];

export const ProductsShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">Featured Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg shadow-md">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-xl font-medium text-white">{product.name}</h3>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#8A0303] hover:bg-[#8A0303]/90 text-white font-medium px-3 py-1">
                  {product.badge}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
