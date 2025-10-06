"use client"
import trashIcon from '../assets/trash.svg'
import type { ChangeEvent } from "react"
import { useAppContext } from "../hooks/useAppContext"
import { useUserContext } from "../hooks/useUserContext"
import SaveButton from './Reusable/SaveButton'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import cross from '../assets/cross-svgrepo-com.svg'

const MarkdownEditor = () => {
  const { setIsEdited } = useUserContext()
  const { note, setNote: setContent, setEditMode, orderedContent, handleSave } = useAppContext()

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
    const newContent = {
      ...note,
      [e.target.name]: e.target.value,
    }
    setIsEdited(true)
    setContent(newContent)
  }

  const toastStyles = {
    style: {
      backgroundColor: '#374151',
      color: 'white'
    }
  }

  const onSave = useCallback(async () => {
    const updatedMarkdown = orderedContent.map((item) => item.content).join("\n---\n");
    setEditMode(false);
    try {
      await handleSave(updatedMarkdown);
    } catch (err: any) {
      toast.error(err.message, toastStyles);
    }
  }, [orderedContent, setEditMode, handleSave]);

  const handleDeleteContent = () => {
    setContent({
      ...note,
      content: "",
    })
    setIsEdited(true)
  }
  const handleDeleteTitle = () => {
    setContent({
      ...note,
      title: "",
    })
    setIsEdited(true)
  }

  return (
    <div className="bg-gray-900 p-3 md:p-4 rounded-lg shadow-lg max-w-full overflow-hidden">
      <div className="flex justify-between items-center gap-3">
        <input
          type="text"
          className="my-2 md:my-3 w-full p-2 rounded-md bg-gray-800 text-gray-100 overflow-hidden text-ellipsis whitespace-nowrap min-w-0"
          placeholder="Title"
          name="title"
          onChange={handleChange}
          value={note.title}
        />
        <button onClick={handleDeleteTitle} className="flex-shrink-0 bg-red-800">
          <img className="w-[40px] p-2 h-auto " src={cross} alt="Delete title" />
        </button>
      </div>

      <textarea
        className="w-full h-48 md:h-76 bg-gray-800 text-gray-100 font-mono text-sm p-3 md:p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden break-words whitespace-pre-wrap overflow-y-scroll"
        value={note.content}
        name="content"
        onChange={handleChange}
        placeholder="Write your markdown here..."
      />
      <div className="flex justify-between items-center mt-2 text-right text-gray-400 text-xs md:text-sm">
        <div>{note.content.length} characters</div>
        <div className='flex justify-between items-center gap-2'>
          <SaveButton onSave={onSave} />
          <button onClick={handleDeleteContent} className='btn flex items-center justify-center 
                rounded-full 
                bg-gradient-to-br from-red-900 to-red-600 
                shadow-md hover:shadow-lg 
                transform active:scale-95 
                transition-all duration-200' >
            <img src={trashIcon} className="w-5 h-5" alt="Delete content" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor
