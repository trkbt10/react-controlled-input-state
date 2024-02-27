# useControlledInputState

This is a hook designed to provide `<input />`-like behavior for React components with complex UIs in their input screens.

## Background

Typically, so-called controlled inputs cannot trigger events like onChange.  
Therefore, many libraries add their own callbacks, similar to onChange, to achieve similar functionality.
However, these bespoke callbacks frequently embody specific functionalities or implementations, tending to diminish their general utility and consequently steepening the learning curve.
Additionally, because it's difficult to treat them the same as regular input elements, compatibility issues can sometimes lead to the decision not to use certain libraries.
By using this hook, you can handle elements as usual and unify the interface, making maintenance easier.

## Usage

This hook aims to apply code that manages input in React, like the following, to other components:

```typescript
const Sample = () => {
  const [value, setValue] = React.useState<string>("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

For instance, if there's a CustomInput with a complex input form, even if onChange only returns a string, you can wrap the input screen with this hook to handle it like <input />.

```typescript
import React from "react";
import { useControlledInputState } from "react-controlled-input-state";
import { CustomInput } from "!!something-react-ui-library!!";
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const ControlledInput = (props: InputProps) => {
  const [currentValue, setCurrentValue, bind] =
    useControlledInputState<HTMLInputElement>(props);

  return (
    <>
      <CustomInput
        options={[
          {
            type: "",
          },
        ]}
        value={currentValue}
        onChange={setCurrentValue}
      ></CustomInput>
      <input {...bind}></input>
    </>
  );
};
```

This can be handled like a regular controlled input:

```typescript
function Input() {
  const [value, setValue] = React.useState<string>("");
  return (
    <CustomInput value={value} onChange={(e) => setValue(e.target.value)} />
  );
}
```

It also works similarly when placed under a form:

```typescript
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(e.target);
    formData.get("hello"); // 'world'
  };
  return (
    <form onSubimt={handleSubmit}>
      <ControlledInput name="hello" defaultValue="world" />
    </form>
  );
}
```
