import Label from "../Reusable/Label";
import Input from "../Reusable/Input";

interface UsernameFormProps {
  username: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => Promise<string | undefined>;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ username, onChange, onSave }) => {
  return (
    <div className="p-5 bg-gray-800 border border-gray-600 rounded-md flex flex-col gap-3 mb-4">
      <form onSubmit={onSave}>
        <h2 className="text-bold text-2xl pb-3 border border-b-1 border-gray-400 border-t-0 border-r-0 border-l-0 mb-4">Change username</h2>
        <Label labelName="username">
            <div className="flex flex-col md:flex-row gap-3 items-center">
            <Input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your new username"
            />
            <button className="btn" type="submit">
              Save
            </button>
          </div>
        </Label>
      </form>
    </div>
  );
};

export default UsernameForm;