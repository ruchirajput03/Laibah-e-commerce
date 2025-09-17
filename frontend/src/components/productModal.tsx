import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Minus } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
interface SizeStock {
  size: number;
  stock: number;
}

interface Category {
  _id: string;
  category_name: string;
  category_id: string;
  type: string;
}

interface ProductVariation {
  color: string;
  price: number;
  originalPrice?: number;
  images: (File | string)[];
  sizes: SizeStock[];
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  brand: string;
  category?: Category | null;
  subcategory?: Category | null;
  baseImage: File | string;
  variations: ProductVariation[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    brand: "",
    category: null,
    baseImage: "",
    subcategory: null,
    variations: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const commonSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  // Fetch all parent categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/products/category/parent_category"
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        console.log(data, "_________________________");
        setCategories(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category?._id) {
      const fetchSubcategories = async () => {
        try {
          if (formData.category) {
            const res = await fetch(
              `http://localhost:8080/api/products/category/subCategory/${formData?.category._id}`
            );
            if (!res.ok) throw new Error("Failed to fetch subcategories");
            const data = await res.json();
            console.log(data);
            setSubcategories(data.data);
          }
        } catch (error) {
          console.error(error);
          setSubcategories([]);
        }
      };
      fetchSubcategories();
    } else {
      console.log("else case");
      setSubcategories([]);
      // Reset subcategory when category changes
      setFormData((prev) => ({ ...prev, subcategory: null }));
    }
  }, [formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("brand", formData.brand);

      // Handle category - send the _id to backend
      if (formData.category) {
        submitData.append("category", formData.category._id);
      }
      if (formData.subcategory) {
        submitData.append("subcategory", formData.subcategory._id);
      }

      if (formData.baseImage instanceof File) {
        submitData.append("baseImage", formData.baseImage);
      } else if (typeof formData.baseImage === "string" && formData.baseImage) {
        submitData.append("existingBaseImage", formData.baseImage);
      }

      if (formData.variations?.length > 0) {
        formData.variations.forEach((variation, index) => {
          submitData.append(`variations[${index}][color]`, variation.color);
          submitData.append(
            `variations[${index}][price]`,
            variation.price.toString()
          );
          if (variation.originalPrice !== undefined) {
            submitData.append(
              `variations[${index}][originalPrice]`,
              variation.originalPrice.toString()
            );
          }
          
          submitData.append(
            `variations[${index}][sizes]`,
            JSON.stringify(variation.sizes)
          );

          variation.images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              submitData.append(`variationImages`, image);
              submitData.append(`imageVariationIndex`, index.toString());
            } else if (typeof image === "string" && image) {
              submitData.append(
                `variations[${index}][existingImages][${imageIndex}]`,
                image
              );
            }
          });
        });
      }

      const url = product
        ? `http://localhost:8080/api/products/${product._id}`
        : "http://localhost:8080/api/products";

      const method = product ? "PUT" : "POST";

      const response = await fetch(url, { method, body: submitData });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = <K extends keyof Product>(
    field: K,
    value: Product[K] // automatically matches the type of the field
  ) => {
    console.log(formData);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory || null,
      subcategory: null, // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    const selectedSubcategory = subcategories.find(
      (sub) => sub._id === subcategoryId
    );
    setFormData((prev) => ({
      ...prev,
      subcategory: selectedSubcategory || null,
    }));
  };

  const handleBaseImageChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, baseImage: file }));
    }
  };

  const addVariation = () => {
    const newVariation: ProductVariation = {
      color: "",
      price: 0,
      originalPrice: 0,
      images: [],
      sizes: [{ size: 8, stock: 0 }],
    };
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, newVariation],
    }));
  };

  const removeVariation = (index: number) => {
    if (formData.variations.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleVariationChange = <K extends keyof ProductVariation>(
    index: number,
    field: K,
    value: ProductVariation[K] | FileList
  ) => {
    const updatedVariations = [...formData.variations];
  
    if (field === "images" && value instanceof FileList) {
      updatedVariations[index].images = Array.from(value);
    } else {
      updatedVariations[index][field] = value as ProductVariation[K];
    }
  
    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
    }));
  };
  

  const handleSizeChange = (
    variationIndex: number,
    sizeIndex: number,
    field: keyof SizeStock,
    value: number
  ) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[variationIndex].sizes[sizeIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
    }));
  };

  const addSize = (variationIndex: number) => {
    const updatedVariations = [...formData.variations];
    const existingSizes = updatedVariations[variationIndex].sizes.map(
      (s) => s.size
    );
    const availableSize = commonSizes.find(
      (size) => !existingSizes.includes(size)
    );
    if (availableSize) {
      updatedVariations[variationIndex].sizes.push({
        size: availableSize,
        stock: 0,
      });
      setFormData((prev) => ({
        ...prev,
        variations: updatedVariations,
      }));
    }
  };

  const removeSize = (variationIndex: number, sizeIndex: number) => {
    const updatedVariations = [...formData.variations];
    if (updatedVariations[variationIndex].sizes.length > 1) {
      updatedVariations[variationIndex].sizes.splice(sizeIndex, 1);
      setFormData((prev) => ({
        ...prev,
        variations: updatedVariations,
      }));
    }
  };

  // Check if selected category is footwear
  const isFootwear = formData.category?.type === "footwear";

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>

            {/* Product Name & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category?._id || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory?._id || ""}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.category_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              {/* <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              /> */}
              <Editor
                apiKey="y1cxbn35lkyh3nk9oraeo2qhmt5b8nxnaxynr4kemh0vbgnp"
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | fontsizeselect fontselect | image |" +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  fontsize_formats:
                    "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 72pt",
                  font_formats:
                    "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                initialValue={formData.description}
                onEditorChange={(newContent) =>
                  handleInputChange("description", newContent)
                }
              />
            </div>

            {/* Base Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleBaseImageChange(e.target.files[0])
                  }
                  className="hidden"
                  id="base-image-upload"
                />
                <label
                  htmlFor="base-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload base image
                  </span>
                </label>
              </div>
              {formData.baseImage && (
                <div className="mt-2">
                  <Image
                    src={
                      typeof formData.baseImage === "string"
                        ? formData.baseImage
                        : URL.createObjectURL(formData.baseImage)
                    }
                    alt="base-preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Variations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Variations
              </h3>
              <button
                type="button"
                onClick={addVariation}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Variation</span>
              </button>
            </div>

            {formData.variations.length > 0 ? (
              formData.variations.map((variation, vIndex) => (
                <div
                  key={vIndex}
                  className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-800">
                      Variation #{vIndex + 1}
                    </h4>
                    {formData.variations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariation(vIndex)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Minus className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Color & Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={variation.color}
                        onChange={(e) =>
                          handleVariationChange(vIndex, "color", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Red, Blue, Black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variation.price}
                        onChange={(e) =>
                          handleVariationChange(
                            vIndex,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variation.originalPrice ?? ""}
                        onChange={(e) =>
                          handleVariationChange(
                            vIndex,
                            "originalPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 49.99"
                      />
                    </div>
                  </div>

                  {/* Variation Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variation Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files &&
                          handleVariationChange(
                            vIndex,
                            "images",
                            e.target.files
                          )
                        }
                        className="hidden"
                        id={`variation-images-upload-${vIndex}`}
                      />
                      <label
                        htmlFor={`variation-images-upload-${vIndex}`}
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload multiple images
                        </span>
                      </label>
                    </div>

                    {variation.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {variation.images.map((image, ImageIndex) => (
                          <div key={ImageIndex} className="relative">
                            <Image
                              src={
                                typeof image === "string"
                                  ? image
                                  : URL.createObjectURL(image)
                              }
                              alt={`variation-preview-${vIndex}-${ImageIndex}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedVariations = [
                                  ...formData.variations,
                                ];
                                updatedVariations[vIndex].images =
                                  updatedVariations[vIndex].images.filter(
                                    (_, i) => i !== ImageIndex
                                  );
                                setFormData((prev) => ({
                                  ...prev,
                                  variations: updatedVariations,
                                }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes and Stock */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {isFootwear ? "Size & Stock" : "Stock"}
                      </label>
                      <button
                        type="button"
                        onClick={() => addSize(vIndex)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {variation.sizes.map((size, sIndex) => (
                        <div
                          key={sIndex}
                          className="flex items-center gap-4 bg-white p-2 rounded border"
                        >
                          {/* Conditionally render size dropdown only for footwear */}
                          {isFootwear && (
                            <select
                              value={size.size}
                              onChange={(e) =>
                                handleSizeChange(
                                  vIndex,
                                  sIndex,
                                  "size",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="px-2 py-1 border border-gray-300 rounded"
                            >
                              {commonSizes.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          )}

                          <input
                            type="number"
                            min="0"
                            value={size.stock}
                            onChange={(e) =>
                              handleSizeChange(
                                vIndex,
                                sIndex,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                            placeholder="Stock"
                          />

                          {variation.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSize(vIndex, sIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No variations added yet. Click Add Variation to create one.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
