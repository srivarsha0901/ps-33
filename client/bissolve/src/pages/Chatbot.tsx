import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Send } from "lucide-react"
import clsx from "clsx"

type Message = {
  from: "user" | "bot"
  text: string
}

const suggestions = [
  "How do I grow my startup?",
  "Give me a marketing strategy for a new product.",
  "What’s a good business name for a tech company?",
  "Explain how to pitch to investors.",
]

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (msg?: string) => {
    const userInput = msg || input.trim()
    if (!userInput) return

    const userMsg: Message = { from: "user", text: userInput }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const { data } = await axios.post("http://localhost:5000/api/chat", {
        message: userInput,
      })

      const botMsg: Message = { from: "bot", text: data.reply }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Something went wrong. Try again later." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-700 p-4 rounded-lg mb-4 shadow">
        <h2 className="text-xl font-semibold mb-2">💬 Business Chat Assistant</h2>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="bg-slate-800 hover:bg-slate-600 text-sm text-white px-3 py-1 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-800 p-4 rounded-lg space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              "max-w-[75%] px-4 py-2 rounded-lg whitespace-pre-wrap",
              msg.from === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-slate-700 text-gray-200 self-start mr-auto"
            )}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-slate-700 text-gray-400 px-4 py-2 rounded-lg max-w-[75%] animate-pulse">
            Typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask something about business..."
          className="flex-1 p-2 rounded-lg bg-slate-700 text-white outline-none"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default Chatbot
