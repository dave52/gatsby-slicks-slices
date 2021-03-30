import { useState } from 'react';

export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // check if its a number and convert
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = parseInt(e.target.value);
    }
    setValues({
      // copy the existing values into it, everything currently in state
      ...values,
      // update the new value that changed...
      // and make property name dynamic and set to e.target.value
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
