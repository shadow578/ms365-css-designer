import type { PropsFor } from ".";

export default function ColorControl(props: PropsFor<"color">) {
  return (
    <>
      <label>Color:</label>
      <input
        type="string"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
}
