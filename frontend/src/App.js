import React, { useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { Route, BrowserRouter } from "react-router-dom";
import Login from "./components/login";
import Header from "./components/header";
import New from "./components/new";
import ProtectedRoute from "./components/ProtectedRoute";

import { Context } from "./contexts";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("isAuthenticated"));

  return (
    <React.Fragment>
      <CssBaseline />
      <BrowserRouter>
        <Context.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <Header />
          <ProtectedRoute exact path="/" component={New} />
          <Route exact path="/login" component={Login} />
        </Context.Provider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
