import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, Loader2, User, Bot } from "lucide-react";

const ChatComponent = ({ initialAnalysis }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    // Load initial analysis into chat when it changes
    useEffect(() => {
        const fetchInitialAnalysis = async () => {
            try {
                setLoading(true);

                const prompt =
                    "Analyze the following market data for a cryptocurrency. Give a summary of how risky it is, whether it's trending up or down, and other important factors to consider: " +
                    initialAnalysis;

                // Send initial analysis to the API endpoint
                const res = await fetch("http://localhost:5000/openai", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: prompt,
                        conversation_history: [], // No previous messages on initial load
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to get response");
                }

                if (data.status === "success") {
                    // Add the API response as the initial AI message
                    const aiMessage = {
                        role: "assistant",
                        content: data.message,
                    };
                    setMessages((prev) => [...prev, aiMessage]);
                } else {
                    throw new Error(data.error || "Unknown error occurred");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (initialAnalysis) {
            fetchInitialAnalysis();
        }
    }, [initialAnalysis]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message to chat
        const userMessage = { role: "user", content: message };
        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/openai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    conversation_history: messages, // Send conversation history to maintain context
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            if (data.status === "success") {
                // Add AI response to chat
                const aiMessage = { role: "assistant", content: data.message };
                setMessages((prev) => [...prev, aiMessage]);
                setMessage(""); // Clear input after successful send
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[530px]">
            {/* Chat messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-t-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2 ${
                            msg.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                        }`}
                    >
                        <div
                            className={`px-5 py-2 rounded-lg max-w-[80%] ${
                                msg.role === "user"
                                    ? "bg-green-600 text-white ml-2"
                                    : "bg-neutral-800 text-white mr-2"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {msg.role === "user" ? (
                                    <User className="h-4 w-4" />
                                ) : (
                                    ""
                                )}
                                <span className="font-bold">
                                    {msg.role === "user" ? "You" : "AI"}
                                </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="p-4 bg-neutral-800 rounded-b-lg"
            >
                <div className="flex gap-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        className="w-full p-3 border rounded-lg bg-neutral-900 text-white resize-none"
                        placeholder="Type your message..."
                        disabled={loading}
                        rows={1}
                    />

                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="bg-green-500 text-white px-8 rounded-lg hover:bg-green-600 
                                 disabled:bg-neutral-700 disabled:cursor-not-allowed
                                 hover:scale-105 duration-100 active:scale-90
                                 flex items-center justify-center min-w-[100px]"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatComponent;
