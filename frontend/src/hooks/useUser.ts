import { Token, User, LoginResponse, Email, ApiResponse, UserToken } from '../interfaces/models'
import { jwtDecode } from 'jwt-decode'
import { User_Service } from '../api/user.service'
import { SetStateAction } from 'react'
import toast from 'react-hot-toast'


interface UseUserProps {
    setError: React.Dispatch<SetStateAction<string>>
    setUser: React.Dispatch<SetStateAction<User | null>>
    isEdited: boolean
    setIsEdited: React.Dispatch<SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>
}

const useUser = ({ setError, setUser, setIsEdited, setIsLoggedIn }: UseUserProps) => {

    const isAuthenticated = async (): Promise<boolean> => {
            const { data } = await User_Service.isAuthenticated()
            return data.authenticated
    }

    const checkExpiration = (token: Token) => {
        if (!token || token === null) {
            return false
        }
        //check expiration
        const decoded = jwtDecode<{ exp: number }>(token as string)
        if (!decoded || !decoded.exp) return false;

        return Date.now() / 1000 < decoded.exp
    }

    const login = async (email: User['email'], password: string): Promise<LoginResponse> => {
        //session in cookies
        const { error: apiError, message } = await User_Service.login(email, password)

        if (apiError) {
            setError(message)
            return { error: apiError, message: message }
        }

        setIsLoggedIn(true)
        setIsEdited(false)
        //localStorage.setItem('token', apiToken as string)
        return { error: apiError, message: message }
    }

    const logout = async () => {
        const { error: apiError, message } = await User_Service.logout()

        if (apiError) {
            setError(message)
            return { error: apiError, message: message }
        }

        clearState()
        toast.success('Logged out succesfully', {
            style: {
                backgroundColor: '#374151',
                color: 'white'
            }
        })
    }

    const clearState = () => {
        setIsEdited(false)
        setIsLoggedIn(false)
        setUser(null)
        sessionStorage.removeItem('user')
        localStorage.removeItem('notes')
    }

    const createAccount = async (form: Record<string, string>): Promise<LoginResponse> => {
        if (form.firstPassword !== form.secondPassword) {
            toast.error("Passwords must match", {
                style: {
                    backgroundColor: '#374151',
                    color: 'white'
                }
            }) // ✅ Mensaje más claro
            return { error: true, message: 'Passwords must match' }
        }

        const { error, message } = await User_Service.createAccount(
            form.username,
            form.email as Email,
            form.firstPassword
        )

        if (error) {
            setError(message)
            return { error: true, message: message }
        }

        return { error: error, message: message }
    }


    const getProfile = async () => {
        console.log('antes de entrar al try')
        try {
          // Obtener usuario en cache
          const cachedUser = sessionStorage.getItem("user");

          if (cachedUser) {
            setUser(JSON.parse(cachedUser as string));
            return;
          }
      
          // Petición a la API
          console.log('get profile req antes')
          const { error: apiError, message, data: userProfile } = await User_Service.getProfile() as ApiResponse<UserToken>; 
          console.log('get profile res despues', {
            error: apiError,
            user: userProfile,
            message: message
          })
          if (apiError) {
            setError(message);
            return;
          }
      
          if (!userProfile) {
            console.warn("User profile is null or undefined.");
            return;
          }
          const user : User = {
            id: userProfile.id,
            username: userProfile.username ?? "Guest",
            email: userProfile.email ?? "unknown",
            isAdmin: userProfile.isAdmin ?? false,
            isVerified: userProfile.email_verified 
          };
      
          sessionStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      

    const saveUsername = async (username: string) => {
        if (!username || username.trim() === '') {
            toast.error('Enter a new username', {
                style: {
                    backgroundColor: '#374151',
                    color: 'white'
                }
            })
            return
        }

        const { error: apiError, message } = await User_Service.changeUsername(username)
        //Lo tengo que cambiar en el sessionStorage tambien

        const cachedUser = sessionStorage.getItem('user');
        const user = JSON.parse(cachedUser as string)
        const updatedUser = {
            ...user,
            username: username
        }

        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        if (apiError) {
            setError(message)
            return
        }

        return { error: apiError, message: message }
    };

    const handleChangePassword = async (originalPassword: string, newPassword: string) : Promise<LoginResponse | undefined> => {
        // Add logic to save password
        const { error: apiError, message } = await User_Service.changePassword(originalPassword, newPassword)
        if (apiError) {
            console.error(message)
            setError(message)
            return
        }

        console.log('Password changed:', newPassword);
        toast.success('Password changed succesfully', {
            style: {
                backgroundColor: '#374151',
                color: 'white'
            }
        })
        
        return { error: apiError, message: message }
    };

    const handleDeleteAccount = async (passwordAccount: string)  => {
        logout()

        const { error: apiError, message } = await User_Service.deleteAccount(passwordAccount)
        if (apiError) {
            console.error(message)
            setError(message)
            return
        }

        toast.success('Account succesfully deleted', {
            style: {
                backgroundColor: '#374151',
                color: 'white'
            }
        })
    };


    return {
        login,
        checkExpiration,
        logout,
        createAccount,
        getProfile,
        saveUsername,
        handleChangePassword,
        handleDeleteAccount,
        isAuthenticated
    }
}

export default useUser