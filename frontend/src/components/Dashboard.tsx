import { type SetStateAction, useState } from "react"
import type { Note } from "../interfaces/models"
import DeleteButton from "./Reusable/DeleteButton"
import { useAppContext } from "../hooks/useAppContext"
import { useUserContext } from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom"
import AccountButton from "./Reusable/AccountButton"
import Input from "./Reusable/Input"


interface DashboardProps {
  onEdit: () => void
  setEditNote: React.Dispatch<SetStateAction<boolean>>
}

function Dashboard({ onEdit, setEditNote }: DashboardProps) {
  const [search, setSearch] = useState('')

  const {
    setNote,
    notes,
    initialNote,
    setOrderedContent,
    setFilteredNotes,
    filteredNotes
  } = useAppContext()

  const nav = useNavigate()

  const {
    isLoggedIn
  } = useUserContext()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setFilteredNotes(notes.filter(note => note.title.toLowerCase().includes(value.toLowerCase())))
  }


  const [showNotes, setShowNotes] = useState<boolean>(false)

  return (
    <aside className="w-full md:w-48 lg:w-72 lg:h-full bg-gray-800 h-full p-4 md:p-6 border-r border-gray-700 shadow-2xl space-y-6 md:space-y-8 overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
        <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          MD Dashboard
        </h2>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => {
            setEditNote(false)
            setNote(initialNote)
            setOrderedContent([])
            nav('/')
          }}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:translate-x-2"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New document
        </button>

        <button
          onClick={() => {
            setShowNotes((prev) => !prev)
          }}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:translate-x-2"
        >
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
            />
          </svg>
          My documents
        </button>
        {showNotes && (
          <div className="flex flex-col justify-center gap-3 md:gap-5 p-2">
            <div>
              <Input type="search" name="search" onChange={handleSearch} value={search} placeholder="Search..." />
            </div>
            {notes.length !== 0 ? (
              filteredNotes.map((note) => (
                <li
                  key={note.id}
                  className="bg-gray-900 flex justify-between items-center gap-2 md:gap-3 border border-gray-900 shadow-md rounded-md p-2 hover:cursor-pointer hover:scale-[1.02] transition duration-300 hover:border-gray-300"
                  onClick={() => {
                    nav('/')
                    onEdit()
                    setNote(note)
                  }}
                >
                  <p className="font-bold text-sm md:text-base max-w-[150px]">{note.title || "Untitled"}</p>
                  <DeleteButton id={note.id as Note['id']} />
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400">No notes available</p>
            )}
          </div>
        )}
        <button
          onClick={() => {
            nav('/quick-format')
          }}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:translate-x-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lightningGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#FFD700" />
                <stop offset="100%" stop-color="#FFA500" />
              </linearGradient>
            </defs>
            <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="url(#lightningGradient)" />
          </svg>

          Quick format
        </button>
        {isLoggedIn ? <>
          <AccountButton url="account" />
        </> :
          <AccountButton url="login" />
        }
        <button
          onClick={() => {
            nav('/guide')
          }}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:translate-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          MD Guide
        </button>
      </nav>
    </aside>
  )
}

export default Dashboard

