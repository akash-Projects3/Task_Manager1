import React, { useState, useEffect } from "react";
import "./styles.css";
import { ClipboardList } from "lucide-react";

// Unique ID generator
const genId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Priority styles
const PRIORITY_STYLES: Record<string, string> = {
  Low: "badge low",
  Medium: "badge medium",
  High: "badge high",
};

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  completed: boolean;
};

// ---------------- MAIN APP ----------------
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return alert("Title is required!");
    const newTask: Task = {
      id: genId(),
      title,
      description: desc,
      priority,
      dueDate,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTitle("");
    setDesc("");
    setDueDate("");
    setPriority("Low");
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "Completed") return task.completed;
      if (filter === "Pending") return !task.completed;
      if (filter === "Low" || filter === "Medium" || filter === "High")
        return task.priority === filter;
      return true;
    })
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <ClipboardList className="icon-float w-12 h-12 text-indigo-600" />
        <h1 className="app-title">Task Manager</h1>
      </header>

      {/* Add Task Form */}
      <div className="form-container card-hover">
        <input
          type="text"
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input"
        />
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
          className="input"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={addTask} className="button">
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        {["All", "Completed", "Pending", "Low", "Medium", "High"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-task">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card card-hover ${
                task.completed ? "completed" : ""
              }`}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={PRIORITY_STYLES[task.priority]}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
              <p className="task-date">📅 {task.dueDate || "No due date"}</p>
              <div className="task-actions">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="button small"
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="button small delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
