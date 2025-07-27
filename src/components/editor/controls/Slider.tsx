import type { PropsFor } from ".";

export default function SliderControl(props: PropsFor<"slider">) {
  return (
    <>
      <label>Slider:</label>
      <input
        type="number"
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </>
  );
}
