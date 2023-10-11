import styles from "./login.module.css"

export default function Dashboard() {
return (
    <div>
        <h1 className={styles.login_header}>Login</h1>
        <p className={styles.login_description}>Login to your account.</p>

        <div className={styles.login_form}>
            <form>
                <input type="text" placeholder="Username" className={styles.login_input} />
                <input type="password" placeholder="Password" className={styles.login_input} />
                <button type="submit" className={styles.login_button}>Login</button>
            </form>

            <a href="/forgot-password" className={styles.login_forgot}>Forgot password?</a>

            <p className={styles.login_register}>Don't have an account? <a href="/register" className={styles.login_register_link}>Register</a></p>


        </div>
    </div>

)
}