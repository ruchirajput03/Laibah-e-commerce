"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import axios from "axios";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import ProductModal from "@/components/productModal";
import Link from "next/link";

// Updated interface to match backend structure
interface SizeStock {
  size: number;
  stock: number;
}

interface ProductVariation {
  color: string;
  price: number;
  images: string[];
  sizes: SizeStock[];
}

interface Category {
  _id: string;
  category_name: string;
  category_id: string;
  type: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: Category;
  subCategory:Category;
  baseImage: string;
  variations: ProductVariation[];
  isActive?: boolean;
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "sneakers",
    "boots",
    "sandals",
    "heels",
    "flats",
    "sports",
  ];

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    selectedCategory,
    selectedBrand,
    selectedColor,
    minPrice,
    maxPrice,
    searchTerm,
  ]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      // Add filters based on backend controller
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);
      if (selectedColor) params.append("color", selectedColor);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (searchTerm) {
        // Backend doesn't have search, so we'll filter by name client-side for now
        // Or you could extend the backend to include name search
      }

      const response = await api.get(`/products?${params}`);
      let fetchedProducts = response.data.products;

      // Client-side search filter if needed
      if (searchTerm) {
        fetchedProducts = fetchedProducts.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(fetchedProducts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      // This endpoint doesn't exist in your backend, you might need to add it
      // For now, we'll just refetch the products
      await api.patch(`/products/${id}/toggle-status`);
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
      alert("Toggle status feature not implemented in backend yet.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  // Helper function to get the lowest price from variations
  const getLowestPrice = (variations: ProductVariation[]) => {
    if (!variations || variations.length === 0) return 0;
    return Math.min(...variations.map((v) => v.price));
  };

  // Helper function to get the highest price from variations
  const getHighestPrice = (variations: ProductVariation[]) => {
    if (!variations || variations.length === 0) return 0;
    return Math.max(...variations.map((v) => v.price));
  };

  // Helper function to get available colors
  const getAvailableColors = (variations: ProductVariation[]) => {
    if (!variations || variations.length === 0) return [];
    return variations.map((v) => v.color).filter(Boolean);
  };

  // Helper function to get total stock
  const getTotalStock = (variations: ProductVariation[]) => {
    if (!variations || variations.length === 0) return 0;
    return variations.reduce((total, variation) => {
      return (
        total +
        variation.sizes.reduce((varTotal, size) => varTotal + size.stock, 0)
      );
    }, 0);
  };

  // Helper function to get primary image
  const getPrimaryImage = (product: Product) => {
    // First try base image
    if (product.baseImage) {
      return product.baseImage.startsWith("/")
        ? `http://localhost:8080${product.baseImage}`
        : product.baseImage;
    }

    // Then try first variation image
    if (
      product.variations &&
      product.variations.length > 0 &&
      product.variations[0].images.length > 0
    ) {
      const image = product.variations[0].images[0];
      return image.startsWith("/") ? `http://localhost:8080${image}` : image;
    }

    return null;
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedColor("");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Manage your shoe inventory</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <input
            type="text"
            placeholder="Filter by brand..."
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Color Filter */}
          <input
            type="text"
            placeholder="Filter by color..."
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const primaryImage = getPrimaryImage(product);
                const lowestPrice = getLowestPrice(product.variations);
                const highestPrice = getHighestPrice(product.variations);
                const availableColors = getAvailableColors(product.variations);
                const totalStock = getTotalStock(product.variations);

                return (
                  <div
                    key={product._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Stock indicator */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            totalStock > 10
                              ? "bg-green-100 text-green-800"
                              : totalStock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {totalStock > 0
                            ? `${totalStock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.brand}
                      </p>

                      {/* Price display */}
                      <div className="mb-2">
                        {lowestPrice === highestPrice ? (
                          <p className="text-lg font-bold text-blue-600">
                            AED {lowestPrice}
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-blue-600">
                            AED{lowestPrice} - AED{highestPrice}
                          </p>
                        )}
                      </div>

                      {/* Available colors */}
                      {availableColors.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Colors:</p>
                          <div className="flex flex-wrap gap-1">
                            {availableColors.slice(0, 3).map((color, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                              >
                                {color}
                              </span>
                            ))}
                            {availableColors.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{availableColors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.category?.category_name}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleStatus(product._id)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              product.isActive !== false
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                            title={
                              product.isActive !== false
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {product.isActive !== false ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal product={editingProduct} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Products;
