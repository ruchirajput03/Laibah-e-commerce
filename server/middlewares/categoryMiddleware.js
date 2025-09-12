const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        const filename = `category-${uniqueSuffix}${extension}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, JPG, and WEBP files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    }
});

// Middleware wrapper for better error handling
const handleCategoryImageUpload = (req, res, next) => {
    const uploadSingle = upload.single('category_image');
    
    uploadSingle(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File too large. Maximum size is 5MB.'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files. Only 1 file is allowed.'
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        success: false,
                        message: 'Unexpected field name. Use "category_image" as field name.'
                    });
                }
            }
            
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }
        
        next();
    });
};

// Optional: Multiple fields upload (if you need banner, icon, etc.)
const handleMultipleCategoryUploads = (req, res, next) => {
    const uploadFields = upload.fields([
        { name: 'category_image', maxCount: 1 },
        { name: 'category_banner', maxCount: 1 },
        { name: 'category_icon', maxCount: 1 }
    ]);
    
    uploadFields(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File too large. Maximum size is 5MB.'
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        success: false,
                        message: 'Unexpected field name in upload.'
                    });
                }
            }
            
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }
        
        next();
    });
};

module.exports = {
    upload,
    handleCategoryImageUpload,
    handleMultipleCategoryUploads
};