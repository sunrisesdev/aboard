import styles from "./LineBadge.module.css";

export function LineBadge({
  name,
  color,
  textColor,
}: {
  name: string;
  color?: string | null;
  textColor?: string | null;
}) {
  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: color ? `#${color}` : undefined,
        color: textColor ? `#${textColor}` : undefined,
      }}
    >
      {name}
    </span>
  );
}
