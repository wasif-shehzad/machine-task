import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert } from "../../../components/Alert";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../../store/reducers/userReducer";

const Login = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      history.push("/");
    }
  }, []);

  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string().required("Email is Required"),
      password: Yup.string().required("Password is required."),
    });
  };
  const [initialState, setInitialState] = useState({
    email: "",
    password: "",
  });

  const handleLoginSubmit = async (values) => {
    let data = { ...values };

    const res = await dispatch(logIn(data));
    if (res.type === "user/login/fulfilled") {
      Alert({
        trigger: true,
        type: "success",
        title: "Success",
        message: "Login In Successfully",
      });
      history.push("/");
    } else {
      Alert({
        trigger: true,
        type: "danger",
        title: "ERROR!",
        message: res?.payload?.message || "Log In Failed",
      });
    }
  };
  return (
    <>
      <div className="Login">
        <div
          className="d-flex justify-content-center align-items-center loginCard"
          style={{ height: "100vh" }}
        >
          <Formik
            initialValues={initialState}
            onSubmit={handleLoginSubmit}
            validationSchema={validationSchema}
            enableReinitialize={true}
          >
            {({
              handleChange,
              errors,
              handleSubmit,
              values,
              setFieldValue,
              setFieldTouched,
              touched,
            }) => (
              <Form
                className="form"
                onSubmit={handleSubmit}
                autoComplete="false"
              >
                <h3 className="text-center">Log In</h3>

                <div className="row">
                  <div className="col-md-12">
                    <Form.Group controlid="title">
                      <div className="w-100">
                        <Form.Label className="font-weight-bold">
                          Email
                        </Form.Label>
                        <Form.Control
                          placeholder={"Enter Email..."}
                          controlid="email"
                          type="text"
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                          isInvalid={!!(errors.email && touched.email)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <Form.Group controlid="title">
                      <div className="w-100">
                        <Form.Label className="font-weight-bold">
                          Password
                        </Form.Label>
                        <Form.Control
                          placeholder={"Enter Password..."}
                          controlid="password"
                          type="password"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={!!(errors.password && touched.password)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="w-100 btn btn-primary text-uppercase"
                    >
                      Log In
                    </button>
                  </div>
                </div>
                <p className="forgot-password text-right">
                  Do You Want To Register <Link to="/signup">Sign Up?</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
