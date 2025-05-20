
import { useState, useEffect } from 'react'; // required for useState hook 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
// import './app.css'
import DirectoryHeader from "./components/DirectoryHeader.jsx"
import FileList from "./components/FileList.jsx"

function App() {
  const [currentDir, setCurrentDir] = useState('');

  const handleDirectoryClick = (path) => {
    setCurrentDir(path);
  };

  return (
    <>
      <Header/>
      <DirectoryHeader currentDir={"test"}/>
      <FileList currentDir={currentDir} onDirectoryClick={handleDirectoryClick} />
      <Footer/>
    </>
  )
}

export default App
