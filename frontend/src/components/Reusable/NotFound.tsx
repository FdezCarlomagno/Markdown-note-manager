import type React from "react"
import { useNavigate } from "react-router-dom"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-900 p-4 md:p-5 rounded-lg shadow-lg border border-gray-800 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Page not found</p>
        <div className="p-5 bg-gray-800 border border-gray-800 rounded-md flex flex-col gap-3">
          <p className="text-gray-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <button
            onClick={handleBackClick}
            className="btn"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound

