import { useState } from 'react';

export default function TaskItem({ task, onToggleDone, onUpdate, onDelete }) {
  const [editing, setEditing]         = useState(false);
  const [editTitle, setEditTitle]     = useState(task.title);
  const [editDesc, setEditDesc]       = useState(task.description);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, { title: editTitle.trim(), description: editDesc.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    // Revert edits when user cancels
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditing(false);
  };

  const createdDate = new Date(task.created_at).toLocaleDateString();

  // ── Edit mode ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <li className="task-item editing">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          maxLength={255}
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          rows={2}
        />
        <div className="actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </li>
    );
  }

  // ── View mode ──────────────────────────────────────────────────────────────
  return (
    <li className={`task-item ${task.status}`}>
      <div className="task-info">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <small>
          {createdDate} &nbsp;·&nbsp;
          <span className={`badge ${task.status}`}>{task.status}</span>
        </small>
      </div>
      <div className="actions">
        <button onClick={() => onToggleDone(task)}>
          {task.status === 'done' ? 'Undo' : '✓ Done'}
        </button>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button
          className="delete"
          onClick={() => {
            if (window.confirm('Delete this task?')) onDelete(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}