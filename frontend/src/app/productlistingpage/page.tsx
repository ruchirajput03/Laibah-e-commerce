'use client';

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Image from "next/image";

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

interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  baseImage: string;
  variations: Variation[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products"); // your backend route
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg shadow-lg p-4">
          <Image
            src={`http://localhost:8080${product.baseImage}`}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto object-contain"
          />
          <h2 className="text-xl font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600">{product.brand}</p>
          <p className="text-sm text-blue-500">{product.category}</p>

          {product.variations.map((variation, index) => (
            <div key={index} className="mt-4 border-t pt-2">
              <p className="font-medium text-sm text-red-600">Color: {variation.color}</p>
              <p className="text-sm">Price: ₹{variation.price}</p>

              <div className="flex gap-2 overflow-x-auto mt-2">
                {variation.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={`http://localhost:8080${img}`}
                    alt={`Variation ${idx}`}
                    width={80}
                    height={80}
                    className="object-cover rounded border"
                  />
                ))}
              </div>

              <div className="text-xs text-gray-700 mt-1">
                Sizes:
                {variation.sizes.map((s, i) => (
                  <span key={i} className="ml-2 inline-block bg-gray-200 px-2 py-0.5 rounded">
                    {s.size} ({s.stock})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
