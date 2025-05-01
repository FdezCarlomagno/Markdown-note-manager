import Dashboard from "./Dashboard"
import { useAppContext } from "../hooks/useAppContext"

const SideBar = () => {
    const { isSidebarOpen, setEditNote, setIsSidebarOpen, setIsEdited } = useAppContext()

    const handleEditNote = () => {
        setIsEdited(false)
        setIsSidebarOpen(false)
        setEditNote(true)
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <>
            <button
                className="md:hidden fixed top-4 right-5 z-50 bg-gray-800 text-white px-3 py-1 rounded-md"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? "✕" : "☰"}
            </button>

            <aside
                className={`
                w-72 bg-gray-900 text-white fixed inset-y-0 left-0 z-40 
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:static
            `}
            >
                <Dashboard onEdit={handleEditNote} setEditNote={setEditNote} />
            </aside>
        </>
    )
}


export default SideBar