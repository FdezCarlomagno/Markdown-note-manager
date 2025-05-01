import { Note } from "../../interfaces/models";
import trashIcon from '../../assets/trash.svg';
import { useAppContext } from "../../hooks/useAppContext";

interface DeleteButtonProps {
    id: Note['id'];
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
    const { handleDelete } = useAppContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent parent click events
        if (id) {
            handleDelete(id);
        } 
    };

    return (
        <div>
            <button onClick={handleClick}>
                <img
                    className='w-[40px] h-auto p-2 py-1 text-xs md:text-sm text-red-400 hover:text-red-300'
                    src={trashIcon}
                    alt="Delete item"
                />
            </button>
        </div>
    );
};

export default DeleteButton;