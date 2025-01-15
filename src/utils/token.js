import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config";

export function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "5m",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}
