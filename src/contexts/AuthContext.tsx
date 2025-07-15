import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, VerificationRequest } from '../types';
import { initializeWalletsOnRegistration } from '../services/WalletService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, phone?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  saveEmailAddress: (email: string) => Promise<void>;
  savePhoneNumber: (phone: string) => Promise<void>;
  submitDocumentVerification: (documentFile: File) => Promise<void>;
  setup2FA: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>;
  verify2FA: (token: string, secret: string) => Promise<boolean>;
  disable2FA: (password: string) => Promise<boolean>;
  isLoading: boolean;
  requires2FA: boolean;
  setRequires2FA: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock speakeasy functions for demo
const mockSpeakeasy = {
  generateSecret: () => ({
    base32: 'JBSWY3DPEHPK3PXP',
    otpauth_url: 'otpauth://totp/White%20Capital:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=White%20Capital'
  }),
  totp: {
    verify: (options: any) => {
      // For demo purposes, accept codes: 123456, 654321, or any 6-digit code starting with 1
      const validCodes = ['123456', '654321'];
      return validCodes.includes(options.token) || options.token.startsWith('1');
    }
  }
};

// Mock QR code generation
const generateQRCode = async (text: string): Promise<string> => {
  // Return a placeholder data URL for demo
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
};

// Generate unique TRC-20 wallet address
const generateTRC20Address = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  let result = 'T';
  for (let i = 0; i < 33; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate seed phrase (12 words)
const generateSeedPhrase = (): string => {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'age',
    'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol',
    'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also',
    'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient',
    'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna',
    'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch',
    'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange',
    'arrest', 'arrive', 'arrow', 'art', 'article', 'artist', 'artwork', 'ask', 'aspect', 'assault',
    'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract',
    'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid'
  ];
  
  const selectedWords = [];
  for (let i = 0; i < 12; i++) {
    selectedWords.push(words[Math.floor(Math.random() * words.length)]);
  }
  
  return selectedWords.join(' ');
};

// Initialize exchange wallet if not exists
const initializeExchangeWallet = () => {
  const existingWallet = localStorage.getItem('exchangeWallet');
  if (!existingWallet) {
    const exchangeWallet = {
      address: generateTRC20Address(),
      seedPhrase: generateSeedPhrase(),
      balance: {
        usdt: 0,
        trx: 0
      },
      createdAt: new Date(),
      transactions: []
    };
    
    localStorage.setItem('exchangeWallet', JSON.stringify(exchangeWallet));
    
    console.log('=== КОШЕЛЕК БИРЖИ СОЗДАН ===');
    console.log(`Адрес: ${exchangeWallet.address}`);
    console.log(`Сид-фраза: ${exchangeWallet.seedPhrase}`);
    console.log(`Дата создания: ${exchangeWallet.createdAt.toLocaleString()}`);
    console.log('============================');
    
    return exchangeWallet;
  }
  
  return JSON.parse(existingWallet);
};

