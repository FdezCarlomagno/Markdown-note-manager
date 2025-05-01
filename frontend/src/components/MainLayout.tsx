import { Outlet, useLocation } from "react-router-dom"
import SideBar from "./SideBar"
import Footer from "./Footer"
import { Header } from "./Reusable/Header"
import Preview from "./markdown/Preview"
import { useUserContext } from "../hooks/useUserContext"
import { useAppContext } from "../hooks/useAppContext"
import Download from "./Download"

const MainLayout = () => {
    const { isLoggedIn } = useUserContext()
    const { note } = useAppContext()
    const { pathname } = useLocation()
    const showPreview = pathname !== '/account'
        && pathname !== '/guide'
        && pathname !== '/login'
        && pathname !== '/register'
        && pathname !== '/verify-email'

    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-x-hidden">
                {/* Sidebar fijo a la izquierda */}
                <SideBar />

                {/* Contenido dinámico a la derecha */}
                <main className="flex-1 p-4 md:p-8 w-full">
                    {//{isLoggedIn ?}
                        <>
                            <Header />
                            <Outlet />
                            {showPreview &&
                                <>
                                <div className="flex flex-col gap-10">
                                    <Preview />
                                    <Download note={note} />
                                    </div>
                                </>
                            }
                            <Footer />
                        </>
                        //:
                        /*<div className="flex flex-col items-center justify-center min-h-screen">
                            <span className="loader"></span>
                        </div>*/}
                </main>
            </div>

        </>
    )
}

export default MainLayout
