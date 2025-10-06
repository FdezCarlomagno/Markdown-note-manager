
interface Props {
  onSave: () => Promise<void>;
}

const SaveButton = ({ onSave }: Props) => {
  return (
    <button
      className="!px-10 btn "
      onClick={onSave}
      id="saveBtn"
    >
      Save
    </button>
  );
};

export default SaveButton;
