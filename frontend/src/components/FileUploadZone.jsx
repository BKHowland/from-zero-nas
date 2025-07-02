import DropZone from './DropZone';
import UploadButton from './UploadButton';

function FileUploadZone({ currentDir, forceRefresh }) {
  const handleUpload = ({ files, paths }) => {
    const formData = new FormData();
    console.log('handle upload with paths: ', paths);

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
        forceRefresh();
        console.log('after refresh function with dir: ', currentDir);
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
    };

    xhr.send(formData);
  };

  return (
    <>
      <DropZone onUpload={handleUpload} />
      <label>Or, manually select:</label>
      <UploadButton onUpload={handleUpload} isDir={false} />
      <UploadButton onUpload={handleUpload} isDir={true} />

    </>
  );
}

export default FileUploadZone