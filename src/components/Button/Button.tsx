import { Button as BaseButton } from "@base-ui/react/button";
import styles from "./Button.module.css";

export function Button({ className, ...props }: BaseButton.Props) {
  return (
    <BaseButton
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
