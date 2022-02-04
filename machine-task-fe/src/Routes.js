import React, { Component, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Prompt,
} from "react-router-dom";
import "react-notifications-component/dist/theme.css";
import Dashboard from "./screens/Users/Dashboard";
import FilePreview from "./screens/Users/Dashboard/subcomponents/FilePreview";

import Login from "./screens/Users/Login";
import SignUp from "./screens/Users/SignUp";

import { useDispatch, useSelector } from "react-redux";

const routes = [
  {
    path: "/login",
    component: Login,
    exact: true,
  },
  {
    path: "/signup",
    component: SignUp,
    exact: true,
  },
  {
    path: "/",
    component: Dashboard,
    exact: true,
    protected: true,
  },
  {
    path: "/view-file/:filename",
    component: FilePreview,
    exact: true,
    protected: true,
  },
];

const Routes = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const PrivateRoute = ({ component: Component, path, exact }) => {
    return token ? (
      <Route path={path} exact={exact} component={Component} />
    ) : (
      <Route
        path={path}
        render={(props) => {
          return <Redirect to={"/login"} />;
        }}
      />
    );
  };

  return (
    <>
      <Router>
        <Switch>
          {routes.map((route, i) => {
            return route.protected !== undefined ? (
              <PrivateRoute
                key={i}
                path={route.path}
                component={route.component}
                exact={route?.exact}
              />
            ) : (
              <Route
                path={route.path}
                component={route.component}
                exact={route?.exact}
                key={i}
              />
            );
            // );
          })}
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
