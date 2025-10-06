import { ReactNode } from "react";

interface LabelProps {
    children: ReactNode,
    labelName: string
}

const Label = ({ labelName = 'text', children } : LabelProps ) => {
    return (
        <label htmlFor={labelName} className="flex flex-col text-gray-100">
            { children } 
        </label>
    )
}

export default Label