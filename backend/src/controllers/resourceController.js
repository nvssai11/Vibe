import Resource from "../models/Resource.js";
import User from "../models/User.js";

/**
 * Add a new resource
 * POST /api/resources
 * body: { title, description, category, apartmentId }
 */
export const addResource = async (req, res) => {
  try {
    const { title, description, category, apartment } = req.body;
    
    // Validate required fields
    if (!title || !category || !apartment) {
      return res.status(400).json({ 
        error: "Title, category and apartment are required" 
      });
    }

    const resource = await Resource.create({
      title,
      description,
      category,
      apartment,
      owner: req.userId
    });
    
    res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message,
      message: "Failed to create resource"
    });
  }
};

/**
 * Get all resources in apartment
 * GET /api/resources/:apartmentId
 */
export const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    console.log('Fetching resources with filter:', filter);
    const query = Resource.find(filter)
      .populate("owner", "name email")
      .populate("borrower", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    console.log('Query with populate:', query.getFilter());
    
    const [resources, total] = await Promise.all([
      query.exec(),
      Resource.countDocuments(filter)
    ]);
    
    console.log('Resources after populate:', resources.map(r => ({
      _id: r._id,
      title: r.title,
      owner: r.owner,
      borrower: r.borrower
    })));
    
    res.json({
      success: true,
      data: resources,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to fetch resources"
    });
  }
};

/**
 * Request to borrow resource
 * PATCH /api/resources/:id/request
 */
export const requestResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ 
      success: false,
      error: "Resource not found" 
    });
    
    if (resource.status !== "available") {
      return res.status(400).json({ 
        success: false,
        error: "Resource is not available for borrowing" 
      });
    }

    // Prevent owner from requesting their own resource
    if (String(resource.owner) === req.userId) {
      return res.status(400).json({
        success: false,
        error: "Cannot request your own resource"
      });
    }
    
    // Verify requester exists
    const requester = await User.findById(req.userId);
    if (!requester) {
      return res.status(400).json({
        success: false,
        error: "Invalid user"
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        status: "requested",
        borrower: req.userId,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate("owner", "name email");
    
    res.json({
      success: true,
      message: "Resource request submitted",
      data: updatedResource
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message,
      message: "Failed to request resource"
    });
  }
};

/**
 * Approve borrow (owner or admin)
 * PATCH /api/resources/:id/approve
 */
// APPROVE RESOURCE REQUEST 
export const approveResource = async (req, res) => { 
  try { 
    console.log("Approve resource request received", {
      resourceId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role
    });

    const resource = await Resource.findById(req.params.id); 

    if (!resource) { 
      console.error("Resource not found", { resourceId: req.params.id });
      return res.status(404).json({ error: "Resource not found" }); 
    } 

    if (resource.status !== "requested") { 
      console.error("Resource not in requested state", { resourceId: req.params.id, status: resource.status });
      return res.status(400).json({ error: "Resource is not in requested state" }); 
    } 

    // only the owner can approve 
    if (resource.owner.toString() !== req.user.id.toString()) { 
      console.error("Unauthorized approval attempt", { resourceId: req.params.id, ownerId: resource.owner, userId: req.user.id });
      return res.status(403).json({ error: "Only the owner can approve this request" }); 
    } 

    resource.status = "borrowed"; 
    await resource.save(); 

    const updated = await Resource.findById(resource._id) 
      .populate("owner", "name email") 
      .populate("borrower", "name email"); 

    console.log("Resource approved successfully", { resourceId: resource._id });

    return res.status(200).json({ 
      success: true, 
      message: "Request approved", 
      data: updated 
    }); 
  } catch (err) { 
    console.error("Approval error", { 
      error: err.message, 
      stack: err.stack, 
      resourceId: req.params.id, 
      userId: req.user.id, 
      userRole: req.user.role 
    }); 

    return res.status(500).json({ 
      success: false, 
      error: err.message, 
      message: "Failed to approve resource request" 
    }); 
  } 
};

/**
 * Return resource
 * PATCH /api/resources/:id/return
 */
export const declineResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found"
      });
    }

    // Only owner or admin can decline
    const isOwner = String(resource.owner) === req.userId;
    const isAdmin = req.userRole === "apartment_admin" || req.userRole === "super_admin";
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to decline this request"
      });
    }

    if (resource.status !== "requested") {
      return res.status(400).json({
        success: false,
        error: "No pending request to decline"
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        status: "declined",
        borrower: null,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate(["owner", "borrower"], "name email");

    res.json({
      success: true,
      message: "Resource request declined",
      data: updatedResource
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to decline resource request"
    });
  }
};

export const returnResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found"
      });
    }

    // Only borrower can return
    if (String(resource.borrower) !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to return this resource"
      });
    }

    if (resource.status !== "borrowed") {
      return res.status(400).json({
        success: false,
        error: "Resource is not currently borrowed"
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        status: "available",
        borrower: null,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate("owner", "name email");

    res.json({
      success: true,
      message: "Resource returned successfully",
      data: updatedResource
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to return resource"
    });
  }
};