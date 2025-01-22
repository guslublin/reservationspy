const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las habitaciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM habitacion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las habitaciones' });
  }
});

// Crear una nueva habitación con manejo de errores detallado
router.post('/', async (req, res) => {
    const { habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar } = req.body;
    try {
      console.log("Datos recibidos:", req.body);
  
      await db.query(
        'INSERT INTO habitacion (habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar) VALUES (?, ?, ?, ?, ?)',
        [habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar]
      );
  
      res.status(201).json({ message: 'Habitación creada correctamente' });
    } catch (error) {
      console.error('Error al crear la habitación:', error);
      res.status(500).json({ error: 'Error al crear la habitación' });
    }
  });
  

// Actualizar una habitación por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar } = req.body;
  try {
    const result = await db.query(
      'UPDATE habitacion SET habitacionpiso = ?, habitacionnro = ?, cantcamas = ?, tienetelevision = ?, tienefrigobar = ? WHERE id = ?',
      [habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar, id]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json({ message: 'Habitación actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la habitación' });
  }
});

// Eliminar una habitación por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM habitacion WHERE id = ?', [id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json({ message: 'Habitación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la habitación' });
  }
});

module.exports = router;
