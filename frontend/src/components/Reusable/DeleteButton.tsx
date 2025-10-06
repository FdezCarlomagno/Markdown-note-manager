import { Note } from "../../interfaces/models";
import trashIcon from '../../assets/trash.svg';
import { useAppContext } from "../../hooks/useAppContext";

interface DeleteButtonProps {
    id: Note['id'];
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
    const { handleDelete } = useAppContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (id) {
            handleDelete(id);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="
                w-10 h-10 flex items-center justify-center 
                rounded-full border-none
                bg-red-900
                shadow-md hover:shadow-lg
                transform active:scale-95 
                transition-all duration-200"
        >
            <img
                className="w-6 h-6"
                src={trashIcon}
                alt="Delete item"
            />
        </button>
    );
};

export default DeleteButton;
