import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config.js'
import routes from './src/routes/index.js';

const app = express();

// Permitir solicitudes desde tu dominio frontend
const allowedOrigins = ['https://dashboard-aerolinea.netlify.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
      secret: SESSION_SECRET, // Cambia esto por una clave secreta segura
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true, // true si estás usando HTTPS
        sameSite: 'none', // Requerido para solicitudes cross-origin
      },
    })
  );

// Estás indicando que todas las rutas definidas en el archivo routes/index.js estarán disponibles bajo el prefijo '/api'
app.use('/api', routes);


app.listen(PORT, () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});