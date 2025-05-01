
interface Props {
    onSave: () => Promise<void>
}

const SaveButton = ({ onSave } : Props) => {
    return (
        <button
            className="btn"
            onClick={onSave}
            id="saveBtn"
        >
            Save
        </button>
    )
}

export default SaveButton