import { useState } from "react"
import { Link } from "react-router-dom"
import { useUserContext } from "../../hooks/useUserContext"
import { Email } from "../../interfaces/models"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from 'react-hot-toast'
import Label from "../Reusable/Label"
import Input from "../Reusable/Input"
import Error from "../Reusable/Error"
import BackButton from "../BackButton"


const LoginForm = () => {
    const { login, error, setError, isLoggedIn } = useUserContext()

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const toastStyles = {
        style: {
            backgroundColor: '#374151',
            color: 'white'
        }
      }

    const nav = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: [e.target.value]
        })
    }


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { error, message } = await login(form.email as Email, form.password)
        setForm({ email: '', password: '' })
        if (error) {
            toast.error(message, toastStyles)
            return
        }
        toast.success('Log in succesfull', toastStyles)
        setError('')
        nav('/')
    }

    return (
        <>
            {!isLoggedIn ?
                <>
                    <div className="flex flex-col items-center justify-center min-h-screen p-5 ">
                        <Toaster />
                        <h1 className="text-4xl font-bold text-gray-100 mb-5">Login</h1>
                        <form onSubmit={handleSubmit} className="bg-gray-900 p-4 md:p-5 rounded-lg shadow-lg border border-gray-800 w-full max-w-md">
                            <div className="p-5 bg-gray-800 border border-gray-800  rounded-md flex flex-col gap-3">
                                <Label labelName="email">
                                    Email
                                    <Input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        placeholder="example@example.com"
                                        onChange={handleChange}
                                    />
                                </Label>
                                <Label labelName="password">
                                    Password
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        minL={10}
                                        maxL={20}
                                    />
                                </Label>
                                {error !== '' && (
                                    <Error>
                                        {error}
                                    </Error>
                                )}
                                <p className="mt-3 text-gray-400 text-sm">
                                    Don't have an account? <Link to={'/register'} className="text-blue-500 hover:underline">Sign up</Link>
                                </p>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-800 text-gray-100 p-2 rounded-md mt-3 hover:bg-gray-700 transition"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </div>
                </> : <>
                <div className="flex flex-col gap-3">
                <Error>Already logged in
                </Error>
                <BackButton></BackButton>
                </div>
                </>
            }
        </>
    )
}



export default LoginForm