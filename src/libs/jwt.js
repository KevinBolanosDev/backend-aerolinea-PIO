import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

//creamos el token para la autenticación
export function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}