import Input from "../Reusable/Input";
import Label from "../Reusable/Label";
import { PasswordState } from "./Account";
import Error from "../Reusable/Error";


interface DangerZoneProps {
  passwordAccount: PasswordState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e : React.FormEvent) => void;
  error: string
}

const DangerZone = ({ passwordAccount, onChange, onDelete, error }: DangerZoneProps) => {
  
  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-800 ">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Delete account</h1>
      <p className="text-gray-500 mb-4">To delete your account, enter your password twice. This action cannot be undone.</p>
      <form onSubmit={onDelete} className="flex flex-col gap-3">
        <div className="p-5 bg-gray-800 border border-gray-600 rounded-md flex flex-col gap-3">
          <Label labelName="firstPasswordAcc">
            Enter Password
            <div className="flex gap-3 items-center">
              <Input
                type="password"
                name="firstPassword"
                value={passwordAccount.firstPassword}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </div>
          </Label>
          <Label labelName="secondPasswordAcc">
            Repeat Password
            <div className="flex gap-3 items-center">
              <Input
                type="password"
                name="secondPassword"
                value={passwordAccount.secondPassword}
                onChange={onChange}
                placeholder="Repeat your password"
              />
            </div>
          </Label>
          {error !== '' ? <Error>{error}</Error> : <></>}
          <button className="p-2 bg-red-800! text-white rounded-md mt-4" type="submit">
            Delete Account
          </button>
        </div>
      </form>
    </div>
  )

}

export default DangerZone
