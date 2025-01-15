import bcrypt from "bcryptjs";
import { createToken } from "../../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../../config.js";
import { UserModel } from "../../models/auth/auth.model.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userFound = await UserModel.findOneByEmail(email);
    if (userFound) return res.status(400).json(["El email ya está registrado"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const userSaved = await UserModel.createUser({
      email,
      password: passwordHash,
      role,
    });

    const token = await createToken({ id: userSaved.id });

    res.cookie("token", token);

    res.json({
      id: userSaved.id,
      email: userSaved.email,
      role: userSaved.role,
      created_at: userSaved.created_at,
      updated_at: userSaved.updated_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await UserModel.findOneByEmail(email);
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createToken({ id: userFound.id });
    res.cookie("token", token);

    res.json({
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const userFound = await UserModel.findById(decoded.id);

    if (!userFound) return res.status(401).json({ message: "User not found" });

    return res.json({
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
