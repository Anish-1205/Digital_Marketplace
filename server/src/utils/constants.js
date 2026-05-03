const ROLES = {
  CUSTOMER: "customer",
  ENTREPRENEUR: "entrepreneur",
  ADMIN: "admin"
};

const SERVICE_REQUEST_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "completed"
};

const ORDER_STATUSES = {
  PLACED: "placed",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

module.exports = {
  ROLES,
  SERVICE_REQUEST_STATUSES,
  ORDER_STATUSES
};
