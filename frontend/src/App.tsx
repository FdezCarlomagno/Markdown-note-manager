import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Home from "./components/Home"
import Login from './components/login/LoginForm'
import Register from './components/register/RegisterForm'
import Account from "./components/account/Account"
import QuickFormat from "./components/QuickFormat/QuickFormat"
import Guide from "./components/guide/Guide"
import V2EmailVerification from "./components/emailVerification/V2EmailVerification"
import NotFound from "./components/Reusable/NotFound"


function App() {
    return (
        <Router>
            <Routes>
                {/* Rutas dentro del layout con Sidebar fijo */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path='quick-format' element={<QuickFormat />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="account" element={<Account />}/>
                    <Route path="guide" element={<Guide />}/>
                    <Route path="verify-email" element={<V2EmailVerification />}/>
                </Route>

                {/* Página 404 u otras rutas fuera del layout */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
