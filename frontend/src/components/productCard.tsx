"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistedContext";

// Define the structure expected for product and variation
interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  baseImage: string;
  variations: {
    color: string;
    price: number;
    images: string[];
    sizes: { size: number; stock: number }[];
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  console.log(product, "-------------------------------");
  const firstVariation = product?.variations?.[0];
  console.log(product._id, ",,,,,,,,,,,,,,,,,,,,,,,,,,");
  if (!firstVariation) {
    return (
      <div className="p-4 border rounded shadow-sm">
        <p className="text-red-500 font-semibold">
          No variation found for this product.
        </p>
      </div>
    );
  }

  const defaultImage = product.baseImage || firstVariation.images?.[0];
  const defaultSize = firstVariation.sizes?.[0]?.size || 0;
  const colorSize = `${firstVariation.color}, ${defaultSize}`;

  const handleAddToCart = () => {
    const cartItem = {
      id: product._id, // Assuming _id is a string that can be converted to a number
      title: product.name,
      quantity: 1,
      size: defaultSize,
      colorSize,
      discount: 10, // or whatever logic you use
      price: firstVariation.price,
      image: defaultImage,
    };
    addToCart(cartItem);
  };

  const isWishlisted = isInWishlist(product._id.toString());

  return (
    <div className="overflow-hidden transition duration-300 relative group hover:shadow-lg ">
      <Link href={`/productdetail/${product._id.toString()}`}>
        <div className="relative w-full h-80">
          <Image
            src={
              defaultImage
                ? `${process.env.API_URL}${defaultImage}`
                : "/fallback.jpg"
            }
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition duration-300 group-hover:scale-105 rounded-lg"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevents the card click from triggering
              handleAddToCart(); // Your actual button action
            }}
            className="absolute bottom-4 left-4 right-4 bg-black  text-white text-sm py-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
          >
            Add to cart
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({
                id: product._id,
                name: product.name,
                price: firstVariation.price,
                image: defaultImage,
              });
            }}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill={isWishlisted ? "red" : "none"}
            >
              <path
                d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-row justify-between items-center">
        <h3 className="text-[16px] !font-medium text-[#000000] ">
          {product.name}
        </h3>
        <p className="text-base font-bold">AED {firstVariation.price}</p>
      </div>
    </div>
  );
}
