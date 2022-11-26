import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/tenants" element={<Home />} />
        <Route path="/rooms" element={<Home />} />
        <Route path="/invoices" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
