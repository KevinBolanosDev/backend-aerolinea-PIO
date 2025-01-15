// Nota: crear un index.js en routes es común en proyectos que necesitan una organización centralizada. Se define un archivo principal, como routes/index.js, que importa todas las rutas y las agrupa.

import { Router } from "express";

// importamos todas las rutas creadas
import authRoutes from "./auth/auth.routes.js";
import airline from "./forms/airline.routes.js";
import airport from "./forms/airport.routes.js";
import airplane from "./forms/airplane.routes.js";
// ...importa otras rutas aquí...

const router = Router();

router.use("/auth", authRoutes);

router.use("/airline", airline);
router.use("/airport", airport);
router.use("/airplane", airplane);
// ...usa otras rutas aquí...

export default router;
