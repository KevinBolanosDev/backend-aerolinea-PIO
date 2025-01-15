// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
import { db } from "../../database/db.js";

// Mostrar todos los registros
export const getMaintenanceModel = async () => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM infraestructura.mantenimiento"
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
export const getMaintenanceByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM infraestructura.mantenimiento WHERE id_mantenimiento = $1",
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
export const createMaintenanceModel = async (data) => {
  try {
    const query = `
            INSERT INTO infraestructura.mantenimiento (tipo_mantenimiento, fecha_inicio, fecha_fin, estado, duracion_horas, ubicacion, costo_mantenimiento) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `;
    const values = [
      data.tipo_mantenimiento, 
      data.fecha_inicio, 
      data.fecha_fin, 
      data.estado, 
      data.duracion_horas, 
      data.ubicacion, 
      data.costo_mantenimiento
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
export const updateMaintenanceModel = async (id, data) => {
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
            UPDATE infraestructura.mantenimiento
            SET ${setClause}
            WHERE id_mantenimiento = $1
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
export const deleteMaintenanceModel = async (id) => {
  try {
    const { rows, rowCount } = await db.query(
      "DELETE FROM infraestructura.mantenimiento WHERE id_mantenimiento = $1 RETURNING *",
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
