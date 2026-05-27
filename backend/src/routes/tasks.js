const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
// Returns all tasks. Optional ?status=pending or ?status=done to filter.
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    // Only apply WHERE clause if a valid status filter is provided
    if (status && !['pending', 'done'].includes(status)) {
      return res.status(400).json({ error: 'status must be "pending" or "done"' });
    }

    const query = status
      ? 'SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM tasks ORDER BY created_at DESC';

    const params = status ? [status] : [];
    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /api/tasks ─────────────────────────────────────────────────────────
// Creates a new task. Body: { title, description? }
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Input validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }
    if (title.trim().length > 255) {
      return res.status(400).json({ error: 'title must be 255 characters or less' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), (description || '').trim()]
    );

    // 201 Created — standard for a successful resource creation
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
// Updates a task. Body can contain any subset of: { title, description, status }
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const { title, description, status } = req.body;

    // Validate fields that were provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'title cannot be empty' });
      }
      if (title.trim().length > 255) {
        return res.status(400).json({ error: 'title must be 255 characters or less' });
      }
    }

    if (status !== undefined && !['pending', 'done'].includes(status)) {
      return res.status(400).json({ error: 'status must be "pending" or "done"' });
    }

    // Fetch existing task so we can apply partial updates (PATCH-like behaviour)
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const current = existing.rows[0];

    // Use provided value, or fall back to current DB value
    const newTitle       = title       !== undefined ? title.trim()       : current.title;
    const newDescription = description !== undefined ? description.trim() : current.description;
    const newStatus      = status      !== undefined ? status             : current.status;

    const result = await pool.query(
      `UPDATE tasks
          SET title = $1, description = $2, status = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *`,
      [newTitle, newDescription, newStatus, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 204 No Content — deletion succeeded, nothing to return
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;