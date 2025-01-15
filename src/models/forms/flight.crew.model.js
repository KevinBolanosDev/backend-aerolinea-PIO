// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
import { db } from "../../database/db.js";

// Mostrar todos los registros
export const getFlightCrewModel = async () => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM recuersos_humanos.tripulacion_vuelo"
    );
    console.log(rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al obtener los registros de la base de datos: " + error.message
    );
  }
};

// Mostrar un registro por id
export const getFlightCrewByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM recuersos_humanos.tripulacion_vuelo WHERE id_tripulacion_vuelo = $1",
      [id]
    );
    console.log(rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al obtener el registro de la base de datos: " + error.message
    );
  }
};

// Crear nuevo registro
// le pasamos data como parámetro nos permite que la función sea más modular y reutilizable.
export const createFlightCrewModel = async (data) => {
  try {
    const query = `
            INSERT INTO recuersos_humanos.tripulacion_vuelo (rol, horas_servicio, estado) VALUES ($1, $2, $3)
            RETURNING *
            `;
    const values = [
      data.rol,
      data.horas_servicio, 
      data.estado
    ];

    const { rows } = await db.query(query, values);
    console.log(rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al crear un registro en la base de datos:",
      +error.message
    );
  }
};

// Actualizar un registro por id
export const updateFlightCrewModel = async (id, data) => {
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
            UPDATE recuersos_humanos.tripulacion_vuelo
            SET ${setClause}
            WHERE id_tripulacion_vuelo = $1
            RETURNING *;
        `;

    // Agregar el ID al inicio de los valores
    const { rows } = await db.query(query, [id, ...values]);

    // Validar si el registro fue encontrado
    if (rows.length === 0) {
      return null;
    }

    console.log(rows[0]);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al actualizar el registro en la base de datos: " + error.message
    );
  }
};

// Eliminar registro por id
export const deleteFlightCrewModel = async (id) => {
  try {
    const { rows, rowCount } = await db.query(
      "DELETE FROM recuersos_humanos.tripulacion_vuelo WHERE id_tripulacion_vuelo = $1 RETURNING *",
      [id]
    );
    if (rowCount === 0) {
      return null;
    }
    console.log(rowCount, rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al eliminar el registro de la base de datos: " + error.message
    );
  }
};
