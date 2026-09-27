import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

export function Skeleton({
  width,
  height,
  className,
}: {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  className?: string;
}) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ width, height }}
    />
  );
}
