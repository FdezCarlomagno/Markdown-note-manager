import { useAppContext } from "../../hooks/useAppContext"
import toast, { Toaster } from 'react-hot-toast'
import createParagraph from "./createParagraph"
import { useState, useEffect } from "react"
import { ElementBar } from "./ElementBar"
import { OrderedContent } from "../../interfaces/models"
import { useUserContext } from "../../hooks/useUserContext"
import NoteTip from "../Reusable/NoteTip"

export interface SelectedFormat {
    base: string | ((language: string) => string),
    name: string
}
const QuickFormat = () => {
    const { setNote, note, notes, setOrderedContent, fetchUserNotes } = useAppContext()
    const { isLoggedIn } = useUserContext()
    const [selectedFormat, setSelectedFormat] = useState<SelectedFormat>({
        base: '',
        name: ''
    })

    useEffect(() => {
        if (isLoggedIn && (!notes || notes.length === 0)) {
            fetchUserNotes()
        }
    }, [isLoggedIn])

    const [showInput, setShowInput] = useState(false)
    const [text, setText] = useState('')

    //const infoSVG = <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 17V11" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="#60a5fa"></circle> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>

    const toggleInput = () => {
        setShowInput(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const handleSaveParagraph = () => {
        if (!selectedFormat.name) {
            toast.error('Please select a format', {
                style: {
                    backgroundColor: '#374151',
                    color: 'white'
                }
            });
            return;
        }

        // Crear el nuevo párrafo
        const paragraph = createParagraph(selectedFormat.base as any, text) as string;

        // Dividir el contenido existente y filtrar bloques vacíos
        const splitContent = note.content
            .split("\n---\n")
            .filter(block => block.trim() !== "");

        // Agregar el nuevo bloque
        splitContent.push(paragraph);

        // Crear el nuevo contenido ordenado
        const newOrderedContent: OrderedContent[] = splitContent.map((content, index) => ({
            slotId: `slot-${index}`,
            itemId: `item-${index}`,
            content: content,
        }));

        // Actualizar estados
        setOrderedContent(newOrderedContent);

        // Unir los bloques con separadores ENTRE ellos y agregar uno final
        const completeNote = splitContent.join('\n---\n')

        setNote({
            ...note,
            content: completeNote
        });

        setText('');
    };

    const renderInput = () => {
        return (
            <>
                {showInput ? <textarea
                    onChange={handleChange}
                    placeholder="Start writing..."
                    name={selectedFormat.name}
                    value={text}
                    className="w-full h-48 md:h-64 bg-gray-800 text-gray-100 font-mono text-sm p-3 md:p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                /> : <div className="text-gray-600 text-left m-4">
                    Select an element from the list above.
                </div>}
            </>
        )
    }

    return <>
        <div className="flex flex-col justify-center m-3">
            <Toaster />
            <h1 className="text-3xl font-bold">Quick Format</h1>
            <ElementBar selectedFormat={selectedFormat} onSelect={setSelectedFormat} onToggle={toggleInput} />
            <NoteTip>
                <ul>
                    <li>To create lists, use coma separated values</li>
                    <li>To create an image, write "[alt], [src]" </li>
                    <li>To create a link, write "[alt], [link]" </li>
                </ul>
            </NoteTip>
            <h1 className="text-bold text-3xl m-2">
                Insert {selectedFormat.name}
            </h1>
            {renderInput()}
            <div className="flex gap-5 my-3">
                <button className="btn w-full" onClick={handleSaveParagraph}>
                    Add block
                </button>
            </div>
        </div>
    </>
}

export default QuickFormat