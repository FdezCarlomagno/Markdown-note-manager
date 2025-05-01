
import { createResponse } from '../utils/createResponse';
import downloadPDF from '../utils/downloadPDF';
import { axiosService } from './axiosService';

export class PDF_Service {

    // Automatically download the PDF
    public static async createPDF(htmlContent: string, filename: string) {
        try {
            if (!htmlContent || !filename) {
                throw new Error('Missing mandatory fields');
            }
            
            const { data: pdfBlob } = await axiosService.post(`/generate-pdf`, {
                htmlContent: htmlContent,
                fileName: filename // ✅ Fix: Use "fileName" instead of "filename"
            }, {
                responseType: 'blob', // ✅ Ensure binary response
            });

            console.log(pdfBlob);

            // ✅ Pass both blob and filename correctly
            downloadPDF(pdfBlob, filename);
            
        } catch (err: any) {
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, null)
        }
    }
}
