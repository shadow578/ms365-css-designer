import { IconButton } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

export default function AddButton(props: { onClick?: () => void }) {
  return (
    <IconButton aria-label="Add" onClick={props.onClick} variant="ghost">
      <MdAdd />
    </IconButton>
  );
}
