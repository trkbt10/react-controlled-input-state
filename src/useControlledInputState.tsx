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
  S extends unknown = any,
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
  if (typeof value !== "undefined" && typeof onChange === "undefined") {
    console.warn(
      "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
    );
  }
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
  const localRef = React.useRef<SourceHTMLElement>(null);
  const convertedCurrentValue = React.useMemo(() => {
    return convert.from(currentValue);
  }, [currentValue]);
  const convertedPrevValue = usePrevious(convertedCurrentValue || null);
  // Must use layout effect to ensure that the input value is updated before the change event is dispatched.
  React.useEffect(() => {
    const input = localRef.current;
    if (!input) {
      return;
    }
    if (
      convertedPrevValue === convertedCurrentValue ||
      typeof convertedPrevValue === "undefined"
    ) {
      return;
    }
    const changedValue = convertedCurrentValue?.toString() || "";
    input.setAttribute("value", changedValue);
    const changeEvent = new Event("change", {
      bubbles: true,
      composed: true,
    });
    input.dispatchEvent(changeEvent);
  }, [convertedCurrentValue, localRef]);
  const ref = useMergedRef(forwardedRef, localRef);
  React.useEffect(() => {
    const input = localRef.current;
    if (!input) {
      return;
    }
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "attributes") {
          continue;
        }
        const changeEvent = new Event("input", {
          composed: true,
          bubbles: true,
        });
        mutation.target.dispatchEvent(changeEvent);
      }
    });
    mutationObserver.observe(input, {
      attributes: true,
      childList: true,
      attributeFilter: ["value"],
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [localRef]);

  return [
    currentValue,
    setCurrentValue,
    {
      ...props,

      // We need to set the value to the converted value, not the current value.
      // This is because the current value is the converted value, and we don't
      defaultValue: undefined,
      value:
        typeof convertedCurrentValue === "undefined"
          ? ""
          : convertedCurrentValue.toString(),
      onChange: onChange,
      ref,
      style: hideInputStyle,
      readOnly: true,
    },
  ] as const;
}
