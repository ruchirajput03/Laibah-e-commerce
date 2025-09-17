"use client";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import ProductCard from "@/components/productCard";
import axios from "axios";
import Link from "next/link";
import CategoryCard from "@/components/categoriesCard";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    {
      title: "Men's Clothing",
      subtitle: "Latest fashion and styles",
      image: "/Rectangle 13.png",
      link: "/category/mens-clothing",
    },
    {
      title: "Women's Clothing",
      subtitle: "Trendy and comfortable",
      image: "/Rectangle 14.png",
      link: "/category/womens-clothing",
    },
    {
      title: "Accessories",
      subtitle: "Bags, belts, and more",
      image: "/Rectangle 15.png",
      link: "/category/accessories",
    },
    {
      title: "Accessories",
      subtitle: "Bags, belts, and more",
      image: "/Rectangle 16.png",
      link: "/category/accessories",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/products");
        console.log(response.data.products, "Fetched products");
        setProducts(response.data.products);
      } catch (err: unknown) {
        let errorMessage = "Something went wrong";
  
        if (axios.isAxiosError(err)) {
          // Axios error
          errorMessage = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          // Regular JS error
          errorMessage = err.message;
        }
  
        console.error("Error fetching products:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] overflow-hidden pt-0 mb-4 lg:pt-0 lg:mb-[40px]">
        <Image
          src="/banner.png"
          alt="Banner"
          fill
          className="object-cover w-full h-full min-h-screen"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center py-6 sm:py-10">
          <h1 className="text-white text-[48px] sm:text-[60px] lg:text-[120px] lg:leading-[120px] sm:leading-[62px] leading-[50px] font-[bold] uppercase sm:pt-8 lg:mt-0">
            Unleash <br /> your stride
          </h1>
          <p className="text-white text-xs sm:text-lg lg:text-xl max-w-2xl mt-4">
            Unlock your full potential with a design that supports every step,
            ensuring maximum comfort and performance whether you&apos;re running on
            the road or tackling the toughest trails.
          </p>
          <Link href="/products" className="bg-black text-white px-6 py-3 mt-6 rounded-lg hover:bg-white hover:text-black transition duration-300">
            Shop Now
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden ">
        <h1 className="text-[#000000] text-[16px] sm:text-3xl lg:text-[53px] leading-extratight lg:leading-[70px] sm:leading-[35px] leading-[22px] font-[bold] uppercase flex text-center justify-center">
          Meet laibah, the best sports gear for comfort, durability and style on
          all terrains
        </h1>
        <p className="max-w-3xl text-[#737373] mx-auto text-center text-sm sm:text-lg lg:text-[16px] mt-4">
          Born in the UAE, Laibah Collections began with a vision: to offer
          comfort, confidence, and affordable quality — not just in footwear,
          but across lifestyle categories.
        </p>
        <p className="max-w-3xl text-[#737373] mx-auto text-center text-sm sm:text-lg lg:text-[16px] mt-4">
          Today, we proudly serve both individual shoppers and business buyers
          with a growing range of trusted products — always curated with care
          and value in mind.
        </p>
        <p className="max-w-3xl text-[#737373] mx-auto text-center text-sm sm:text-lg lg:text-[16px] mt-4">
          From the popular Camel Safari footwear to our exclusive in-house brand
          Pierre Jennet, and the well-known Skylark slippers from India, our
          collection continues to grow with products that combine style,
          durability, and great value.
        </p>
      </div>

      {/* Bestseller Section */}
      <section className="max-w-6xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">
        <div className="flex justify-between mb-8">
          <h2 className="lg:text-2xl font-semibold text-[#313131]">Our Bestseller</h2>
          <Link
            href="/products"
            className="text-sm text-gray-700 border px-4 py-1 rounded-full hover:bg-gray-100"
          >
            SEE ALL →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-2xl font-semibold">Shop By Categories</h2>
          <button className="text-sm text-gray-700 border px-4 py-1 rounded-full hover:bg-gray-100">
            SEE ALL →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              subtitle={category.subtitle}
              image={category.image}
              link={category.link}
            />
          ))}
        </div>
      </section>

      {/* Banner Section */}
      <section className="max-w-full mx-auto lg:pt-[80px] pt-[20px] overflow-hidden lg:mb-[40px] mb-4">
        <Image
          src="/Group 415.png"
          alt="Banner"
          width={1080}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Featured Shoes Section */}
      <section className="max-w-6xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">
        <div className="flex justify-between mb-8">
          <h2 className="lg:text-2xl font-semibold text-[#313131]">Featured Shoes</h2>
          <Link
            href="/products"
            className="lg:text-sm text-xs text-gray-700 border px-4 py-1 rounded-full hover:bg-gray-100"
          >
            SEE ALL PRODUCTS →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