// Create verification request with user account link
const createVerificationRequest = (userId: string, userEmail: string, type: 'email' | 'phone' | 'document', data: any): VerificationRequest => {
  const request: VerificationRequest = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    userEmail,
    type,
    status: 'pending',
    data,
    submittedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  };

  // Save to localStorage for admin processing
  const existingRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
  existingRequests.push(request);
  localStorage.setItem('verificationRequests', JSON.stringify(existingRequests));

  console.log('=== ЗАЯВКА НА ВЕРИФИКАЦИЮ АВТОМАТИЧЕСКИ ОТПРАВЛЕНА ===');
  console.log(`Тип: ${type}`);
  console.log(`Пользователь: ${userEmail}`);
  console.log(`ID пользователя: ${userId}`);
  console.log(`ID заявки: ${request.id}`);
  console.log(`Ссылка на аккаунт: /admin (поиск по email: ${userEmail})`);
  console.log(`Срок действия: ${request.expiresAt.toLocaleString()}`);
  console.log(`Данные:`, data);
  console.log('====================================================');

  return request;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);

  useEffect(() => {
    // Initialize exchange wallet on app start
    initializeExchangeWallet();
    
    // Check for email verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify');
    
    if (verifyToken) {
      verifyEmailFromUrl(verifyToken);
    }

    // Load user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Auto-redirect admin users to admin panel
      if (userData.role === 'admin' && !window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }
    setIsLoading(false);
  }, []);

  const verifyEmailFromUrl = async (token: string) => {
    try {
      // This would normally verify with server
      // For demo, we'll just show success
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('Email успешно подтвержден!');
    } catch (error) {
      console.error('Email verification failed:', error);
    }
  };

  const login = async (email: string, password: string, twoFactorCode?: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check admin credentials
    if (email === 'admin@whitecapital.com' && password !== 'anita2021') {
      setIsLoading(false);
      throw new Error('Неверный пароль администратора');
    }
    
    // Check if user exists and has 2FA enabled
    const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    const existingUser = savedUsers[email];
    
    if (existingUser && existingUser.twoFactorAuth?.enabled && !twoFactorCode) {
      setRequires2FA(true);
      setIsLoading(false);
      throw new Error('REQUIRES_2FA');
    }
    
    if (existingUser && existingUser.twoFactorAuth?.enabled && twoFactorCode) {
      const isValid = mockSpeakeasy.totp.verify({
        secret: existingUser.twoFactorAuth.secret,
        token: twoFactorCode,
        window: 2
      });
      
      if (!isValid) {
        setIsLoading(false);
        throw new Error('Неверный код двухфакторной аутентификации');
      }
    }
    
    const mockUser: User = existingUser || {
      id: '1',
      email,
      isVerified: false,
      verificationStatus: {
        email: false,
        phone: false,
        document: false
      },
      walletAddress: email === 'admin@whitecapital.com' ? undefined : generateTRC20Address(),
      balances: {
        rub: 0,
        usdt: 0
      },
      createdAt: new Date(),
      role: email === 'admin@whitecapital.com' ? 'admin' : 'user',
      twoFactorAuth: {
        enabled: false
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setRequires2FA(false);
    setIsLoading(false);
    
    // Auto-redirect admin users to admin panel after login
    if (mockUser.role === 'admin') {
      setTimeout(() => {
        window.location.href = '/admin';
      }, 100);
    }
  };

  const register = async (email: string, password: string, phone?: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate unique TRC-20 wallet address for new user
    const walletAddress = generateTRC20Address();
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      phone,
      isVerified: false,
      verificationStatus: {
        email: false,
        phone: false,
        document: false
      },
      walletAddress, // Automatically assigned TRC-20 wallet
      balances: {
        rub: 0,
        usdt: 0
      },
      createdAt: new Date(),
      role: 'user',
      twoFactorAuth: {
        enabled: false
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Save to all users for 2FA persistence
    const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    savedUsers[email] = mockUser;
    localStorage.setItem('allUsers', JSON.stringify(savedUsers));
    
    // Автоматически создаем кошельки для нового пользователя
    try {
      await initializeWalletsOnRegistration(mockUser.id, email);
    } catch (error) {
      console.error('Failed to create wallets for new user:', error);
    }
    
    console.log('=== НОВЫЙ ПОЛЬЗОВАТЕЛЬ ЗАРЕГИСТРИРОВАН ===');
    console.log(`Email: ${email}`);
    console.log(`TRC-20 кошелек: ${walletAddress}`);
    console.log(`Мульти-кошельки: Создаются автоматически...`);
    console.log(`Дата регистрации: ${new Date().toLocaleString()}`);
    console.log('=====================================');
    
    setIsLoading(false);
  };

  const setup2FA = async (): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> => {
    if (!user) throw new Error('User not logged in');
    
    // Generate secret and QR code
    const secret = mockSpeakeasy.generateSecret();
    const qrCode = await generateQRCode(secret.otpauth_url);
    
    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    
    return {
      secret: secret.base32,
      qrCode,
      backupCodes
    };
  };

  const verify2FA = async (token: string, secret: string): Promise<boolean> => {
    if (!user) return false;
    
    const isValid = mockSpeakeasy.totp.verify({
      secret,
      token,
      window: 2
    });
    
    if (isValid) {
      // Generate backup codes
      const backupCodes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substr(2, 8).toUpperCase()
      );
      
      const updatedUser = {
        ...user,
        twoFactorAuth: {
          enabled: true,
          secret,
          backupCodes
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in all users storage
      const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      savedUsers[user.email] = updatedUser;
      localStorage.setItem('allUsers', JSON.stringify(savedUsers));
      
      return true;
    }
    
    return false;
  };

  const disable2FA = async (password: string): Promise<boolean> => {
    if (!user) return false;
    
    // In a real app, you'd verify the password here
    // For demo, we'll just disable 2FA
    const updatedUser = {
      ...user,
      twoFactorAuth: {
        enabled: false
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in all users storage
    const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    savedUsers[user.email] = updatedUser;
    localStorage.setItem('allUsers', JSON.stringify(savedUsers));
    
    return true;
  };

  const saveEmailAddress = async (email: string) => {
    if (!user) return;
    
    // Update user email address immediately
    const updatedUser = { ...user, email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in all users storage - remove old email key and add new one
    const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    delete savedUsers[user.email]; // Remove old email key
    savedUsers[email] = updatedUser; // Add with new email key
    localStorage.setItem('allUsers', JSON.stringify(savedUsers));
    
    // Automatically create verification request for admin processing
    createVerificationRequest(user.id, email, 'email', {
      email: email,
      userAccountLink: `/admin/users/${user.id}`,
      previousEmail: user.email !== email ? user.email : undefined
    });
    
    console.log('=== EMAIL СОХРАНЕН И АВТОМАТИЧЕСКИ ОТПРАВЛЕН АДМИНИСТРАТОРУ ===');
    console.log(`Пользователь: ${user.email} → ${email}`);
    console.log(`ID пользователя: ${user.id}`);
    console.log(`Время: ${new Date().toLocaleString()}`);
    console.log(`Статус: Автоматически отправлено администратору для проверки`);
    console.log(`Ссылка на аккаунт: Админ-панель → Поиск по email: ${email}`);
    console.log('==============================================================');
    
    alert(`Email сохранен и автоматически отправлен на верификацию!\n\nEmail: ${email}\n\nДанные автоматически направлены администратору для проверки.\nВремя рассмотрения: до 24 часов.\n\nАдминистратор сможет просмотреть все данные вашего аккаунта для принятия решения.`);
  };

  const savePhoneNumber = async (phone: string) => {
    if (!user) return;
    
    // Update user phone number immediately
    const updatedUser = { ...user, phone };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in all users storage
    const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    savedUsers[user.email] = updatedUser;
    localStorage.setItem('allUsers', JSON.stringify(savedUsers));
    
    // Automatically create verification request for admin processing
    createVerificationRequest(user.id, user.email, 'phone', {
      phone: phone,
      userAccountLink: `/admin/users/${user.id}`,
      previousPhone: user.phone !== phone ? user.phone : undefined
    });
    
    console.log('=== ТЕЛЕФОН СОХРАНЕН И АВТОМАТИЧЕСКИ ОТПРАВЛЕН АДМИНИСТРАТОРУ ===');
    console.log(`Пользователь: ${user.email}`);
    console.log(`ID пользователя: ${user.id}`);
    console.log(`Номер телефона: ${phone}`);
    console.log(`Время: ${new Date().toLocaleString()}`);
    console.log(`Статус: Автоматически отправлено администратору для проверки`);
    console.log(`Ссылка на аккаунт: Админ-панель → Поиск по email: ${user.email}`);
    console.log('================================================================');
    
    alert(`Номер телефона сохранен и автоматически отправлен на верификацию!\n\nНомер: ${phone}\n\nДанные автоматически направлены администратору для проверки.\nВремя рассмотрения: до 24 часов.\n\nАдминистратор сможет просмотреть все данные вашего аккаунта для принятия решения.`);
  };

  const submitDocumentVerification = async (documentFile: File) => {
    if (!user) return;
    
    // Simulate file upload and create verification request
    const documentUrl = `document_${user.id}_${Date.now()}.jpg`;
    
    // Automatically create verification request for admin processing
    createVerificationRequest(user.id, user.email, 'document', {
      documentUrl: documentUrl,
      fileName: documentFile.name,
      fileSize: documentFile.size,
      fileType: documentFile.type,
      userAccountLink: `/admin/users/${user.id}`
    });
    
    console.log('=== ДОКУМЕНТ ЗАГРУЖЕН И АВТОМАТИЧЕСКИ ОТПРАВЛЕН АДМИНИСТРАТОРУ ===');
    console.log(`Пользователь: ${user.email}`);
    console.log(`ID пользователя: ${user.id}`);
    console.log(`Файл: ${documentFile.name}`);
    console.log(`Размер: ${(documentFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Тип: ${documentFile.type}`);
    console.log(`Время: ${new Date().toLocaleString()}`);
    console.log(`Статус: Автоматически отправлено администратору для проверки`);
    console.log(`Ссылка на аккаунт: Админ-панель → Поиск по email: ${user.email}`);
    console.log('================================================================');
    
    alert(`Документ загружен и автоматически отправлен на верификацию!\n\nФайл: ${documentFile.name}\nРазмер: ${(documentFile.size / 1024 / 1024).toFixed(2)} MB\n\nДокумент автоматически направлен администратору для проверки.\nВремя рассмотрения: до 24 часов.\n\nАдминистратор сможет просмотреть все данные вашего аккаунта для принятия решения.`);
  };

  const logout = () => {
    setUser(null);
    setRequires2FA(false);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in all users storage
      const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      savedUsers[user.email] = updatedUser;
      localStorage.setItem('allUsers', JSON.stringify(savedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateUser,
      saveEmailAddress,
      savePhoneNumber,
      submitDocumentVerification,
      setup2FA,
      verify2FA,
      disable2FA,
      isLoading,
      requires2FA,
      setRequires2FA
    }}>
      {children}
    </AuthContext.Provider>
  );
};