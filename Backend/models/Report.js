import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Updated category field to handle multi-language
  category: {
    type: String,
    required: [true, 'Category is required'],
    validate: {
      validator: function(value) {
        // Define all possible category values in different languages
        const validCategories = [
          // English
          'Roads & Infrastructure',
          'Street Lighting', 
          'Sanitation & Waste',
          'Water Supply',
          'Traffic & Transportation',
          'Public Safety',
          'Parks & Recreation',
          'Other',
          // Hindi
          'सड़कें और बुनियादी ढांचा',
          'स्ट्रीट लाइटिंग',
          'स्वच्छता और कचरा',
          'पानी की आपूर्ति',
          'यातायात और परिवहन',
          'सार्वजनिक सुरक्षा',
          'पार्क और मनोरंजन',
          'अन्य',
          // Marathi
          'रस्ते आणि पायाभूत सुविधा',
          'रस्त्यावरील दिवे',
          'स्वच्छता आणि कचरा',
          'पाणी पुरवठा',
          'रहदारी आणि वाहतूक',
          'सार्वजनिक सुरक्षा',
          'उद्यान आणि मनोरंजन',
          'इतर'
        ];
        return validCategories.includes(value);
      },
      message: 'Invalid category value. Please select a valid category.'
    }
  },

  // Location Information
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: true,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },

  // Media with Cloudinary
  image: {
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    width: Number,
    height: Number
  },

  // Status Management
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // User Information
  reportedBy: {
    type: String,
    default: 'Anonymous'
  },

  contactInfo: {
    phone: String,
    email: String
  },

  // Administrative
  assignedTo: {
    type: String,
    default: null
  },

  resolutionNotes: {
    type: String,
    default: ''
  },

  estimatedResolution: {
    type: Date,
    default: null
  },

  // Store the language used for this report
  language: {
    type: String,
    enum: ['en', 'hi', 'mr'],
    default: 'en'
  },

  // Timestamps
  reportedAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: {
    type: Date,
    default: null
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },

  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
reportSchema.index({ status: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ language: 1 });
reportSchema.index({ 'location.coordinates': '2dsphere' });
reportSchema.index({ reportedAt: -1 });

// Method to normalize category to English for consistent querying
reportSchema.methods.getNormalizedCategory = function() {
  const categoryMapping = {
    // Hindi to English
    'सड़कें और बुनियादी ढांचा': 'Roads & Infrastructure',
    'स्ट्रीट लाइटिंग': 'Street Lighting',
    'स्वच्छता और कचरा': 'Sanitation & Waste',
    'पानी की आपूर्ति': 'Water Supply',
    'यातायात और परिवहन': 'Traffic & Transportation',
    'सार्वजनिक सुरक्षा': 'Public Safety',
    'पार्क और मनोरंजन': 'Parks & Recreation',
    'अन्य': 'Other',
    // Marathi to English
    'रस्ते आणि पायाभूत सुविधा': 'Roads & Infrastructure',
    'रस्त्यावरील दिवे': 'Street Lighting',
    'स्वच्छता आणि कचरा': 'Sanitation & Waste',
    'पाणी पुरवठा': 'Water Supply',
    'रहदारी आणि वाहतूक': 'Traffic & Transportation',
    'सार्वजनिक सुरक्षा': 'Public Safety',
    'उद्यान आणि मनोरंजन': 'Parks & Recreation',
    'इतर': 'Other'
  };
  
  return categoryMapping[this.category] || this.category;
};

// Static method to get category statistics with normalized categories
reportSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    {
      $addFields: {
        normalizedCategory: {
          $switch: {
            branches: [
              { case: { $eq: ['$category', 'सड़कें और बुनियादी ढांचा'] }, then: 'Roads & Infrastructure' },
              { case: { $eq: ['$category', 'स्ट्रीट लाइटिंग'] }, then: 'Street Lighting' },
              { case: { $eq: ['$category', 'स्वच्छता और कचरा'] }, then: 'Sanitation & Waste' },
              { case: { $eq: ['$category', 'पानी की आपूर्ति'] }, then: 'Water Supply' },
              { case: { $eq: ['$category', 'यातायात और परिवहन'] }, then: 'Traffic & Transportation' },
              { case: { $eq: ['$category', 'सार्वजनिक सुरक्षा'] }, then: 'Public Safety' },
              { case: { $eq: ['$category', 'पार्क और मनोरंजन'] }, then: 'Parks & Recreation' },
              { case: { $eq: ['$category', 'अन्य'] }, then: 'Other' },
              { case: { $eq: ['$category', 'रस्ते आणि पायाभूत सुविधा'] }, then: 'Roads & Infrastructure' },
              { case: { $eq: ['$category', 'रस्त्यावरील दिवे'] }, then: 'Street Lighting' },
              { case: { $eq: ['$category', 'स्वच्छता आणि कचरा'] }, then: 'Sanitation & Waste' },
              { case: { $eq: ['$category', 'पाणी पुरवठा'] }, then: 'Water Supply' },
              { case: { $eq: ['$category', 'रहदारी आणि वाहतूक'] }, then: 'Traffic & Transportation' },
              { case: { $eq: ['$category', 'सार्वजनिक सुरक्षा'] }, then: 'Public Safety' },
              { case: { $eq: ['$category', 'उद्यान आणि मनोरंजन'] }, then: 'Parks & Recreation' },
              { case: { $eq: ['$category', 'इतर'] }, then: 'Other' }
            ],
            default: '$category'
          }
        }
      }
    },
    { $group: { _id: '$normalizedCategory', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Pre-save middleware to detect language
reportSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  
  // Auto-detect language based on category
  if (this.isModified('category')) {
    const hindiCategories = [
      'सड़कें और बुनियादी ढांचा', 'स्ट्रीट लाइटिंग', 'स्वच्छता और कचरा', 
      'पानी की आपूर्ति', 'यातायात और परिवहन', 'सार्वजनिक सुरक्षा', 
      'पार्क और मनोरंजन', 'अन्य'
    ];
    const marathiCategories = [
      'रस्ते आणि पायाभूत सुविधा', 'रस्त्यावरील दिवे', 'स्वच्छता आणि कचरा',
      'पाणी पुरवठा', 'रहदारी आणि वाहतूक', 'सार्वजनिक सुरक्षा',
      'उद्यान आणि मनोरंजन', 'इतर'
    ];
    
    if (hindiCategories.includes(this.category)) {
      this.language = 'hi';
    } else if (marathiCategories.includes(this.category)) {
      this.language = 'mr';
    } else {
      this.language = 'en';
    }
  }
  
  next();
});

// Static method to get reports by location radius
reportSchema.statics.findByLocation = function(lat, lng, radiusInMeters = 1000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radiusInMeters
      }
    }
  });
};

// Instance method to mark as resolved
reportSchema.methods.markResolved = function(resolutionNotes = '') {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolutionNotes = resolutionNotes;
  return this.save();
};

const Report = mongoose.model('Report', reportSchema);

export default Report;
