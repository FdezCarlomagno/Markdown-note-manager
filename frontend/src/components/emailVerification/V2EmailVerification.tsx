import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../../hooks/useUserContext";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { User_Service } from "../../api/user.service";
import { Email, User } from '../../interfaces/models';

enum VerifyStates {
  IDLE,
  VERIFYING,
  VERIFIED,
  INVALID_CODE,
  EXPIRED_CODE,
  SERVER_ERROR,
}

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const { registeredEmail, setRegisteredEmail } = useUserContext();
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyStates>(VerifyStates.IDLE);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [emailLoaded, setEmailLoaded] = useState(false);

  // Cargar el email desde sessionStorage y redirigir si no existe
  useEffect(() => {
    const cachedUser = sessionStorage.getItem('user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser) as User;
      setRegisteredEmail(user.email);
    }
    setEmailLoaded(true);
  }, [setRegisteredEmail]);

  // Si ya se cargó el email pero sigue sin existir, redirigir a registro
  useEffect(() => {
    if (emailLoaded && !registeredEmail) {
      navigate('/register', { replace: true });
    }
  }, [emailLoaded, registeredEmail, navigate]);

  const handleRedirect = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const verifyEmail = useCallback(async () => {
    if (verificationCode.length !== 6) {
      setVerifyState(VerifyStates.INVALID_CODE);
      return;
    }
    try {
      setIsLoading(true);
      setVerifyState(VerifyStates.VERIFYING);

      const { error, message } = await User_Service.verifyEmail(registeredEmail as string, verificationCode);

      if (error) {
        if (message === "Invalid verification code") {
          setVerifyState(VerifyStates.INVALID_CODE);
        } else if (message === "Verification code expired") {
          setVerifyState(VerifyStates.EXPIRED_CODE);
        } else {
          setVerifyState(VerifyStates.SERVER_ERROR);
        }
        return;
      }

      setVerifyState(VerifyStates.VERIFIED);
      // Iniciar cuenta regresiva para redirigir
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setVerifyState(VerifyStates.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, registeredEmail, handleRedirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmail();
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await User_Service.resendVerificationEmail(registeredEmail as Email);
      setVerificationCode('');
      setVerifyState(VerifyStates.IDLE);
    } catch (error) {
      setVerifyState(VerifyStates.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Mientras se carga el email, mostramos un spinner
  if (!emailLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const renderContent = () => {
    switch (verifyState) {
      case VerifyStates.IDLE:
        return (
          <div className="space-y-6">
            <div className="mb-6 text-center">
              <p className="text-gray-300">We've sent a verification code to:</p>
              <p className="text-white font-medium mt-1">{registeredEmail}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading || verificationCode.length !== 6
                    ? 'bg-blue-600 opacity-50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <p className="text-sm text-gray-400 text-center mt-4 flex gap-2 items-center">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed p-2"
              >
                Resend Code
              </button>
            </p>
          </div>
        );
      case VerifyStates.VERIFYING:
        return (
          <div className="flex items-center gap-3">
            <LoadingSpinner />
            <p className="text-lg">Verifying your email...</p>
          </div>
        );
      case VerifyStates.VERIFIED:
        return (
          <>
            <div className="text-green-400 text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-400">Redirecting to login in {countdown} seconds...</p>
          </>
        );
      case VerifyStates.INVALID_CODE:
        return (
          <>
            <div className="text-red-400 text-4xl mb-4">✗</div>
            <h2 className="text-2xl font-bold mb-2">Invalid Verification Code</h2>
            <p className="text-gray-400">Please try again with the correct code.</p>
          </>
        );
      case VerifyStates.EXPIRED_CODE:
        return (
          <>
            <div className="text-yellow-400 text-4xl mb-4">⚠</div>
            <h2 className="text-2xl font-bold mb-2">Verification Code Expired</h2>
            <p className="text-gray-400">Please request a new code.</p>
          </>
        );
      case VerifyStates.SERVER_ERROR:
        return (
          <>
            <div className="text-red-400 text-4xl mb-4">⚠</div>
            <h2 className="text-2xl font-bold mb-2">Server Error</h2>
            <p className="text-gray-400">Please try again later.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Email Verification</h1>
        <div className="p-5 bg-gray-800 border border-gray-700 rounded-md flex flex-col items-center gap-3">
          {renderContent()}
        </div>
        {(verifyState !== VerifyStates.IDLE && verifyState !== VerifyStates.VERIFYING) && (
          <button
            onClick={handleRedirect}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 w-full"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
