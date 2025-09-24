import Report from "../models/Report.js";
import mongoose from "mongoose";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/Cloudinary.js";

// Create a new report with Cloudinary image upload and language detection
export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      image, // Base64 image data
      reportedBy,
      contactInfo,
      language, // Optional: can be passed from frontend
    } = req.body;

    console.log("=== CREATE REPORT DEBUG START ===");
    console.log("Title:", title);
    console.log("Category:", category);
    console.log("Language:", language);
    console.log("Location type:", typeof location);
    console.log("Image exists:", !!image);
    console.log("Image type:", typeof image);
    console.log("Image length:", image ? image.length : 0);
    console.log(
      "Image starts with data:image:",
      image ? image.startsWith("data:image") : false
    );

    // Validate required fields
    if (!title || !description || !category || !location || !image) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        required: ["title", "description", "category", "location", "image"],
        received: {
          title: !!title,
          description: !!description,
          category: !!category,
          location: !!location,
          image: !!image,
        },
      });
    }

    // Check if image is valid base64
    if (!image.startsWith("data:image/")) {
      console.log("❌ Invalid image format");
      return res.status(400).json({
        success: false,
        message:
          "Invalid image format. Expected base64 data URL starting with data:image/",
      });
    }

    console.log("🔄 Attempting Cloudinary upload...");

    // Try to upload to Cloudinary
    let imageUpload;
    try {
      imageUpload = await uploadToCloudinary(image, "civic-reports");
      console.log("📤 Cloudinary upload result:", imageUpload);
    } catch (uploadError) {
      console.error("❌ Cloudinary upload exception:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: uploadError.message,
      });
    }

    if (!imageUpload || !imageUpload.success) {
      console.error("❌ Cloudinary upload unsuccessful:", imageUpload);
      return res.status(400).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
        error: imageUpload?.error || "Unknown upload error",
        cloudinaryResult: imageUpload,
      });
    }

    if (!imageUpload.url || !imageUpload.public_id) {
      console.error(
        "❌ Missing URL or public_id in Cloudinary response:",
        imageUpload
      );
      return res.status(400).json({
        success: false,
        message: "Incomplete Cloudinary response",
        cloudinaryResult: imageUpload,
      });
    }

    console.log("✅ Image uploaded successfully");
    console.log("URL:", imageUpload.url);
    console.log("Public ID:", imageUpload.public_id);

    // Create new report
    const reportPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        address: typeof location === "string" ? location : location.address,
        coordinates: {
          latitude:
            location.coordinates?.lat || location.coordinates?.latitude || 0,
          longitude:
            location.coordinates?.lng || location.coordinates?.longitude || 0,
        },
      },
      image: {
        url: imageUpload.url,
        publicId: imageUpload.public_id,
        width: imageUpload.width,
        height: imageUpload.height,
      },
      reportedBy: reportedBy || "Anonymous",
      contactInfo: contactInfo || {},
      language: language || "en",
    };

    console.log("📝 Creating report with image data:", {
      url: reportPayload.image.url ? "SET" : "MISSING",
      publicId: reportPayload.image.publicId ? "SET" : "MISSING",
    });

    const report = new Report(reportPayload);
    const savedReport = await report.save();

    console.log("✅ Report saved successfully:", savedReport._id);
    console.log("=== CREATE REPORT DEBUG END ===");

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: savedReport,
      reportId: savedReport._id,
    });
  } catch (error) {
    console.error("❌ Create report error:", error);
    console.log("=== CREATE REPORT DEBUG END (ERROR) ===");

    if (error.name === "ValidationError") {
      console.error("Validation errors:", Object.keys(error.errors));
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Add other controller functions here (getReports, etc.)
export const getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      sortBy = "reportedAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;
    const reports = await Report.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Report.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReports: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await Report.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      priority,
      assignedTo,
      resolutionNotes,
      estimatedResolution,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
    if (estimatedResolution)
      updateData.estimatedResolution = estimatedResolution;

    if (status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    const report = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.image && report.image.publicId) {
      await deleteFromCloudinary(report.image.publicId);
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      data: report,
    });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getReportsByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const reports = await Report.find({
      "location.coordinates.latitude": {
        $gte: parseFloat(lat) - 0.01,
        $lte: parseFloat(lat) + 0.01,
      },
      "location.coordinates.longitude": {
        $gte: parseFloat(lng) - 0.01,
        $lte: parseFloat(lng) + 0.01,
      },
    });

    res.status(200).json({
      success: true,
      data: reports,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseInt(radius),
    });
  } catch (error) {
    console.error("Get reports by location error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby reports",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalReports,
      pendingReports,
      resolvedReports,
      inProgressReports,
      recentReports,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "resolved" }),
      Report.countDocuments({ status: "in-progress" }),
      Report.find().sort({ reportedAt: -1 }).limit(5).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
          inProgress: inProgressReports,
        },
        recentReports: recentReports,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Get most recent reports
export const getRecentReports = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const recent = await Report.find()
      .sort({ reportedAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    res.status(200).json({
      success: true,
      data: recent,
      count: recent.length,
    });
  } catch (error) {
    console.error("Get recent reports error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent reports",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};
