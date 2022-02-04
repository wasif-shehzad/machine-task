import React, { useState, useEffect } from "react";
import { Card, Tabs, Sonnet, Tab, Button, Table, Modal } from "react-bootstrap";
import AppNavbar from "../../subcomponets/Navbar";
import FileUploadForm from "./subcomponents/FileUploadForm";
import { getAllFiles } from "../../../store/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FilePermissionModal from "./subcomponents/FilePermissionModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [modelType, setmodelType] = useState("uploadfile");
  const [selectedFile, setSelectedFile] = useState(null);

  const [filesList, setfilesList] = useState([]);

  const showFileModal = (type) => {
    setOpenDialog(true);
    setmodelType(type);
  };

  const editFilePermissionModal = (type, file) => {
    setOpenDialog(true);
    setmodelType(type);
    setSelectedFile(file);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const getFilesList = async () => {
    const res = await dispatch(getAllFiles());
    if (res.type === "user/getAllFiles/fulfilled") {
      let fileData = res?.payload?.data?.data;
      setfilesList(fileData);
    }
  };

  useEffect(() => {
    console.log(user);
    debugger;
    getFilesList();
  }, []);

  const viewFile = (file) => {
    let obj = {
      fileId: file?._id,
      file_type: file?.type,
    };
    history.push(`/view-file/${file?.file_name}`, { ...obj });
  };

  return (
    <div>
      <AppNavbar />
      <div className="toolbar-spacer"></div>
      <div className="d-flex main-container">
        <Card className="main-content">
          <Tabs
            defaultActiveKey="your_files"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="your_files" title="Your Files">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    size="lg"
                    active
                    onClick={() => showFileModal("uploadfile")}
                  >
                    Upload FIle
                  </Button>
                </div>
                <div className="d-flex mt-2">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>File Name</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filesList.length > 0 &&
                        filesList.map((file, index) => {
                          if (user?.userData?._id === file?.owner?._id) {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{file?.original_file_name}</td>
                                <td>{file?.type}</td>
                                <td className="d-flex actionItem">
                                  <i
                                    className="fas fa-edit mr-3"
                                    onClick={() =>
                                      editFilePermissionModal(
                                        "edituserpermission",
                                        file
                                      )
                                    }
                                  ></i>
                                  <i
                                    class="fas fa-eye"
                                    onClick={() => viewFile(file)}
                                  ></i>
                                </td>
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>
            <Tab eventKey="all_files" title="All Files">
              <div className="d-flex flex-column">
                <div className="d-flex mt-2">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>File Name</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filesList.length > 0 &&
                        filesList.map((file, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{file?.original_file_name}</td>
                            <td>{file?.type}</td>
                            <td className="d-flex actionItem">
                              <i
                                class="fas fa-eye"
                                onClick={() => viewFile(file)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </div>

      <Modal
        className="file-upload-modal"
        centered
        show={openDialog}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modelType === "uploadfile"
              ? "Upload File"
              : "Edit Users Permissions"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modelType === "uploadfile" ? (
            <FileUploadForm
              handleClose={handleClose}
              getFilesList={getFilesList}
            />
          ) : (
            <FilePermissionModal
              handleClose={handleClose}
              selectedFile={selectedFile}
              getFilesList={getFilesList}
            />
          )}
          {/* <UserForm
            formConfig={[]}
            initialValues={initialValues}
            onSubmit={this.handleSubmitUserForm}
            onHide={() => this.setState({ showFileModal: false })}
          /> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
