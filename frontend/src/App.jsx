
import { useState, useEffect } from 'react'; // required for useState hook 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
// import './app.css'
import DirectoryHeader from "./components/DirectoryHeader.jsx"
import FileList from "./components/FileList.jsx"
import FileUploadZone from './components/FileUploadZone.jsx';

function App() {
  //react useState hook. declares piece of state and function to change it.
  const [currentDir, setCurrentDir] = useState('./storage-directory/'); 

  const handleDirectoryClick = (path) => {
    setCurrentDir(path);
  };

  return (
    <>
      <Header/>
      <DirectoryHeader currentDir={currentDir}/>
      <FileList currentDir={currentDir} onDirectoryClick={handleDirectoryClick} />
      <FileUploadZone currentDir={currentDir}/>
      <Footer/>
    </>
  )
}

export default App
