// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
import { db } from "../../database/db.js";

// Mostrar todos los registros
export const getEmployeesModel = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM recuersos_humanos.empleado");
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al obtener los registros de la base de datos: " + error.message
    );
  }
};

// Mostrar un registro por id
export const getEmployeesByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM recuersos_humanos.empleado WHERE id_empleado = $1",
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
export const createEmployeesModel = async (data) => {
  try {
    const query = `
            INSERT INTO recuersos_humano.empleado (nombre, segundo_nombre, apellido, segundo_apellido, tipo_documento, numero_documento, fecha_nacimiento, genero, fecha_nacimiento, genero, fecha_contratacion, cargo, pais, ciudad, salario, email_corporativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 $9, $10, $11, 12, 13, 14, 15, $16)  
            RETURNING *
            `;
    const values = [
      data.nombre, 
      data.segundo_nombre, 
      data.apellido, 
      data.segundo_apellido, 
      data.tipo_documento, 
      data.numero_documento, 
      data.fecha_nacimiento, 
      data.genero, 
      data.fecha_nacimiento, 
      data.genero, 
      data.fecha_contratacion, 
      data.cargo, 
      data.pais, 
      data.ciudad, 
      data.salario, 
      data.email_corporativo
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
export const updateEmployeesModel = async (id, data) => {
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
            UPDATE recuersos_humanos.avion
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
export const deleteEmployeesModel = async (id) => {
  try {
    const { rows, rowCount } = await db.query(
      "DELETE FROM recuersos_humanos.empleado WHERE id_avion = $1 RETURNING *",
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
