// pages/Home.tsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Globe, Image, Mail, Bot, File } from "lucide-react"

import Website from "./Website"
import Poster from "./Poster"
import Email from "./Email"
import Chatbot from "./Chatbot"
import Assets from "./Assets"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("website")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "website":
        return <Website />
      case "poster":
        return <Poster />
      case "email":
        return <Email />
      case "chatbot":
        return <Chatbot />
      case "assets":
        return <Assets />
      default:
        return <div className="text-slate-400">Select a section</div>
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 space-y-6 shadow-lg">
        <h2 className="text-xl font-bold text-primary-400 mb-4">Bissolve</h2>
        <nav className="flex flex-col space-y-4">
          <SidebarButton label="Website" icon={<Globe size={20} />} onClick={() => setActiveSection("website")} active={activeSection === "website"} />
          <SidebarButton label="Poster" icon={<Image size={20} />} onClick={() => setActiveSection("poster")} active={activeSection === "poster"} />
          <SidebarButton label="Email" icon={<Mail size={20} />} onClick={() => setActiveSection("email")} active={activeSection === "email"} />
          <SidebarButton label="Chatbot" icon={<Bot size={20} />} onClick={() => setActiveSection("chatbot")} active={activeSection === "chatbot"} />
          <SidebarButton label="Assets" icon={<File size={20} />} onClick={() => setActiveSection("assets")} active={activeSection === "assets"} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold capitalize">{activeSection}</h1>
          <button
            onClick={handleLogout}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </header>

        {/* Section Content */}
        <section className="bg-slate-800 p-6 rounded-lg shadow">
          {renderContent()}
        </section>
      </main>
    </div>
  )
}

const SidebarButton = ({
  label,
  icon,
  onClick,
  active
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  active: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
      active ? "bg-primary-600" : "hover:bg-slate-700"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export default Home
