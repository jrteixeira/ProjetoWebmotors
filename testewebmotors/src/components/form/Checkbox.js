import React from 'react';

const Checkbox = ({ value, setValue, name }) => {
  return (
    <>
      <input
        type="checkbox"
        value={value}
        checked={value}
        onChange={({ target }) => setValue(target.checked)}
      />
      <label htmlFor="">{name}</label>
    </>
  );
};

export default Checkbox;
