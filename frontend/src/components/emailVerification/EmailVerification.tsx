import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User_Service } from '../../api/user.service';
import LoadingSpinner from '../Reusable/LoadingSpinner'; // Add a loading spinner component

enum VerifyStates {
  IDLE,
  VERIFYING,
  VERIFIED,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
  SERVER_ERROR,
}

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifyState, setVerifyState] = useState<VerifyStates>(VerifyStates.IDLE);
  const [countdown, setCountdown] = useState(5);

  const handleRedirect = () => {
    navigate('/login', { replace: true }); // Use replace to prevent back navigation
  };

  const verifyEmail = async () => {
    console.log("Token from params", token)
    if (!token) {
      setVerifyState(VerifyStates.INVALID_TOKEN);
      return;
    }

    try {
      setVerifyState(VerifyStates.VERIFYING);
      const { error, message } = await User_Service.verifyEmail(token, "");

      if (error) {
        switch (message) {
          case 'Invalid verification token':
            setVerifyState(VerifyStates.INVALID_TOKEN);
            break;
          case 'Verification link expired':
            setVerifyState(VerifyStates.EXPIRED_TOKEN);
            break;
          default:
            setVerifyState(VerifyStates.SERVER_ERROR);
        }
        return;
      }

      setVerifyState(VerifyStates.VERIFIED);
    } catch (error) {
      setVerifyState(VerifyStates.SERVER_ERROR);
    }
  };

  useEffect(() => {
    if (!token) {
      setVerifyState(VerifyStates.INVALID_TOKEN);
      return;
    }
    verifyEmail();
  }, [token]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verifyState >= VerifyStates.INVALID_TOKEN) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verifyState]);

  useEffect(() => {
    if (countdown === 0 && verifyState >= VerifyStates.INVALID_TOKEN) {
      handleRedirect();
    }
  }, [countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Email Verification</h1>
      
      {verifyState === VerifyStates.IDLE && (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <p>Initializing verification...</p>
        </div>
      )}

      {verifyState === VerifyStates.VERIFYING && (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <p>Verifying your email...</p>
        </div>
      )}

      {verifyState === VerifyStates.VERIFIED && (
        <div className="text-center space-y-4">
          <div className="text-green-500 text-2xl">
            ✓ Email Verified Successfully!
          </div>
          <p className="text-gray-300">
            Redirecting to login in {countdown} seconds...
          </p>
        </div>
      )}

      {verifyState === VerifyStates.INVALID_TOKEN && (
        <div className="text-center space-y-4">
          <div className="text-red-500 text-2xl">
            ✗ Invalid Verification Link
          </div>
          <p className="text-gray-300">
            Redirecting to login in {countdown} seconds...
          </p>
        </div>
      )}

      {verifyState === VerifyStates.EXPIRED_TOKEN && (
        <div className="text-center space-y-4">
          <div className="text-yellow-500 text-2xl">
            ⚠ Verification Link Expired
          </div>
          <p className="text-gray-300">
            Redirecting to login in {countdown} seconds...
          </p>
        </div>
      )}

      {verifyState === VerifyStates.SERVER_ERROR && (
        <div className="text-center space-y-4">
          <div className="text-red-500 text-2xl">
            ⚠ Server Error
          </div>
          <p className="text-gray-300">
            Please try again later. Redirecting in {countdown} seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;