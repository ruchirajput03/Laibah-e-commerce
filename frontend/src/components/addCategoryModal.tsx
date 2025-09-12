"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface Category {
  _id: string;
  category_name: string;
}

interface CategoryData {
  _id?: string;
  category_description: string;
  category_name: string;
  category_image: string | File;
  category_id: string;
  parent_category_id?: string | null;
  category?:any;
  type?: "footwear" | "apparel" | "accessory" | "other";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData?: CategoryData | null;
  onCategoryAdded: () => void; // if provided, modal is in edit mode
}

export default function CategoryModal({
  isOpen,
  onClose,
  editData,
  onCategoryAdded,
}: Props) {
  const isEditMode = Boolean(editData);
  const [categoryType, setCategoryType] = useState<"parent" | "sub">("parent");
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryData>({
    category_description: "",
    category_name: "",
    category_image: "",
    category_id: "",
    type: "other", // default
    parent_category_id: "",
  });

  // Pre-fill form when edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData(editData);
      setCategoryType(editData.parent_category_id ? "sub" : "parent");
    }
  }, [editData, isEditMode]);

  // Fetch parent categories if subcategory selected
  useEffect(() => {
    if (categoryType === "sub") {
      fetch("http://localhost:8080/api/admin/categories") // Change to your backend API route
        .then((res) => res.json())
        .then((data) => {
          setParentCategories(data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching parent categories:", err);
        });
    }
  }, [categoryType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append("category_name", formData.category_name);
      formPayload.append(
        "parent_category_id",
        categoryType === "parent" ? "" : formData.parent_category_id || ""
      );
      formPayload.append("type", formData.type || "other");

      if (formData.category_image instanceof File) {
        formPayload.append("image", formData.category_image);
      }

      const url = isEditMode
        ? `http://localhost:8080/api/admin/categories/${editData?._id}`
        : `http://localhost:8080/api/admin/categories`;

      const method = isEditMode ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: formPayload,
    
      });

      if (res.status === 200 || res.status === 201) {
        alert(
          isEditMode
            ? "Category updated successfully"
            : "Category created successfully"
        );
        onCategoryAdded();
        onClose();
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Error saving category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Type */}
          <div>
            <label className="block font-medium mb-1">Category Type</label>
            <select
              value={categoryType}
              onChange={(e) =>
                setCategoryType(e.target.value as "parent" | "sub")
              }
              className="w-full border rounded p-2"
            >
              <option value="parent">Parent Category</option>
              <option value="sub">Sub Category</option>
            </select>
          </div>

          {/* Parent Category (if subcategory) */}
          {categoryType === "sub" && (
            <div>
              <label className="block font-medium mb-1">
                Select Parent Category
              </label>
              <select
                name="parent_category_id"
                value={formData.parent_category_id || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">-- Select --</option>
                {parentCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block font-medium mb-1">Category Name</label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
  <label className="block font-medium mb-1">Category Kind</label>
  <select
    name="type"
    value={formData.type || "other"}
    onChange={handleChange}
    className="w-full border rounded p-2"
    required
  >
    <option value="footwear">Footwear</option>
    <option value="apparel">Apparel</option>
    <option value="accessory">Accessory</option>
    <option value="other">Other</option>
  </select>
</div>
      
       {/* Category Image */}
<div>
  <label className="block font-medium mb-1">Category Image</label>

  {/* Show preview if editing or uploading new image */}
  {formData.category_image && (
    <img
      src={
        typeof formData.category_image === "string"
          ? `http://localhost:8080${formData.category_image}` // from DB
          : URL.createObjectURL(formData.category_image)      // new file
      }
      alt="Category"
      className="w-20 h-20 object-cover rounded mb-2"
    />
  )}

  <input
    type="file"
    name="category_image"
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        category_image: e.target.files?.[0] || "",
      }))
    }
    className="w-full border rounded p-2"
    required={!isEditMode}
  />
</div>


          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
