import { useState, useEffect } from "react";  // Add useEffect
import { X } from "lucide-react";
import SpeechInput from "../components/Speechinput";

const NoteForm = ({ onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Initialize form with existing note data if editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }
        
        // Pass the id if we're editing an existing note
        onSubmit({
            title,
            content,
            ...(initialData && { _id: initialData._id })  // Include _id if editing
        });
        
        setTitle("");
        setContent("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {initialData ? "Edit Note" : "Create a New Note"}
                    </h2>
                    <button onClick={onClose}>
                        <X size={20} className="text-gray-600 hover:text-gray-800" />
                    </button>
                </div>

                <SpeechInput placeholder="Title" value={title} onChange={setTitle} />
                <SpeechInput placeholder="Content" value={content} onChange={setContent} />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {initialData ? "Update Note" : "Add Note"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteForm;