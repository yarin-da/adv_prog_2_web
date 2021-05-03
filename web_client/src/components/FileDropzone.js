import React, {useCallback, useMemo} from "react";
import {useDropzone} from "react-dropzone";
import "./FileDropzone.css";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 5,
  borderColor: '#dddddd',
  borderStyle: 'solid',
  backgroundColor: '#fafafa',
  color: '#acacac',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const FileDropzone = ({text, type, onFileChosen}) => {
  const onDrop = useCallback(acceptedFiles => {
    onFileChosen(acceptedFiles[0]);
  }, [onFileChosen]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({onDrop, accept: type, maxFiles: 1});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div className="Dropzone">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default FileDropzone;