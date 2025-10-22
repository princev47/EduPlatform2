import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { BookOpen, User, LogOut, Menu, X, GraduationCap, Users, Settings } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const context = useContext(AuthContext)
  if (!context) throw new Error('Layout must be used within AuthProvider')
  
  const { user, logout } = context
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">EduPlatform</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/courses" 
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/courses') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/dashboard') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/profile') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/80 backdrop-blur-md">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/courses" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false) }}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/60 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 EduPlatform. Built with React & Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}