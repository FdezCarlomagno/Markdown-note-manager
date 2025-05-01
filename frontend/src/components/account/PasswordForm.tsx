import { PasswordState } from "./Account";
import Label from "../Reusable/Label";
import Input from "../Reusable/Input";
import Error from "../Reusable/Error";

interface PasswordFormProps {
    password: PasswordState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: (e: React.FormEvent) => void;
    error: string
}

const PasswordForm = ({ password, onChange, onSave, error }: PasswordFormProps) => (
    <div >
        <form onSubmit={onSave} className="p-5 bg-gray-800 border border-gray-600 rounded-md flex flex-col gap-3">
        <h2 className="text-bold text-2xl pb-3 border border-b-1 border-gray-400 border-t-0 border-r-0 border-l-0">Change password</h2>
        <Label labelName="originalPassword">
                Original password
                <div className="flex gap-3 items-center">
                    <Input
                        type="password"
                        name="originalPassword"
                        value={password.originalPassword}
                        onChange={onChange}
                        placeholder="Enter your original password"
                    />
                </div>
            </Label>
            <Label labelName="firstPassword">
                New password
                <div className="flex gap-3 items-center">
                    <Input
                        type="password"
                        name="firstPassword"
                        value={password.firstPassword}
                        onChange={onChange}
                        placeholder="Enter your new password"
                    />
                </div>
            </Label>
            <Label labelName="secondPassword">
                Repeat new password
                <div className="flex gap-3 items-center">
                    <Input
                        type="password"
                        name="secondPassword"
                        value={password.secondPassword}
                        onChange={onChange}
                        placeholder="Repeat your new password"
                    />
                </div>
                {error !== '' ? <Error>
                    {error}
                </Error> : <></>}
                <button className="btn mt-3" type="submit">
                    Save
                </button>
            </Label>
        </form>
    </div>
);

export default PasswordForm