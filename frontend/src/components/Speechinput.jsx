import { useState, useRef } from "react";
import { Mic } from "lucide-react";

const SpeechInput = ({ value, onChange, placeholder }) => {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = (event) => console.error("Speech Recognition Error:", event.error);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onChange(transcript);
        };

        recognition.start();
    };

    return (
        <div className="relative mb-4">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button
                onClick={startListening}
                className={`absolute right-3 top-3 text-gray-600 ${listening ? "text-red-500" : "hover:text-gray-800"}`}
            >
                <Mic size={18} />
            </button>
        </div>
    );
};

export default SpeechInput;
