import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { LandingPage } from "@/pages/LandingPage";
import { EditorPage } from "@/pages/EditorPage";

function App() {
  const [page, setPage] = useState<"landing" | "editor">("landing");
  return page === "landing" ? <LandingPage onLaunch={() => setPage("editor")} /> : <EditorPage onBack={() => setPage("landing")} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
