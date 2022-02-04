import logo from "./logo.svg";
import React, { useEffect } from "react";
import Routes from "./Routes";
import ReactNotification from "react-notifications-component";
import { useHistory } from "react-router-dom";

import { verifyUserToken } from "./store/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    (async () => {
      const res = await dispatch(verifyUserToken(token));
      if (res.type === "user/verifytoken/rejected") {
        history.push("/login");
      }
    })();
  }, []);
  return (
    <>
      <ReactNotification />
      {auth?.initialize ? (
        <Routes />
      ) : (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </>
  );
};

export default App;
