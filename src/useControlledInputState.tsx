import React from "react";
import { useMergedRef } from "./useMergedRef";
import { usePrevious } from "./usePrevious";
import { compareTwoState } from "./compareTwoState";

const hideInputStyle = {
  display: "none",
};
type InputValue = React.InputHTMLAttributes<any>["value"];
export type ValueConverter<T> = {
  to: (value: InputValue) => T;
  from: (value: T) => InputValue;
};
const passThroughConverter: ValueConverter<any> = {
  to: (value) => value,
  from: (value) => value,
};
export function useControlledInputState<
  SourceHTMLElement extends HTMLElement,
  S extends unknown,
  C extends ValueConverter<S> = ValueConverter<S>
>(
  {
    value,
    defaultValue,
    onChange,
    ref: forwardedRef,
    ...props
  }: React.InputHTMLAttributes<SourceHTMLElement> & {
    ref?: React.ForwardedRef<SourceHTMLElement>;
  },
  convert: C = passThroughConverter as C,
  areEqual: (a: S, b: S) => boolean = compareTwoState
) {
  const [currentValue, updateCurrentValue] = React.useState<S>(() => {
    return convert.to(value || defaultValue);
  });
  const setCurrentValue = React.useCallback(
    (value: S | ((prev: S) => S)) => {
      if (props.readOnly) {
        return;
      }
      updateCurrentValue((prev) => {
        const nextValue =
          typeof value === "function" ? (value as (s: S) => S)(prev) : value;
        return nextValue;
      });
    },
    [updateCurrentValue, props.readOnly]
  );
  const prevValue = usePrevious(value);
  React.useLayoutEffect(() => {
    if (typeof value === "undefined") {
      return;
    }
    if (!prevValue) {
      return;
    }
    const convertedValue = convert.to(value);
    if (value === prevValue) {
      return;
    }
    if (areEqual(convertedValue, currentValue)) {
      return;
    }
    setCurrentValue(convertedValue);
  }, [value, currentValue]);
  const localRef = React.useRef<SourceHTMLElement>();
  const convertedCurrentValue = React.useMemo(() => {
    return convert.from(currentValue);
  }, [currentValue]);
  const convertedPrevValue = usePrevious(convertedCurrentValue);
  React.useEffect(() => {
    const input = localRef.current;
    if (!onChange || !input) {
      return;
    }
    if (convertedPrevValue === convertedCurrentValue || !convertedPrevValue) {
      return;
    }
    const changedValue = convertedCurrentValue?.toString() || "";
    const changeEvent = new Event("change", { bubbles: true });
    input.setAttribute("value", changedValue);
    input.dispatchEvent(changeEvent);
  }, [convertedCurrentValue, localRef]);
  const ref = useMergedRef<any>(forwardedRef, localRef);
  return [
    currentValue,
    setCurrentValue,
    {
      ...props,
      onChange,
      ref,
      style: hideInputStyle,
      readOnly: true,
    },
  ] as const;
}
