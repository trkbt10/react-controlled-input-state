import React, { forwardRef } from "react";
import ReactSelect from "react-select";
import {
  ValueConverter,
  useControlledInputState,
} from "../src/useControlledInputState";
import { useMergedRef } from "../src/useMergedRef";
import { type Option } from "../src/traverseOptionsForSelectElement";
import { useSelectElementOptions } from "../src/useSelectElementOptions";
const converter: ValueConverter<Option | undefined> = {
  from: (value) => {
    return value?.value;
  },
  to: (value) => {
    if (typeof value === "string") {
      return {
        value,
        label: value,
      };
    }
    return;
  },
};
export const Select = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["select"]
>(({ ...props }, forwardRef) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const options = useSelectElementOptions(selectRef);
  const ref = useMergedRef(selectRef, forwardRef);
  const [currentValue, setCurrentValue, bind] = useControlledInputState<
    HTMLSelectElement,
    Option | undefined
  >(
    {
      ...props,
      ref,
    },
    converter
  );
  return (
    <>
      <ReactSelect<any>
        options={options}
        placeholder={props["aria-placeholder"]}
        onChange={setCurrentValue}
        value={currentValue}
      ></ReactSelect>
      <select {...bind}>{props.children}</select>
    </>
  );
});
Select.displayName = "Select";

export const ReactSelectExample = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>();

  return (
    <form
      onInput={(e) => {
        console.log(e.currentTarget.value);
        if (e.currentTarget["name"] === "options") {
          setSelectedValue(e.currentTarget.value);
        }
      }}
    >
      <h1>React Select</h1>
      <Select
        aria-placeholder="Select a value"
        name="options"
        onChange={(e) => {
          console.log(e);
        }}
      >
        <optgroup label="Group 1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </optgroup>
        <optgroup label="Group 2">
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
        </optgroup>
      </Select>
      <output>{selectedValue}</output>
    </form>
  );
};
