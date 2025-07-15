import { walletGenerator, UserWallets } from './WalletGenerator';

// Сервис для интеграции с основным приложением
export class WalletService {
  
  // Создание кошельков при регистрации пользователя
  static async createWalletsForNewUser(userId: string, userEmail: string): Promise<UserWallets> {
    try {
      console.log(`🚀 Creating wallets for new user: ${userEmail} (${userId})`);
      
      const userWallets = await walletGenerator.generateUserWallets(userId);
      
      console.log('✅ All wallets created successfully:');
      console.log(`📧 User: ${userEmail}`);
      console.log(`🆔 User ID: ${userId}`);
      console.log(`🔗 TRC-20 (Tron): ${userWallets.wallets.trc20.address}`);
      console.log(`🔗 ERC-20 (Ethereum): ${userWallets.wallets.erc20.address}`);
      console.log(`🔗 BEP-20 (BSC): ${userWallets.wallets.bep20.address}`);
      console.log(`🔗 TON: ${userWallets.wallets.ton.address}`);
      
      // Обновляем пользователя в основном приложении
      await this.updateUserWithWallets(userId, userWallets);
      
      return userWallets;
    } catch (error) {
      console.error('❌ Failed to create wallets for user:', error);
      throw new Error(`Wallet creation failed: ${error}`);
    }
  }

  // Получение кошельков пользователя (публичная информация)
  static async getUserWallets(userId: string) {
    try {
      return await walletGenerator.getUserWalletsPublic(userId);
    } catch (error) {
      console.error('Failed to get user wallets:', error);
      return null;
    }
  }

  // Регенерация кошельков администратором
  static async regenerateWallets(
    userId: string, 
    adminId: string, 
    networks?: string[]
  ): Promise<UserWallets> {
    try {
      console.log(`🔄 Admin ${adminId} regenerating wallets for user ${userId}`);
      
      const updatedWallets = await walletGenerator.regenerateUserWallets(
        userId, 
        adminId, 
        networks
      );
      
      // Обновляем пользователя в основном приложении
      await this.updateUserWithWallets(userId, updatedWallets);
      
      return updatedWallets;
    } catch (error) {
      console.error('❌ Failed to regenerate wallets:', error);
      throw error;
    }
  }

  // Валидация адреса
  static validateAddress(address: string, network: string): boolean {
    return walletGenerator.validateAddress(address, network);
  }

  // Получение приватного ключа (только для админов)
  static async getPrivateKey(
    userId: string, 
    network: string, 
    adminId: string
  ): Promise<string> {
    try {
      return await walletGenerator.getDecryptedPrivateKey(userId, network, adminId);
    } catch (error) {
      console.error('❌ Failed to get private key:', error);
      throw error;
    }
  }

  // Обновление пользователя с информацией о кошельках
  private static async updateUserWithWallets(userId: string, wallets: UserWallets): Promise<void> {
    try {
      // Получаем текущих пользователей
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      
      // Находим пользователя по ID
      const userEmail = Object.keys(allUsers).find(email => allUsers[email].id === userId);
      
      if (userEmail && allUsers[userEmail]) {
        // Обновляем пользователя с информацией о кошельках
        allUsers[userEmail] = {
          ...allUsers[userEmail],
          multiWallets: {
            trc20: wallets.wallets.trc20.address,
            erc20: wallets.wallets.erc20.address,
            bep20: wallets.wallets.bep20.address,
            ton: wallets.wallets.ton.address
          },
          walletsCreatedAt: wallets.createdAt,
          walletsLastRegenerated: wallets.lastRegenerated
        };
        
        // Сохраняем обновленных пользователей
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        // Обновляем текущего пользователя, если он авторизован
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (currentUser && currentUser.id === userId) {
          const updatedCurrentUser = {
            ...currentUser,
            multiWallets: allUsers[userEmail].multiWallets,
            walletsCreatedAt: wallets.createdAt,
            walletsLastRegenerated: wallets.lastRegenerated
          };
          localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
        }
        
        console.log(`✅ User ${userEmail} updated with wallet information`);
      }
    } catch (error) {
      console.error('Failed to update user with wallets:', error);
    }
  }

  // Статистика кошельков для админ-панели
  static async getWalletStatistics() {
    try {
      const allWallets = JSON.parse(localStorage.getItem('userWallets') || '{}');
      const userCount = Object.keys(allWallets).length;
      
      const networkStats = {
        trc20: 0,
        erc20: 0,
        bep20: 0,
        ton: 0
      };

      Object.values(allWallets).forEach((userWallet: any) => {
        if (userWallet.wallets) {
          Object.keys(networkStats).forEach(network => {
            if (userWallet.wallets[network]) {
              networkStats[network as keyof typeof networkStats]++;
            }
          });
        }
      });

      return {
        totalUsers: userCount,
        networkStats,
        lastGenerated: userCount > 0 ? new Date().toISOString() : null
      };
    } catch (error) {
      console.error('Failed to get wallet statistics:', error);
      return {
        totalUsers: 0,
        networkStats: { trc20: 0, erc20: 0, bep20: 0, ton: 0 },
        lastGenerated: null
      };
    }
  }
}

// Хук для автоматического создания кошельков при регистрации
export const initializeWalletsOnRegistration = async (userId: string, userEmail: string) => {
  try {
    await WalletService.createWalletsForNewUser(userId, userEmail);
  } catch (error) {
    console.error('Failed to initialize wallets on registration:', error);
    // В продакшене отправить уведомление администратору
  }
};