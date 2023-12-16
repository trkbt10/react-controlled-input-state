import React, { forwardRef } from "react";
import ReactSelect, { Options } from "react-select";
import {
  ValueConverter,
  useControlledInputState,
} from "../src/useControlledInputState";
import { useMergedRef } from "../src/useMergedRef";
import { traverse } from "../src/traverse";
export type Option = {
  label: string;
  value: string;
};
export type Group = {
  label: string;
  options: GroupsOrOptions;
};
type GroupsOrOptions = (Option | Group)[];
const converter: ValueConverter<Option> = {
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
    return {
      value: "",
      label: "",
    };
  },
};
function useSyncSelectOptions(): [
  Options<any> | undefined,
  React.RefObject<HTMLSelectElement>
] {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [reactSelectOptions, setReactSelectOptions] =
    React.useState<Options<any>>();
  React.useLayoutEffect(() => {
    const select = selectRef.current;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }
    const mutationObserver = new MutationObserver((mutations) => {
      const items = traverse(select.children);
      setReactSelectOptions(items);
    });
    const items = traverse(select.children);
    mutationObserver.observe(select, {
      childList: true,
      subtree: true,
    });
    setReactSelectOptions(items);
    return () => {
      mutationObserver.disconnect();
    };
  }, [setReactSelectOptions]);
  return [reactSelectOptions, selectRef] as const;
}
export const Select = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["select"]
>(({ onChange, value, defaultValue, ...props }, forwardRef) => {
  const [reactSelectOptions, selectRef] = useSyncSelectOptions();
  const ref = useMergedRef(selectRef, forwardRef);
  const [currentValue, setCurrentValue, bind] = useControlledInputState<
    HTMLSelectElement,
    Option
  >(
    {
      ...props,
      ref,
    },
    converter
  );
  const handleChange: React.ComponentProps<typeof ReactSelect>["onChange"] = (
    newValue,
    actionMeta
  ) => {
    setCurrentValue(newValue as any);
  };
  return (
    <>
      <ReactSelect<any>
        options={reactSelectOptions}
        placeholder={props["aria-placeholder"]}
        onChange={handleChange}
        value={currentValue}
      ></ReactSelect>
      <select {...bind}>{props.children}</select>
    </>
  );
});
Select.displayName = "Select";

export const App = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>();

  return (
    <form
      onInput={(e) => {
        if (e.currentTarget["name"] === "options") {
          setSelectedValue(e.currentTarget.value);
        }
      }}
    >
      <h1>React Select</h1>
      <Select aria-placeholder="Select a value" name="options">
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
