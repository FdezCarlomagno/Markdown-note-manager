import axios from 'axios'

const tunnelUrl = 'https://t7kvkw28-3000.brs.devtunnels.ms/api'
const baseUrl = 'http://localhost:3000/api'

export const axiosService = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

