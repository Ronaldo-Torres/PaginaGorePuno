"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function Chat({ logoInstitucion }: { logoInstitucion: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy el asistente virtual del GORE PUNO. ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Mensaje del usuario
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Respuesta automática (demo)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Gracias por tu mensaje, pronto te responderemos." },
      ]);
    }, 800);

    setInput("");
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 cursor-pointer"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-2xl w-80 h-96 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <img src={logoInstitucion} alt="Logo" className="h-7 w-7 rounded-full bg-white p-1" />
              <span className="font-bold">GOREP CHAT</span>
            </div>
            <button onClick={toggleChat} className="hover:text-gray-200 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${msg.from === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
