const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const { syncElasticsearch } = require('./config/elasticsearch');

// Load environment variables from .env file
dotenv.config();

const app = express();
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

// Enable CORS for the client 
app.use(cors({
  origin: CLIENT_PORT,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
// Import route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Define API routes
app.use('/', authRoutes);            
app.use('/products', productRoutes); 
app.use('/search', searchRoutes);    

const PORT = process.env.PORT || 5000;

// Start the server only after DB and Elasticsearch are ready
async function startServer() {
  try {
    await connectDB();           
    await syncElasticsearch();  

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
