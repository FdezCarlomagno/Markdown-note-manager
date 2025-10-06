import { Note } from "../interfaces/models";
import { useUserContext } from "../hooks/useUserContext";
import useDownload from "../hooks/useDownload";
import { useAppContext } from "../hooks/useAppContext";
import { useState } from "react"; // Importamos useState

interface DownloadProps {
    note: Note;
}

const Download = ({ note }: DownloadProps) => {
    const { isLoggedIn } = useUserContext();
    const { loading, LoadingStates } = useAppContext();
    const [theme, setPdfTheme] = useState<'light' | 'dark'>('light'); // Estado para el tema

    // Pasamos el tema a los handlers
    const { handleDownloadHTML, handleDownloadMD, handleDownloadPDF } = useDownload({
        note,
        theme // Pasamos el tema actual
    });

    const buttonStyles = "p-3 m-1 w-[50%] md:w-[200px] hover:text-white rounded-md transition-colors btn disabled:cursor-not-allowed text-gray-600";
    const themeButtonStyles = "p-2 text-xs rounded-md border transition-colors";

    return (
        <div className="bg-gray-800/50 rounded-xl p-1 md:p-6 border border-gray-700/50 shadow-xl overflow-x-auto">
            <div className="flex items-center m-3">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1" />
                <h2 className="text-xl md:text-2xl font-semibold text-gray-300 px-2 md:px-4">Download</h2>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1" />
            </div>

            {/* Selector de tema solo para PDF */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => setPdfTheme('light')}
                    className={`${themeButtonStyles} ${theme === 'light'
                            ? 'bg-gray-100 text-gray-900 border-gray-400 shadow-md'  // seleccionado
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' // no seleccionado
                        }`}
                >
                    Light Theme
                </button>
                <button
                    onClick={() => setPdfTheme('dark')}
                    className={`${themeButtonStyles} ${theme === 'dark'
                            ? 'bg-gray-900 text-white border-gray-700 shadow-md'  // seleccionado
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' // no seleccionado
                        }`}
                >
                    Dark Theme
                </button>
            </div>


            <div className="flex flex-col items-center justify-center md:flex-row gap-2 w-full bg-gray-900 p-3 border-0 rounded-md shadow-md">
                <button
                    disabled={loading === LoadingStates.LOADING}
                    className="btn"
                    onClick={handleDownloadMD}
                >
                    Markdown (.md)
                </button>
                <button
                    disabled={loading === LoadingStates.LOADING}
                    className="btn"
                    onClick={handleDownloadHTML}
                >
                    HTML (.html)
                </button>
                <button
                    disabled={!isLoggedIn || loading === LoadingStates.LOADING}
                    className="btn"
                    onClick={handleDownloadPDF} // Pasamos el tema actual
                >
                    PDF (.pdf)
                </button>
            </div>

            {/* Indicador del tema seleccionado */}
            <div className="text-center mt-2 text-sm text-gray-400">
                PDF Theme: {theme === 'light' ? 'Light' : 'Dark'}
            </div>
        </div>
    );
};

export default Download;