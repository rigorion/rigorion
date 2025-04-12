import React from 'react';
import { Badge } from '@/components/ui/badge';
type ProductType = {
  id: number;
  name: string;
  image: string;
  badge: string;
};
const PRODUCTS: ProductType[] = [{
  id: 1,
  name: "SAT",
  image: "https://cdn.pixabay.com/photo/2015/04/20/18/58/student-732012_1280.jpg",
  badge: "BESTSELLER"
}, {
  id: 2,
  name: "GRE",
  image: "https://cdn.pixabay.com/photo/2020/02/13/16/11/street-4846133_1280.jpg",
  badge: "POPULAR"
}, {
  id: 3,
  name: "TOEFL",
  image: "https://cdn.pixabay.com/photo/2017/10/01/14/14/street-2805643_1280.jpg",
  badge: "NEW"
}, {
  id: 4,
  name: "IELTS",
  image: "https://cdn.pixabay.com/photo/2019/09/22/16/18/bicycle-4496443_640.jpg",
  badge: "Exclusive"
}];
export const ProductsShowcase = () => {
  return <section className="bg-white py-[12px]">
      <div className="container mx-auto px-[24px]">
        <h2 className="font-bold text-center text-gray-800 mb-14 text-2xl">Featured Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map(product => <div key={product.id} className="group relative overflow-hidden rounded-lg shadow-md">
              <div className="aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-xl font-medium text-white">{product.name}</h3>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#8A0303] hover:bg-[#8A0303]/90 text-white font-medium px-3 py-1">
                  {product.badge}
                </Badge>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
