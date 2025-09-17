"use client";

import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/productCard";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

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

interface ProductResponse {
  products: ProductVariant[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export default function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceFilter, setPriceFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<ProductVariant[]>([]);

  const productsPerPage = 10;

  // Function to build query parameters
  const buildQueryParams = (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", productsPerPage.toString());

    // Add price filters - send to backend
    if (priceFilter === "low") {
      params.append("maxPrice", "30");
    } else if (priceFilter === "mid") {
      params.append("minPrice", "30");
      params.append("maxPrice", "40");
    } else if (priceFilter === "high") {
      params.append("minPrice", "40");
    }

    // Add availability filter - send to backend
    if (availabilityFilter === "available") {
      params.append("inStock", "true");
    }

    // Add sorting
    if (sortBy && sortBy !== "featured") {
      params.append("sortBy", sortBy);
    }

    return params.toString();
  };

  const getProducts = async (page: number) => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams(page);
      console.log(
        "API Query:",
        `http://localhost:8080/api/products?${queryParams}`
      );

      const res = await axios.get<ProductResponse>(
        `http://localhost:8080/api/products?${queryParams}`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(parseInt(res.data.currentPage.toString()));
      setTotalProducts(res.data.total);
    } catch (err) {
      console.error("Failed to fetch products", err);
      // Set empty state on error
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getProducts(1);
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1); // Reset to first page when filters change
      getProducts(1);
    } else {
      getProducts(1); // If already on page 1, just fetch
    }
  }, [priceFilter, availabilityFilter, sortBy]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getProducts(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle filter changes
  const handlePriceFilterChange = (value: string) => {
    setPriceFilter(value);
  };

  const handleAvailabilityFilterChange = (value: string) => {
    setAvailabilityFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceFilter("");
    setAvailabilityFilter("");
    setSortBy("featured");
  };

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-8 h-8 border text-sm rounded bg-white text-black hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={loading}
          className={`w-8 h-8 border text-sm rounded disabled:opacity-50 ${
            currentPage === i
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Next
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-8 h-8 border text-sm rounded bg-white text-black hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Check if any filters are active
  const hasActiveFilters =
    priceFilter || availabilityFilter || (sortBy && sortBy !== "featured");

  return (
    <>
      <Header />

      <section className="relative overflow-hidden lg:pt-[0px] pt-[60px]">
        <Image
          src="/shoes/Rectangle 1.png"
          alt="Product Banner"
          width={1080}
          height={1080}
          className="w-full h-full object-cover"
        />
      </section>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex gap-4 flex-wrap">
            <select
              className="border px-3 py-2 text-sm rounded disabled:opacity-50"
              value={availabilityFilter}
              onChange={(e) => handleAvailabilityFilterChange(e.target.value)}
              disabled={loading}
            >
              <option value="">All Availability</option>
              <option value="available">In Stock Only</option>
            </select>

            <select
              className="border px-3 py-2 text-sm rounded disabled:opacity-50"
              value={priceFilter}
              onChange={(e) => handlePriceFilterChange(e.target.value)}
              disabled={loading}
            >
              <option value="">All Prices</option>
              <option value="low">Below AED 30</option>
              <option value="mid">AED 30 - 40</option>
              <option value="high">Above AED 40</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                disabled={loading}
                className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Sort:</span>
            <select
              className="border px-3 py-2 rounded disabled:opacity-50"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={loading}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_az">Name: A to Z</option>
              <option value="name_za">Name: Z to A</option>
            </select>
            <span className="ml-2 text-gray-500">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${totalProducts} product${totalProducts !== 1 ? "s" : ""}`
              )}
            </span>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && !loading && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {priceFilter && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Price:{" "}
                {priceFilter === "low"
                  ? "Below AED 30"
                  : priceFilter === "mid"
                  ? "AED 30-40"
                  : "Above AED 40"}
              </span>
            )}
            {availabilityFilter && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                In Stock Only
              </span>
            )}
            {sortBy && sortBy !== "featured" && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Sort: {sortBy.replace("_", " ")}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 w-52 mx-auto">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              No products found matching your criteria.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} href={`/productdetail/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2 flex-wrap gap-2">
                {generatePaginationButtons()}
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
              {totalProducts > 0 && ` (${totalProducts} total products)`}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
