import styles from './page.module.css';
import Logo3D from './components/Logo3D';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.stage}>
                <Logo3D />
            </div>
        </main>
    );
}
