import puppeteer from "puppeteer";
import type { Request, Response, NextFunction } from "express";
import Note_Error from "../middlewares/noteError";
import createResponse from "../utils/createResponse";

export class PDF_Controller {
    public static async createPDF(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { htmlContent, fileName } = req.body;

        // Validate mandatory fields
        if (!htmlContent || !fileName) {
            return next(new Note_Error(createResponse(true, 'Missing mandatory fields for PDF creation', []), 400));
        }

        // Validate file name (alphanumeric, underscores, hyphens, and .pdf extension)
        const fileNameRegex = /^[a-zA-Z0-9_-]+\.pdf$/;
        if (!fileNameRegex.test(fileName)) {
            return next(new Note_Error(createResponse(true, 'Invalid file name format. File name must end with .pdf', []), 400));
        }

        let browser;
        try {
            // Launch Puppeteer browser
            browser = await puppeteer.launch({
                headless: true, // Use true for production
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            // Create a new page and set its content
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // Generate the PDF buffer
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'
                }
            });

            // Set headers for file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
            res.end(pdfBuffer); // Use res.end() instead of res.send()            
        } catch (err: any) {
            // Pass errors to the error-handling middleware
            return next(err);
        } finally {
            // Ensure the browser is closed even if an error occurs
            if (browser) {
                await browser.close();
            }
        }
    }
}