import { Router } from "express";
import {
  createAirline,
  deleteAirline,
  getAirline,
  getAirlineById,
  searchAirlines,
  updateAirline,
} from "../../controllers/forms/airline.controller.js";

const router = Router();

router.get("/", getAirline);

router.get("/:id", getAirlineById);

router.get("/search/:id", searchAirlines)

router.post("/", createAirline);

router.delete("/:id", deleteAirline);

router.put("/:id", updateAirline);

export default router;