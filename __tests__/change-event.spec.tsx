import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { RadioButton } from "../examples/radio-button";
describe("change event", () => {
  it("should work", async () => {
    const onChange = () => {};
    const mock = vi.fn().mockImplementation(onChange);
    const result = render(<RadioButton onChange={mock} />);
    const Strawberry = await document.querySelector(
      'input[value="strawberry"]'
    );
    if (!Strawberry) {
      throw new Error("strawberry not found");
    }
    const output = await document.querySelector("output");
    if (!output) {
      throw new Error("output not found");
    }
    expect(output.textContent).toBe("output: ");
    await userEvent.click(Strawberry);
    expect(mock).toHaveBeenCalledTimes(1);

    expect(output.textContent).toBe("output: strawberry");
  });
  it("should be not changed, because target element is controlled not implemented", async () => {
    // defaultChecked: undefined, checked: 'strawberry'
    const checked = "strawberry";
    const ControlledInputButNotImplemented = (
      props: React.InputHTMLAttributes<HTMLInputElement>
    ) => {
      const [value, setValue] = React.useState(props.defaultValue);
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
      };
      return (
        <RadioButton type="text" value={checked} onChange={handleChange} />
      );
    };
    await render(<ControlledInputButNotImplemented />);
    const info = await document.querySelector("#element-stats");
    if (!info) {
      throw new Error("info not found");
    }
    expect(info.textContent).toBe("element: controlled");
    const currentValue = await document.querySelector("#current");
    if (!currentValue) {
      throw new Error("current not found");
    }
    expect(currentValue.textContent).toBe(checked);
    const inputs = await document.querySelectorAll("input[checked]");
    expect(inputs.length).toBe(1);
    expect(inputs[0].getAttribute("value")).toBe(checked);
  });
});
