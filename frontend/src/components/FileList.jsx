
function FileList({ files, onDirClick }) {
  return (
    <ul>
      {files.map(file => (
        <li key={file.path}>
          {file.name} ({file.size} bytes), IsDirectory: {file.isDirectory.toString()}
          {file.isDirectory && (
            <button onClick={() => onDirClick(file.path)}>Enter</button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default FileList