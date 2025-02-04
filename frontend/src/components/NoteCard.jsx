import { Star, Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ 
    title, 
    content, 
    createdAt,
    isFavorite, 
    onEdit, 
    onDelete, 
    onToggleFavorite 
}) => {
    const formatDate = (date) => {
        if (!date) return 'No date';
        
        try {
            const dateObj = new Date(date);
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) return 'Invalid date';
            
            // Format the date using Intl.DateTimeFormat for better localization
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(dateObj);
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onToggleFavorite}
                        className={`p-1 rounded-full hover:bg-gray-100 ${
                            isFavorite ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                    >
                        <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mb-2">{content}</p>
            <p className="text-sm text-gray-400">{formatDate(createdAt)}</p>
        </div>
    );
};

export default NoteCard;