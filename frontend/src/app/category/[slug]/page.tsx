'use client';

import CategoryHeader from './CategoryHeader';
import ProductGrid from './ProductGrid';

const categoryData: Record<string, { title: string; description: string; image: string }> = {
  'men-wallet': {
    title: "Men's Wallets",
    description: "Premium leather wallets for every occasion.",
    image: '/Rectangle 13.png'
  },
  'men-belts': {
    title: "Men's Belts",
    description: "Stylish belts to match your wardrobe.",
    image: '/images/belts-banner.jpg'
  },
  'slippers': {
    title: "Slippers",
    description: "Comfortable and durable slippers for daily wear.",
    image: '/images/slippers-banner.jpg'
  },
  'shoes': {
    title: "Shoes",
    description: "Trendy and comfortable shoes for all seasons.",
    image: '/images/shoes-banner.jpg'
  }
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryData[params.slug];

  if (!category) {
    return <div className="p-10 text-center">Category not found</div>;
  }

  return (
    <div>
      <CategoryHeader 
        title={category.title} 
        description={category.description} 
        image={category.image} 
      />
      <ProductGrid category={params.slug} />
    </div>
  );
}
