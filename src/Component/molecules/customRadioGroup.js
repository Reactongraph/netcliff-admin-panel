const CustomRadioGroup = ({ options, value, onChange, label, error, disabled }) => {
    return (
        <div className="mb-4">
            <label className=" styleForTitle movieForm">
                {label}
            </label>
            <div className="d-flex gap-4">
                {options.map((option) => (
                    <div className="form-check" key={option.value}>
                        <input
                            type="radio"
                            id={option.value}
                            name={label}
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="form-check-input"
                            disabled={disabled}
                        />
                        <label
                            className={`form-check-label ${disabled ? 'text-muted' : ''}`}
                            htmlFor={option.value}>
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {error && <span className="text-danger">{error}</span>}
        </div>
    );
};

export default CustomRadioGroup;