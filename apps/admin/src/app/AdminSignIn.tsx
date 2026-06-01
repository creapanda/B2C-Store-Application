import styles from "./page.module.css";

export function AdminSignIn() {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.authHeader}>
          <p className={styles.eyebrow}>B2C Store Admin</p>
          <h1>Admin Login</h1>
          <p>Sign in to your account</p>
        </div>

        <form action="/api/auth" method="post" className={styles.authForm}>
          <label className={styles.field}>
            <span>Password</span>
            <input className={styles.input} name="password" type="password" />
          </label>

          <button className={styles.button} type="submit">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
