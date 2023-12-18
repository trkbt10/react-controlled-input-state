import * as React from "react";
import { RadioButton } from "./radio-button";
import type { Option } from "../src/traverseOptionsForSelectElement";
import { Select } from "./react-select";
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
  return (
    <div>
      <RadioButton
        name="name"
        defaultValue="strawberry"
        onChange={captureChange}
        options={options}
      ></RadioButton>
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
      </form>
      <Select>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </Select>
    </div>
  );
}
