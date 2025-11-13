

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ThemedInput: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange
}) => {
  return (
    <div className="themed-input-group">
      <label className="themed-label">{label}</label>
      <input
        type={type}
        className="themed-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ThemedInput;