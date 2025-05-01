import { titleStyles } from "./Account"
import Error from "../Reusable/Error"
import { Link } from "react-router-dom"
import { Note } from "../../interfaces/models"
import DeleteButton from "../Reusable/DeleteButton"

interface NotesProps {
    notes: Note[]
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
    setNote: React.Dispatch<React.SetStateAction<Note>>
}

const Notes = ({ notes, setNote }: NotesProps) => {

    return (
        <>
            <h1 className={`text-3xl border border-b-gray-700 p-3 border-x-0 border-t-0`}>Active notes</h1>
            <div>
                {notes && notes.length > 0 ? <>
                    {notes.map((note: Note) => (

                        <div key={note.id} className="p-3 border border-gray-700 rounded-lg shadow-lg bg-gray-900 mt-3"
                            onClick={(e) => {
                                e.stopPropagation()
                                setNote(note)
                            }}
                        >
                            <Link to={'/'}><h2 className="text-2xl mb-2">{note.title}</h2> </Link>
                            <div className="flex justify-between flex-col md:flex-row gap-3">
                                <p className="text-gray-500 text-left break-words">{
                                    `${note.content.slice(0, 100)}...`
                                }
                                 
                                </p>
                                <DeleteButton id={note.id} />
                            </div>
                        </div>

                    ))}

                </> : <Error dismissButton={false} >No notes found</Error>}
            </div>
        </>
    )
}

export default Notes