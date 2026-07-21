import styles from "./WorkoutLoggedAnimation.module.css";

export function WorkoutLoggedAnimation() {
  return (
    <div className={styles.overlay}>
      <div className={styles.scaleWrapper}>
        <div className={styles.container}>
          <div className={styles["bench-container"]}>
            <div className={styles.seat} />
            <div className={styles.left} />
            <div className={styles.right} />
          </div>
          <div className={styles.man}>
            <div className={styles.legs}>
              <div className={`${styles.leg} ${styles.one}`} />
              <div className={`${styles.leg} ${styles.two}`} />
              <div className={styles.thy} />
            </div>
            <div className={styles["main-parts"]}>
              <div className={styles.lower} />
              <div className={styles.upper}>
                <div className={styles.above} />
              </div>
            </div>
            <div className={styles.neck}>
              <div className={styles.head} />
            </div>
            <div className={styles.arm} />
            <div className={styles.nose}>
              <div />
              <div />
            </div>
            <div className={styles.hairs}>
              <div className={styles.lower} />
              <div className={styles.upper}>
                <div />
                <div />
                <div />
              </div>
            </div>
            <div className={styles.hand} />
            <div className={styles.weight} />
          </div>
          <div className={styles["bicept-machine"]} />
          <div className={styles.rod1} />
        </div>
      </div>
      <p className={styles.caption}>Workout logged!</p>
    </div>
  );
}
