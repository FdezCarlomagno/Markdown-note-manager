import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../hooks/useUserContext";
import { Email } from "../../interfaces/models";
import { User_Service } from "../../api/user.service";
import { toast, Toaster } from "react-hot-toast";
import Label from "../Reusable/Label";
import Input from "../Reusable/Input";
import Error from "../Reusable/Error";
import EmailVerification from "../emailVerification/V2EmailVerification";

const initialForm = {
  username: "",
  email: "",
  firstPassword: "",
  secondPassword: "",
};

enum EmailStates {
  IDLE,
  SUBMITTING,
  SUCCEDED,
  ERROR
}

const RegisterForm = () => {
  const { error, setError, isLoggedIn, registeredEmail, setRegisteredEmail } = useUserContext();
  const [form, setForm] = useState(initialForm);
  const [sendEmail, setSendEmail] = useState<EmailStates>(EmailStates.IDLE);
  const [sentEmail, setSentEmail] = useState<boolean>(false)
  const nav = useNavigate();

  const toastStyles = {
    style: {
        backgroundColor: '#374151',
        color: 'white'
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  useEffect(() => {
    if (isLoggedIn) {
      nav("/");
    }
  }, [isLoggedIn, nav]);

  // Handler for form submission (account creation)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.firstPassword !== form.secondPassword) {
      toast.error("Passwords must match", toastStyles);
      return;
    }

    setSendEmail(EmailStates.SUBMITTING);

    // Call your account creation endpoint
    const { error : apiError, message } = await User_Service.createAccount(
      form.username,
      form.email as Email,
      form.firstPassword
    );

    if (apiError) {
      setSendEmail(EmailStates.ERROR);
      toast.error("Could not send verification code", toastStyles);
      setError(message);
      return;
    }
    
    // Save the email for resending later
    setRegisteredEmail(form.email);

    // Optionally, clear the form or keep the email to show confirmation details
    setForm(initialForm);
    setSendEmail(EmailStates.SUCCEDED);
    setSentEmail(true)
    toast.success("A verification code was sent to your email", toastStyles);
    setError("");
  };

  // New handler for resending the verification email
  const handleResendEmail = async () => {
    if (!registeredEmail) return;

    setSendEmail(EmailStates.SUBMITTING);

    // Assuming you have a dedicated endpoint or function to resend the verification email:
    const { error } = await User_Service.resendVerificationEmail(registeredEmail as Email);

    if (error) {
      setSendEmail(EmailStates.ERROR);
      toast.error("Could not resend verification code", toastStyles);
      return;
    }

    setSendEmail(EmailStates.SUCCEDED);
    toast.success("Verification code resent successfully", toastStyles);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <Toaster />
      <h1 className="text-4xl font-bold text-gray-100 mb-5">{sentEmail ? 'Verify your email' : 'Register'}</h1>
      {!sentEmail ? <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-4 md:p-5 rounded-lg shadow-lg border border-gray-800 w-full max-w-md"
      >
        <div className="p-5 bg-gray-800 border border-gray-800 rounded-md flex flex-col gap-3">
          <Label labelName="email">
            Email
            <Input
              type="email"
              placeholder="example@example.com"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Label>
          <Label labelName="username">
            Username
            <Input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </Label>
          <Label labelName="firstPassword">
            Password
            <Input 
              type="password"
              placeholder="Enter your password"
              name="firstPassword"
              value={form.firstPassword}
              onChange={handleChange}
              minL={10}
              maxL={20}
            />
          </Label>
          <Label labelName="secondPassword">
            Repeat password
            <Input 
              type="password"
              placeholder="Repeat your password"
              name="secondPassword"
              value={form.secondPassword}
              onChange={handleChange}
              minL={10}
              maxL={20}
            />
          </Label>
          {error !== "" && (
            <Error>
              {error}
            </Error>
          )}
          <p className="mt-3 text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
          <button
            disabled={sendEmail === EmailStates.SUBMITTING}
            type="submit"
            className="w-full bg-gray-800 text-gray-100 p-2 rounded-md mt-3 hover:bg-gray-700 transition"
          >
            {sendEmail === EmailStates.SUBMITTING  ? 'Sending verification email...' : 'Register'}
          </button>
        </div>
      </form> : <EmailVerification />}
      <div className="m-2">
      {/* Render the resend button if the email was sent successfully */}

      </div>
    </div>
  );
};

export default RegisterForm;
