import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { components } from "../markdown/components" // Your custom components
import { guideContent } from './guideContent'
import NoteTip from "../Reusable/NoteTip"
const Guide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Markdown Reference Guide
      </h1>
      <NoteTip>
        <p>This is a basic guide that helps you understand the basics of markdown format.</p>
        <p>If you want to learn more, go to <a href="https://www.markdownguide.org/getting-started/" target="_blank">Markdown guide</a></p>
      </NoteTip>
      <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700/50 shadow-xl mb-4 md:mb-8">
        <Markdown components={components} remarkPlugins={[remarkGfm]}>
          {guideContent}
        </Markdown>
      </div>
    </div>
  )
}

export default Guide

