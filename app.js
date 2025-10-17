require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoute');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Server running'));

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));

module.exports = app;