import Image from "next/image";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
  }
  
  const mockProducts: Record<string, Product[]> = {
    'men-wallet': [
      { id: 1, name: 'Brown Leather Wallet', price: 1200, image: '/Rectangle 13.png' },
      { id: 2, name: 'Black Card Holder', price: 900, image: '/Rectangle 13.png' },
    ],
    'men-belts': [
      { id: 3, name: 'Classic Black Belt', price: 1500, image: '/Rectangle 13.png' },
      { id: 4, name: 'Brown Suede Belt', price: 1700, image: '/Rectangle 13.png' },
    ],
    'slippers': [
      { id: 5, name: 'Casual Flip Flops', price: 500, image: '/Rectangle 13.png' },
      { id: 6, name: 'Comfort Home Slippers', price: 650, image: '/Rectangle 13.png' },
    ],
    'shoes': [
      { id: 7, name: 'Running Shoes', price: 2500, image: '/images/shoe1.jpg' },
      { id: 8, name: 'Formal Leather Shoes', price: 3200, image: '/images/shoe2.jpg' },
    ]
  };
  
  export default function ProductGrid({ category }: { category: string }) {
    const products = mockProducts[category] || [];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <Image src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-500">AED{product.price}</p>
          </div>
        ))}
      </div>
    );
  }
  