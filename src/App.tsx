import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home/Home";
import Invoices from "./pages/Invoices/Invoices";
import Rooms from "./pages/Rooms/Rooms";
import Tenants from "./pages/Tenants/Tenants";
import './app.sass'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </BrowserRouter>
  );
}
