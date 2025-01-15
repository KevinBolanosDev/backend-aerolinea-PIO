import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

//creamos un middleware para validar la autenticacion del token de inicio de sesión
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
    return res.status(401).json({ message: "No estas autorizado" });
    
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({ message: "Token invalido" });

        req.user = user;
        
        next();
    });
};


/* export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ ok: false, message: "Token not provided." });
  }
  // Eliminamos la palabra "Bearer" y dejamos solo el token
  token = token.split(" ")[1];

  try {
    //payload del token
    const { email, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.email = email;
    req.role = role;

    next(); // Continuamos con el siguiente middleware o la ruta
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Error verifying token.",
    });
  }
};

export const verifyRole = (req, res, next) => {
  if (req.role === "admin" || req.role === "user") {
    return next();
  }
  return res.status(403).json({ error: "Only admin login!" });
}; */
