export type GroupsOrOptions = (Option | Group)[];
export type Option = {
  label: string;
  value: string;
};
export type Group = {
  label: string;
  options: GroupsOrOptions;
};

export function traverseOptionsForHTMLSelectElement(
  collection: HTMLCollection
) {
  const options: (Option | Group)[] = [];
  const nodes = Array.from(collection);

  nodes.forEach((node) => {
    if (node instanceof HTMLOptGroupElement) {
      options.push({
        label: node.label,
        options: traverseOptionsForHTMLSelectElement(node.children),
      });
      return;
    }
    if (node instanceof HTMLOptionElement) {
      options.push({
        label: node.textContent || node.value,
        value: node.value,
      });
    }
  });
  return options;
}
