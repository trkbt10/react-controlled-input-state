import React from "react";
import {
  GroupsOrOptions,
  traverseOptionsForHTMLSelectElement,
} from "./traverseOptionsForSelectElement";

export function useSelectElementOptions(
  ref: React.RefObject<HTMLDataListElement | HTMLSelectElement>,
  defaultOptions: GroupsOrOptions = []
) {
  const [syncedOptions, setSyncedOptions] = React.useState<GroupsOrOptions>(
    () => defaultOptions
  );
  React.useEffect(() => {
    const select = ref.current;
    if (
      !(
        select instanceof HTMLDataListElement ||
        select instanceof HTMLSelectElement
      )
    ) {
      return;
    }
    const mutateOptions = () => {
      const items = traverseOptionsForHTMLSelectElement(select.children);
      setSyncedOptions(items);
    };
    const mutationObserver = new MutationObserver((mutations) => {
      mutateOptions();
    });
    mutationObserver.observe(select, {
      childList: true,
      subtree: true,
    });
    mutateOptions();
    return () => {
      mutationObserver.disconnect();
    };
  }, [setSyncedOptions]);
  return syncedOptions;
}
