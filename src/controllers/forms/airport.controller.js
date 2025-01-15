// El controlador delega tareras a los servicios, y esta devuelve las respuestas manejando las solicitudes HTTP, además de manejar los errores.
import * as airlineAirport from "../../models/forms/airport.model.js";

// Controlador para obtener registros de aerolinea
export const getAirport = async (req, res) => {
  try {
    const airline = await airlineAirport.getAirportModel();
    return res.json(airline);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// Controlador para obtener un registro
export const getAirportById = async (req, res) => {
  const { id } = req.params;
  try {
    const airline = await airlineAirport.getAirportByIdModel(id);
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

export const createAirport = async (req, res) => {
  try {
    const newAirline = await airlineAirport.createAirportModel(req.body);
    return res.status(201).json(newAirline);
  } catch (error) {
    console.error("Error al crear la aerolínea controller:", error.message);
    return res.status(error.status || 500).json({
      message: error.message || "Error del servidor!",
    });
  }
};

// Controlador para eliminar un registro por id
export const deleteAirport = async (req, res) => {
  const { id } = req.params;
  try {
    const airline = await airlineAirport.deleteAirportModel(id);
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
export const updateAirport = async (req, res) => {
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
    const updatedAirline = await airlineAirport.updateAirportModel(id, data);

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
