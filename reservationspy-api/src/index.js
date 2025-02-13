const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const personasRoutes = require('./routes/personas');
app.use('/personas', personasRoutes);

const habitacionesRoutes = require('./routes/habitaciones');
app.use('/habitaciones', habitacionesRoutes);

const reservasRoutes = require('./routes/reservas');
app.use('/reservas', reservasRoutes);


app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
