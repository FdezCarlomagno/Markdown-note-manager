import type React from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import type { OrderedContent } from "../../interfaces/models"
import { components } from "./components"

interface Props {
  orderedContent: OrderedContent[]
  onContentChange: (newContent: OrderedContent[]) => void
}

export const ReorderableParagraphs: React.FC<Props> = ({ orderedContent, onContentChange }) => {
  const moveParagraph = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= orderedContent.length) return

    const newContent = [...orderedContent]
    const [movedItem] = newContent.splice(index, 1)
    newContent.splice(newIndex, 0, movedItem)
    onContentChange(newContent)
  }

  const deleteParagraph = (id: string) => {
    const updatedParagraphs = orderedContent.filter((item) => item.itemId !== id)
    onContentChange(updatedParagraphs)
  }

  return (
    <div className="space-y-4">
      {orderedContent.map((item, index) => (
        <div key={item.itemId} className="group relative p-3 rounded-lg border border-gray-700 hover:bg-gray-800/30">
          <div className="flex flex-row space-x-1 opacity-100 md:absolute md:right-2 md:top-2 md:flex-col md:space-x-0 md:space-y-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity gap-2">
            <button
              onClick={() => deleteParagraph(item.itemId)}
              className="p-1 rounded-full bg-red-700! hover:bg-red-600! focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-4 h-4 text-white"></X>
            </button>
            <button
              onClick={() => moveParagraph(index, "up")}
              disabled={index === 0}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Move paragraph up"
            >
              <ChevronUp className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => moveParagraph(index, "down")}
              disabled={index === orderedContent.length - 1}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Move paragraph down"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>
          <Markdown components={components} remarkPlugins={[remarkGfm]}>
            {item.content || ""}
          </Markdown>
        </div>
      ))}
    </div>
  )
}

