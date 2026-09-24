// API_BASE_URL: local dev talks to your local backend; anywhere else
// (Netlify) talks to the deployed Render backend. Update the production
// URL once the backend is deployed.

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://young4chicks-backend.onrender.com';




  