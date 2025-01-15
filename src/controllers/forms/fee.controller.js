// El controlador delega tareras a los servicios, y esta devuelve las respuestas manejando las solicitudes HTTP, además de manejar los errores.
import * as airlineModel from "../../models/forms/airline.model.js";

// Controlador para obtener registros de aerolinea
export const getAirline = async (req, res) => {
  try {
    const airline = await airlineModel.getAirlineModel();
    return res.json(airline);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// Controlador para obtener un registro
export const getAirlineById = async (req, res) => {
  const { id } = req.params;
  try {
    const airline = await airlineModel.getAirlineByIdModel(id);
    if (!airline) {
      return res.status(404).json({ message: "Aerolinea no encontrada." });
    }
    return res.json(airline);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la aerolinea por id.",
      error: error.message,
    });
  }
};

export const createAirline = async (req, res) => {
  try {
    const newAirline = await airlineModel.createAirlineModel(req.body);
    return res.status(201).json(newAirline);
  } catch (error) {
    console.error("Error al crear la aerolínea controller:", error.message);
    return res.status(error.status || 500).json({
      message: error.message || "Error del servidor!",
    });
  }
};

// Controlador para eliminar un registro por id
export const deleteAirline = async (req, res) => {
  const { id } = req.params;
  try {
    const airline = await airlineModel.deleteAirlineModel(id);
    if (!airline) {
      return res.status(404).json({ message: "Aerolinea no encontrada" });
    }
    return res
      .status(200)
      .json({ message: "Aerolinea eliminada con exito", airline });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la aerolinea por id",
      error: error.message,
    });
  }
};

// Controlado para actualizar los registros
export const updateAirline = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const data = req.body; // Obtener los datos del cuerpo de la solicitud

    // Validar si se proporcionó un ID
    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID de la aerolínea es requerido." });
    }

    // Validar si se proporcionaron datos para actualizar
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar." });
    }

    // Llamar al modelo para actualizar la aerolínea
    const updatedAirline = await airlineModel.updateAirlineModel(id, data);

    // Validar si la aerolínea fue encontrada y actualizada
    if (!updatedAirline) {
      return res
        .status(404)
        .json({ message: "La aerolínea no fue encontrada." });
    }

    // Retornar la respuesta con el registro actualizado
    return res.status(200).json({
      message: "Aerolínea actualizada correctamente.",
      data: updatedAirline,
    });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({
      message: "Ocurrió un error al actualizar la aerolínea.",
      error: error.message,
    });
  }
};
