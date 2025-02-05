import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { Plus, Search, LogIn, UserPlus } from "lucide-react";

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem("token");
            if (!token) return console.error("No token found, user is not authenticated.");
    
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(response.data);
            } catch (error) {
                console.error("welcome to Ai notes, create a fresh notes");
            }
        };
    
        fetchNotes();
    }, []);
    
    const handleAddOrUpdateNote = async (noteData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            if (noteData._id) {
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/notes/${noteData._id}`,
                    { 
                        title: noteData.title, 
                        content: noteData.content,
                        isFavorite: noteData.isFavorite 
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setNotes(notes.map((note) => (note._id === noteData._id ? response.data : note)));
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/notes/create`,
                    { 
                        title: noteData.title, 
                        content: noteData.content,
                        isFavorite: false 
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setNotes([response.data, ...notes]);
            }
            setShowModal(false);
            setEditNote(null);
        } catch (error) {
            console.error("Error saving note:", error.response?.data?.message || error.message);
        }
    };

    const handleEdit = (note) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setEditNote(note);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(notes.filter((note) => note._id !== id));
        } catch (error) {
            console.error("Error deleting note:", error.response?.data?.message || error.message);
        }
    };

    const handleToggleFavorite = async (note) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/notes/${note._id}`,
                { 
                    ...note,
                    isFavorite: !note.isFavorite 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setNotes(notes.map((n) => (n._id === note._id ? response.data : n)));
        } catch (error) {
            console.error("Error updating favorite status:", error.response?.data?.message || error.message);
        }
    };

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 relative min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 sm:mb-0">All Notes</h1>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <LogIn size={20} />
                            <span className="hidden sm:inline">Login</span>
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <UserPlus size={20} />
                            <span className="hidden sm:inline">Sign Up</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                    <NoteCard
                        key={note._id}
                        title={note.title}
                        content={note.content}
                        createdAt={note.createdAt}
                        isFavorite={note.isFavorite}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => handleDelete(note._id)}
                        onToggleFavorite={() => handleToggleFavorite(note)}
                    />
                ))}
            </div>

            <button
                onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        navigate("/login");
                        return;
                    }
                    setShowModal(true);
                    setEditNote(null);
                }}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            >
                <Plus size={24} />
            </button>

            {showModal && (
                <NoteForm
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddOrUpdateNote}
                    initialData={editNote}
                />
            )}
        </div>
    );
};

export default Home;