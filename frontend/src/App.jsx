import { Routes, Route, useLocation } from "react-router-dom";
import Signup from "./pages/signUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";
import Sidebar from "./components/SideBar";

function App() {
  const location = useLocation(); // Get the current route

  return (
    <div className="flex">
      {/* Conditionally render Sidebar based on the current route */}
      {location.pathname === "/" || location.pathname === "/favourite" ? (
        <Sidebar />
      ) : null}

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/favourite" element={<Favourite />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
