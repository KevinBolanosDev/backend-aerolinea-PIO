import { Router } from "express";
import {
  createAirplane,
  deleteAirplane,
  getAirplane,
  getAirplaneById,
  updateAirplane,
} from "../../controllers/forms/airplane.controller.js";

const router = Router();

router.get("/", getAirplane);

router.get("/:id", getAirplaneById);

router.post("/", createAirplane);

router.put("/:id", updateAirplane);

router.delete("/:id", deleteAirplane);

export default router;
