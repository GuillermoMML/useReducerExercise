import { useMemo, useState } from "react";

// Datos iniciales de ejemplo
const initialTodos = [
  { id: 1, text: "Entender props y estado", done: true },
  { id: 2, text: "Practicar map/filter", done: false },
];

export default function App() {
  // ✅ Starter con useState (los alumnos migran a useReducer)
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "done"
  const [text, setText] = useState("");

  // Derivado: lista visible según filtro (esto no cambiará con useReducer)
  const visibleTodos = useMemo(() => {
    if (filter === "pending") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  // Handlers (TODO: migrar a dispatch({ type, payload }) con useReducer)
  function handleAdd() {
    const t = text.trim();
    if (!t) return;
    const nuevo = { id: Date.now(), text: t, done: false };
    setTodos((prev) => [nuevo, ...prev]);
    setText("");
  }

  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function handleRemove(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function handleClearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  const pendingCount = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

  return (
    <div className="page">
      <div className="card">
        <h1>To-Do • Starter sin useReducer</h1>
        <p className="muted">
          Objetivo: migrar a <b>useReducer</b> (sin usar useState para lista ni filtro).
        </p>

        {/* Input + Añadir */}
        <div className="row mb-3">
          <input
            className="input"
            placeholder="Nueva tarea…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Añadir
          </button>
        </div>

        {/* Filtros */}
        <div className="row mt-10">
          <button
            className={filter === "all" ? "btn btn-active" : "btn"}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={filter === "pending" ? "btn btn-active" : "btn"}
            onClick={() => setFilter("pending")}
          >
            Pendientes
          </button>
          <button
            className={filter === "done" ? "btn btn-active" : "btn"}
            onClick={() => setFilter("done")}
          >
            Hechas
          </button>

          <button className="btn ml-auto" onClick={handleClearDone}>
            Limpiar hechas
          </button>
        </div>

        {/* Resumen */}
        <div className="row mt-10 muted">
          <span>Total: {todos.length}</span>
          <span className="v-sep" />
          <span>Pendientes: {pendingCount}</span>
          {pendingCount === 0 && todos.length > 0 && (
            <span className="badge-success" style={{ marginLeft: 8 }}>
              ¡Todo al día!
            </span>
          )}
        </div>

        {/* Lista */}
        <ul className="list">
          {visibleTodos.map((t) => (
            <li key={t.id} className="item">
              <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => handleToggle(t.id)}
                />
                <span className={t.done ? "item-text done" : "item-text"}>
                  {t.text}
                </span>
              </label>
              <button className="btn btn-danger" onClick={() => handleRemove(t.id)}>
                Borrar
              </button>
            </li>
          ))}
          {visibleTodos.length === 0 && (
            <li className="center">No hay tareas para este filtro.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
