import { toast } from 'react-hot-toast';
import { Marked } from 'marked';
import { Note } from '../interfaces/models';
import downloadFile from '../utils/download';
import { PDF_Service } from '../api/pdf.service';
import { useAppContext } from './useAppContext';

interface UseDownloadProps {
    note: Note,
    theme: 'dark' | 'light'
}

const useDownload = ({ note, theme = 'dark' }: UseDownloadProps) => {
    const marked = new Marked();
    const { setLoading, LoadingStates } = useAppContext();

    /**
     * Genera el contenido para la descarga, incluyendo un título limpio y contenido HTML.
     */

    /*
    Vieja version de download content con un solo theme
    const getDownloadContent = async (
        content?: string,
        title?: string,
        theme: 'dark' | 'light' = 'dark'
    ): Promise<{ cleanTitle?: string; htmlContent?: string }> => {
        let cleanTitle;
        let htmlContent;

        if (title) {
            cleanTitle = `${title
                .toLowerCase()
                .replace(/[^a-z0-9áéíóúüñ]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')}`;
        }

        if (content) {
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${title}</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">
                    <style>
                        .markdown-body { 
                            padding: 20px; 
                            max-width: 800px; 
                            margin: 0 auto;
                            color: #fff;
                            background-color: #1a1a1a;
                        }
                    </style>
                </head>
                <body>
                    <article class="markdown-body">
                        ${await marked.parse(content)}
                    </article>
                </body>
                </html>
            `;
        }

        return { cleanTitle, htmlContent };
    };
    */

        /**
     * Valida si la nota es válida para ser descargada.
     */
        const isValidNote = (): boolean => {
            if (note.title.trim() === '') {
                toast.error('Cannot download without a title', {
                    style: {
                        backgroundColor: '#374151',
                        color: 'white'
                    }
                });
                return false;
            }
    
            if (note.content.trim() === '') {
                toast.error('Cannot download without content', {
                    style: {
                        backgroundColor: '#374151',
                        color: 'white'
                    }
                });
                return false;
            }
    
            return true;
        };


    //Ahora maneja dark y light theme
    const getDownloadContent = async (
        content?: string,
        title?: string,
    ): Promise<{ cleanTitle?: string; htmlContent?: string }> => {
        let cleanTitle;
        let htmlContent;
    
        if (title) {
            cleanTitle = `${title
                .toLowerCase()
                .replace(/[^a-z0-9áéíóúüñ]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')}`;
        }
    
        if (content) {
            // Seleccionamos la hoja de estilos según el tema
            const stylesheet = theme === 'light' 
                ? 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css'
                : 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css';
    
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${title}</title>
                    <link rel="stylesheet" href="${stylesheet}">
                    <style>
                        .markdown-body { 
                            padding: 20px; 
                            max-width: 800px; 
                            margin: 0 auto;
                            color: ${theme === 'light' ? '#24292f' : '#fff'};
                            background-color: ${theme === 'light' ? '#ffffff' : '#1a1a1a'};
                        }
                    </style>
                </head>
                <body>
                    <article class="markdown-body">
                        ${await marked.parse(content)}
                    </article>
                </body>
                </html>
            `;
        }
    
        return { cleanTitle, htmlContent };
    };

    /**
     * Descarga la nota como un archivo PDF.
     */
    const handleDownloadPDF = async () => {
        if (!isValidNote()) return;
    
        const downloadProcess = async () => {
            const { cleanTitle, htmlContent } = await getDownloadContent(note.content, note.title);
            const filename = `${cleanTitle || 'nota-sin-titulo'}.pdf`;
    
            if (!htmlContent) {
                throw new Error("No HTML content generated");
            }
    
            await PDF_Service.createPDF(htmlContent, filename);
        };
    
        try {
            setLoading(LoadingStates.LOADING);
            
            await toast.promise(
                downloadProcess(),
                {
                    loading: 'Generating PDF...',
                    success: <b>Note downloaded successfully as PDF!</b>,
                    error: (error) => <b>{error.message || 'Failed to generate PDF'}</b>,
                }
                , {
                    style: {
                        backgroundColor: '#374151',
                        color: 'white'
                    }
                });
    
            setLoading(LoadingStates.SUCCESS);
        } catch (error) {
            setLoading(LoadingStates.NOT_LOADING);
            console.error('PDF Download Error:', error);
        } finally {
            setTimeout(() => {
                setLoading(LoadingStates.NOT_LOADING);
            }, 2000);
        }
    };

    /**
     * Descarga la nota como un archivo Markdown (.md).
     */
    const handleDownloadMD = async () => {
        if (!isValidNote()) return;

        const downloadProcess = async () => {
            const { cleanTitle } = await getDownloadContent('', note.title);
            const filename = `${cleanTitle || 'nota-sin-titulo'}.md`;
            const content = `# ${note.title}\n\n${note.content}`;

            downloadFile(content, filename);
        };

      

        try {
            setLoading(LoadingStates.LOADING);
            await toast.promise(downloadProcess(), {
                loading: 'Downloading your note...',
                success: <b>Note downloaded successfully!</b>,
                error: <b>Failed to download note. Please try again.</b>,
            }, {
                style: {
                    backgroundColor: '#374151',
                    color: 'white'
                }
            });
            setLoading(LoadingStates.SUCCESS);
        } catch (error) {
            setLoading(LoadingStates.NOT_LOADING);
            console.error('MD Download Error:', error);
        } finally {
            setTimeout(() => {
                setLoading(LoadingStates.NOT_LOADING);
            }, 2000);
        }
    };

    /**
     * Descarga la nota como un archivo HTML.
     */
    const handleDownloadHTML = async () => {
        if (!isValidNote()) return;

        try {
            setLoading(LoadingStates.LOADING);

            const { cleanTitle, htmlContent } = await getDownloadContent(note.content, note.title);
            const filename = `${cleanTitle || 'nota-sin-titulo'}.html`;

            if (htmlContent) {
                downloadFile(htmlContent, filename);
                toast.success('Note downloaded successfully as HTML', {
                    style: {
                        backgroundColor: '#374151',
                        color: 'white'
                    }
                });
            }
        } catch (error) {
            toast.error('Failed to download HTML file', {
                style: {
                    backgroundColor: '#374151',
                    color: 'white'
                }
            });
            console.error('HTML Download Error:', error);
        } finally {
            setLoading(LoadingStates.NOT_LOADING);
        }
    };

    return {
        handleDownloadHTML,
        handleDownloadMD,
        handleDownloadPDF,
    };
};

export default useDownload;