import React, { SetStateAction, useEffect, useMemo, useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { OrderedContent } from "../interfaces/models";
import { ReorderableParagraphs } from "./markdown/ReorderableParagraphs";
import { components, lightModeComponents } from "./markdown/components";
import SaveButton from "./Reusable/SaveButton";
import { useAppContext } from "../hooks/useAppContext";
import toast from "react-hot-toast";

interface GitHubMarkdownDarkProps {
  content: string;
  orderedContent: OrderedContent[];
  setOrderedContent: React.Dispatch<SetStateAction<OrderedContent[]>>;
  editMode: boolean;
  setEditMode: React.Dispatch<SetStateAction<boolean>>;
}

const GitHubMarkdownDark: React.FC<GitHubMarkdownDarkProps> = React.memo(({ 
  content, 
  orderedContent, 
  setOrderedContent, 
  editMode, 
  setEditMode 
}) => {
  const { setIsEdited, handleSave } = useAppContext();

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

  const createObjects = useCallback((content: string): OrderedContent[] => {
    const splitContent = content.split("\n---\n");
    return splitContent.map((item, index) => ({
      slotId: `slot-${index}`,
      itemId: `item-${index}`,
      content: item,
    }));
  }, []);

  useEffect(() => {
    if (!content) return;
    const ordered: OrderedContent[] = createObjects(content);
    setOrderedContent(ordered);
  }, [content, createObjects, setOrderedContent]);

  const handleEditContent = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  const handleContentChange = useCallback((newOrderedContent: OrderedContent[]) => {
    setIsEdited(true);
    setOrderedContent(newOrderedContent);
  }, [setIsEdited, setOrderedContent]);

  const renderContent = useMemo(() => {
    if (editMode) {
      return <ReorderableParagraphs orderedContent={orderedContent} onContentChange={handleContentChange} />;
    } else {
      const fullContent = orderedContent.map((item) => item.content).join("\n\n---\n\n");
      return (
        <Markdown components={components} remarkPlugins={[remarkGfm]}>
          {fullContent}
        </Markdown>
      );
    }
  }, [editMode, orderedContent, handleContentChange]);

  return (
    <div className="flex flex-col min-h-screen">
      <button
        className="btn"
        onClick={handleEditContent}
      >
        {editMode ? "Stop editing" : "Edit content"}
      </button>
      <div className="github-markdown-dark bg-gray-900 p-4 md:p-8 rounded-lg shadow-md m-1 md:m-4 flex-grow">
        {renderContent}
      </div>
      <SaveButton onSave={onSave} />
    </div>
  );
});

export default GitHubMarkdownDark;

