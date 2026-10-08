import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.jsx";
document.documentElement.dataset.intensity = localStorage.getItem("datawhisper_intensity") || "vivid";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
