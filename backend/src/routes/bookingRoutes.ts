import { Router } from "express";
const { createBooking } = require("../controllers/booking/createBooking");
const { createBookings } = require("../controllers/booking/createBookings");
const { getBookings } = require("../controllers/booking/getBookings");
const { deleteBooking } = require("../controllers/booking/deleteBooking");
const { updateBooking } = require("../controllers/booking/updateBooking");
const {
  getAllBookingsForSuperAdmin,
} = require("../controllers/booking/getAllBookingsForSuperAdmin");
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get(
  "/admin/all",
  requireAuth,
  requireRole("super_admin"),
  getAllBookingsForSuperAdmin,
);

router.post("/bulk", createBookings);
router.post("/", createBooking);
router.get("/", getBookings);

router.delete("/:id", requireAuth, requireRole("owner"), deleteBooking);
router.put("/:id", requireAuth, requireRole("owner"), updateBooking);

export default router;
