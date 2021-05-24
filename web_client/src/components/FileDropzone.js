import { Typography } from '@material-ui/core';
import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '25px',
  borderWidth: 0,
  borderRadius: 5,
  borderStyle: 'solid',
  backgroundColor: '#acacac',
  color: '#555555',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

// change styles based on drag status
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
  } = useDropzone({accept: type, maxFiles: 1, onDrop: onFileChosen});

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

  // draw the dropzone - make text unselectable
  return (
    <div className="Unselectable" style={{margin: 3}}>
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