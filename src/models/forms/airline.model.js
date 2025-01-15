// Los modelos solo ejecutan las consultas sql a la base de datos. o que realizan operaciones CRUD
// Nota: el modelo no incluye try-catch. Si ocurre un error, este se propaga al controlador, que es el encargado de manejar los errores
import { db } from "../../database/db.js";

// Mostrar todos los registros de la aerolinea
export const getAirlineModel = async () => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM corporativo.aerolinea ORDER BY id_aerolinea ASC"
    );
    // console.log(rows);
    return rows;
  } catch (error) {
    throw new Error(
      "Error al obtener los registros de la base de datos: " + error.message
    );
  }
};

// Mostrar un registro por id
export const getAirlineByIdModel = async (id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM corporativo.aerolinea WHERE id_aerolinea = $1",
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

// Crear nuevo registro aerolinea
// le pasamos data como parámetro nos permite que la función sea más modular y reutilizable.
export const createAirlineModel = async (data) => {
  try {
    const query = `
            INSERT INTO corporativo.aerolinea (nombre, nombre_legal, estado, pais_origen, numero_empleados, sede_principal, telefono, email, cantidad_aviones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            `;
    const values = [
      data.nombre,
      data.nombre_legal,
      data.estado,
      data.pais_origen,
      data.numero_empleados,
      data.sede_principal,
      data.telefono,
      data.email,
      data.cantidad_aviones,
    ];
    const { rows } = await db.query(query, values);
    // console.log(rows);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al crear un registro en la base de datos: " + error.message
    );
  }
};

// Eliminar registro por id
export const deleteAirlineModel = async (id) => {
  try {
    // Primero, desasociar los aviones de la aerolínea estableciendo id_aerolinea a null
    await db.query(
      "UPDATE infraestructura.avion SET id_aerolinea = NULL WHERE id_aerolinea = $1",
      [id]
    );

    // Desasociar los empleados de la aerolínea estableciendo empleado_id_aerolinea a NULL
    await db.query(
      "UPDATE recuersos_humanos.empleados SET id_aerolinea = NULL WHERE id_aerolinea = $1",
      [id]
    );

    // Desasociar los empleados de la aerolínea estableciendo empleado_id_aerolinea a NULL
    await db.query(
      "UPDATE corporativo.vuelo SET id_aerolinea = NULL WHERE id_aerolinea = $1",
      [id]
    );

    // Luego, eliminar la aerolínea
    const { rows, rowCount } = await db.query(
      "DELETE FROM corporativo.aerolinea WHERE id_aerolinea = $1 RETURNING *",
      [id]
    );

    if (rowCount === 0) {
      return null; // No se encontró la aerolínea para eliminar
    }

    return rows[0]; // Retorna la aerolínea eliminada
  } catch (error) {
    throw new Error(
      "Error al eliminar el registro de la aerolínea: " + error.message
    );
  }
};

// Actualizar un registro por id
export const updateAirlineModel = async (id, data) => {
  try {
    // Hay que exluir el id_aerolinea para la actualizacion
    const { id_aerolinea, ...updateData } = data;

    // Crear dinámicamente el conjunto de campos a actualizar
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    // Validar si hay campos para actualizar
    if (fields.length === 0) {
      throw new Error("No hay datos para actualizar.");
    }

    // Crear consulta dinámica
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");
    const query = `
            UPDATE corporativo.aerolinea
            SET ${setClause}
            WHERE id_aerolinea = $1
            RETURNING *;
        `;

    // Agregar el ID al inicio de los valores
    const { rows } = await db.query(query, [id, ...values]);

    // Validar si el registro fue encontrado
    if (rows.length === 0) {
      return null;
    }

    // console.log(rows[0]);
    return rows[0];
  } catch (error) {
    throw new Error(
      "Error al actualizar el registro en la base de datos: " + error.message
    );
  }
};

export const searchAirlinesModel = async (name, country) => {
  try {
    // Crear la consulta base
    let query = "SELECT * FROM corporativo.aerolinea WHERE 1=1"; // 1=1 es una técnica para facilitar la concatenación de condiciones
    const values = [];
    let paramIndex = 1; // Para manejar el índice de los parámetros

    // Agregar condiciones según los parámetros proporcionados
    if (name) {
      query += ` AND nombre ILIKE $${paramIndex}`; // ILIKE para búsqueda insensible a mayúsculas
      values.push(`%${name}%`); // Agregar el nombre con comodines para búsqueda parcial
      paramIndex++;
    }

    if (country) {
      query += ` AND pais_origen ILIKE = $${paramIndex}`; // Suponiendo que 'estado' es un campo en la tabla
      values.push(`%${country}%`);
      paramIndex++;
    }

    // Ejecutar la consulta
    const { rows } = await db.query(query, values);
    return rows; // Retornar los registros encontrados
  } catch (error) {
    throw new Error("Error al buscar aerolíneas: " + error.message);
  }
};
