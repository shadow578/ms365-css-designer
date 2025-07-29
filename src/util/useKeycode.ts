import { useState, useEffect } from "react";

type KeyCode =
  | "Backspace"
  | "Tab"
  | "Enter"
  | "Shift"
  | "Control"
  | "Alt"
  | "Pause"
  | "CapsLock"
  | "Escape"
  | "Space"
  | "PageUp"
  | "PageDown"
  | "End"
  | "Home"
  | "ArrowLeft"
  | "ArrowUp"
  | "ArrowRight"
  | "ArrowDown"
  | "Insert"
  | "Delete"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v";

/**
 * unlock functions after the user enters a specific key sequence.
 * useful for easter eggs or special features.
 *
 * @param code the code sequence to match. Key codes match the KeyboardEvent.key values.
 * @returns true once the sequence was entered once.
 */
export default function useKeycode(code: KeyCode[]): boolean {
  const [nextCodeIndex, setNextCodeIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (completed) {
        return;
      }

      if (e.key === code[nextCodeIndex]) {
        if (nextCodeIndex === code.length - 1) {
          setCompleted(true);
        }

        setNextCodeIndex(nextCodeIndex + 1);
      } else {
        setNextCodeIndex(0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [code, nextCodeIndex, completed]);

  return completed;
}

export const KONAMI_CODE: KeyCode[] = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
