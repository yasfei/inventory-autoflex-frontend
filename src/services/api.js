import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // porta padrão do Quarkus, mudar para a URL do backend caso seja diferente
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
