/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";

const listeners = new Set();
let nextId = 0;
function publish(message, type) {
  const item = { id: ++nextId, message, type };
  listeners.forEach((listener) => listener(item));
}
export const toast = { success: (message) => publish(message, "success"), error: (message) => publish(message, "error") };

export function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const listener = (item) => {
      setItems((current) => [...current, item]);
      window.setTimeout(() => setItems((current) => current.filter(({ id }) => id !== item.id)), 3600);
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  return <div className="toast-region" aria-live="polite">{items.map((item) => <div className={`toast toast-${item.type}`} key={item.id}>{item.message}</div>)}</div>;
}
