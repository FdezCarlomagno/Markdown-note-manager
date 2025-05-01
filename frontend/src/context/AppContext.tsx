import { createContext, ReactNode, SetStateAction, useState, useMemo, useEffect } from 'react';
import { Note, OrderedContent } from '../interfaces/models';
import useNotes from '../hooks/useNotes';
import { useUserContext } from '../hooks/useUserContext';
import { LoadingStates } from '../interfaces/models';

interface AppProviderProps {
  children: ReactNode;
}

interface AppContextType {
  initialNote: Note;
  note: Note;
  setNote: React.Dispatch<SetStateAction<Note>>;
  notes: Note[];
  setNotes: React.Dispatch<SetStateAction<Note[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<SetStateAction<boolean>>;
  editNote: boolean;
  setEditNote: React.Dispatch<SetStateAction<boolean>>;
  fetchUserNotes: () => void;
  handleSave: (content?: string) => Promise<string | undefined>;
  handleDelete: (id: Note['id']) => Promise<void>;
  loading: LoadingStates;
  setLoading: React.Dispatch<SetStateAction<LoadingStates>>;
  LoadingStates: typeof LoadingStates;
  isEdited: boolean;
  setIsEdited: React.Dispatch<SetStateAction<boolean>>;
  handleEditNote: (content: string) => Promise<void>
  orderedContent: OrderedContent[],
  setOrderedContent: React.Dispatch<SetStateAction<OrderedContent[]>>,
  editMode: boolean,
  setEditMode: React.Dispatch<SetStateAction<boolean>>
  filteredNotes: Note[]
  setFilteredNotes: React.Dispatch<SetStateAction<Note[]>>
}



export const AppContext = createContext<AppContextType | undefined>(undefined);

const ContextProvider = ({ children }: AppProviderProps) => {
  const { isEdited, setIsEdited } = useUserContext();

  // Memoize static values
  const initialNote = useMemo(() => ({
    id: null,
    title: "",
    content: "",
    createdAt: ""
  }), []);


  const [note, setNote] = useState<Note>(initialNote);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [loading, setLoading] = useState<LoadingStates>(LoadingStates.NOT_LOADING);
  const [orderedContent, setOrderedContent] = useState<OrderedContent[]>([])
  const [editMode, setEditMode] = useState(false)
    // ... otros estados
    const [originalContent, setOriginalContent] = useState("");
  
    // Actualizar contenido original cuando cambia la nota
    useEffect(() => {
      setOriginalContent(note.content);
      setIsEdited(false);
    }, [note.id]);
  
    // Detectar cambios reales en el contenido
    const contentChanged = useMemo(() => {
      return note.content !== originalContent;
    }, [note.content, originalContent]);
  
    useEffect(() => {
      setIsEdited(contentChanged);
    }, [contentChanged, setIsEdited]);

  

  const { fetchUserNotes, handleDelete, handleSave, handleEditNote } = useNotes({
    setNotes,
    notes,
    note,
    editNote,
    setNote,
    initialNote,
    isEdited,
    setIsEdited,
    setOrderedContent,
    setFilteredNotes
  });

  // Memoize context values to avoid unnecessary re-renders
  const contextValues = {
    initialNote,
    note,
    setNote,
    notes,
    setNotes,
    isSidebarOpen,
    setIsSidebarOpen,
    editNote,
    setEditNote,
    fetchUserNotes,
    handleSave,
    handleDelete,
    loading,
    setLoading,
    LoadingStates,
    isEdited,
    setIsEdited,
    handleEditNote,
    orderedContent,
    setOrderedContent,
    editMode,
    setEditMode,
    filteredNotes,
    setFilteredNotes
  }

  return (
    <AppContext.Provider value={contextValues}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;