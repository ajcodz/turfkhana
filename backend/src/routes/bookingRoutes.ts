import { Router } from "express";
const { createBooking } = require("../controllers/booking/createBooking");
const { getBookings } = require("../controllers/booking/getBookings");
const { deleteBooking } = require("../controllers/booking/deleteBooking");

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);

export default router;
