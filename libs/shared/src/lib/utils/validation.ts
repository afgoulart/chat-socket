export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Mínimo 6 caracteres
  return password.length >= 6;
};

export const validateLoginData = (email: string, password: string): { valid: boolean; error?: string } => {
  if (!email || !password) {
    return { valid: false, error: 'Email e senha são obrigatórios' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Email inválido' };
  }

  if (!isValidPassword(password)) {
    return { valid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }

  return { valid: true };
};
