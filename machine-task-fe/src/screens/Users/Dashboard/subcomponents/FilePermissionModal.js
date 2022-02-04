import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Alert } from "../../../../components/Alert";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  editFilePermission,
} from "../../../../store/reducers/userReducer";

const FilePermissionModal = ({ handleClose, selectedFile, getFilesList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const [initialState, setInitialState] = useState({
    users: "",
  });
  const [alUsers, setAllUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);

  const getALLUsers = async () => {
    const res = await dispatch(getUsers());
    if (res.type === "user/getAllUsers/fulfilled") {
      let userList = res?.payload?.data?.data;
      debugger;
      let allUsers = userList.map((data) => ({
        value: data._id,
        label: data.name,
      }));

      setAllUsers(allUsers);
      let alreadySelectedUser = [];
      let selectFilesUsers = selectedFile?.allowed_users;
      for (let i = 0; i < selectFilesUsers.length; i++) {
        if (user?.userData?._id !== selectFilesUsers[i]?._id) {
          alreadySelectedUser.push({
            value: selectFilesUsers[i]._id,
            label: selectFilesUsers[i].name,
          });
        }
      }

      setSelectedUser(alreadySelectedUser);
    }
  };
  useEffect(() => {
    getALLUsers();
  }, []);

  const validationSchema = () => {
    return Yup.object().shape({
      users: Yup.string().required("Allow Permission Users"),
    });
  };

  const handleFileUploadSubmit = async (values) => {
    let data = {
      users: selectedUser,
      file: selectedFile?._id,
    };
    debugger;

    const res = await dispatch(editFilePermission(data));
    if (res.type === "user/editFilePermission/fulfilled") {
      Alert({
        trigger: true,
        type: "success",
        title: "Success",
        message: "File Permission Updated Successfully",
      });
      getFilesList();
      handleClose();
    } else {
      Alert({
        trigger: true,
        type: "danger",
        title: "ERROR!",
        message: res?.payload?.message || "File Permission Not Updated",
      });
    }
  };
  return (
    <div className="d-flex justify-content-center flex-column">
      <Formik
        initialValues={initialState}
        onSubmit={handleFileUploadSubmit}
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
          <Form className="form" onSubmit={handleSubmit} autoComplete="false">
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlid="title">
                  <div className="w-100">
                    <Form.Label className="font-weight-bold">
                      Edit Access User For File
                    </Form.Label>
                    <div className="w-100">
                      <Select
                        options={alUsers}
                        value={selectedUser}
                        name={"users"}
                        onChange={(selected) => {
                          debugger;
                          selected = selected || [];
                          setSelectedUser(selected);
                          setFieldValue(`users`, selected);
                        }}
                        isMulti
                      />
                    </div>
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
                  Allow Users
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FilePermissionModal;
