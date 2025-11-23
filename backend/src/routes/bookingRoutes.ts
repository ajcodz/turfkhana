import { Router } from "express";
const { createBooking } = require('../controllers/booking/createBooking');
const { getBookings } = require('../controllers/booking/getBookings');

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);

export default router;