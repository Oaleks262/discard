// Migration Manager for Card Encryption
// Handles migration of existing unencrypted cards to encrypted format

class MigrationManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.migrationKey = 'encryptionMigrationCompleted';
    this.migrationVersion = '1.0.0';
  }

  // Check if migration is needed
  needsMigration() {
    const migrationCompleted = localStorage.getItem(this.migrationKey);
    const hasUnencryptedCards = this.hasUnencryptedCards();

    return !migrationCompleted && hasUnencryptedCards && this.dataManager.encryptionEnabled;
  }

  // Check if there are unencrypted cards in storage or cards needing re-encryption
  hasUnencryptedCards() {
    try {
      const cardsData = localStorage.getItem('cards');
      if (!cardsData) return false;

      const cards = JSON.parse(cardsData);
      if (!Array.isArray(cards) || cards.length === 0) return false;

      // Check if any card lacks the 'isEncrypted' flag or needs client encryption
      return cards.some(card => !card.isEncrypted || card.needsClientEncryption);
    } catch (error) {
      console.error('Error checking for unencrypted cards:', error);
      return false;
    }
  }

  // Get count of unencrypted cards
  getUnencryptedCardsCount() {
    try {
      const cardsData = localStorage.getItem('cards');
      if (!cardsData) return 0;

      const cards = JSON.parse(cardsData);
      if (!Array.isArray(cards)) return 0;

      return cards.filter(card => !card.isEncrypted || card.needsClientEncryption).length;
    } catch (error) {
      console.error('Error counting unencrypted cards:', error);
      return 0;
    }
  }

  // Perform migration of cards to encrypted format
  async performMigration(showProgress = true) {
    if (!this.needsMigration()) {
      return { success: true, message: 'No migration needed' };
    }

    if (!this.dataManager.encryptionEnabled || !this.dataManager.cryptoManager) {
      console.error('Encryption not available for migration');
      return { success: false, error: 'Encryption not available' };
    }

    try {
      
      if (showProgress) {
        UIUtils.showToast('info', 'Міграція карток до захищеного формату...');
      }

      // Get current cards from localStorage
      const cardsData = localStorage.getItem('cards');
      if (!cardsData) {
        this.markMigrationCompleted();
        return { success: true, message: 'No cards to migrate' };
      }

      const currentCards = JSON.parse(cardsData);
      if (!Array.isArray(currentCards) || currentCards.length === 0) {
        this.markMigrationCompleted();
        return { success: true, message: 'No cards to migrate' };
      }

      // Count cards that need migration or re-encryption
      const cardsNeedingMigration = currentCards.filter(card => !card.isEncrypted || card.needsClientEncryption);

      if (cardsNeedingMigration.length === 0) {
        this.markMigrationCompleted();
        return { success: true, message: 'All cards already encrypted' };
      }

      // Handle cards that need client-side re-encryption
      for (const card of currentCards) {
        if (card.needsClientEncryption && card.code && !card.isEncrypted) {
          // This card was auto-migrated and fixed for display - contains plain text in code
          // We need to properly encrypt it
          try {
            const encryptedCode = await this.dataManager.cryptoManager.encryptCard(
              { code: card.code }, 
              this.dataManager.encryptionKey
            );
            
            // Update the card with proper encryption
            card.encryptedCode = encryptedCode;
            card.isEncrypted = true;
            card.needsClientEncryption = false; // Remove flag
            card.code = undefined; // Remove plain text
            
            // Update on server
            try {
              await this.dataManager.app.apiCall(`/cards/${card.id || card._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  encryptedCode: encryptedCode,
                  isEncrypted: true
                })
              });
            } catch (serverError) {
              console.error('Failed to update card on server:', serverError);
            }
          } catch (error) {
            console.error('Failed to re-encrypt card:', card.name, error);
          }
        }
      }

      // Migrate remaining cards using CryptoManager
      const migratedCards = await this.dataManager.cryptoManager.migrateCards(
        currentCards, 
        this.dataManager.encryptionKey
      );

      // Update AppState and localStorage with migrated cards
      AppState.cards = await this.dataManager.cryptoManager.decryptCards(
        migratedCards, 
        this.dataManager.encryptionKey
      );

      // Save encrypted cards to localStorage
      localStorage.setItem('cards', JSON.stringify(migratedCards));

      // Mark migration as completed
      this.markMigrationCompleted();
      
      if (showProgress) {
        UIUtils.showToast('success', `Мігровано ${unencryptedCards.length} карток до захищеного формату`);
      }

      return { 
        success: true, 
        message: `Successfully migrated ${unencryptedCards.length} cards`,
        migratedCount: unencryptedCards.length
      };

    } catch (error) {
      console.error('Migration failed:', error);
      
      if (showProgress) {
        UIUtils.showToast('error', 'Помилка міграції карток');
      }

      return { 
        success: false, 
        error: error.message || 'Migration failed' 
      };
    }
  }

  // Mark migration as completed
  markMigrationCompleted() {
    const migrationInfo = {
      version: this.migrationVersion,
      completedAt: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    localStorage.setItem(this.migrationKey, JSON.stringify(migrationInfo));
  }

  // Reset migration status (for testing)
  resetMigration() {
    localStorage.removeItem(this.migrationKey);
  }

  // Get migration status
  getMigrationStatus() {
    const migrationData = localStorage.getItem(this.migrationKey);
    if (!migrationData) {
      return { completed: false, needsMigration: this.needsMigration() };
    }

    try {
      const migrationInfo = JSON.parse(migrationData);
      return {
        completed: true,
        version: migrationInfo.version,
        completedAt: migrationInfo.completedAt,
        needsMigration: false
      };
    } catch (error) {
      console.error('Error parsing migration status:', error);
      return { completed: false, needsMigration: this.needsMigration() };
    }
  }

  // Auto-migration check and execution
  async checkAndMigrate(options = {}) {
    const { 
      showProgress = true, 
      autoRun = true,
      requireConfirmation = false 
    } = options;

    const status = this.getMigrationStatus();
    
    if (status.completed) {
      return { success: true, message: 'Migration already completed' };
    }

    if (!status.needsMigration) {
      return { success: true, message: 'No migration needed' };
    }

    const unencryptedCount = this.getUnencryptedCardsCount();

    if (requireConfirmation && window.confirm) {
      const confirmed = await window.confirm(
        `Знайдено ${unencryptedCount} незахищених карток. Мігрувати їх до захищеного формату?`,
        'Міграція карток'
      );
      
      if (!confirmed) {
        return { success: false, message: 'Migration cancelled by user' };
      }
    }

    if (autoRun) {
      return await this.performMigration(showProgress);
    } else {
      return { 
        success: true, 
        message: 'Migration available but not executed',
        pendingCount: unencryptedCount 
      };
    }
  }

  // Force migration (for manual triggers)
  async forceMigration() {
    this.resetMigration();
    return await this.performMigration(true);
  }
}

// Export for use in other modules
window.MigrationManager = MigrationManager;