import {Typography} from "@material-ui/core";
import {useMemo} from "react";
import {useDropzone} from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '25px',
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
  backgroundColor: 'lightgray',
  color: 'black',
};

const acceptStyle = {
  backgroundColor: 'lightgreen',
  color: 'black',
};

const rejectStyle = {
  backgroundColor: 'lightcoral',
  color: 'black',
};

const FileDropzone = ({text, type, onFileChosen}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({accept: type, maxFiles: 1});

  const onFileUpload = useMemo(
    () => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileChosen(acceptedFiles[0]);
      }
    },
    [acceptedFiles],
  );

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div style={{margin: 3}}>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <Typography
          style={{padding: 10}}>
          {text}
        </Typography>
      </div>
    </div>
  );
}

export default FileDropzone;