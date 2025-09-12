const Category = require("../models/category"); // Adjust path
const mongoose = require("mongoose");

/**
 * Create category (parent or subcategory)
 */

exports.createCategory = async (req, res) => {
  try {
    const {
      category_name,
      parent_category_id,
      type
    } = req.body;

    // Handle image upload
    let category_image = "";
    if (req.file) {
      category_image = `/uploads/categories/${req.file.filename}`;
    }

    // Validation
    if (!category_name|| !type) {
      return res.status(400).json({ 
        message: "Category name and type are required" 
      });
    }

    // Auto-generate unique category_id
    const category_id = "CAT-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    // Check if category_id already exists (very rare, but just in case)
    const existingCategoryId = await Category.findOne({ category_id });
    if (existingCategoryId) {
      return res.status(400).json({ 
        message: "Generated category ID already exists. Please try again." 
      });
    }

    // Check if category name already exists at the same level
    const duplicateQuery = { 
      category_name: { $regex: new RegExp(`^${category_name}$`, "i") }
    };
    
    if (parent_category_id) {
      duplicateQuery.parent_category_id = parent_category_id;
    } else {
      duplicateQuery.$or = [
        { parent_category_id: null }, 
        { parent_category_id: "" },
        { parent_category_id: { $exists: false } }
      ];
    }

    const duplicateCategory = await Category.findOne(duplicateQuery);
    if (duplicateCategory) {
      return res.status(400).json({ 
        message: "Category name already exists at this level" 
      });
    }

    // If parent category ID is provided, verify it exists
    if (parent_category_id) {
      if (!mongoose.Types.ObjectId.isValid(parent_category_id)) {
        return res.status(400).json({ message: "Invalid parent_category_id format" });
      }
      const parentExists = await Category.findById(parent_category_id);
      if (!parentExists) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Create and save category
    const newCategory = new Category({
      category_name,
      category_image,
      category_id,
      type,
      parent_category_id: parent_category_id || undefined,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * Update category
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const {
      category_description,
      category_name,
      category_id,
      parent_category_id,
      existing_image,
      type
    } = req.body;

    // Handle image update
    let category_image = existing_image || category.category_image;
    if (req.file) {
      category_image = `/uploads/categories/${req.file.filename}`;
    }

    // Check for duplicate category_id if it's being changed
    if (category_id && category_id !== category.category_id) {
      const existingCategoryId = await Category.findOne({ 
        category_id,
        _id: { $ne: id }
      });
      if (existingCategoryId) {
        return res.status(400).json({ 
          message: "Category ID already exists" 
        });
      }
    }

    // Check for duplicate category name if it's being changed
    if (category_name && category_name !== category.category_name) {
      const duplicateQuery = { 
        category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
        _id: { $ne: id }
      };
      
      const newParentId = parent_category_id !== undefined ? parent_category_id : category.parent_category_id;
      if (newParentId) {
        duplicateQuery.parent_category_id = newParentId;
      } else {
        duplicateQuery.$or = [
          { parent_category_id: null }, 
          { parent_category_id: "" },
          { parent_category_id: { $exists: false } }
        ];
      }

      const duplicateCategory = await Category.findOne(duplicateQuery);
      if (duplicateCategory) {
        return res.status(400).json({ 
          message: "Category name already exists at this level" 
        });
      }
    }

    // Validate new parent category if provided
    if (parent_category_id) {
      if (!mongoose.Types.ObjectId.isValid(parent_category_id)) {
        return res.status(400).json({ message: "Invalid parent_category_id format" });
      }
      const parentExists = await Category.findById(parent_category_id);
      if (!parentExists) {
        return res.status(404).json({ message: "Parent category not found" });
      }
      if (parent_category_id === id) {
        return res.status(400).json({ message: "Category cannot be its own parent" });
      }

      // Check for circular reference
      let currentParent = parentExists;
      while (currentParent && currentParent.parent_category_id) {
        if (currentParent.parent_category_id.toString() === id) {
          return res.status(400).json({ 
            message: "Circular reference detected in category hierarchy" 
          });
        }
        currentParent = await Category.findById(currentParent.parent_category_id);
      }
    }

    // Update fields
    const updateData = {
      category_description: category_description || category.category_description,
      category_name: category_name || category.category_name,
      category_image,
      category_id: category_id || category.category_id,
      type:type||category.type
    };

    // Handle parent_category_id update
    if (parent_category_id !== undefined) {
      if (parent_category_id === '' || parent_category_id === 'null') {
        updateData.parent_category_id = undefined;
      } else {
        updateData.parent_category_id = parent_category_id;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({message:error.message})
  }
};

/**
 * Delete category
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { force = 'false' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has subcategories
    const subCategories = await Category.find({ parent_category_id: id });
    
    if (subCategories.length > 0 && force !== 'true') {
      return res.status(400).json({
        message: "Cannot delete category with existing subcategories. Use force=true to delete all subcategories.",
        subcategories_count: subCategories.length,
        subcategories: subCategories.map(sub => ({
          _id: sub._id,
          category_name: sub.category_name,
          category_id: sub.category_id
        }))
      });
    }

    // If force delete, remove all subcategories recursively
    if (force === 'true' && subCategories.length > 0) {
      await deleteSubcategoriesRecursively(id);
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true,
      message: "Category deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({message:error.message})
  }
};

// Helper function to recursively delete subcategories
const deleteSubcategoriesRecursively = async (parentId) => {
  const subcategories = await Category.find({ parent_category_id: parentId });
  
  for (const subcategory of subcategories) {
    await deleteSubcategoriesRecursively(subcategory._id);
    await Category.findByIdAndDelete(subcategory._id);
  }
};

/**
 * Get all categories with optional filtering and pagination
 */
exports.getAllCategories = async (req, res) => {
  try {
    const { 
      parent_only = 'false', 
      include_children = 'false',
      tree_view = 'false',
      page = 1, 
      limit = 50 
    } = req.query;

    let query = {};
    
    if (parent_only === 'true') {
      query.$or = [
        { parent_category_id: null }, 
        { parent_category_id: "" },
        { parent_category_id: { $exists: false } }
      ];
    }

    if (tree_view === 'true') {
      // Return hierarchical structure
      const allCategories = await Category.find({}).sort({ category_name: 1 });
      const categoryTree = buildCategoryTree(allCategories);
      
      return res.status(200).json({
        success: true,
        data: categoryTree,
        total: categoryTree.length
      });
    }

    // Regular pagination
    const skip = (page - 1) * limit;
    const categories = await Category.find(query)
      .sort({ category_name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Category.countDocuments(query);

    // Add children info if requested
    let responseData = categories;
    if (include_children === 'true') {
      responseData = await Promise.all(
        categories.map(async (category) => {
          const childrenCount = await Category.countDocuments({ 
            parent_category_id: category._id 
          });
          return {
            ...category.toObject(),
            children_count: childrenCount
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      data: responseData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({message:error.message})
  }
};

// Helper function to build category tree
const buildCategoryTree = (categories, parentId = null) => {
  return categories
    .filter(category => {
      const categoryParentId = category.parent_category_id;
      if (parentId === null) {
        return !categoryParentId || categoryParentId === "" || categoryParentId === null;
      }
      return categoryParentId && categoryParentId.toString() === parentId.toString();
    })
    .map(category => ({
      ...category.toObject(),
      children: buildCategoryTree(categories, category._id)
    }));
};

/**
 * Get all parent categories
 */
exports.getAllParentCategories = async (req, res) => {
  try {
    console.log("........................")
    const parents = await Category.find({
      $or: [
        { parent_category_id: null }, 
        { parent_category_id: "" },
        { parent_category_id: { $exists: false } }
      ],
    }).sort({ category_name: 1 });

    res.status(200).json({ 
      success: true,
      data: parents,
      total: parents.length
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    res.status(500).json({message:error.message})
  }
};

/**
 * Get subcategories by parent ID
 */
exports.getSubCategories = async (req, res) => {
  try {
    const { parentCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }

    const subs = await Category.find({ parent_category_id: parentCategoryId })
      .sort({ category_name: 1 });

    res.status(200).json({ 
      success: true,
      data: subs,
      total: subs.length,
      parent_id: parentCategoryId
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({message:error.message})
  }
};

/**
 * Get category by ID
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get parent category details if exists
    let parentCategory = null;
    if (category.parent_category_id) {
      parentCategory = await Category.findById(category.parent_category_id);
    }

    // Get children categories
    const children = await Category.find({ 
      parent_category_id: id 
    }).sort({ category_name: 1 });

    res.status(200).json({ 
      success: true,
      data: {
        ...category.toObject(),
        parent_category: parentCategory,
        children,
        children_count: children.length
      }
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({message:error.message})
  }
};

/**
 * Get category hierarchy/breadcrumb
 */
exports.getCategoryHierarchy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Build hierarchy path
    const hierarchy = [];
    let currentCategory = category;

    while (currentCategory) {
      hierarchy.unshift({
        _id: currentCategory._id,
        category_id: currentCategory.category_id,
        category_name: currentCategory.category_name,
        category_image: currentCategory.category_image
      });

      if (currentCategory.parent_category_id) {
        currentCategory = await Category.findById(currentCategory.parent_category_id);
      } else {
        currentCategory = null;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        category_id: category.category_id,
        category_name: category.category_name,
        hierarchy,
        depth: hierarchy.length
      }
    });
  } catch (error) {
    console.error("Error fetching category hierarchy:", error);
    res.status(500).json({message:error.message|| "Internal server error"})
  }
};