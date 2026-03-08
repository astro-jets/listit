import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiSearch, FiMoreVertical, FiArrowLeft, FiSmile, FiPaperclip } from 'react-icons/fi';
import DashboardLayout from '~/components/layouts/DashboardLayout';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'me';
    time: string;
}

interface Conversation {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

const MessagesPage = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [inputMessage, setInputMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock Data
    const conversations: Conversation[] = [
        { id: 1, name: "Vintage Hunter", lastMessage: "Is the camera still available?", time: "2m ago", unread: 2, online: true },
        { id: 2, name: "Sarah Jenkins", lastMessage: "I just sent the payment!", time: "1h ago", unread: 0, online: false },
        { id: 3, name: "Retro Collective", lastMessage: "Can you ship to London?", time: "3h ago", unread: 0, online: true },
        { id: 4, name: "Marcus Sold", lastMessage: "Received the jacket, thanks!", time: "1d ago", unread: 0, online: false },
    ];

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hey! I saw your listing for the Leica M3.", sender: 'user', time: '10:30 AM' },
        { id: 2, text: "Is it still available for purchase?", sender: 'user', time: '10:31 AM' },
        { id: 3, text: "Yes it is! I just serviced it last month.", sender: 'me', time: '10:35 AM' },
        { id: 4, text: "Perfect. Does it come with the original leather case?", sender: 'user', time: '10:40 AM' },
    ]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-80px)] bg-white p-2 overflow-hidden">

                {/* --- SIDEBAR: Conversation List --- */}
                <aside className={`w-full md:w-80 border-r-4 border-black flex flex-col bg-gray-50 ${selectedChat && 'hidden md:flex'}`}>
                    <div className="p-4 border-b-4 border-black bg-yellow-400">
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Messages</h1>
                        <div className="relative mt-4">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="SEARCH CHATS..."
                                className="w-full bg-white border-2 border-black p-2 pl-10 font-bold text-xs focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`p-4 border-b-2 border-black cursor-pointer transition-colors flex items-center gap-3
                                    ${selectedChat === chat.id ? 'bg-black text-white' : 'hover:bg-yellow-50'}
                                `}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 border-2 border-current bg-gray-200 flex items-center justify-center">
                                        <FiUser size={24} />
                                    </div>
                                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-black uppercase text-sm truncate">{chat.name}</h3>
                                        <span className={`text-[10px] font-bold ${selectedChat === chat.id ? 'text-yellow-400' : 'text-gray-400'}`}>{chat.time}</span>
                                    </div>
                                    <p className={`text-xs truncate font-medium ${selectedChat === chat.id ? 'text-gray-300' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && selectedChat !== chat.id && (
                                    <div className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* --- MAIN CHAT AREA --- */}
                <main className={`flex-1 flex flex-col bg-white ${!selectedChat && 'hidden md:flex'}`}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSelectedChat(null)} className="md:hidden border-2 border-black p-1">
                                        <FiArrowLeft />
                                    </button>
                                    <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <h2 className="font-black uppercase text-sm tracking-tight leading-none">
                                            {conversations.find(c => c.id === selectedChat)?.name}
                                        </h2>
                                        <span className="text-[10px] font-bold text-green-600 uppercase">Online</span>
                                    </div>
                                </div>
                                <button className="hover:bg-gray-100 p-2 border-2 border-transparent active:border-black">
                                    <FiMoreVertical />
                                </button>
                            </div>

                            {/* Chat Messages Container */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
                            >
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                            ${msg.sender === 'me' ? 'bg-yellow-400' : 'bg-white'}
                                        `}>
                                            <p className="leading-relaxed">{msg.text}</p>
                                            <span className="text-[8px] uppercase mt-1 block opacity-60 text-right">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t-4 border-black bg-gray-50 flex gap-2">
                                <button type="button" className="p-3 border-2 border-black bg-white hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <FiPaperclip />
                                </button>
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="TYPE YOUR MESSAGE..."
                                    className="flex-1 border-2 border-black p-3 font-black text-sm focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                />
                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-2"
                                >
                                    <span className="hidden sm:inline">Send</span> <FiSend />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="w-20 h-20 border-4 border-black bg-yellow-400 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <FiSend size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase">Select a Conversation</h2>
                                <p className="text-gray-500 font-bold text-sm uppercase">Pick a buyer to start negotiating.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
};

export default MessagesPage;