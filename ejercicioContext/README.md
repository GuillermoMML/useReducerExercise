# Tarea: To-Do App con **useReducer** (sin librerías de UI)

> **Objetivo:** Partiendo de un starter con `useState`, migra la gestión de estado a **`useReducer`** y demuestra que sabes modelar acciones, escribir un reducer **puro** y despachar transiciones de estado.

---

## 🧩 Qué vas a construir

Una mini app de tareas (To-Do) con:

- Añadir tarea
- Marcar tarea como hecha / no hecha
- Borrar tarea
- Limpiar todas las hechas
- Filtro: `todas | pendientes | hechas`

La **lista** y el **filtro** deben gestionarse con **`useReducer`** (no `useState`).

---

## 📁 Estructura del proyecto

```
src/
  App.jsx      
  main.jsx
```

---

## ▶️ Puesta en marcha

```bash
# si usas Vite
npm install
npm run dev
```

Abre `http://localhost:5173` (o el puerto que te indique).

---

## 🛠️ Trabajo a realizar

### 1) Migración a `useReducer`
- Reemplaza los `useState` de:
  - `todos` (array de tareas)
  - `filter` (`"all" | "pending" | "done"`)
- Crea un **reducer puro** (sin efectos, sin acceso a `localStorage` ni `fetch`) con estas **acciones**:

```js
{ type: "todo/add",       payload: { id, text } }
{ type: "todo/toggle",    payload: id } //Se encargará de cambiar el done a false o true, es decir tarea terminada o no
{ type: "todo/remove",    payload: id }
{ type: "todo/clearDone" }                 // sin payload
{ type: "todo/setFilter", payload: "all" | "pending" | "done" }
```

- Cambia los handlers para que hagan `dispatch({ type, payload })` en lugar de `setTodos` / `setFilter`.

### 3) Derivados (no cambian)

**¿Qué es `useMemo` y por qué usarlo aquí?**  
`useMemo` te deja **memorizar** (cachear) el **resultado de un cálculo** para no repetirlo en cada render _si sus entradas no cambiaron_.  
En esta tarea lo usamos para **derivar** la lista visible a partir de `state.todos` y `state.filter`.

- **Sin `useMemo`**: calcularías `visibleTodos` en cada render, aunque `todos` y `filter` no cambien.
- **Con `useMemo`**: solo se recalcula cuando **cambian las dependencias** (en este caso `todos` o `filter`).

> Nota: En una app tan pequeña, el rendimiento no será un problema. Lo usamos sobre todo para enseñar **buena práctica**: separar *estado fuente* (todos, filter) de *estado derivado* (visibleTodos).

**Cómo hacerlo (paso a paso)**

1) Define `visibleTodos` con `useMemo` y devuelve el array filtrado según `filter`:
```jsx
import { useMemo } from "react";

const visibleTodos = useMemo(() => {
  if (state.filter === "pending") {
    return state.todos.filter(t => !t.done);   // solo pendientes
  }
  if (state.filter === "done") {
    return state.todos.filter(t => t.done);    // solo hechas
  }
  return state.todos;                          // todas
}, [state.todos, state.filter]); // 👈 dependencias: si cambian, se recalcula
```

2) Usa `visibleTodos` directamente en el render:
```jsx
<ul>
  {visibleTodos.map(t => (
    <li key={t.id}>{t.text}</li>
  ))}
</ul>
```

**Versión SIN `useMemo` (para comparar)**  
Funciona igual, pero recalcula siempre:
```jsx
const visibleTodos =
  state.filter === "pending"
    ? state.todos.filter(t => !t.done)
    : state.filter === "done"
    ? state.todos.filter(t => t.done)
    : state.todos;
```

**Reglas clave de `useMemo`**  
- Debe ser **puro**: no hagas `setState` dentro del callback. Solo **calcula y devuelve**.
- Lista correctamente las **dependencias**: aquí `state.todos` y `state.filter`.
- No abuses: si el cálculo es trivial y no se repite mucho, puedes no usarlo.

---

- Mantén el cálculo de lista visible con `useMemo`:
  - `pending` → `!t.done`
  - `done` → `t.done`
  - `all` → todas

---

## ✅ Criterios de aceptación (mínimos)

- [ ] La app funciona sin errores.
- [ ] `todos` y `filter` se gestionan con **`useReducer`**.
- [ ] Acciones implementadas: **add**, **toggle**, **remove**, **clearDone**, **setFilter**.
- [ ] La UI responde correctamente a cada acción.
- [ ] Código claro: nombres de acciones consistentes, sin “magia”.
---

## 🧭 Pistas (por si te atascas)

- Estado inicial sugerido:
  ```js
  const initialState = {
    todos: [
      { id: 1, text: "Entender props y estado", done: true },
      { id: 2, text: "Practicar map/filter", done: false },
    ],
    filter: "all", // "all" "pending" "done" para filtrar por todos, pendiente o hecho
  };
  ```
- **IDs**: genéralos **fuera** del reducer (p. ej., `Date.now()`) al hacer `dispatch` de `add`.
- En `toggle`, usa:
  ```js
  state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t)
  ```
- En `remove`, usa:
  ```js
  state.todos.filter(t => t.id !== action.payload)
  ```
- En `clearDone`, usa:
  ```js
  state.todos.filter(t => !t.done)
  ```

---

## 📦 Entrega

1. Repo con el código funcionando.
2. Este `README.md` actualizado indicando:
   - Cómo arrancar
   - Acciones implementadas
   - (Si hiciste bonus) cómo persistes y cómo cargas

---

¡Suerte y a por ello! 
