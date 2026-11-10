import pool from "../db.js";

const STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED'];

export default function registerBookings(server) {
  // GET all
  server.get('/bookings', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM bookings ORDER BY id 
      `);
      return res.status(200).json(result.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET by ID
  server.get('/bookings/:id', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM bookings WHERE id = $1`, [req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Could not find booking' });
      }
      res.status(200).json(rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // CREATE
  server.post('/bookings', async (req, res) => {
    try {
      const { name, email, date_time, number_of_people, status = 'PENDING' } = req.body;

      if (!name || !email || !date_time || !number_of_people) {
        return res.status(400).json({
          message: "Invalid request."
        });
      }

      const result = await pool.query(
        `INSERT INTO bookings (name, email, date_time, number_of_people, status)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, email, date_time, number_of_people, status]);
      res.status(201).json(result.rows[0]);

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // UPDATE
  server.put('/bookings/:id', async (req, res) => {
    try {
      const { name, email, date_time, number_of_people, status = 'PENDING' } = req.body;

      if (!name || !email || !date_time || !number_of_people) {
        return res.status(400).json({
          message: "Invalid request."
        });
      }
      const result = await pool.query(
        `UPDATE bookings SET name=$1, email=$2, date_time=$3,
         number_of_people=$4, status=$5 WHERE id=$6 RETURNING *`,
        [name, email, date_time, number_of_people, status, req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({
          error: 'Could not find booking.'
        });
      }
      res.status(200).json(result.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  // DELETE
  server.delete('/bookings/:id', async (req, res) => {
    try {
      const result = await pool.query(`
        DELETE FROM bookings
        WHERE id = $1
        `, [req.params.id]);
      if (!result.rowCount) {
        return res.status(404).json({ error: 'Could not find booking.' });
      }
      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  });
}