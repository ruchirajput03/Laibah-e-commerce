'use client';

import { useEffect, useState, useMemo, useCallback, ReactElement } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { useCart } from '@/context/cartContext';
import { useWishlist } from "@/context/wishlistedContext";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "react-hot-toast";

// Types
interface Size {
  size: number;
  stock: number;
}

interface Variation {
  color: string;
  price: number;
  images: string[];
  sizes: Size[];
}

interface ProductVariant {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  baseImage: string;
  variations: Variation[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariation || selectedSize === null) return;

    const cartItem = {
      id: product._id,
      title: product.name,
      price: selectedVariation.price,
      quantity,
      size: selectedSize,
      colorSize: `${selectedVariation.color}, ${selectedSize}`,
      image: selectedVariation.images?.[0] || product.baseImage,
      discount: 0,
    };

    addToCart(cartItem);
    toast.success(`${product.name} added to cart 🛒`);
  }, [addToCart, product, selectedVariation, selectedSize, quantity]);

  if (wishlist.length === 0) {
    return <p className="text-center mt-8">Your wishlist is empty 💔</p>;
  }

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:pt-[120px] pt-[20px] gap-4 lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">

        {wishlist.map((item) => (
          <Link href={`/productdetail/${item.id}`} key={item.id} className="group">

          <div key={item.id} className="p-4 rounded ">
             {/* Image container wizth fixed size and relative positioning */}

            <div className="relative w-full aspect-[1/1] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={process.env.API_URL + item.image}
                alt={item.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105 rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-2">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="font-semibold text-sm">AED {item.price}</p>
            </div>
          </div>

          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
}
