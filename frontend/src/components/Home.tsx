import { useEffect } from "react";
import "../App.css";
import MarkdownEditor from "./MarkdownEditor";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "../hooks/useAppContext";
import { useUserContext } from "../hooks/useUserContext";

function Home() {
    const { setNotes, fetchUserNotes, notes, setNote, initialNote } = useAppContext();
    const { isLoggedIn } = useUserContext();

    useEffect(() => {
        
        if (isLoggedIn && (!notes || notes.length === 0)) {
            console.log(isLoggedIn && (!notes || notes.length === 0))
            fetchUserNotes();
        } else if (!isLoggedIn) {
            setNotes([]);
            setNote(initialNote);
        }
    }, [isLoggedIn]);

    return (
        <div className="flex flex-col md:flex-row">
            <Toaster />
            <main className="flex-1 md:w-full overflow-x-auto">
                <div className="flex flex-col w-full">
                    <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700/50 shadow-xl mb-4 md:mb-8">
                        <MarkdownEditor />
                    </div>   
                </div>
            </main>
        </div>
    );
}

export default Home;
