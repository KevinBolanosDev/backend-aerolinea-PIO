// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
import { db } from "../../database/db.js";

// Mostrar todos los registros
export const getAirplaneModel = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM infraestructura.avion");
    return rows;
  } catch (error) {
    throw new Error(
      "Error al obtener los registros de la base de datos: " + error.message
    );
  }
};

// Mostrar un registro por id
export const getAirplaneByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM infraestructura.avion WHERE id_avion = $1",
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al obtener el registro de la base de datos: " + error.message
    );
  }
};

// Crear nuevo registro
// le pasamos data como parámetro nos permite que la función sea más modular y reutilizable.
export const createAirplaneModel = async (data) => {
  try {
    const query = `
            INSERT INTO infraestructura.avion (modelo, capacidad_pasajeros, capacidad_carga_kg, fecha_fabricacion, estado, ultimo_mantenimiento, proximo_mantenimiento) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `;
    const values = [
      data.modelo, 
      data.capacidad_pasajeros, 
      data.capacidad_carga_kg, 
      data.fecha_fabricacion, 
      data.estado, 
      data.ultimo_mantenimiento, 
      data.proximo_mantenimiento
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al crear un registro en la base de datos:",
      +error.message
    );
  }
};

// Actualizar un registro por id
export const updateAirplaneModel = async (id, data) => {
  try {
    // Crear dinámicamente el conjunto de campos a actualizar
    const fields = Object.keys(data);
    const values = Object.values(data);

    // Validar si hay campos para actualizar
    if (fields.length === 0) {
      throw new Error("No hay datos para actualizar.");
    }

    // Crear consulta dinámica
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");
    const query = `
            UPDATE infraestructura.avion
            SET ${setClause}
            WHERE id_avion = $1
            RETURNING *;
        `;

    // Agregar el ID al inicio de los valores
    const { rows } = await db.query(query, [id, ...values]);

    // Validar si el registro fue encontrado
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al actualizar el registro en la base de datos: " + error.message
    );
  }
};

// Eliminar registro por id
export const deleteAirplaneModel = async (id) => {
  try {
    const { rows, rowCount } = await db.query(
      "DELETE FROM infraestructura.avion WHERE id_avion = $1 RETURNING *",
      [id]
    );
    if (rowCount === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al eliminar el registro de la base de datos: " + error.message
    );
  }
};
