"use client";

import React, { useState, useEffect } from "react";
import AddCategoryModal from "@/components/addCategoryModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash2, SquarePen,Eye,EyeOff} from 'lucide-react';
export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/categories/parents"
      );
      console.log("Fetched categories:", res.data);
      setCategories(res.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/categories/${id}`);
      setCategories((prev: any) => prev.filter((cat: any) => cat._id !== id));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };
  

  // ✅ fixed handleUpdate
  const handleUpdate = (cat: any) => {
    setSelectedCategory(cat); // pass the whole category object
    setIsModalOpen(true);
  };

   const handleToggleStatus = async (id: string) => {
      try {
        // This endpoint doesn't exist in your backend, you might need to add it
        // For now, we'll just refetch the products
       
      } catch (error) {
        console.error('Error toggling product status:', error);
        alert('Toggle status feature not implemented in backend yet.');
      }
    };

  const filteredCategories = categories.filter((cat: any) =>
    cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Bar and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setSelectedCategory(null); // reset for new category
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat: any) => (
            <div
              key={cat._id}
              className="bg-white border rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center"
            >
              {cat.category_image && (
                <img
                  src={`http://localhost:8080${cat.category_image}`}
                  alt={cat.category_name}
                  className="w-20 h-20 object-cover rounded-full mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {cat.category_name}
              </h3>
             
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
  {cat.type || "No type"}


              </h3>

              <div className="flex gap-2 mt-auto">

              <button
      type="button"
      onClick={() => setIsVisible((prev) => !prev)}
      className="p-2 text-green-500 hover:bg-gray-100"
    >
      {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>

                <button
                  onClick={() => handleUpdate(cat)}
                  className="px-2 py-1 text-sm text-blue-500 transition"
                >
                  <SquarePen className="w-4 h-4"/>
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="px-3 py-1 text-sm transition text-red-500"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No categories found</p>
        )}
      </div>

      {/* Modal Component */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={selectedCategory} 
        onCategoryAdded={fetchCategories}
      />
    </div>
  );
}
