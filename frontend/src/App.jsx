
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
// import './app.css'
import DirectoryHeader from "./components/DirectoryHeader.jsx"

function App() {

  return (
    <>
      <Header/>
      <DirectoryHeader currentDir={"test"}/>
      <Footer/>
    </>
  )
}

export default App
