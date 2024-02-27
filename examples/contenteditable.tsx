import * as React from "react";
import { useControlledInputState } from "../src";
export function ContentEditable(props: React.PropsWithChildren<{}>) {
  const [value, setValue] = React.useState<string>("Hello World");
  return (
    <form>
      <EditableH1
        onChange={(e) => {
          console.log(e);
          setValue(e.target.value);
        }}
        defaultValue="Hello World"
      ></EditableH1>
      <output>{value}</output>
      <input type="text" onChange={console.log} />
    </form>
  );
}
function EditableH1(
  props: React.PropsWithChildren<{
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    defaultValue: string;
  }>
) {
  const [value, setValue, bind] = useControlledInputState({
    ...props,
  });

  return (
    <div>
      <h1
        contentEditable
        dangerouslySetInnerHTML={{
          __html: props.defaultValue,
        }}
        onInput={(e) => {
          setValue(e.currentTarget.textContent || "");
        }}
      ></h1>
      <input type="text" {...bind} />
    </div>
  );
}
