import { useUserContext } from '../../hooks/useUserContext';
import React, { useEffect, useState } from 'react';
import Error from '../Reusable/Error';
import DangerZone from './DangerZone';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';
import toast from 'react-hot-toast';
import { LoginResponse } from '../../interfaces/models';
import Notes from './Notes';
import { useAppContext } from '../../hooks/useAppContext';
import { Toaster } from 'react-hot-toast';
import { User } from '../../interfaces/models';
import NoteTip from '../Reusable/NoteTip';
import { User_Service } from '../../api/user.service';
import { Email } from '../../interfaces/models';
import { useNavigate } from 'react-router-dom';

export interface PasswordState {
  originalPassword: string;
  firstPassword: string;
  secondPassword: string;
}

const initialPasswordState: PasswordState = {
  originalPassword: '',
  firstPassword: '',
  secondPassword: '',
};

export const titleStyles = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400';


const Account = () => {
  const nav = useNavigate()
  const { getProfile, user, saveUsername, isLoggedIn, setUser, handleChangePassword, error, handleDeleteAccount } = useUserContext();
  const { setNotes, setNote, fetchUserNotes, notes } = useAppContext();
  const [username, setUsername] = useState<string>(user?.username || '');
  const [submiting, setSubmiting] = useState(false)
  const [password, setPassword] = useState<PasswordState>(initialPasswordState);
  const [passwordAccount, setPasswordAccount] = useState<PasswordState>(initialPasswordState);


  // Fetch the user's profile data
  const fetchProfileData = async () => {

    try {
      if (isLoggedIn) {
        await getProfile();
      }
    } catch (err) {
      console.error(err)
    }
  };

  // Save the new username
  const handleSaveUsername = async (e: React.FormEvent): Promise<string | undefined> => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (username === user?.username) {
      return toastError('Specify a new username')
    }

    const { error, message } = await saveUsername(username) as LoginResponse;

    if (error) {
      return toastError(message);
    }

    toast.success('Username changed successfully');
    setUsername('');
    setUser((prev) => ({ ...prev, username }) as User);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<PasswordState>>) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const toastError = (msg?: string) => {
    return toast.error(msg ?? 'An unexpected error occurred', {
      style: {
        backgroundColor: '#374151',
        color: 'white'
      }
    })
  }


  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add logic to save password TODO
    if (!password.originalPassword || password.originalPassword.trim() === '') {
      return toastError('Please enter your original password')
    }

    if (!password.firstPassword ||
      password.firstPassword.trim() === '' ||
      !password.secondPassword || password.firstPassword.trim() === ''
    ) {
      return toastError("Please enter your new password twice")
    }

    if (password.firstPassword !== password.secondPassword) {
      return toastError("Passwords must match")
    }

    await handleChangePassword(password.originalPassword, password.firstPassword) as LoginResponse

    setPassword(initialPasswordState)
  }

  const onDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordAccount.firstPassword ||
      passwordAccount.firstPassword.trim() === '' ||
      !passwordAccount.secondPassword || passwordAccount.firstPassword.trim() === ''
    ) {
      return toastError("Please enter your password twice")
    }

    if (passwordAccount.firstPassword !== passwordAccount.secondPassword) {
      return toastError("Passwords must match")
    }

    await handleDeleteAccount(passwordAccount.firstPassword)
  };


  useEffect(() => {
    if (isLoggedIn && (!notes || notes.length === 0)) {
      fetchUserNotes()
    }
  }, [isLoggedIn])

  useEffect(() => {
    console.log(user)
    if (isLoggedIn) {
      fetchProfileData();
    }
  }, [isLoggedIn]);

  const resendEmail = async () => {
    return await User_Service.resendVerificationEmail(user?.email as Email)
  }

  const sendVerificationEmail = async () => {
    if(error){
      return
    }

    setSubmiting(true)
    await toast.promise(
      resendEmail(),
      {
        loading: 'Sending verification email...',
        success: <b>Verification email sent!</b>,
        error: (error) => <b>{error.message ?? 'Failed to send verification email'}</b>,
    }
    , {
        style: {
            backgroundColor: '#374151',
            color: 'white'
        }
    }
    )
    setSubmiting(false)
    //Si la url es localhost/account me lleva a localhost/verify-email o a localhost/account/verify-email?
    if(!error) nav('/verify-email')
    
  }

  return (
    <div className="p-5">
      <Toaster />
      <h1 className={`${titleStyles} text-4xl mb-6`}>Account Management</h1>
      <div className="flex flex-col gap-5">
        {!user?.isVerified && isLoggedIn ? <NoteTip>
          <div className='flex flex-col gap-3'>
          This account hasn´t been verified yet. 
          <button onClick={sendVerificationEmail} className='text-gray-300'
            disabled={submiting}
          >Verify your account</button>
          </div>
        </NoteTip> : <></>}
        
        <Notes notes={notes} setNote={setNote} setNotes={setNotes} />
        {user ? (
          <>
            <div className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-800">
              <h2 className={`${titleStyles} text-2xl mb-4`}>{user.username}</h2>
              <UsernameForm
                username={username}
                onChange={handleUsernameChange}
                onSave={(e) => handleSaveUsername(e)}
              />
              <PasswordForm
                password={password}
                onChange={(e) => handlePasswordChange(e, setPassword)}
                onSave={onChangePassword}
                error={error}
              />
            </div>
            <DangerZone
              passwordAccount={passwordAccount}
              onChange={(e) => handlePasswordChange(e, setPasswordAccount)}
              onDelete={onDeleteAccount}
              error={error}
            />
          </>
        ) : (
          <Error>{'No profile data found'}</Error>
        )}
      </div>
    </div>
  );
};


export default Account;