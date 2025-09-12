const Category = require("../models/category");
const Product = require("../models/Product");



// Helper function to process variation images
const processVariationImages = (files, imageVariationIndices) => {
  const variationImageMap = {};

  if (files && files.length > 0) {
    files.forEach((file, index) => {
      const variationIndex = imageVariationIndices[index] || 0;
      if (!variationImageMap[variationIndex]) {
        variationImageMap[variationIndex] = [];
      }
      variationImageMap[variationIndex].push(
        `/uploads/products/${file.filename}`
      );
    });
  }

  return variationImageMap;
};

exports.createProduct = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Files:", req.files);

  try {
    const { name, description, brand, category ,subcategory} = req.body;
    console.log(req.body)
   
      const categoryData=await Category.findOne({_id:category})

    let categoryIsSizeBased 
    if(categoryData.type == 'footwear'){
      categoryIsSizeBased=true
    }else{
      categoryIsSizeBased=false
    }

    // Process base image
    let baseImage = "";
    if (req.files && req.files.find((file) => file.fieldname === "baseImage")) {
      const baseImageFile = req.files.find(
        (file) => file.fieldname === "baseImage"
      );
      baseImage = `/uploads/products/${baseImageFile.filename}`;
    }

    // Initialize variations
    let variations = [];

    // Parse variations array
    let rawVariations = [];

    if (typeof req.body.variations === "string") {
      try {
        rawVariations = JSON.parse(req.body.variations);
      } catch (e) {
        return res.status(400).json({ message: "Invalid variations format" });
      }
    } else if (Array.isArray(req.body.variations)) {
      rawVariations = req.body.variations;
    }

    // Process variation images
    const imageVariationIndices = req.body.imageVariationIndex
      ? Array.isArray(req.body.imageVariationIndex)
        ? req.body.imageVariationIndex.map((i) => parseInt(i))
        : [parseInt(req.body.imageVariationIndex)]
      : [];

    const variationFiles = req.files
      ? req.files.filter((file) => file.fieldname === "variationImages")
      : [];

    const variationImageMap = processVariationImages(
      variationFiles,
      imageVariationIndices
    );

    // Build variations array based on category type
    variations = rawVariations.map((v, idx) => {
      const baseVariation = {
        color: v.color || "",
        originalPrice: parseFloat(v.originalPrice) || parseFloat(v.price) || 0,
        price: parseFloat(v.price) || 0,
        images: variationImageMap[idx] || [],
      };

      if (categoryIsSizeBased) {
        // For size-based products (shoes, slippers)
        let sizes = [];
        try {
          sizes = typeof v.sizes === "string" ? JSON.parse(v.sizes) : v.sizes;
        } catch (err) {
          console.error(`Error parsing sizes for variation index ${idx}`, err);
        }

        return {
          ...baseVariation,
          sizes: Array.isArray(sizes)
            ? sizes.map((size) => ({
                size: parseFloat(size.size) || 0,
                stock: parseInt(size.stock) || 0,
              }))
            : [],
        };
      } else {
        // For non-size-based products (belts, wallets)
        return {
          ...baseVariation,
          stock: parseInt(v.stock) || 0,
        };
      }
    });

    // Validate variations based on category
    console.log("Variations:", variations);
    if (!variations || variations.length === 0) {
      return res
        .status(400)
        .json({ message: "Product must have at least one variation" });
    }

    for (const variation of variations) {
      if (
        !variation.color ||
        variation.price <= 0 ||
        !variation.images.length
      ) {
        return res.status(400).json({
          message: "Each variation must have color, price > 0, and at least one image",
        });
      }

      if (categoryIsSizeBased) {
        if (!variation.sizes || variation.sizes.length === 0) {
          return res.status(400).json({
            message: `${category} must have size variations`,
          });
        }
      } else {
        if (typeof variation.stock !== 'number' || variation.stock < 0) {
          return res.status(400).json({
            message: `${category} must have valid stock quantity`,
          });
        }
      }
    }

    console.log("Processed variations:", variations);

    // Final product data
    const productData = {
      name,
      description: description || "",
      brand: brand || "",
      category,
      baseImage,
      subcategory,
      variations,
    };

    console.log("Product data to save:", productData);

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  console.log("Update request body:", req.body);
  console.log("Update files:", req.files);

  try {
    const { id } = req.params;
    const { name, description, brand, category, existingBaseImage } = req.body;


    const categoryData=await Category.findOne({_id:category})

    let categoryIsSizeBased 
    if(categoryData.type == 'footwear'){
      categoryIsSizeBased=true
    }else{
      categoryIsSizeBased=false
    }


    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Base image logic
    let baseImage = existingBaseImage || existingProduct.baseImage || '';
    if (req.files && req.files.find(file => file.fieldname === 'baseImage')) {
      const baseImageFile = req.files.find(file => file.fieldname === 'baseImage');
      baseImage = `/uploads/products/${baseImageFile.filename}`;
    }

    // Parse structured variations (already array in req.body)
    const rawVariations = Array.isArray(req.body.variations) ? req.body.variations : [];

    // Image variation indices
    const imageVariationIndices = req.body.imageVariationIndex
      ? Array.isArray(req.body.imageVariationIndex)
        ? req.body.imageVariationIndex.map(i => parseInt(i))
        : [parseInt(req.body.imageVariationIndex)]
      : [];

    const variationFiles = req.files
      ? req.files.filter(file => file.fieldname === 'variationImages')
      : [];

    const variationImageMap = processVariationImages(variationFiles, imageVariationIndices);

    // Build variations array based on category type
    const variations = rawVariations.map((variation, index) => {
      const existingImages = variation.existingImages || [];
      const newImages = variationImageMap[index] || [];

      const baseVariation = {
        color: variation.color || '',
        originalPrice: parseFloat(variation.originalPrice) || parseFloat(variation.price) || 0,
        price: parseFloat(variation.price) || 0,
        images: [...existingImages.filter(Boolean), ...newImages],
      };

      if (categoryIsSizeBased) {
        // For size-based products
        let sizes = [];
        try {
          sizes = typeof variation.sizes === 'string'
            ? JSON.parse(variation.sizes)
            : variation.sizes;
        } catch (e) {
          sizes = [];
        }

        return {
          ...baseVariation,
          sizes: Array.isArray(sizes)
            ? sizes.map(size => ({
                size: parseFloat(size.size) || 0,
                stock: parseInt(size.stock) || 0
              }))
            : []
        };
      } else {
        // For non-size-based products
        return {
          ...baseVariation,
          stock: parseInt(variation.stock) || 0,
        };
      }
    });

    // Validation based on category
    if (!variations.length) {
      return res.status(400).json({
        message: "Product must have at least one variation"
      });
    }

    for (const variation of variations) {
      if (
        !variation.color ||
        variation.price <= 0 ||
        !variation.images.length
      ) {
        return res.status(400).json({
          message: "Each variation must have color, price > 0, and at least one image"
        });
      }

      if (categoryIsSizeBased) {
        if (!variation.sizes || !variation.sizes.length) {
          return res.status(400).json({
            message: `${category} must have size variations`
          });
        }
      } else {
        if (typeof variation.stock !== 'number' || variation.stock < 0) {
          return res.status(400).json({
            message: `${category} must have valid stock quantity`
          });
        }
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description: description || '',
        brand: brand || '',
        category: category.toLowerCase(),
        baseImage,
        variations
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      color,
      size,
      page = 1,
      limit = 10,
    } = req.query;
    console.log("Query parameters:", req.query);
    
    // Build filter object
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = { $regex: brand, $options: "i" };

    // Handle price range filtering on variations
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

      filter["variations.price"] = priceFilter;
    }

    // Handle color filtering
    if (color) {
      filter["variations.color"] = { $regex: color, $options: "i" };
    }

    // Handle size filtering (only for size-based categories)
    if (size && category && isSizeBased(category)) {
      filter["variations.sizes.size"] = parseFloat(size);
    }

    const products = await Product.find(filter)
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const validCategories = ['shoes', 'slippers', 'belts', 'wallets'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const skip = (page - 1) * limit;
    const products = await Product.find({ 
      category: category.toLowerCase() 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Product.countDocuments({ category: category.toLowerCase() });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// Get available sizes for a category (only for size-based products)
exports.getAvailableSizesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!isSizeBased(category)) {
      return res.status(400).json({
        message: "Size information not available for this category"
      });
    }

    const pipeline = [
      { $match: { category: category.toLowerCase() } },
      { $unwind: '$variations' },
      { $unwind: '$variations.sizes' },
      { $group: { _id: '$variations.sizes.size' } },
      { $sort: { _id: 1 } }
    ];

    const sizes = await Product.aggregate(pipeline);
    const availableSizes = sizes.map(item => item._id);

    res.json({
      category,
      sizes: availableSizes
    });
  } catch (error) {
    console.error("Error fetching available sizes:", error);
    res.status(500).json({
      message: "Error fetching available sizes",
      error: error.message,
    });
  }
};

// Get available colors for a category
exports.getAvailableColorsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ['shoes', 'slippers', 'belts', 'wallets'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const pipeline = [
      { $match: { category: category.toLowerCase() } },
      { $unwind: '$variations' },
      { $group: { _id: '$variations.color' } },
      { $sort: { _id: 1 } }
    ];

    const colors = await Product.aggregate(pipeline);
    const availableColors = colors.map(item => item._id);

    res.json({
      category,
      colors: availableColors
    });
  } catch (error) {
    console.error("Error fetching available colors:", error);
    res.status(500).json({
      message: "Error fetching available colors",
      error: error.message,
    });
  }
};

// Get available sizes for a specific product variation (legacy function - updated)
exports.getAvailableSizes = async (req, res) => {
  try {
    const { productId, color } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product category supports sizes
    if (!isSizeBased(product.category)) {
      return res.status(400).json({ 
        message: "This product category does not have size variations" 
      });
    }

    const variation = product.variations.find(
      (v) => v.color.toLowerCase() === color.toLowerCase()
    );
    if (!variation) {
      return res.status(404).json({ message: "Color variation not found" });
    }

    const availableSizes = variation.sizes.filter((s) => s.stock > 0);
    res.json(availableSizes);
  } catch (error) {
    console.error("Error fetching available sizes:", error);
    res.status(500).json({
      message: "Error fetching available sizes",
      error: error.message,
    });
  }
};

// Update stock - works for both size-based and non-size-based products
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size, stock } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variationIndex = product.variations.findIndex(
      (v) => v.color.toLowerCase() === color.toLowerCase()
    );
    if (variationIndex === -1) {
      return res.status(404).json({ message: "Color variation not found" });
    }

    const variation = product.variations[variationIndex];

    if (isSizeBased(product.category)) {
      // For size-based products
      if (!size) {
        return res.status(400).json({ message: "Size is required for this product category" });
      }

      const sizeIndex = variation.sizes.findIndex(
        (s) => s.size === parseFloat(size)
      );
      if (sizeIndex === -1) {
        return res.status(404).json({ message: "Size not found" });
      }

      product.variations[variationIndex].sizes[sizeIndex].stock = parseInt(stock);
    } else {
      // For non-size-based products
      product.variations[variationIndex].stock = parseInt(stock);
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(400).json({
      message: "Error updating stock",
      error: error.message,
    });
  }
};