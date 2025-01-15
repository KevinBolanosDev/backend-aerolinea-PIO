import { Router } from "express";
import {
  createAirport,
  deleteAirport,
  getAirport,
  getAirportById,
  updateAirport,
} from "../../controllers/forms/airport.controller.js";

const router = Router();

router.get("/", getAirport);

router.get("/:id", getAirportById);

router.post("/", createAirport);

router.delete("/:id", deleteAirport);

router.put("/:id", updateAirport);

export default router;