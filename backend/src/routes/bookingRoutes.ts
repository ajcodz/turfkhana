import { Router } from "express";
const { createBooking } = require("../controllers/booking/createBooking");
const { getBookings } = require("../controllers/booking/getBookings");
const { deleteBooking } = require("../controllers/booking/deleteBooking");
const { updateBooking } = require("../controllers/booking/updateBooking");

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);
router.put("/:id", updateBooking);

export default router;
