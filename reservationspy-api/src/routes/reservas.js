const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las reservas
router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT r.id, r.fechareserva, r.fechaentrada, r.fechasalida, r.montoreserva,
               p.nombrecompleto AS cliente, h.habitacionpiso, h.habitacionnro
        FROM reserva r
        INNER JOIN persona p ON r.personaid = p.id
        INNER JOIN habitacion h ON r.habitacionid = h.id
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las reservas' });
    }
  });
  

// Crear una nueva reserva
router.post('/', async (req, res) => {
    const { fechaentrada, fechasalida, habitacionid, personaid } = req.body;
  
    try {
      // Verificar disponibilidad de la habitación (evitar solapamiento de reservas)
      const [exists] = await db.query(
        `SELECT COUNT(*) AS count FROM reserva 
         WHERE habitacionid = ? 
         AND ((? BETWEEN fechaentrada AND fechasalida) 
         OR (? BETWEEN fechaentrada AND fechasalida) 
         OR (fechaentrada BETWEEN ? AND ?)
         OR (fechasalida BETWEEN ? AND ?))`,
        [habitacionid, fechaentrada, fechasalida, fechaentrada, fechasalida, fechaentrada, fechasalida]
      );
  
      if (exists[0].count > 0) {
        return res.status(400).json({ error: 'La habitación no está disponible en el rango de fechas' });
      }
  
      // Calcular el monto de la reserva (Cantidad de días * 120000)
      const diffDays = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        return res.status(400).json({ error: 'La fecha de salida debe ser mayor que la fecha de entrada' });
      }
  
      const montoreserva = diffDays * 120000;
  
      await db.query(
        'INSERT INTO reserva (fechaentrada, fechasalida, habitacionid, personaid, montoreserva) VALUES (?, ?, ?, ?, ?)',
        [fechaentrada, fechasalida, habitacionid, personaid, montoreserva]
      );
  
      res.status(201).json({ message: 'Reserva creada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la reserva' });
    }
  });

// Actualizar una reserva
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fechaentrada, fechasalida } = req.body;
  
    if (!fechaentrada || !fechasalida) {
      return res.status(400).json({ error: 'Las fechas de entrada y salida son obligatorias' });
    }
  
    try {
      const diffDays = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        return res.status(400).json({ error: 'La fecha de salida debe ser mayor que la fecha de entrada' });
      }
  
      const montoreserva = diffDays * 120000;
  
      const query = `
        UPDATE reserva 
        SET fechaentrada = ?, fechasalida = ?, montoreserva = ? 
        WHERE id = ?
      `;
      await db.query(query, [fechaentrada, fechasalida, montoreserva, id]);
  
      res.json({ message: 'Reserva actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
  });
  

// Eliminar una reserva
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM reserva WHERE id = ?', [id]);
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
});

module.exports = router;
