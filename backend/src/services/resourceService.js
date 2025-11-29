// src/services/resourceService.js
import Resource from "../models/Resource.js";
import User from "../models/User.js";

// Add a new resource (lend item)
export const addResource = async ({ name, description, ownerId, apartmentId }) => {
  const resource = new Resource({
    name,
    description,
    owner: ownerId,
    apartment: apartmentId,
    status: "available"
  });
  await resource.save();
  return resource;
};

// Request a resource (borrow item)
export const requestResource = async ({ resourceId, requesterId }) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new Error("Resource not found");
  if (resource.status !== "available") throw new Error("Resource is not available");

  resource.requester = requesterId;
  resource.status = "requested";
  await resource.save();
  return resource;
};

// Approve borrow request (admin or owner)
export const approveResourceRequest = async ({ resourceId, approve }) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new Error("Resource not found");
  if (!resource.requester) throw new Error("No requester for this resource");

  resource.status = approve ? "borrowed" : "available";
  if (!approve) resource.requester = null;

  await resource.save();
  return resource;
};

// Return resource
export const returnResource = async (resourceId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw new Error("Resource not found");

  resource.status = "available";
  resource.requester = null;
  await resource.save();
  return resource;
};

// Get all resources in an apartment
export const getApartmentResources = async (apartmentId) => {
  return await Resource.find({ apartment: apartmentId });
};
