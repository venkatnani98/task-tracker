const request = require('supertest');

// Mock the DB module BEFORE importing app.
// This intercepts the require() call so routes use our mock pool, not real Postgres.
jest.mock('../src/db', () => ({
  pool: { query: jest.fn() },
  initDb: jest.fn().mockResolvedValue(),
}));

const { pool } = require('../src/db');
const app = require('../src/app');

// Clear mock call history between tests so they don't bleed into each other
beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('returns all tasks as JSON array', async () => {
    const mockTasks = [
      { id: 1, title: 'Buy milk', description: '', status: 'pending', created_at: new Date() },
    ];
    pool.query.mockResolvedValue({ rows: mockTasks });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Buy milk');
  });

  it('filters by status when ?status=pending is provided', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await request(app).get('/api/tasks?status=pending');

    // The query should have been called with the filter value as a parameter
    const [querySql, queryParams] = pool.query.mock.calls[0];
    expect(querySql).toContain('WHERE status');
    expect(queryParams).toContain('pending');
  });

  it('rejects invalid status filter with 400', async () => {
    const res = await request(app).get('/api/tasks?status=banana');
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/tasks', () => {
  it('creates a task and returns 201', async () => {
    const created = { id: 1, title: 'Test', description: 'desc', status: 'pending', created_at: new Date() };
    pool.query.mockResolvedValue({ rows: [created] });

    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test', description: 'desc' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'no title here' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('returns 400 when title is only whitespace', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {
  it('updates a task and returns updated object', async () => {
    const existing = { id: 1, title: 'Old title', description: '', status: 'pending' };
    const updated  = { ...existing, status: 'done' };

    // First query: SELECT existing. Second query: UPDATE returning updated row.
    pool.query
      .mockResolvedValueOnce({ rows: [existing] })
      .mockResolvedValueOnce({ rows: [updated] });

    const res = await request(app)
      .put('/api/tasks/1')
      .send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  it('returns 404 when task does not exist', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // SELECT returns nothing

    const res = await request(app)
      .put('/api/tasks/999')
      .send({ status: 'done' });

    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app)
      .put('/api/tasks/1')
      .send({ status: 'in-progress' }); // not a valid status

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  it('deletes a task and returns 204', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1 }] });

    const res = await request(app).delete('/api/tasks/1');

    expect(res.status).toBe(204);
  });

  it('returns 404 when task does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app).delete('/api/tasks/999');

    expect(res.status).toBe(404);
  });
});