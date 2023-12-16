import { Option, Group } from "../examples/react-select";

export function traverse(collection: HTMLCollection) {
  const options: (Option | Group)[] = [];
  const nodes = Array.from(collection);

  nodes.forEach((node) => {
    if (node instanceof HTMLOptGroupElement) {
      options.push({
        label: node.label,
        options: traverse(node.children),
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
