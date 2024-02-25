import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./App.scss";
import { GlobalProvider } from "./providers/GlobalProvider";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import NotFound from "./pages/ErrorPages/NotFound";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
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
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
                <Route element={<PrivateRoutes roles={["user"]} />}>
                  <Route path="/tenant" element={<Tenant />} />
                </Route>
                <Route element={<PrivateRoutes roles={["admin"]} />}>
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/tenants" element={<Tenants />} />
                  <Route path="/transactions" element={<Transactions />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default App;
