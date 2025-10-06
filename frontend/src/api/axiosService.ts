import axios from 'axios';
import dotenv from 'dotenv';

// Cargar variables de entorno PRIMERO
/*dotenv.config();

const production = process.env.NODE_ENV === 'production';

const production = false;
const baseUrl = process.env.DEVELOPMENT_URL || 'http://localhost:3000/api';
const productionUrl = process.env.PRODUCTION_URL || 'https://tu-api-production.com/api';

// Verificar que las variables se cargaron
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DEVELOPMENT_URL:', process.env.DEVELOPMENT_URL);
console.log('PRODUCTION_URL:', process.env.PRODUCTION_URL);*/

// Usar valores por defecto más robustos
const production = false;
const baseUrl = 'http://localhost:3000/api';
const productionUrl = 'https://tu-api-production.com/api';

export const axiosService = axios.create({
    baseURL: production ? productionUrl : baseUrl,
    withCredentials: true,
});