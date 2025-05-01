import { useAppContext } from "../../hooks/useAppContext"
import PreviewMarkdown from '../PreviewMarkdown'

const Preview = () => {
    const { note, orderedContent, setOrderedContent, editMode, setEditMode } = useAppContext()
    return (
        <>
            {/* Preview */}
            <div className="bg-gray-800/50 rounded-xl p-1 md:p-6 border border-gray-700/50 shadow-xl overflow-x-auto">
                <div className="flex items-center m-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1" />
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-300 px-2 md:px-4">Preview</h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1" />
                </div>
                <div className="text-gray-300 flex flex-col gap-3 md:gap-5 break-words whitespace-normal ">
                    <PreviewMarkdown
                        content={note.content}
                        orderedContent={orderedContent}
                        setOrderedContent={setOrderedContent}
                        editMode={editMode}
                        setEditMode={setEditMode}
                    />
                </div>
            </div>
        </>
    )
}

export default Preview