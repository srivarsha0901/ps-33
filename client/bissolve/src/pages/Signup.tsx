// pages/Signup.tsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

const Signup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isLogin) {
        await axios.post("http://localhost:3000/api/auth/signin", {
          email: formData.email,
          password: formData.password,
        })
        navigate("/home") // ✅ go to home on successful login
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }

        await axios.post("http://localhost:3000/api/auth/signup", {
          fullName: formData.fullname,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
        navigate("/home") // ✅ go to home on successful signup
      }
    } catch (err: any) {
      if (err.response?.status === 503) {
        setError("Database service unavailable. MongoDB is required for authentication. Please ensure MongoDB is running and connected.")
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.")
      }
    }
  }

  const handleGoogleSignup = () => {
    window.open("http://localhost:3000/api/auth/google", "_self")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-effect rounded-3xl max-w-md w-full p-8"
      >
        <div className="flex items-center space-x-3 justify-center mb-6">
          <Building2 className="text-primary-400 w-6 h-6" />
          <h2 className="text-white text-2xl font-semibold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-all font-semibold"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-slate-600" />
          <span className="text-slate-400 px-4 text-sm">or</span>
          <hr className="flex-grow border-slate-600" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
        </button>

        <p className="text-sm text-center text-slate-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-400 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup
