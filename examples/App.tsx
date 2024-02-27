import * as React from "react";
import { RadioButton } from "./radio-button";
import type { Option } from "../src/traverseOptionsForSelectElement";
import { ReactSelectExample, Select } from "./react-select";
import { ContentEditable } from "./contenteditable";
export function App(props: React.PropsWithChildren<{}>) {
  const captureChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((e) => {
      console.log("catch", e);
    }, []);
  const [options, setOptions] = React.useState<Option[]>(() => [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ]);
  const hash = React.useMemo(() => {
    return window.location.hash.slice(1);
  }, []);
  console.log(hash);
  if (hash === "/contentEditable") {
    return <ContentEditable></ContentEditable>;
  }
  return (
    <div>
      <RadioButton
        name="name"
        defaultValue="strawberry"
        onChange={captureChange}
        options={options}
      ></RadioButton>
      {/*
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!(e.currentTarget instanceof HTMLFormElement)) {
            return;
          }
          const option = e.currentTarget.new_option.value;
          if (!option) {
            return;
          }
          const upperFirst = option.split(/\s+/).reduce((prev, curr) => {
            return prev + curr[0].toUpperCase() + curr.slice(1);
          }, "");
          const lower = option.toString().toLowerCase();
          setOptions((prev) => {
            return [...prev, { value: lower, label: upperFirst }];
          });
        }}
      >
        <input type="text" placeholder="taste" name="new_option" />
        <button type="submit">Add Option</button>
      </form> */}
      <ReactSelectExample></ReactSelectExample>
    </div>
  );
}
