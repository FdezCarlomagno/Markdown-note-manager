import { ReactNode } from "react"
import { useUserContext } from "../../hooks/useUserContext"

interface ErrorProps {
    children: ReactNode
    dismissButton?: boolean
}

const Error = ({ children, dismissButton = true }: ErrorProps) => {
    const { setError } = useUserContext()

    return (
        <>
            <div className="bg-red-600 text-white p-2 text-left rounded-md mt-3 justify-between items-center shadow-lg flex flex-col md:flex-row gap-3">
                {children}
                {dismissButton &&
                    <button
                        className="p-1 bg-red-800! text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => setError('')}
                    >
                        Dismiss
                    </button>
                }

            </div>
        </>
    )
}

export default Error