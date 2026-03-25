require('dns').setServers(['8.8.8.8']);
require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('./app');

const app = createApp();
const PORT = process.env.PORT || 3002;

// Database Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB (TradeSphereAI)'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
