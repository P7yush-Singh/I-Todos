"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Pencil, Trash } from "lucide-react";
import { toast } from 'react-toastify';


function Home() {
  const [selected, setSelected] = useState("total");
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const notifyAdd = () => toast.success("Todo added");
    const notifyEdit = () => toast.info("Todo updated");
    const notifyDelete = () => toast.success("Todo deleted");

    // Load todos from localStorage on mount
    useEffect(() => {
      try {
        const saved = localStorage.getItem("todos");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setTodos(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to parse todos from localStorage", err);
      }
    }, []);

    // Persist todos to localStorage whenever they change
    useEffect(() => {
      try {
        localStorage.setItem("todos", JSON.stringify(todos));
      } catch (err) {
        console.error("Failed to save todos to localStorage", err);
      }
    }, [todos]);

  const counts = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  const filteredTodos = todos.filter(t => {
    if (selected === "active") return !t.completed;
    if (selected === "completed") return t.completed;
    return true;
  });

  const addTodo = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos([...todos, { id: Date.now().toString(), text: value, completed: false }]);
    setText("");
    notifyAdd();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

    const startEdit = (id, currentText) => {
      setEditingId(id);
      setEditText(currentText);
    };

    const saveEdit = () => {
      const value = editText.trim();
      if (!value) { setEditingId(null); return; }
      setTodos(todos.map(t => t.id === editingId ? { ...t, text: value } : t));
      setEditingId(null);
      setEditText("");
      notifyEdit();
    };

    const deleteTodo = (id) => {
      setTodos(todos.filter(t => t.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditText("");
      }
      notifyDelete();
    };

  return (
    <div className="bg-purple-300 min-h-screen w-full relative">
      <Navbar/>
      <div className="px-4 sm:px-6 lg:px-10 mt-4 flex justify-center">
        <div className="inline-flex gap-2 sm:gap-3 bg-white/70 rounded-full p-1">
          {["total", "active", "completed"].map((key) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`relative px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                selected === key ? "bg-blue-200 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] sm:text-xs font-semibold rounded-full bg-red-500 text-white">
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Add todo form */}
      <form onSubmit={addTodo} className="px-4 sm:px-6 lg:px-10 mt-6 fixed w-full bottom-4 sm:bottom-8 z-20">
        <div className="flex gap-2 sm:gap-3 max-w-5xl mx-auto">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 px-3 sm:px-4 py-3 rounded-lg border border-blue-500 bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* List / Empty state */}
      <div className="px-4 sm:px-6 lg:px-10 mt-6">
        {filteredTodos.length === 0 ? (
          <div className="text-center text-gray-700 bg-white/70 rounded-xl py-8 sm:py-10 max-w-5xl mx-auto">No Task added yet</div>
        ) : (
          <ul className="space-y-3 max-w-5xl mx-auto">
            {filteredTodos.map(todo => (
               <li key={todo.id} className="bg-white/80 rounded-lg p-3 sm:p-4 py-6 flex items-center gap-3 relative">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5"
                />
                {editingId === todo.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') { setEditingId(null); setEditText(""); }
                    }}
                    onBlur={saveEdit}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (
                  <span className={todo.completed ? "line-through text-gray-500" : "text-gray-800"}>{todo.text}</span>
                )}
                <div className="flex flex-col px-3 sm:px-6 py-2 items-center absolute right-0">
                  <div className="flex gap-2 sm:gap-3">
                    <button onClick={() => startEdit(todo.id, todo.text)} className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"><Pencil/></button>
                    <button onClick={() => deleteTodo(todo.id)} className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm"><Trash/></button>
                  </div>
                  <h3 className="text-[0.65rem] sm:text-[0.7rem] mt-1">Created {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;