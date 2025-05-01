import { useNavigate } from "react-router-dom"

const BackButton = () => {
    const nav = useNavigate()
    return (
        <button className="bg-gray-800 text-gray-100 p-2 rounded-md shadow-md hover:bg-gray-700 transition" 
        onClick={() => nav('/')}>Back to home</button>
    )
}

export default BackButton