import TronWeb from 'tronweb';
import { ethers } from 'ethers';
import { WalletContractV4, internal } from '@ton/ton';
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import CryptoJS from 'crypto-js';

// Типы для кошельков
export interface WalletData {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
}

export interface UserWallets {
  userId: string;
  wallets: {
    trc20: WalletData;
    bep20: WalletData;
    erc20: WalletData;
    ton: WalletData;
  };
  createdAt: Date;
  lastRegenerated?: Date;
}

// Конфигурация шифрования
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'AES-256-GCM';

// Класс для безопасного шифрования
class CryptoManager {
  private static encryptionKey = ENCRYPTION_KEY;

  static encrypt(text: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }
}

// Логгер безопасности
class SecurityLogger {
  static logWalletGeneration(userId: string, network: string, success: boolean, error?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      network,
      action: 'wallet_generation',
      success,
      error: error || null,
      ip: 'system', // В реальном приложении получать из request
    };
    
    console.log('SECURITY_LOG:', JSON.stringify(logEntry));
    
    // В продакшене отправлять в централизованную систему логирования
    // await sendToSecurityLog(logEntry);
  }

  static logWalletRegeneration(userId: string, adminId: string, networks: string[]) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      adminId,
      action: 'wallet_regeneration',
      networks,
      success: true,
    };
    
    console.log('SECURITY_LOG:', JSON.stringify(logEntry));
  }
}

// Основной класс генератора кошельков
export class WalletGenerator {
  private static instance: WalletGenerator;
  private tronWeb: any;

