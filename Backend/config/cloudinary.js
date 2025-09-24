import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload image to Cloudinary
export const uploadToCloudinary = async (imageData, folder = 'civic-reports') => {
  try {
    console.log('🔄 Starting Cloudinary upload...');
    console.log('Folder:', folder);
    console.log('Image data type:', typeof imageData);
    console.log('Image data length:', imageData ? imageData.length : 0);
    console.log('Starts with data:image:', imageData ? imageData.startsWith('data:image') : false);

    if (!imageData) {
      throw new Error('No image data provided');
    }

    if (!imageData.startsWith('data:image')) {
      throw new Error('Invalid image format. Expected base64 data URL.');
    }

    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' },
        { format: 'auto' }
      ],
      timeout: 60000, // 60 seconds timeout
    });

    console.log('✅ Cloudinary upload successful:', {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    
    // Check for specific Cloudinary errors
    if (error.http_code) {
      console.error('Cloudinary HTTP Code:', error.http_code);
      console.error('Cloudinary Error:', error.message);
    }

    return {
      success: false,
      error: error.message || 'Unknown upload error'
    };
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('✅ Cloudinary delete result:', result);
    
    return {
      success: result.result === 'ok',
      result
    };
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test Cloudinary connection
export const testCloudinaryConnection = async () => {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    console.log('Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
    });

    // Test with a small base64 image (1x1 transparent pixel)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/WqrO9wAAAABJRU5ErkJggg==';
    
    const result = await cloudinary.uploader.upload(testImage, {
      folder: 'test',
      public_id: 'connection-test',
      overwrite: true
    });

    console.log('✅ Cloudinary connection test successful');
    
    // Clean up test image
    await cloudinary.uploader.destroy('test/connection-test');
    
    return {
      success: true,
      message: 'Cloudinary connection successful'
    };
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default cloudinary;
