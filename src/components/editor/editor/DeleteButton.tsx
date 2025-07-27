import { IconButton } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

export default function DeleteButton(props: { onClick?: () => void }) {
  return (
    <IconButton aria-label="Delete" onClick={props.onClick} variant="ghost">
      <MdDelete />
    </IconButton>
  );
}
