import React from "react";

export function isMutableRefObject<T>(
  ref: React.Ref<T>
): ref is React.MutableRefObject<T> {
  if (!ref) {
    return false;
  }
  return "current" in ref;
}
