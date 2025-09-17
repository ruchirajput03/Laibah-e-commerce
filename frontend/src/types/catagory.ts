// types/category.ts

// Minimal parent category info (for dropdowns, etc.)
export interface ParentCategory {
  _id: string;
  category_name: string;
}

// Full category object
export interface Category {
  _id?: string; 

  category_name: string;
  category_description?: string;
  category_id?: string;
  parent_category_id?: string | null;
  category_image: string | File; // ✅ unified type
  type?: "footwear" | "apparel" | "accessory" | "other";
}
