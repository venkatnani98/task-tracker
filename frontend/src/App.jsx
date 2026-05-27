import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import Filter from './components/Filter';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks]     = useState([]);
  const [filter, setFilter]   = useState('all');   // 'all' | 'pending' | 'done'
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  // useCallback so fetchTasks has a stable reference when used in useEffect
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const status = filter === 'all' ? null : filter;
      const data = await getTasks(status);
      setTasks(data);
    } catch {
      setError('Could not load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Re-fetch whenever the filter changes
  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (taskData) => {
    try {
      await createTask(taskData);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleDone = async (task) => {
    try {
      await updateTask(task.id, {
        status: task.status === 'done' ? 'pending' : 'done',
      });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updateTask(id, updates);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Task Tracker</h1>

      {error && (
        <div className="error" role="alert">
          {error}
          <button className="error-close" onClick={() => setError('')}>✕</button>
        </div>
      )}

      <TaskForm onSubmit={handleCreate} />

      <Filter current={filter} onChange={setFilter} />

      {loading
        ? <p className="loading">Loading...</p>
        : <TaskList
            tasks={tasks}
            onToggleDone={handleToggleDone}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
      }
    </div>
  );
}