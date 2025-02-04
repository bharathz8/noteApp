import { Home, Star, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = () => {

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.name);
    }
  }, []);

  return (
    <div className="h-screen w-64 bg-gray-200 text-black flex flex-col p-4">
      {/* Top Logo */}
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">AI Notes</h1>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col space-y-2 mt-5 flex-1">
        <Link to="/" className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-300">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/favourite" className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-300">
          <Star size={20} />
          <span>Favourite</span>
        </Link>
      </div>

      {/* Bottom User Profile */}
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-300 cursor-pointer mt-auto">
        <User size={20} />
        <span>{userName || "Guest"}</span>
      </div>
    </div>
  );
};

export default Sidebar;