  private constructor() {
    // Инициализация TronWeb (в продакшене использовать реальные узлы)
    this.tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' },
      privateKey: undefined // Не устанавливаем глобальный приватный ключ
    });
  }

  static getInstance(): WalletGenerator {
    if (!WalletGenerator.instance) {
      WalletGenerator.instance = new WalletGenerator();
    }
    return WalletGenerator.instance;
  }

  // Генерация TRC-20 кошелька (Tron)
  private async generateTronWallet(): Promise<WalletData> {
    try {
      const account = await this.tronWeb.createAccount();
      
      return {
        address: account.address.base58,
        publicKey: account.publicKey,
        encryptedPrivateKey: CryptoManager.encrypt(account.privateKey)
      };
    } catch (error) {
      throw new Error(`TRC-20 wallet generation failed: ${error}`);
    }
  }

  // Генерация ERC-20 кошелька (Ethereum)
  private async generateEthereumWallet(): Promise<WalletData> {
    try {
      const wallet = ethers.Wallet.createRandom();
      
      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        encryptedPrivateKey: CryptoManager.encrypt(wallet.privateKey)
      };
    } catch (error) {
      throw new Error(`ERC-20 wallet generation failed: ${error}`);
    }
  }

  // Генерация BEP-20 кошелька (Binance Smart Chain)
  private async generateBSCWallet(): Promise<WalletData> {
    try {
      // BSC использует тот же формат, что и Ethereum
      const wallet = ethers.Wallet.createRandom();
      
      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        encryptedPrivateKey: CryptoManager.encrypt(wallet.privateKey)
      };
    } catch (error) {
      throw new Error(`BEP-20 wallet generation failed: ${error}`);
    }
  }

  // Генерация TON кошелька
  private async generateTonWallet(): Promise<WalletData> {
    try {
      // Генерируем мнемонику
      const mnemonic = await mnemonicNew();
      
      // Получаем ключевую пару из мнемоники
      const keyPair = await mnemonicToPrivateKey(mnemonic);
      
      // Создаем кошелек V4
      const workchain = 0; // Основная сеть TON
      const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
      
      return {
        address: wallet.address.toString(),
        publicKey: keyPair.publicKey.toString('hex'),
        encryptedPrivateKey: CryptoManager.encrypt(keyPair.secretKey.toString('hex'))
      };
    } catch (error) {
      throw new Error(`TON wallet generation failed: ${error}`);
    }
  }

  // Основная функция генерации всех кошельков для пользователя
  async generateUserWallets(userId: string): Promise<UserWallets> {
    const results: Partial<UserWallets['wallets']> = {};
    const errors: string[] = [];

    // Генерируем кошельки для каждой сети
    const networks = [
      { name: 'trc20', generator: () => this.generateTronWallet() },
      { name: 'erc20', generator: () => this.generateEthereumWallet() },
      { name: 'bep20', generator: () => this.generateBSCWallet() },
      { name: 'ton', generator: () => this.generateTonWallet() }
    ];

    for (const network of networks) {
      try {
        const walletData = await network.generator();
        results[network.name as keyof UserWallets['wallets']] = walletData;
        
        SecurityLogger.logWalletGeneration(userId, network.name, true);
        
        console.log(`✅ ${network.name.toUpperCase()} wallet generated for user ${userId}`);
        console.log(`Address: ${walletData.address}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${network.name}: ${errorMessage}`);
        
        SecurityLogger.logWalletGeneration(userId, network.name, false, errorMessage);
        
        console.error(`❌ Failed to generate ${network.name} wallet:`, errorMessage);
      }
    }

    // Проверяем, что все кошельки созданы успешно
    if (errors.length > 0) {
      throw new Error(`Wallet generation failed for networks: ${errors.join(', ')}`);
    }

    const userWallets: UserWallets = {
      userId,
      wallets: results as UserWallets['wallets'],
      createdAt: new Date()
    };

    // Сохраняем в базу данных (симуляция)
    await this.saveWalletsToDatabase(userWallets);

    return userWallets;
  }

  // Повторная генерация кошельков (только для админов)
  async regenerateUserWallets(
    userId: string, 
    adminId: string, 
    networks: string[] = ['trc20', 'erc20', 'bep20', 'ton']
  ): Promise<UserWallets> {
    
    // Проверка прав администратора (в реальном приложении)
    if (!this.isAdminAuthorized(adminId)) {
      throw new Error('Unauthorized: Admin privileges required for wallet regeneration');
    }

    console.log(`🔄 Regenerating wallets for user ${userId} by admin ${adminId}`);
    
    const existingWallets = await this.getWalletsFromDatabase(userId);
    if (!existingWallets) {
      throw new Error('User wallets not found');
    }

    const updatedWallets = { ...existingWallets };

    for (const network of networks) {
      try {
        let newWallet: WalletData;
        
        switch (network) {
          case 'trc20':
            newWallet = await this.generateTronWallet();
            break;
          case 'erc20':
            newWallet = await this.generateEthereumWallet();
            break;
          case 'bep20':
            newWallet = await this.generateBSCWallet();
            break;
          case 'ton':
            newWallet = await this.generateTonWallet();
            break;
          default:
            throw new Error(`Unsupported network: ${network}`);
        }

        updatedWallets.wallets[network as keyof UserWallets['wallets']] = newWallet;
        
        console.log(`✅ Regenerated ${network.toUpperCase()} wallet for user ${userId}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to regenerate ${network} wallet:`, errorMessage);
        throw error;
      }
    }

    updatedWallets.lastRegenerated = new Date();
    
    // Логируем операцию
    SecurityLogger.logWalletRegeneration(userId, adminId, networks);
    
    // Сохраняем обновленные кошельки
    await this.saveWalletsToDatabase(updatedWallets);

    return updatedWallets;
  }

  // Получение приватного ключа (только для авторизованных операций)
  async getDecryptedPrivateKey(userId: string, network: string, adminId?: string): Promise<string> {
    if (!adminId || !this.isAdminAuthorized(adminId)) {
      throw new Error('Unauthorized: Admin privileges required to access private keys');
    }

    const wallets = await this.getWalletsFromDatabase(userId);
    if (!wallets) {
      throw new Error('User wallets not found');
    }

    const wallet = wallets.wallets[network as keyof UserWallets['wallets']];
    if (!wallet) {
      throw new Error(`Wallet not found for network: ${network}`);
    }

    try {
      return CryptoManager.decrypt(wallet.encryptedPrivateKey);
    } catch (error) {
      throw new Error('Failed to decrypt private key');
    }
  }

  // Валидация адреса для каждой сети
  validateAddress(address: string, network: string): boolean {
    try {
      switch (network) {
        case 'trc20':
          return this.tronWeb.isAddress(address);
        case 'erc20':
        case 'bep20':
          return ethers.isAddress(address);
        case 'ton':
          // Простая проверка формата TON адреса
          return /^[A-Za-z0-9_-]{48}$/.test(address.replace(/[=:]/g, ''));
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Симуляция проверки прав администратора
  private isAdminAuthorized(adminId: string): boolean {
    // В реальном приложении проверять в базе данных
    const authorizedAdmins = ['admin@whitecapital.com', 'admin1', 'admin2'];
    return authorizedAdmins.includes(adminId);
  }

  // Симуляция сохранения в базу данных
  private async saveWalletsToDatabase(userWallets: UserWallets): Promise<void> {
    try {
      // В реальном приложении сохранять в PostgreSQL/MongoDB
      const existingWallets = JSON.parse(localStorage.getItem('userWallets') || '{}');
      existingWallets[userWallets.userId] = {
        ...userWallets,
        // Не сохраняем приватные ключи в обычном хранилище
        wallets: Object.fromEntries(
          Object.entries(userWallets.wallets).map(([network, wallet]) => [
            network,
            {
              address: wallet.address,
              publicKey: wallet.publicKey,
              // Приватные ключи сохраняются в отдельном защищенном хранилище
              hasPrivateKey: true
            }
          ])
        )
      };
      localStorage.setItem('userWallets', JSON.stringify(existingWallets));
      
      // Приватные ключи сохраняем отдельно (симуляция KMS)
      const privateKeys = JSON.parse(localStorage.getItem('encryptedPrivateKeys') || '{}');
      privateKeys[userWallets.userId] = Object.fromEntries(
        Object.entries(userWallets.wallets).map(([network, wallet]) => [
          network,
          wallet.encryptedPrivateKey
        ])
      );
      localStorage.setItem('encryptedPrivateKeys', JSON.stringify(privateKeys));
      
      console.log(`💾 Wallets saved to database for user ${userWallets.userId}`);
    } catch (error) {
      throw new Error(`Failed to save wallets to database: ${error}`);
    }
  }

  // Симуляция получения из базы данных
  private async getWalletsFromDatabase(userId: string): Promise<UserWallets | null> {
    try {
      const wallets = JSON.parse(localStorage.getItem('userWallets') || '{}');
      const privateKeys = JSON.parse(localStorage.getItem('encryptedPrivateKeys') || '{}');
      
      const userWalletData = wallets[userId];
      const userPrivateKeys = privateKeys[userId];
      
      if (!userWalletData || !userPrivateKeys) {
        return null;
      }

      // Восстанавливаем полную структуру с приватными ключами
      const fullWallets: UserWallets = {
        ...userWalletData,
        wallets: Object.fromEntries(
          Object.entries(userWalletData.wallets).map(([network, wallet]: [string, any]) => [
            network,
            {
              ...wallet,
              encryptedPrivateKey: userPrivateKeys[network]
            }
          ])
        )
      };

      return fullWallets;
    } catch (error) {
      console.error('Failed to retrieve wallets from database:', error);
      return null;
    }
  }

  // Получение публичной информации о кошельках пользователя
  async getUserWalletsPublic(userId: string): Promise<Omit<UserWallets, 'wallets'> & {
    wallets: Record<string, Omit<WalletData, 'encryptedPrivateKey'>>
  } | null> {
    const wallets = await this.getWalletsFromDatabase(userId);
    if (!wallets) return null;

    return {
      userId: wallets.userId,
      createdAt: wallets.createdAt,
      lastRegenerated: wallets.lastRegenerated,
      wallets: Object.fromEntries(
        Object.entries(wallets.wallets).map(([network, wallet]) => [
          network,
          {
            address: wallet.address,
            publicKey: wallet.publicKey
          }
        ])
      )
    };
  }
}

// Экспорт singleton instance
export const walletGenerator = WalletGenerator.getInstance();