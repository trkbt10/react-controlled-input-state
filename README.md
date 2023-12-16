# useControlledInputState

これは、複雑な UI を持つ React コンポーネントの入力画面でも、HTML の Input 要素と同じように扱う事を可能にする hooks です

## 背景

この Hooks は、下記のような React による input を操作するコードを、他のコンポーネントにも適用することを目的としています

```typescript
const Sample = () => {
  const [value, setValue] = React.useState<string>("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

例えば、複雑な入力フォームを有する CustomInput があるとして、onChange からは文字列のみが返ってくる場合でも、
この hooks を使うだけで、Input 要素と同じように扱う事ができます

```typescript
import React from "react";
import { useControlledInputState } from "react-controlled-input-state";
import { CustomInput } from "!!something-react-ui-library!!";
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const ControlledInput = (props: InputProps) => {
  const [currentValue, setCurrentValue, bind] =
    useControlledInputState<HTMLInputElement>(props, reactSelectConverter);

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

これは、通常の controlled-input と同様に扱う事ができます

```typescript
function Input() {
  const [value, setValue] = React.useState<string>("");
  return (
    <CustomInput value={value} onChange={(e) => setValue(e.target.value)} />
  );
}
```

また、form 配下に設置した場合でも同様に動作します

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
