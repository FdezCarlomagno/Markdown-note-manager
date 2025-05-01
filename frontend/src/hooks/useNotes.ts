import { useUserContext } from "./useUserContext";
import { toast } from 'react-hot-toast'
import { Note } from "../interfaces/models";
import { Note_Service } from "../api/note.service";
import { SetStateAction } from "react";
import { OrderedContent } from '../interfaces/models'

interface UseNotesProps {
  initialNote: Note
  note: Note
  setNote: React.Dispatch<SetStateAction<Note>>
  notes: Note[]
  setNotes: React.Dispatch<SetStateAction<Note[]>>
  editNote: boolean
  isEdited: boolean
  setIsEdited: React.Dispatch<SetStateAction<boolean>>
  setOrderedContent: React.Dispatch<SetStateAction<OrderedContent[]>>
  setFilteredNotes: React.Dispatch<SetStateAction<Note[]>>
}

const useNotes = ({ setNotes, notes, note, editNote, setNote, initialNote, setIsEdited, isEdited, setOrderedContent, setFilteredNotes }: UseNotesProps) => {
  const { setError, isLoggedIn } = useUserContext()

  const fetchUserNotes = async () => {
    const cachedNotes = localStorage.getItem('notes')

    if (cachedNotes) {
      try {
        const parsed = JSON.parse(cachedNotes)
        if (Array.isArray(parsed)) {
          setNotes(parsed as Note[])
          setFilteredNotes(parsed as Note[])
          return;
        } else {
          console.warn('cachedNotes no es un array válido')
        }
      } catch (e) {
        console.error('Error al parsear cachedNotes', e)
      }
    }
    
    const { error: apiError, message, data: notes } = await Note_Service.getUserNotes()
    console.log(notes)
    if (apiError) {
      setError(message)
    }
    localStorage.setItem('notes', JSON.stringify(notes))
    setNotes(notes as Note[])
    setFilteredNotes(notes as Note[])
  }

  const handleEditNote = async (content: string) => {

    const { error: apiError, message, data: updatedNote } = await Note_Service.editNote(note.title, content, note.id)

    if (apiError) {
      setError(message)
      toast.error(message, {
        style: {
          backgroundColor: '#374151',
          color: 'white'
        }
      })
      return
    }

    const updatedNotes = notes.map((n) =>
      n.id === note.id
        ? updatedNote
        : n
    ) as Note[]

    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
    toast.success('Note edited succesfully', {
      style: {
        backgroundColor: '#374151',
        color: 'white'
      }
    })
  }

  const handleSave = async (content?: string) => {
    if (note.content.trim() === "") {
      return toast.error("Cannot save an empty note", {
        style: {
          backgroundColor: '#374151',
          color: 'white'
        }
      })
    }

    if (!isLoggedIn) {
      toast('Please log in to store notes',
        {
          style: {
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: '10px'
          }
        }
      );
      return
    }

    if (!isEdited) {
      return toast.error('No changes to save', {
        style: {
          backgroundColor: '#374151',
          color: 'white'
        }
      })
    }

    const noteToEdit = notes.find(n => n.id === note.id)

    if (editNote && noteToEdit) {
      handleEditNote(content as string)
      setIsEdited(false)
      return
    }

    const { error: apiError, message, data: newNote } = await Note_Service.addNote(note.title || 'Untitled', note.content)

    if (apiError) {
      setError(message)
      toast.error(message, {
        style: {
          backgroundColor: '#374151',
          color: 'white'
        }
      })
      return
    }

    const updatedNotes = [...notes, newNote] as Note[]
    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
    setNote(initialNote)
    setIsEdited(false)
    setOrderedContent([])
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    toast.success("Note saved successfully", {
      style: {
        backgroundColor: '#374151',
        color: 'white'
      }
    })
  }

  const handleDelete = async (id: Note['id']) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
    //set the notes to the updated notes in the localStorage
    localStorage.setItem('notes', JSON.stringify(updatedNotes))

    const { error: apiError, message, data: response } = await Note_Service.deleteNote(id)

    console.log(response)

    if (apiError) {
      setError(message)
      toast.error(message, {
        style: {
          backgroundColor: '#374151',
          color: 'white'
        }
      })
      return
    }

    toast.success('Note deleted succesfully', {
      style: {
        backgroundColor: '#374151',
        color: 'white'
      }
    })
  }

  return {
    fetchUserNotes,
    handleDelete,
    handleSave,
    handleEditNote
  }
}

export default useNotes