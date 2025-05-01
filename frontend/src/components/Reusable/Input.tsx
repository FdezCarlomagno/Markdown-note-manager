interface InputProps {
    type?: string
    placeholder?: string
    name: string
    value: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    minL?: number
    maxL?: number
    defaultValue?: string
}

const Input = ({ 
    type = 'text', 
    placeholder, 
    name, 
    value, 
    onChange, 
    minL, 
    maxL, 
    defaultValue 
}: InputProps ) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className="font-normal w-full p-2 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            maxLength={maxL}
            minLength={minL}
            defaultValue={defaultValue}
            required
        />
    );
}

export default Input;
