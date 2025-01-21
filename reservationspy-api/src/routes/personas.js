const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las personas
router.get('/', async (req, res) => {
    console.log('Obteniendo personas');

    try {
        const [rows] = await db.query('SELECT * FROM persona');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Crear una nueva persona
router.post('/', async (req, res) => {
    const { nombrecompleto, nrodocumento, correo, telefono } = req.body;
    try {
        const query = 'INSERT INTO persona (nombrecompleto, nrodocumento, correo, telefono) VALUES (?, ?, ?, ?)';
        await db.query(query, [nombrecompleto, nrodocumento, correo, telefono]);
        res.status(201).json({ message: 'Persona creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar una persona
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombrecompleto, nrodocumento, correo, telefono } = req.body;
    try {
        await db.query(
            'UPDATE persona SET nombrecompleto = ?, nrodocumento = ?, correo = ?, telefono = ? WHERE id = ?',
            [nombrecompleto, nrodocumento, correo, telefono, id]
        );
        res.json({ message: 'Persona actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar una persona
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM persona WHERE id = ?', [id]);
        res.json({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;
