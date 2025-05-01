# Markdown Note Manager

A full-stack web application designed for creating, managing, and exporting markdown notes with user authentication and email verification. Perfect for organizing AI-generated content, study materials, or code snippets, and exporting them to PDF/HTML for offline use.

---

## Features
- 🔐 **User Authentication**: Login/Register with JWT & email verification
- 📝 **Note Management**: 
  - Create/Edit/Delete notes with markdown syntax
  - Real-time preview
  - LocalStorage persistence
- 📤 **Export Options**:
  - Download as PDF (using Puppeteer)
  - Export as raw markdown
  - Generate HTML files
- 🛡 **Security**:
  - Rate limiting on authentication routes
  - Secure HTTP-only cookies
  - BCrypt password hashing
- 💻 **Code Friendly**:
  - Syntax highlighting
  - GitHub Flavored Markdown support
  - AI response formatting

---

## Technologies Used

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Markdown**: `marked` + `react-markdown`
- **PDF Generation**: Puppeteer
- **UI**: Lucide React icons
- **State Management**: React hooks
- **Routing**: React Router 7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Database**: MySQL
- **PDF Generation**: Puppeteer
- **Authentication**: JWT + BCrypt
- **Email**: Node Mailer
- **Validation**: Express Validator
- **Rate Limiting**: express-rate-limit

## Key Routes

### Notes API (`/api/notes`)
```http
GET    /notes       - List all notes
GET    /notes/:id   - Get single note
POST   /notes       - Create new note
PUT    /notes/:id   - Update note
DELETE /notes/:id   - Delete note
```

### PDF API (`/api/pdf`)
```http
POST /generate-pdf - Generate PDF from markdown
```

### User API (`/api/users`)
```http
POST /login                  - User login
POST /create-account         - Register new user
POST /verify-code            - Email verification
POST /resend-verification    - Resend verification code
GET  /profile                - Get user profile
```

---

## Common Use Cases
- 🧠 **AI Response Storage**: Save ChatGPT/Gemini responses in markdown and export as study PDFs
- 📚 **Study Notes**: Create lecture notes with code snippets and equations
- 💼 **Project Documentation**: Maintain technical docs with export capabilities
- 🚀 **Code Snippet Library**: Store reusable code with syntax highlighting

---

## Security Features
- 🔄 Rate limiting on authentication endpoints
- 🍪 HTTP-only cookies for JWT storage
- 🔒 Session management with sessionStorage
- 🛡️ CSRF protection for state-changing operations
- 📧 Optional email verification for new accounts

## License
MIT License - see [LICENSE](LICENSE) for details

---

*Developed with ❤️ using cutting-edge web technologies*