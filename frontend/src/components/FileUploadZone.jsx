import DropZone from './DropZone';

function FileUploadZone({ currentDir }) {
  const handleUpload = ({ files, paths }) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      formData.append('paths', paths[i]);
    }

    formData.append('destination', currentDir);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://10.0.0.235:8080/upload', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Upload complete!');
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
    };

    xhr.send(formData);
  };

  return (
    <>
      <DropZone onUpload={handleUpload} />
    </>
  );
}

export default FileUploadZone