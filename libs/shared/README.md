# @chatSocket/shared

Biblioteca compartilhada para unificar tipos, DTOs, constantes e lógicas de negócio entre os projetos frontend e backend do chatSocket.

## 📦 Conteúdo

### Types (Tipos)

#### User Types

- `User`: Interface de usuário (sem password)
- `UserWithPassword`: Interface de usuário com password
- `UserRole`: Tipo para roles ('admin' | 'consultant')
- `LoginResponse`: Interface para resposta de login

#### Chat Types

- `Client`: Interface para dados do cliente
- `Message`: Interface para mensagens do chat
- `Chat`: Interface para chat completo
- `MessageSender`: Tipo para remetente ('client' | 'consultant')
- `ChatStatus`: Tipo para status do chat ('active' | 'closed')

#### Config Types

- `SystemConfig`: Interface para configurações do sistema

### DTOs (Data Transfer Objects)

#### Auth DTOs

- `LoginDto`: DTO para login
- `RegisterDto`: DTO para registro de novo usuário

#### Chat DTOs

- `CreateChatDto`: DTO para criar novo chat
- `SendMessageDto`: DTO para enviar mensagem
- `UpdateClientDto`: DTO para atualizar dados do cliente

### Constants (Constantes)

- `DEFAULT_CHAT_TTL`: Tempo padrão de vida do chat (30 minutos)
- `API_ENDPOINTS`: Mapeamento de todos os endpoints da API
- `SOCKET_EVENTS`: Eventos do WebSocket

### Utils (Utilitários)

#### Validation

- `isValidEmail(email: string)`: Valida formato de email
- `isValidPassword(password: string)`: Valida senha (mínimo 6 caracteres)
- `validateLoginData(email, password)`: Valida dados de login

#### Date

- `formatDate(date)`: Formata data no padrão brasileiro (dd/MM/yyyy)
- `formatDateTime(date)`: Formata data e hora (dd/MM/yyyy HH:mm)
- `formatTime(date)`: Formata apenas hora (HH:mm)
- `isDateExpired(date, ttlMinutes)`: Verifica se data expirou

## 🚀 Uso

### No Backend (NestJS)

```typescript
import {
  User,
  Chat,
  CreateChatDto,
  SendMessageDto,
  SOCKET_EVENTS,
  API_ENDPOINTS
} from '@chatSocket/shared';

// Usar tipos nas controllers, services, etc.
async createChat(dto: CreateChatDto): Promise<Chat> {
  // ...
}
```

### No Frontend (Next.js/React)

```typescript
import {
  User,
  Chat,
  Message,
  API_ENDPOINTS,
  SOCKET_EVENTS,
  validateLoginData,
  formatDateTime
} from '@chatSocket/shared';

// Usar tipos em componentes
const [user, setUser] = useState<User | null>(null);

// Usar validações
const validation = validateLoginData(email, password);
if (!validation.valid) {
  alert(validation.error);
}

// Usar constantes
fetch(`${API_BASE}${API_ENDPOINTS.AUTH.LOGIN}`, { ... });

// Usar utilitários
const formatted = formatDateTime(message.timestamp);
```

## 🔧 Building

```bash
nx build shared
```

## 🧪 Running unit tests

```bash
nx test shared
```

## 📝 Benefícios

✅ **Consistência**: Tipos e lógicas compartilhados garantem consistência entre frontend e backend  
✅ **DRY**: Evita duplicação de código  
✅ **Type-Safety**: TypeScript garante tipagem correta em ambos os projetos  
✅ **Manutenção**: Alterações em um único lugar refletem em toda a aplicação  
✅ **Validação**: Regras de validação unificadas  
✅ **Documentação**: Código autodocumentado com interfaces claras
