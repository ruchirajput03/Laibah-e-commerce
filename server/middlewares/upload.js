const multer = require('multer');
const path = require('path');
const fs =require("fs")
// Configure storage for products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Generic product image upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB limit
  }
});

// Upload multiple variation images
const uploadVariationImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 20
  }
}).any();

// Legacy support for specific product image fields
const uploadProductWithVariations = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 20
  }
}).fields([
  { name: 'images', maxCount: 5 }
]);

// Upload for category images (separate folder)
const categoryUploadDir = path.join(__dirname, "../uploads/categories");
if (!fs.existsSync(categoryUploadDir)) {
  fs.mkdirSync(categoryUploadDir, { recursive: true });
}

const uploadCategoryImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, categoryUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
}).single("image");

// Middleware to handle dynamic variation fields
const handleVariationUploads = (req, res, next) => {
  const dynamicUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 20
    }
  }).any();

  dynamicUpload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    // Organize variation images
    if (req.files && Array.isArray(req.files)) {
      const variationImages = {};

      req.files.forEach(file => {
        const match = file.fieldname.match(/variations\[(\d+)\]\[images\]/);
        if (match) {
          const variationIndex = match[1];
          if (!variationImages[variationIndex]) {
            variationImages[variationIndex] = [];
          }
          variationImages[variationIndex].push(file);
        }
      });

      req.variationImages = variationImages;
    }

    next();
  });
};

// Export everything
module.exports = {
  upload,
  uploadVariationImages,
  uploadProductWithVariations,
  uploadCategoryImage,
  handleVariationUploads
};
