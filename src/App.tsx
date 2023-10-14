import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./App.scss";
import Account from "./pages/Account/Account";
import { GlobalProvider } from "./providers/GlobalProvider";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Rooms from "./pages/Rooms/Rooms";
import Tenant from "./pages/Tenant/Tenant";
import Tenants from "./pages/Tenants/Tenants";
import Transactions from "./pages/Transactions/Transactions";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <div className="app">
          <div className="header">
            <Header />
          </div>
          <Container className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/account" element={<Account />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/tenant" element={<Tenant />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </Container>
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default App;
