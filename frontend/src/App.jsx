import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ArticleDetail from "./pages/ArticleDetail";
import "./App.css"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
    </Routes>
  );
}

export default App;