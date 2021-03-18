import React from 'react';

const Select = ({
  options,
  value,
  setValue,
  required,
  selectName,
  all,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={({ target }) => setValue(target.value)}
      {...props}
      required={required}
    >
      <option value="" disabled>
        {selectName ? selectName : 'Selecione'}
      </option>
      {all ? <option value="0">todos</option> : ''}
      {options.map((option) => (
        <option key={option.ID} value={option.ID}>
          {option.Name}
        </option>
      ))}
    </select>
  );
};

export default Select;
