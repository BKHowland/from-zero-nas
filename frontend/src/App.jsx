
import { useState, useEffect } from 'react'; // required for useState hook 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
// import './app.css'
import DirectoryHeader from "./components/DirectoryHeader.jsx"
import FileList from "./components/FileList.jsx"
import UploadButton from './components/UploadButton.jsx';
import FileUploadZone from './components/FileUploadZone.jsx';

function App() {
  //react useState hook. declares piece of state and function to change it.
  const [currentDir, setCurrentDir] = useState('./storage-directory/'); 
  const [refreshKey, setRefreshKey] = useState(0); // to allow force refresh of filelist

  const handleDirectoryClick = (path) => {
    setCurrentDir(path);
  };


  return (
    <>
      <Header/>
      <DirectoryHeader currentDir={currentDir}/>
      <hr></hr>
      <FileList currentDir={currentDir} onDirectoryClick={handleDirectoryClick} refreshKey={refreshKey} 
          forceRefresh={() => setRefreshKey(prev => prev + 1)}/>
      <FileUploadZone currentDir={currentDir} forceRefresh={() => setRefreshKey(prev => prev + 1)}/>
      <Footer/>
    </>
  )
}

export default App
