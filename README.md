# ChatSocket - Sistema de Atendimento Genérico

Sistema de chat em tempo real com suporte a múltiplos consultores e clientes, desenvolvido com NestJS, Next.js e Socket.io.

## 📋 Sobre o Projeto

ChatSocket é uma solução open-source para atendimento ao cliente em tempo real. O sistema permite que clientes iniciem conversas e sejam atendidos por consultores, com funcionalidades de gerenciamento de usuários, métricas e configurações personalizáveis.

### Principais Funcionalidades

- ✅ **Chat em Tempo Real**: Comunicação bidirecional usando Socket.io
- ✅ **Múltiplos Perfis**: Suporte para perfis de Admin e Consultor
- ✅ **Gestão de Clientes**: Consultores podem adicionar informações dos clientes (nome, data de nascimento, localidade)
- ✅ **TTL Configurável**: Fechamento automático de chats inativos baseado em tempo configurável
- ✅ **Storage Genérico**: Interface abstrata permitindo múltiplos backends de armazenamento
- ✅ **Arquitetura Limpa**: Separação clara entre lógica de negócio e visualização

## 🏗️ Arquitetura

### Backend (NestJS)

```
apps/backend/src/
├── auth/                 # Autenticação e autorização
├── chat/                 # Lógica de chat e Socket.io Gateway
├── config/               # Configurações do sistema
├── models/               # Modelos de dados
├── storage/              # Interface Storage e implementações
│   ├── storage.interface.ts
│   ├── lowdb.storage.ts       # Implementação com LowDB (padrão)
│   └── inmemory.storage.ts    # Implementação em memória
└── users/                # Gestão de usuários
```

### Frontend (Next.js)

```
apps/frontend/src/
├── app/
│   ├── chat/             # Páginas de chat do cliente
│   ├── consultant/       # Interface do consultor
│   └── dashboard/        # Dashboard com métricas
├── components/           # Componentes React reutilizáveis
├── hooks/                # Hooks customizados (useSocket, useConsultant)
└── lib/                  # Server actions e tipos
```

## 🚀 Começando

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/chatSocket.git
cd chatSocket
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend
PORT=3000

# Database
DATABASE_TYPE=lowdb
DATABASE_URI=./db.json

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

**Tipos de Storage Disponíveis:**

- `lowdb` - Armazenamento em arquivo JSON (padrão)
- `inmemory` - Armazenamento em memória (para testes)
- `mongodb` - MongoDB (requer implementação)
- `postgres` ou `postgresql` - PostgreSQL (requer implementação)
- `mysql` - MySQL (requer implementação)

### Executando o Projeto

#### Iniciar Backend e Frontend simultaneamente

```bash
npm start
```

#### Ou iniciar separadamente

```bash
# Backend (porta 3000)
npm run start:backend

# Frontend (porta 4200)
npm run start:frontend
```

### Build para Produção

```bash
# Build completo
npm run build

# Build individual
npm run build:backend
npm run build:frontend
```

## 📚 Estrutura de Storage

O projeto implementa uma interface genérica de Storage que pode ser facilmente adaptada para diferentes backends:

### Implementações Disponíveis

1. **LowDB** (Padrão): Armazenamento em arquivo JSON
2. **InMemory**: Armazenamento em memória (útil para testes)

### Adicionar Novo Storage

Para adicionar um novo backend de storage (ex: MongoDB, PostgreSQL):

1. Crie uma nova classe que implemente a interface `Storage`:

```typescript
// apps/backend/src/storage/mongodb.storage.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Storage } from './storage.interface';
// ... outros imports

@Injectable()
export class MongoDBStorage implements Storage, OnModuleInit {
  async onModuleInit() {
    // Inicializar conexão MongoDB usando DATABASE_URI
    const uri = process.env.DATABASE_URI;
    // ...
  }

  async createChat(chat: Chat): Promise<Chat> {
    // Implementação MongoDB
  }
  // ... implementar todos os métodos da interface Storage
}
```

