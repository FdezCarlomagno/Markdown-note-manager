import type { ChangeEvent } from "react"
import trashIcon from '../assets/trash.svg'
import { useAppContext } from "../hooks/useAppContext"
import { useUserContext } from "../hooks/useUserContext"

const MarkdownEditor = () => {
  const { setIsEdited } = useUserContext()
  const { note, setNote : setContent } = useAppContext()

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
    const newContent = {
      ...note,
      [e.target.name]: e.target.value,
    }
    setIsEdited(true)
    setContent(newContent)
  }

  const handleDeleteContent = () => {
    setContent({
      ...note,
      content: ''
    })
    setIsEdited(true)
  }
  const handleDeleteTitle = () => {
    setContent({
      ...note,
      title: ''
    })
    setIsEdited(true)
  }

  return (
    <div className="bg-gray-900 p-3 md:p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center gap-3">
      <input
        type="text"
        className="my-2 md:my-3 w-full p-2 rounded-md bg-gray-800 text-gray-100"
        placeholder="Title"
        name="title"
        onChange={handleChange}
        value={note.title}
      />
        <button onClick={handleDeleteTitle}><img className='w-[40px] p-2 h-auto' src={trashIcon} alt="Trash icon" /></button>
      </div>
    
      <textarea
        className="w-full h-48 md:h-64 bg-gray-800 text-gray-100 font-mono text-sm p-3 md:p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={note.content}
        name="content"
        onChange={handleChange}
        placeholder="Write your markdown here..."
      />
      <div className="flex justify-between items-center mt-2 text-right text-gray-400 text-xs md:text-sm">
        <div>
        {note.content.length} characters
        </div>
        <div>
         <button onClick={handleDeleteContent}><img className='w-[40px] p-2 h-auto' src={trashIcon} alt="Trash icon" /></button>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor

