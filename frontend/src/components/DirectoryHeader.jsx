
function DirectoryHeader({ currentDir }) {
  return (
    <>
      <div className="directory-header">
        <h2>File List</h2>
        <p>Current directory: {currentDir}</p>
      </div>
    </>
  );
}

export default DirectoryHeader