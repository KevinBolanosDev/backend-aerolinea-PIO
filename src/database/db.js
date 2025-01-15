import 'dotenv/config';
import  pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error("Error: La variable de entorno no está definida.");
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

// Conectando el servidor a pg admin
export const db = new Pool({
  allowExitOnIdle: true,
  connectionString
});

// Verificamos la conexión
const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log("Conexión a la base de datos exitosa:", result.rows[0].now);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

testConnection();


