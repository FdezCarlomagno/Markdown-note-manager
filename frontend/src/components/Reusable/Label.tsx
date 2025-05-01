import { ReactNode } from "react";

interface LabelProps {
    children: ReactNode,
    labelName: string
}

const Label = ({ labelName = 'text', children } : LabelProps ) => {
    return (
        <label htmlFor={labelName} className="flex flex-col gap-2 text-gray-100">
            { children } 
        </label>
    )
}

export default Label