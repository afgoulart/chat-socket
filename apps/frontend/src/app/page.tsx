import Link from 'next/link';
import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span>Chat Application</span>
              Sistema de Chat com Socket.io
            </h1>
          </div>

          <div id="middle-content" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/chat"
                className="button-pill rounded shadow"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                Iniciar Chat
              </Link>

              <Link
                href="/login"
                className="button-pill rounded shadow"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                Login Consultor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
