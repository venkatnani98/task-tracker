const app = require('./app');
const { initDb } = require('./db');

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    // Create the tasks table if it doesn't exist yet
    await initDb();
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Non-zero exit tells Docker the container failed
  }
};

start();