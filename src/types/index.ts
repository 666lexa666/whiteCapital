export interface User {
  id: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  verificationStatus: {
    personal?: boolean;
    email: boolean;
    phone: boolean;
    document: boolean;
  };
  personalData?: {
    lastName: string;
    firstName: string;
    middleName?: string;
    birthYear: string;
  };
  walletAddress?: string;
  seedPhrase?: string;
  balances: {
    rub: number;
    usdt: number;
  };
  documents?: {
    passport?: string;
    selfie?: string;
  };
  createdAt: Date;
  lastLogin?: Date;
  role: 'user' | 'admin';
  twoFactorAuth?: {
    enabled: boolean;
    secret?: string;
    backupCodes?: string[];
  };
  multiWallets?: {
    trc20: string;
    erc20: string;
    bep20: string;
    ton: string;
  };
  walletsCreatedAt?: Date;
  walletsLastRegenerated?: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  type: 'deposit' | 'withdrawal' | 'exchange';
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate?: number;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
  processedBy?: string;
  txHash?: string;
  withdrawalAddress?: string;
  adminNotes?: string;
}

export interface ExchangeRate {
  id: string;
  pair: string;
  rate: number;
  updatedAt: Date;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: 'passport' | 'face';
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface SupportMessage {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  category?: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  responses?: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  messageId: string;
  adminId: string;
  adminEmail: string;
  response: string;
  createdAt: Date;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userEmail: string;
  type: 'email' | 'phone' | 'document' | 'personal';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  data: {
    email?: string;
    phone?: string;
    documentUrl?: string;
    fileName?: string;
    personalData?: {
      lastName: string;
      firstName: string;
      middleName?: string;
      birthYear: string;
    };
    verificationCode?: string;
    userAccountLink?: string;
  };
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  adminNotes?: string;
  expiresAt: Date;
}