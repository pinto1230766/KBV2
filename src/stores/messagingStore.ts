import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ChannelService, StatusTracker, TemplateEngine } from '@/utils/channelService';

// ============================================================================
// TYPES POUR LA MESSAGERIE
// ============================================================================

export type Language = 'fr' | 'pt' | 'cv';
export type MessageCategory = 'invitation' | 'confirmation' | 'reminder' | 'cancellation' | 'thank-you' | 'follow-up';
export type MessageRole = 'speaker' | 'host';
export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read' | 'replied';
export type CommunicationChannel = 'whatsapp' | 'sms' | 'email';

export interface MessageTemplate {
  id: string;
  name: string;
  category: MessageCategory;
  translations: {
    fr: string;
    pt: string;
    cv: string;
  };
  variables: string[];
  context: string[];
  usageCount: number;
  lastUsed: Date | null;
}

export interface Message {
  id: string;
  recipientId: string;
  recipientType: MessageRole;
  templateId: string | null;
  content: string;
  language: Language;
  channels: CommunicationChannel[];
  status: MessageStatus;
  sentAt: Date | null;
  readAt: Date | null;
  repliedAt: Date | null;
  reply: string | null;
  metadata: {
    visitId?: string;
    congregation?: string;
    automatic?: boolean;
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface MessageStats {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalReplied: number;
  avgResponseTime: number;
  byChannel: Record<string, number>;
  byLanguage: Record<string, number>;
  byCongregation: Record<string, number>;
}

interface MessagingStore {
  // État
  templates: MessageTemplate[];
  messages: Message[];
  stats: MessageStats;
  activeLanguage: Language;
  autoDetectLanguage: boolean;

  // Actions
  createTemplate: (template: Omit<MessageTemplate, 'id' | 'usageCount' | 'lastUsed'>) => void;
  generateMessage: (templateId: string, recipientId: string, variables: Record<string, any>) => Promise<Message>;
  sendMessage: (messageId: string, channels: CommunicationChannel[]) => Promise<void>;
  trackResponse: (messageId: string, reply: string) => void;
  detectLanguage: (recipientId: string) => Promise<Language>;
  getSmartSuggestions: (context: string) => MessageTemplate[];
  setActiveLanguage: (lang: Language) => void;
  toggleAutoDetect: () => void;

  // Nouvelles méthodes pour compatibilité
  getTemplatesByCategory: (category: MessageCategory) => MessageTemplate[];
  getTemplatesByLanguage: (language: Language) => MessageTemplate[];
  updateTemplateUsage: (templateId: string) => void;

  // Méthode helper interne
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
}

// ============================================================================
// TEMPLATES PAR DÉFAUT - Conversion depuis messageTemplates.ts
// ============================================================================

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  // Confirmation orateur
  {
    id: 'confirmation-speaker',
    name: 'Confirmation visite orateur',
    category: 'confirmation',
    translations: {
      fr: `Bonjour Frère *{speakerName}*,{firstTimeIntroduction}

J'espère que tu vas bien. 🙏

C'est avec joie que nous attendons ta visite le *{visitDate} à {visitTime}*.

Pourrais-tu me confirmer ta présence et me faire savoir si tu as besoin de quelque chose de spécial (hébergement, repas, transport) ?

Merci beaucoup et à bientôt !

Fraternellement,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
      pt: `Olá Irmão *{speakerName}*,{firstTimeIntroduction}

Espero que estejas bem. 🙏

Aguardamos com alegria a tua visita no dia *{visitDate} às {visitTime}*.

Poderias confirmar a tua presença e dizer-me se precisas de algo especial (alojamento, refeições, transporte)?

Muito obrigado e até breve!

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
      cv: `Bon dia Mon *{speakerName}*,{firstTimeIntroduction}

N ta spera ma bu sta bon. 🙏

E ku alegria ma nu ta spera bu bizita dia *{visitDate} na {visitTime}*.

Bu pode confirma-m bu prezensa i txoma-m si bu ten nesesidadi di kualker koza (alojamentu, kumida, transporte)?

Obrigadu di more i te logu!

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`
    },
    variables: ['speakerName', 'visitDate', 'visitTime', 'firstTimeIntroduction', 'hospitalityOverseer', 'hospitalityOverseerPhone'],
    context: ['confirmation', 'speaker', 'visit'],
    usageCount: 0,
    lastUsed: null
  },

  // Préparation orateur
  {
    id: 'preparation-speaker',
    name: 'Préparation visite orateur',
    category: 'invitation',
    translations: {
      fr: `Bonjour Frère *{speakerName}*,

Merci pour ta confirmation ! 😊

Voici les détails pour ta visite du *{visitDate} à {visitTime}* :

🏠 *Contact d'accueil* : {hostName}
📞 *Téléphone* : {hostPhone}
📍 *Adresse* : {hostAddress}

N'hésite pas à contacter directement notre frère {hostName} si besoin.

Au plaisir de te voir bientôt !

Fraternellement,
{hospitalityOverseer}`,
      pt: `Olá Irmão *{speakerName}*,

Obrigado pela tua confirmação! 😊

Aqui estão os detalhes para a tua visita de *{visitDate} às {visitTime}*:

🏠 *Contacto de acolhimento*: {hostName}
📞 *Telefone*: {hostPhone}
📍 *Morada*: {hostAddress}

Não hesites em contactar diretamente o nosso irmão {hostName} se precisares.

Até breve!

Fraternalmente,
{hospitalityOverseer}`,
      cv: `Bon dia Mon *{speakerName}*,

Obrigadu pa bu konfirmasón! 😊

Aki es detalhis pa bu bizita dia *{visitDate} na {visitTime}* :

🏠 *Kontaktu di akolhimentu* : {hostName}
📞 *Telefone* : {hostPhone}
📍 *Morada* : {hostAddress}

Si bu prisize, bu pode kontakta diretamenti nu mon {hostName}.

Te logu!

Fraternalmenti,
{hospitalityOverseer}`
    },
    variables: ['speakerName', 'visitDate', 'visitTime', 'hostName', 'hostPhone', 'hostAddress', 'hospitalityOverseer'],
    context: ['preparation', 'speaker', 'visit'],
    usageCount: 0,
    lastUsed: null
  },

  // Rappel 7 jours
  {
    id: 'reminder-7-speaker',
    name: 'Rappel 7 jours avant',
    category: 'reminder',
    translations: {
      fr: `Bonjour Frère *{speakerName}*,

Petit rappel amical : nous attendons ta visite avec joie dans *7 jours*, le *{visitDate} à {visitTime}* ! 🎉

📍 Adresse : {hostAddress}
📞 Contact : {hostName} - {hostPhone}

Bon voyage et à très bientôt !

Fraternellement,
{hospitalityOverseer}`,
      pt: `Olá Irmão *{speakerName}*,

Lembrete amigável: aguardamos a tua visita com alegria daqui a *7 dias*, no dia *{visitDate} às {visitTime}*! 🎉

📍 Morada: {hostAddress}
📞 Contacto: {hostName} - {hostPhone}

Boa viagem e até breve!

Fraternalmente,
{hospitalityOverseer}`,
      cv: `Bon dia Mon *{speakerName}*,

Limbransá di amizadi: nu ta spera bu bizita ku alegria dento di *7 dia*, dia *{visitDate} na {visitTime}*! 🎉

📍 Morada : {hostAddress}
📞 Kontaktu : {hostName} - {hostPhone}

Bon biaji i te logu!

Fraternalmenti,
{hospitalityOverseer}`
    },
    variables: ['speakerName', 'visitDate', 'visitTime', 'hostAddress', 'hostName', 'hostPhone', 'hospitalityOverseer'],
    context: ['reminder', '7-days', 'speaker'],
    usageCount: 0,
    lastUsed: null
  },

  // Merci après visite
  {
    id: 'thank-you-speaker',
    name: 'Remerciement après visite',
    category: 'thank-you',
    translations: {
      fr: `Bonjour Frère *{speakerName}*,

Merci infiniment pour ta visite et ton discours édifiant ! 🙏✨

Ce fut un réel plaisir de t'accueillir parmi nous. Nous espérons te revoir très bientôt !

Fraternellement,
{hospitalityOverseer}`,
      pt: `Olá Irmão *{speakerName}*,

Muito obrigado pela tua visita e pelo teu discurso edificante! 🙏✨

Foi um verdadeiro prazer receber-te entre nós. Esperamos ver-te novamente em breve!

Fraternalmente,
{hospitalityOverseer}`,
      cv: `Bon dia Mon *{speakerName}*,

Obrigadu infinitamenti pa bu bizita i bu diskursu idifikanti! 🙏✨

Foi un prazer riali di akolhe-u entre nu. Nu ta spera bo i-u logu!

Fraternalmenti,
{hospitalityOverseer}`
    },
    variables: ['speakerName', 'hospitalityOverseer'],
    context: ['thank-you', 'speaker', 'post-visit'],
    usageCount: 0,
    lastUsed: null
  }
];

// ============================================================================
// STORE DE MESSAGERIE
// ============================================================================

export const useMessagingStore = create<MessagingStore>()(
  subscribeWithSelector((set, get) => ({
    // État initial
    templates: DEFAULT_TEMPLATES,
    messages: [],
    stats: {
      totalSent: 0,
      totalDelivered: 0,
      totalRead: 0,
      totalReplied: 0,
      avgResponseTime: 0,
      byChannel: {},
      byLanguage: {},
      byCongregation: {}
    },
    activeLanguage: 'fr',
    autoDetectLanguage: true,

    // Actions
    createTemplate: (template) => {
      const newTemplate: MessageTemplate = {
        ...template,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        usageCount: 0,
        lastUsed: null
      };

      set(state => ({
        templates: [...state.templates, newTemplate]
      }));
    },

    generateMessage: async (templateId, recipientId, variables) => {
      const state = get();
      const template = state.templates.find(t => t.id === templateId);

      if (!template) throw new Error('Template not found');

      const language = state.autoDetectLanguage
        ? await get().detectLanguage(recipientId)
        : state.activeLanguage;

      // Utilisation du TemplateEngine pour le rendu avancé
      const content = TemplateEngine.render(template.translations[language], variables);

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        recipientId,
        recipientType: 'speaker', // TODO: déterminer automatiquement
        templateId,
        content,
        language,
        channels: ['whatsapp'],
        status: 'draft',
        sentAt: null,
        readAt: null,
        repliedAt: null,
        reply: null,
        metadata: {
          automatic: false,
          priority: 'medium'
        }
      };

      set(state => ({
        messages: [...state.messages, message],
        templates: state.templates.map(t =>
          t.id === templateId
            ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date() }
            : t
        )
      }));

      return message;
    },

    sendMessage: async (messageId, channels) => {
      const state = get();
      const message = state.messages.find(m => m.id === messageId);

      if (!message) throw new Error('Message not found');

      // Envoi réel via ChannelService
      const sendPromises = channels.map(channel =>
        ChannelService.send(channel, message)
      );

      try {
        const results = await Promise.all(sendPromises);
        const successCount = results.filter(Boolean).length;

        console.log(`Message sent to ${successCount}/${channels.length} channels`);

        set(state => ({
          messages: state.messages.map(m =>
            m.id === messageId
              ? { ...m, status: 'sent', sentAt: new Date(), channels }
              : m
          ),
          stats: {
            ...state.stats,
            totalSent: state.stats.totalSent + successCount,
            byChannel: {
              ...state.stats.byChannel,
              ...channels.reduce((acc, ch) => ({ ...acc, [ch]: (state.stats.byChannel[ch] || 0) + 1 }), {})
            },
            byLanguage: {
              ...state.stats.byLanguage,
              [message.language]: (state.stats.byLanguage[message.language] || 0) + successCount
            }
          }
        }));

        // Démarrer le suivi de statut
        StatusTracker.track(messageId, (msgId, status) => {
          get().updateMessageStatus(msgId, status as MessageStatus);
        });

      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    trackResponse: (messageId, reply) => {
      set(state => {
        const message = state.messages.find(m => m.id === messageId);
        if (!message) return state;

        const responseTime = message.sentAt
          ? Date.now() - message.sentAt.getTime()
          : 0;

        return {
          messages: state.messages.map(m =>
            m.id === messageId
              ? { ...m, reply, repliedAt: new Date(), status: 'replied' }
              : m
          ),
          stats: {
            ...state.stats,
            totalReplied: state.stats.totalReplied + 1,
            avgResponseTime: (state.stats.avgResponseTime * state.stats.totalReplied + responseTime)
              / (state.stats.totalReplied + 1)
          }
        };
      });
    },

    detectLanguage: async (recipientId) => {
      // TODO: Intégrer avec les vraies données des speakers/hosts
      // Pour l'instant, simulation basée sur l'ID
      if (recipientId.includes('albufeira') || recipientId.includes('Albufeira')) return 'pt';
      if (recipientId.includes('ettelbruck') || recipientId.includes('Ettelbruck')) return 'fr';
      if (recipientId.includes('+238')) return 'cv';
      if (recipientId.includes('+351')) return 'pt';
      if (recipientId.includes('+33')) return 'fr';

      return 'fr'; // Défaut
    },

    getSmartSuggestions: (context) => {
      const state = get();
      return state.templates
        .filter(t => t.context.includes(context))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5);
    },

    setActiveLanguage: (lang) => set({ activeLanguage: lang }),
    toggleAutoDetect: () => set(state => ({ autoDetectLanguage: !state.autoDetectLanguage })),

    // Nouvelles méthodes pour compatibilité
    getTemplatesByCategory: (category) => {
      return get().templates.filter(t => t.category === category);
    },

    getTemplatesByLanguage: (language) => {
      return get().templates.filter(t => t.translations[language]);
    },

    updateTemplateUsage: (templateId) => {
      set(state => ({
        templates: state.templates.map(t =>
          t.id === templateId
            ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date() }
            : t
        )
      }));
    },

    // Méthode helper pour simulation de statut
    updateMessageStatus: (messageId, status) => {
      set(state => ({
        messages: state.messages.map(m =>
          m.id === messageId
            ? {
                ...m,
                status: status as MessageStatus,
                ...(status === 'delivered' && { readAt: null }),
                ...(status === 'read' && { readAt: new Date() })
              }
            : m
        ),
        stats: {
          ...state.stats,
          ...(status === 'delivered' && { totalDelivered: state.stats.totalDelivered + 1 }),
          ...(status === 'read' && { totalRead: state.stats.totalRead + 1 })
        }
      }));
    }
  }))
);

// ============================================================================
// SÉLECTEURS OPTIMISÉS
// ============================================================================

const createSelectors = <T extends Record<string, any>>(store: any) => ({
  useTemplates: () => store((state: T) => state.templates),
  useMessages: () => store((state: T) => state.messages),
  useStats: () => store((state: T) => state.stats),
  useActiveLanguage: () => store((state: T) => state.activeLanguage),
  useAutoDetectLanguage: () => store((state: T) => state.autoDetectLanguage),
  useTemplatesByCategory: (category: MessageCategory) =>
    store((state: T) => state.templates.filter((t: MessageTemplate) => t.category === category)),
});

export const {
  useTemplates,
  useMessages,
  useStats,
  useActiveLanguage,
  useAutoDetectLanguage,
  useTemplatesByCategory,
} = createSelectors(useMessagingStore);

// ============================================================================
// SUBSCRIPTIONS POUR DEBUGGING
// ============================================================================

useMessagingStore.subscribe(
  (state) => state.messages.length,
  (messageCount) => {
    console.log('Messages count changed:', messageCount);
  }
);

useMessagingStore.subscribe(
  (state) => state.stats.totalSent,
  (totalSent) => {
    console.log('Total messages sent:', totalSent);
  }
);
