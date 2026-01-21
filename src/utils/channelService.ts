import { Message, CommunicationChannel } from '@/stores/messagingStore';

// ============================================================================
// SERVICE MULTI-CANAUX POUR L'ENVOI DE MESSAGES
// ============================================================================

class ChannelService {
  static async send(channel: CommunicationChannel, message: Message): Promise<boolean> {
    switch (channel) {
      case 'whatsapp':
        return this.sendWhatsApp(message);
      case 'sms':
        return this.sendSMS(message);
      case 'email':
        return this.sendEmail(message);
      default:
        console.warn('Unknown channel:', channel);
        return false;
    }
  }

  private static async sendWhatsApp(message: Message): Promise<boolean> {
    try {
      // Simulation d'envoi WhatsApp (sera remplacé par API réelle)
      console.log('📱 Sending WhatsApp message:', {
        to: message.recipientId,
        content: message.content.substring(0, 50) + '...',
        language: message.language
      });

      // Créer l'URL WhatsApp
      const phoneNumber = this.extractPhoneNumber(message.recipientId);
      if (!phoneNumber) {
        console.error('No phone number found for recipient:', message.recipientId);
        return false;
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const encodedMessage = encodeURIComponent(message.content);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

      // Ouvrir WhatsApp (en production, utiliser une API)
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      return true;
    } catch (error) {
      console.error('Erreur envoi WhatsApp:', error);
      return false;
    }
  }

  private static async sendSMS(message: Message): Promise<boolean> {
    try {
      console.log('📨 Sending SMS:', {
        to: message.recipientId,
        content: message.content.substring(0, 50) + '...',
        language: message.language
      });

      // Simulation d'envoi SMS
      const phoneNumber = this.extractPhoneNumber(message.recipientId);
      if (!phoneNumber) {
        console.error('No phone number found for recipient:', message.recipientId);
        return false;
      }

      // En production, intégrer avec un service SMS (Twilio, etc.)
      console.log(`SMS would be sent to ${phoneNumber}`);

      return true;
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      return false;
    }
  }

  private static async sendEmail(message: Message): Promise<boolean> {
    try {
      console.log('📧 Sending Email:', {
        to: message.recipientId,
        content: message.content.substring(0, 50) + '...',
        language: message.language
      });

      // Simulation d'envoi Email
      const email = this.extractEmail(message.recipientId);
      if (!email) {
        console.error('No email found for recipient:', message.recipientId);
        return false;
      }

      // En production, intégrer avec un service Email (SendGrid, etc.)
      const subject = `Message de l'assemblée - ${message.language.toUpperCase()}`;
      const body = encodeURIComponent(message.content);

      if (typeof window !== 'undefined') {
        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
      }

      return true;
    } catch (error) {
      console.error('Erreur envoi Email:', error);
      return false;
    }
  }

  // Helpers pour extraire les coordonnées
  private static extractPhoneNumber(recipientId: string): string | null {
    // Pour l'instant, considérer que recipientId peut contenir un numéro
    // En production, faire une requête à l'API pour récupérer les données du destinataire
    if (recipientId.match(/^\+?\d{10,15}$/)) {
      return recipientId;
    }

    // Simulation: retourner un numéro par défaut basé sur l'ID
    if (recipientId.includes('albufeira')) return '+351912345678';
    if (recipientId.includes('ettelbruck')) return '+352123456789';
    if (recipientId.includes('cabo-verde') || recipientId.includes('cv')) return '+238123456789';

    return '+33123456789'; // Défaut
  }

  private static extractEmail(recipientId: string): string | null {
    // Simulation: générer un email basé sur l'ID
    if (recipientId.includes('@')) return recipientId;

    const baseName = recipientId.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${baseName}@example.com`;
  }

  // Vérifier si un canal est supporté
  static isChannelSupported(channel: CommunicationChannel): boolean {
    return ['whatsapp', 'sms', 'email'].includes(channel);
  }

  // Obtenir les canaux disponibles pour un destinataire
  static getAvailableChannels(_recipientId: string): CommunicationChannel[] {
    const channels: CommunicationChannel[] = [];

    // Simulation: tous les canaux sont disponibles
    // En production, vérifier les préférences du destinataire
    channels.push('whatsapp', 'sms', 'email');

    return channels;
  }
}

// ============================================================================
// SUIVI DE STATUT DES MESSAGES
// ============================================================================

class StatusTracker {
  private static trackedMessages: Map<string, NodeJS.Timeout> = new Map();

  static track(messageId: string, onStatusUpdate?: (messageId: string, status: string) => void): void {
    const intervals = [
      { delay: 5000, status: 'delivered' },
      { delay: 30000, status: 'read' }
    ];

    intervals.forEach(({ delay, status }) => {
      const timeout = setTimeout(() => {
        console.log(`Message ${messageId} status updated to: ${status}`);
        if (onStatusUpdate) {
          onStatusUpdate(messageId, status);
        }
      }, delay);

      this.trackedMessages.set(`${messageId}-${status}`, timeout);
    });
  }

  static stopTracking(messageId: string): void {
    this.trackedMessages.forEach((timeout, key) => {
      if (key.startsWith(messageId)) {
        clearTimeout(timeout);
        this.trackedMessages.delete(key);
      }
    });
  }

  static stopAllTracking(): void {
    this.trackedMessages.forEach((timeout) => clearTimeout(timeout));
    this.trackedMessages.clear();
  }
}

// ============================================================================
// MOTEUR DE TEMPLATES AMÉLIORÉ
// ============================================================================

class TemplateEngine {
  static render(template: string, variables: Record<string, any>): string {
    let result = template;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });

    return result;
  }

  static extractVariables(template: string): string[] {
    const regex = /{([^}]+)}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(template)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  static validate(template: string, variables: Record<string, any>): { valid: boolean; missing: string[] } {
    const required = this.extractVariables(template);
    const provided = Object.keys(variables);
    const missing = required.filter(v => !provided.includes(v));

    return {
      valid: missing.length === 0,
      missing
    };
  }

  static preview(template: string, variables: Record<string, any>, _language: string): string {
    let preview = this.render(template, variables);
    preview = preview.replace(/\n{3,}/g, '\n\n'); // Limiter les sauts de ligne
    return preview.length > 200 ? preview.substring(0, 200) + '...' : preview;
  }
}

export { ChannelService, StatusTracker, TemplateEngine };
export default ChannelService;