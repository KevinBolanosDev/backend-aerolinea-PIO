import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config.js'
import routes from './src/routes/index.js';

const app = express();

app.use(cors({
    origin: 'https://dashboard-aerolinea.netlify.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

// Estás indicando que todas las rutas definidas en el archivo routes/index.js estarán disponibles bajo el prefijo '/api'
app.use('/api', routes);


app.listen(PORT, () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});