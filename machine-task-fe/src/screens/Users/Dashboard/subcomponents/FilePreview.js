import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  viewFile,
  checkFilePermission,
} from "../../../../store/reducers/userReducer";

const FilePreview = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [fileType, setFileType] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [streamData, setstreamData] = useState(null);

  const getFileDetails = async () => {
    console.log(location);
    var file = location?.state?.fileId;

    setFileType(location?.state?.file_type);
    setFileId(location?.state?.fileId);

    let fileName = String(location?.pathname);
    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
    var fileObj = {
      file: file,
      fileName: fileName,
    };
    const res = await dispatch(checkFilePermission(fileObj));
    if (res.type === "user/viewFilePermission/fulfilled") {
      const data = res?.payload?.data?.data;
      if (data?.code === 200) {
        const stream = await dispatch(viewFile(fileObj));
        if (stream.type === "user/viewFile/fulfilled") {
          const blob = stream?.payload?.data;
          const file = new Blob([blob], { type: "application/pdf" });
          setstreamData(URL.createObjectURL(file));
        }
      }
    } else {
      const errorCode = res?.payload?.error?.statusCode;
      if (errorCode === 403) {
        setForbidden(true);
      }
    }
  };
  useEffect(() => {
    getFileDetails();
  }, []);
  return (
    <div className="d-flex w-100 h-100">
      {forbidden === false ? (
        fileType === "pdf" && (
          <div className="d-flex w-100  justify-content-center">
            <iframe className="w-100 h-100" src={streamData}></iframe>
          </div>
        )
      ) : (
        <div className="d-flex w-100 flex-column justify-content-center align-items-center">
          <h1>Forbidden 403</h1>
          <span>Sorry You Don't Have Permission To access file</span>
        </div>
      )}

      {/* <iframe src="https://docs.google.com/viewer?url=your_url_to_pdf&embedded=true"></iframe> */}
    </div>
  );
};

export default FilePreview;
