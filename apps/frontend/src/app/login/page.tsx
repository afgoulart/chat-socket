'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/consultant');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Login - Consultor</h1>
        <p>Faça login para acessar o painel do consultor</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="consultor@teste.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.hint}>
          <p>Credenciais de teste:</p>
          <p><strong>Email:</strong> consultor@teste.com</p>
          <p><strong>Senha:</strong> 123456</p>
        </div>
      </div>
    </div>
  );
}
