import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Alert } from "../../../../components/Alert";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile, getUsers } from "../../../../store/reducers/userReducer";

const FileUploadForm = ({ handleClose, getFilesList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const { userList } = useSelector((state) => state.user);
  const [initialState, setInitialState] = useState({
    file: "",
  });
  const [alUsers, setAllUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedFile, setselectedFile] = useState(null);

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
    }
  };
  useEffect(() => {
    getALLUsers();
  }, []);

  const validationSchema = () => {
    return Yup.object().shape({
      file: Yup.string().required("Please Upload File"),
    });
  };

  const handleFileUploadSubmit = async (values) => {
    console.log(selectedFile);
    const formData = new FormData();

    // Update the formData object
    formData.append("file", selectedFile);
    formData.append("users", JSON.stringify(selectedUser));

    const res = await dispatch(uploadFile(formData));
    if (res.type === "user/fileUpload/fulfilled") {
      Alert({
        trigger: true,
        type: "success",
        title: "Success",
        message: "File Uploaded Successfully",
      });
      getFilesList();
      handleClose();
    } else {
      Alert({
        trigger: true,
        type: "danger",
        title: "ERROR!",
        message: res?.payload?.message || "File Not Uploaded",
      });
    }
  };
  return (
    <div className="d-flex justify-content-center flex-column">
      <Formik
        initialValues={initialState}
        onSubmit={handleFileUploadSubmit}
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
          <Form className="form" onSubmit={handleSubmit} autoComplete="false">
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlid="title">
                  <div className="w-100">
                    <Form.Label className="font-weight-bold">
                      Choose File
                    </Form.Label>
                    <Form.Control
                      controlid="file"
                      type="file"
                      name="file"
                      onChange={(e) => {
                        handleChange(e);
                        setselectedFile(e?.target?.files[0]);
                      }}
                      value={values.file}
                      isInvalid={!!(errors.file && touched.file)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.file}
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
                      Assign access To User
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
                  Upload File To Server
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FileUploadForm;
