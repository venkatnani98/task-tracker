import { useState } from 'react';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();         // prevent page reload
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');               // reset form after submit
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add Task</h2>
      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={255}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}