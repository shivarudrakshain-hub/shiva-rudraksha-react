import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./components/AdminPage";
import "./styles.css";
import "./admin.css";

function Root() {
  const [hash, setHash] = React.useState(window.location.hash);

  React.useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return hash.startsWith("#admin") ? <AdminPage /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
