import './global.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'ChatSocket - Sistema de Atendimento',
  description: 'Sistema de chat em tempo real com Socket.io',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
