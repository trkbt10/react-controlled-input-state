import React from "react";
import { isMutableRefObject } from "./isMutableRefObject";

export function useMergedRef<T>(
  ...refs: (React.ForwardedRef<T> | undefined)[]
): React.RefCallback<T> {
  const ref = React.useCallback(
    (node: T) => {
      for (const ref of refs) {
        if (!ref) {
          continue;
        }
        // LegacyRef
        if (typeof ref === "string") {
          throw new Error("LegacyRef is not supported");
        }
        if (typeof ref === "function") {
          ref(node);
          continue;
        }
        if (isMutableRefObject(ref)) {
          ref.current = node;
          continue;
        }
        if (ref && "value" in ref) {
          ref.value = node;
          continue;
        }
      }
    },
    [refs]
  );
  return ref;
}
