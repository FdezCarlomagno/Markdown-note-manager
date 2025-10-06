
import { Link } from "react-router-dom"
import { useUserContext } from "../../hooks/useUserContext"

export function Header(){
    const { isLoggedIn, logout } = useUserContext()
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Markdown Note Manager
                </h1>
                <div className="flex flex-col md:flex-row justify-between">
                {!isLoggedIn ? (
                    <div className="flex items-center gap-3">
                        <Link to={'/login'}>
                            <button className="btn">Log in</button>
                        </Link>
                        <Link to={'/register'}>
                            <button className="btn">Register</button>
                        </Link>
                    </div>
                ) : (
                    <button className="m-2 px-4 py-2 btn w-[100px]" onClick={logout}>Log out</button>
                )}
                </div>
            </div>
        </>
    )
}