2. Adicione o novo storage no `StorageModule`:

```typescript
// apps/backend/src/storage/storage.module.ts
import { MongoDBStorage } from './mongodb.storage';

// No switch dentro do useFactory:
case 'mongodb':
  return new MongoDBStorage();
```

3. Configure as variáveis de ambiente:

```env
DATABASE_TYPE=mongodb
DATABASE_URI=mongodb://localhost:27017/chatsocket
```

**Pronto!** O sistema automaticamente usará o novo storage sem precisar alterar nenhum módulo.

## 🔧 Configurações do Sistema

### TTL de Chat

Configure o tempo (em minutos) para fechamento automático de chats inativos:

```typescript
// Via API
PUT /api/config
{
  "chatTTL": 30  // 30 minutos
}
```

O scheduler verifica a cada minuto se há chats que ultrapassaram o tempo configurado de inatividade.

## 👥 Perfis de Usuário

### Admin

- Gerencia usuários
- Configura sistema
- Acessa métricas completas
- Gerencia chats

### Consultor

- Atende chats
- Adiciona informações de clientes
- Visualiza histórico de conversas

## 🌐 API Endpoints

### Autenticação

```
POST /api/auth/login
POST /api/auth/register
```

### Chats

```
GET  /api/chats          # Listar todos os chats
GET  /api/chats/:id      # Buscar chat por ID
POST /api/chats          # Criar novo chat
```

### Usuários

```
GET    /api/users        # Listar usuários
GET    /api/users/:id    # Buscar usuário
PUT    /api/users/:id    # Atualizar usuário
DELETE /api/users/:id    # Remover usuário
```

### Configurações

```
GET /api/config          # Buscar configurações
PUT /api/config          # Atualizar configurações
```

## 🔌 Eventos Socket.io

### Cliente

```javascript
// Entrar em um chat
socket.emit('joinChat', chatId);

// Enviar mensagem
socket.emit('sendMessage', { chatId, content, sender: 'client' });

// Atualizar informações do cliente
socket.emit('updateClient', { chatId, client });
```

### Consultor

```javascript
// Entrar na sala de consultores
socket.emit('joinConsultants');

// Buscar todos os chats
socket.emit('getAllChats');

// Fechar chat
socket.emit('closeChat', chatId);
```

### Eventos Recebidos

```javascript
// Nova mensagem
socket.on('newMessage', (message) => {});

// Histórico do chat
socket.on('chatHistory', (messages) => {});

// Chat atualizado
socket.on('chatUpdate', ({ chatId, message }) => {});

// Cliente atualizado
socket.on('clientUpdated', (chat) => {});

// Chat fechado
socket.on('chatClosed', (chat) => {});
```

## 📦 Tecnologias Utilizadas

### Backend

- **NestJS**: Framework Node.js para aplicações server-side
- **Socket.io**: Comunicação em tempo real
- **LowDB**: Banco de dados JSON simples
- **@nestjs/schedule**: Tarefas agendadas (cron jobs)
- **TypeScript**: Tipagem estática

### Frontend

- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca de UI
- **Socket.io-client**: Cliente WebSocket
- **TypeScript**: Tipagem estática
- **CSS Modules**: Estilos isolados

### Monorepo

- **Nx**: Ferramenta de build e monorepo

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Roadmap

- [ ] Dashboard com métricas completas
- [ ] Interface de configurações no frontend
- [ ] Autenticação com JWT
- [ ] Implementação MongoDB Storage
- [ ] Implementação PostgreSQL Storage
- [ ] Sistema de notificações
- [ ] Upload de arquivos no chat
- [ ] Chat em grupo
- [ ] Tema dark mode
- [ ] Internacionalização (i18n)
- [ ] Testes automatizados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade open-source.

---

**Nota**: Este é um projeto educacional e pode necessitar de ajustes de segurança e performance para uso em produção.
