"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/productCard";

import axios from "axios";

import { useCart } from "@/context/cartContext";
import ProductGallery from "@/components/productGallary";
import SizeSelector from "@/components/SizeSelector";
import QuantitySelector from "@/components/QuantitySelector";
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
  originalPrice?: number;
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
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Single loading state
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<null | "description" | "shipping">(null);

  const { addToCart } = useCart();

  // Fetch products (for "Featured Shoes")
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data.products);
      } catch (err:unknown) {
        if (axios.isAxiosError(err)) {
          if (err instanceof Error) {
            setError(err.message || "Something went wrong");
          } else {
            setError("Something went wrong");
          }
        } else {
          setError("Something went wrong");
        }
      }
    };
    fetchProducts();
  }, []);

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        const fetchedProduct: ProductVariant = res.data;
        setProduct(fetchedProduct);

        const firstVariation = fetchedProduct.variations?.[0];
        setSelectedVariation(firstVariation || null);

        // Default to first size with stock > 0
        const firstAvailableSize = firstVariation?.sizes.find((s) => s.stock > 0);
        setSelectedSize(firstAvailableSize?.size || null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Something went wrong");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);


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

  const toggleSection = (section: "description" | "shipping") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const renderHTML = (htmlString: string) => {
    htmlString = htmlString.replaceAll(/font-family: -webkit-standard;/g, "");
    htmlString = htmlString.replaceAll(
      /line-height: 14.4px;/g,
      "padding:5px 0px;"
    );
    htmlString = htmlString.replaceAll(
      /text-decoration: underline;/g,
      "text-decoration: none;"
    );
    htmlString = htmlString.replaceAll(/font-size: 14px;/g, "font-size: 14px;");
    htmlString = htmlString.replaceAll(/font-size: 14px;/g, "font-size: 14px;");

    //Add list styling to ensure bullets are visible
    htmlString = htmlString.replace(
      /<ul>/g,
      `<ul style="list-style-type: disc; margin-left: 20px;">`
    );

    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div>Product not found</div>;


  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;







  // ✅ Fetch Product
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const res = await axios.get(`http://localhost:8080/api/products/${id}`);
  //       const fetchedProduct: ProductVariant = res.data;

  //       setProduct(fetchedProduct);

  //       const firstVariation = fetchedProduct.variations?.[0];
  //       setSelectedVariation(firstVariation || null);

  //       // Set default size with stock > 0
  //       const firstAvailableSize = firstVariation?.sizes.find(
  //         (s) => s.stock > 0
  //       );
  //       setSelectedSize(firstAvailableSize?.size || null);
  //     } catch (err) {
  //       console.error("Failed to fetch product", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) fetchProduct();
  // }, [id]);

  // // ✅ Add to Cart Handler

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto pt-[120px] px-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-[100px] ">
        {/* Left - Image Gallery */}
        <div>
          <ProductGallery images={selectedVariation?.images || []} />
        </div>

        {/* Right - Product Info */}
        <div>
          <div className="flex items-center space-x-1 mb-2">
            {/* Stars */}
            <div className="flex space-x-1 text-[#FF875F]">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.013 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
                </svg>
              ))}
            </div>

            {/* Review Count */}
            <span className="text-sm text-black">1 review</span>
          </div>

          <h1 className="text-xl font-bold">{product.name}</h1>
          {/* <p className="text-gray-400 mt-2"> {product?.description}</p> */}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[18px] !font-bold text-black ">
              AED {selectedVariation?.price}
            </p>

            {selectedVariation?.originalPrice && (
              <p className="text-sm text-[#000] line-through">
                AED {selectedVariation.originalPrice}
              </p>
            )}

            {selectedVariation?.originalPrice &&
              selectedVariation?.originalPrice > selectedVariation?.price && (
                <span className="bg-[#FF875F] text-white text-xs font-medium px-2 py-1 rounded-full">
                  {Math.round(
                    ((selectedVariation.originalPrice -
                      selectedVariation.price) /
                      selectedVariation.originalPrice) *
                      100
                  )}
                  % off
                </span>
              )}
          </div>

          {/* Variations */}
          <div className="mt-6 flex gap-2">
            {product.variations.map((variation, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${
                  variation.color === selectedVariation?.color
                    ? "bg-white text-white"
                    : ""
                }`}
                onClick={() => {
                  setSelectedVariation(variation);
                  const firstAvailable = variation.sizes.find(
                    (s) => s.stock > 0
                  );
                  setSelectedSize(firstAvailable?.size || null);
                }}
              >
                <Image
                  src={process.env.API_URL + variation.images[0]}
                  width={100}
                  alt=""
                  height={100}
                />
              </button>
            ))}
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <SizeSelector
              sizes={selectedVariation?.sizes || []}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
            />
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>

          {/* Add to Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card click from triggering
              handleAddToCart(); // Your actual button action
            }}
            disabled={selectedSize === null}
            className="bg-black text-white text-sm w-full mt-8 py-3 disabled:opacity-50"
          >
            Add to cart
          </button>

          {/* Description */}
          <div className="mt-8">
            <button
              onClick={() => toggleSection("description")}
              className="w-full text-left text-sm font-semibold flex justify-between"
            >
              DESCRIPTION{" "}
              <span>{openSection === "description" ? "-" : "+"}</span>
            </button>
            {openSection === "description" &&
              (product.description ? renderHTML(product.description) : "---")}
          </div>

          {/* Shipping */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection("shipping")}
              className="w-full text-left text-sm font-semibold flex justify-between"
            >
              SHIPPING & RETURNS{" "}
              <span>{openSection === "shipping" ? "-" : "+"}</span>
            </button>
            {openSection === "shipping" && (
              <div className="mt-2 text-sm text-gray-600">
                Shipping and return policy goes here...
              </div>
            )}
          </div>
        </div>
      </div>
      <section className="max-w-6xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4 overflow-hidden">
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
    </>
  );
}
