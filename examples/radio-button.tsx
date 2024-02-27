import * as React from "react";
import { useControlledInputState } from "../src";

const defaultOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
export function RadioButton(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    options?: typeof defaultOptions;
  }
) {
  const options = props.options || defaultOptions;
  const [currentValue, setCurrentValue, bind] = useControlledInputState<
    HTMLInputElement,
    string
  >(props);
  const handleSelect: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const value = e.currentTarget.value;
        setCurrentValue(value);
      },
      [setCurrentValue]
    );
  const controlled = props.value !== undefined;

  return (
    <>
      <i id="element-stats">element: {controlled ? "" : "un"}controlled</i>
      <br />
      <i id="current">{currentValue}</i>
      <div>
        <fieldset>
          <legend>Prease choose an option:</legend>
          {options.map((option, i) => {
            return (
              <div key={i}>
                <input
                  type="radio"
                  id={option.value}
                  name={props.name}
                  value={option.value}
                  {...(controlled
                    ? {
                        checked: currentValue === option.value ? true : false,
                      }
                    : {
                        defaultChecked: props.defaultValue === option.value,
                      })}
                  onChange={handleSelect}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            );
          })}
        </fieldset>
        <output>output: {currentValue}</output>
      </div>
      <input type="text" {...bind} />
    </>
  );
}
