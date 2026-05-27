import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggleDone, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks here. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}