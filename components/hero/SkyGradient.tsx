import styles from "./hero.module.css";

/** Sky gradient, sunlight, light rays and horizon glow. Purely decorative. */
export default function SkyGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className={styles.sky} />
      <div className={styles.sun} />
      <div className={styles.rays} />
      <div className={styles.rays2} />
      <div className={styles.horizonGlow} />
    </div>
  );
}
