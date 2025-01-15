// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
import { db } from "../../database/db.js";

// Mostrar todos los registros del aeropuerto
export const getAirportModel = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM infraestructura.aeropuerto");
    // console.log(rows);
    return rows;
  } catch (error) {
    throw new Error(
      "Error al obtener los registros de la base de datos: " + error.message
    );
  }
};

// Mostrar un registro por id
export const getAirportByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM infraestructura.aeropuerto WHERE id_aeropuerto = $1",
      [id]
    );
    // console.log(rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al obtener el registro de la base de datos: " + error.message
    );
  }
};

// Crear nuevo aeropuerto
// le pasamos data como parámetro nos permite que la función sea más modular y reutilizable.
export const createAirportModel = async (data) => {
  const query = `
        INSERT INTO infraestructura.aeropuerto (nombre, ciudad, pais, codigo_iata, estado) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `;
  const values = [
    data.nombre,
    data.ciudad,
    data.pais,
    data.codigo_iata,
    data.estado,
  ];

  const { rows } = await db.query(query, values);
  console.log(rows);
  return rows[0];
};

// Actualizar un registro por id
export const updateAirportModel = async (id, data) => {
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
              UPDATE infraestructura.aeropuerto
              SET ${setClause}
              WHERE id_aeropuerto = $1
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

// Eliminar cliente por id
export const deleteAirportModel = async (id) => {
  try {
    const { rows, rowCount } = await db.query(
      "DELETE FROM infraestructura.aeropuerto WHERE id_aeropuerto = $1 RETURNING *",
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
