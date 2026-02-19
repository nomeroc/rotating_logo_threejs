import styles from './page.module.css';
import Logo from './components/logo3d/Logo';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <Logo />
            </div>
        </main>
    );
}
