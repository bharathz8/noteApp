import { useState, useEffect } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import { BACKEND_URL } from "../../config";

const Favourite = () => {
    const [favouriteNotes, setFavouriteNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFavouriteNotes();
    }, []);

    const fetchFavouriteNotes = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Filter notes to only show favorites
            const favorites = response.data.filter(note => note.isFavorite);
            setFavouriteNotes(favorites);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch favorite notes");
            setLoading(false);
        }
    };

    const handleEdit = async (note) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/notes/${note._id}`,
                {
                    title: note.title,
                    content: note.content,
                    isFavorite: note.isFavorite
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setFavouriteNotes(favouriteNotes.map(n => 
                n._id === note._id ? response.data : n
            ));
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavouriteNotes(favouriteNotes.filter(note => note._id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleToggleFavorite = async (note) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/notes/${note._id}`,
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
            // If the note is no longer a favorite, remove it from the list
            if (!response.data.isFavorite) {
                setFavouriteNotes(favouriteNotes.filter(n => n._id !== note._id));
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Favourite Notes</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Favourite Notes</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Favourite Notes</h1>
            {favouriteNotes.length === 0 ? (
                <p className="text-gray-500">No favourite notes yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favouriteNotes.map((note) => (
                        <NoteCard
                            key={note._id}
                            title={note.title}
                            content={note.content}
                            timestamp={note.timestamp}
                            isFavorite={note.isFavorite}
                            onEdit={() => handleEdit(note)}
                            onDelete={() => handleDelete(note._id)}
                            onToggleFavorite={() => handleToggleFavorite(note)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favourite;