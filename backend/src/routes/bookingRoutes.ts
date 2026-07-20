import { Router } from "express";
const { createBooking } = require("../controllers/booking/createBooking");
const { getBookings } = require("../controllers/booking/getBookings");
const { deleteBooking } = require("../controllers/booking/deleteBooking");
const { updateBooking } = require("../controllers/booking/updateBooking");
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);

router.delete("/:id", requireAuth, requireRole("owner"), deleteBooking);
router.put("/:id", requireAuth, requireRole("owner"), updateBooking);

export default router;
