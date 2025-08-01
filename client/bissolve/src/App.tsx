import { motion } from 'framer-motion'
import { 
  Building2, 
  Globe, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  Zap,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from "react-router-dom"; // Add at top

function App() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "AI Website Builder",
      description: "Create professional websites in minutes with AI-generated content and layouts"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Smart Marketing",
      description: "Automated email campaigns and newsletters that convert"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Chatbot",
      description: "24/7 customer support with intelligent responses"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Poster Generation",
      description: "Create stunning posters and graphics with AI-powered design tools"
    }
  ]

  const benefits = [
    "No technical skills required",
    "Free to use",
    "Launch in under 30 minutes",
    "24/7 AI-powered support",
    "Mobile-optimized designs",
    "SEO-friendly content"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
                         <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center space-x-2"
             >
               <Building2 className="w-8 h-8 text-primary-400" />
               <span className="text-xl font-bold text-white">Bissolve</span>
             </motion.div>
                         <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="hidden md:flex space-x-8"
             >
               <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
               <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
               <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
             </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
                         <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
               <Building2 className="w-4 h-4 mr-2" />
               AI-Powered Digital Toolkit
             </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your Business with
              <span className="gradient-text block">AI Magic</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Build, manage, and grow your online presence without technical skills. 
              Our AI toolkit handles everything from website creation to customer engagement.
            </p>
            <div className="flex justify-center mt-12">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-16 py-8"
                onClick={() => navigate("/signup")}

              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-40 left-10 opacity-20"
          >
            <div className="w-20 h-20 bg-primary-400 rounded-full blur-xl"></div>
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-60 right-10 opacity-20"
          >
            <div className="w-32 h-32 bg-purple-400 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="gradient-text"> Succeed Online</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From website creation to customer engagement, our AI handles it all
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                 Why Choose
                 <span className="gradient-text"> Bissolve</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of small businesses that have transformed their digital presence with our AI toolkit.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-primary-400" />
                    <span className="text-white font-semibold">Customer Growth</span>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Website Traffic</span>
                    <span className="text-white font-semibold">+245%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Customer Engagement</span>
                    <span className="text-white font-semibold">+180%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sales Conversion</span>
                    <span className="text-white font-semibold">+156%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-effect rounded-3xl p-12"
          >
            <Zap className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of entrepreneurs who've already taken their business to the next level
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-xl px-16 py-8"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
                         <div className="flex items-center space-x-2 mb-4 md:mb-0">
               <Building2 className="w-6 h-6 text-primary-400" />
               <span className="text-white font-semibold">Bissolve</span>
             </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 