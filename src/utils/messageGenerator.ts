import { Visit, Speaker, Host, Language, MessageType, MessageRole, CongregationProfile } from '@/types';
import { messageTemplates, hostRequestMessageTemplates, adaptMessageGender } from '@/data/messageTemplates';
import { formatFullDate } from './formatters';

// ============================================================================
// GÉNÉRATION DE MESSAGE POUR UNE VISITE
// ============================================================================

export function generateMessage(
  visit: Visit,
  speaker: Speaker | undefined,
  host: Host | undefined,
  congregationProfile: CongregationProfile,
  messageType: MessageType,
  role: MessageRole,
  language: Language,
  customTemplate?: string
): string {
  // Utiliser le modèle personnalisé si fourni, sinon le modèle par défaut
  const template = customTemplate || messageTemplates[language]?.[messageType]?.[role];

  if (!template) {
    return `Modèle non trouvé pour: ${language}/${messageType}/${role}`;
  }

  // Remplacer les variables
  let message = replaceVariables(template, visit, host, congregationProfile);

  // Adapter selon le genre
  message = adaptMessageGender(message, speaker?.gender, host?.gender);

  return message;
}

// ============================================================================
// REMPLACEMENT DES VARIABLES
// ============================================================================

function replaceVariables(
  template: string,
  visit: Visit,
  host: Host | undefined,
  congregationProfile: CongregationProfile
): string {
  let message = template;

  // Variables de l'orateur
  message = message.replace(/{speakerName}/g, visit.nom);
  message = message.replace(/{congregation}/g, visit.congregation);
  message = message.replace(/{speakerPhone}/g, visit.telephone || '(non renseigné)');

  // Variables du contact d'accueil
  const hostName = visit.host !== 'À définir' ? visit.host : '(non assigné)';
  message = message.replace(/{hostName}/g, hostName);
  message = message.replace(/{hostPhone}/g, host?.telephone || '(non renseigné)');
  message = message.replace(/{hostAddress}/g, host?.address || '(non renseignée)');

  // Variables de la visite
  message = message.replace(/{visitDate}/g, formatFullDate(visit.visitDate));
  message = message.replace(/{visitTime}/g, visit.visitTime);

  // Variables du discours
  if (visit.talkNoOrType && visit.talkTheme) {
    message = message.replace(/{talkNo}/g, String(visit.talkNoOrType));
    message = message.replace(/{talkTheme}/g, visit.talkTheme);
  }

  // Variables de la congrégation
  message = message.replace(/{hospitalityOverseer}/g, congregationProfile.hospitalityOverseer);
  message = message.replace(/{hospitalityOverseerPhone}/g, congregationProfile.hospitalityOverseerPhone);
  message = message.replace(/{congregationName}/g, congregationProfile.name);

  // Introduction pour premier contact
  const isFirstContact =
    !visit.communicationStatus || Object.keys(visit.communicationStatus).length === 0;

  if (isFirstContact) {
    const intro = getFirstTimeIntroduction(congregationProfile.name);
    message = message.replace(/{firstTimeIntroduction}/g, intro);
  } else {
    message = message.replace(/{firstTimeIntroduction}/g, '');
  }

  return message;
}

// ============================================================================
// INTRODUCTION PREMIER CONTACT
// ============================================================================

function getFirstTimeIntroduction(congregationName: string): string {
  return `\n\nJe suis le responsable de l'accueil pour le ${congregationName}.`;
}

// ============================================================================
// GÉNÉRATION DE DEMANDE D'ACCUEIL
// ============================================================================

export function generateHostRequestMessage(
  visits: Visit[],
  congregationProfile: CongregationProfile,
  language: Language,
  customTemplate?: string
): string {
  // Utiliser le modèle personnalisé si fourni, sinon le modèle par défaut
  const template = customTemplate || hostRequestMessageTemplates[language];

  if (!template) {
    return `Modèle non trouvé pour la langue: ${language}`;
  }

  // Créer la liste des visites
  const visitsList = visits
    .map((visit, index) => {
      const dateFormatted = formatFullDate(visit.visitDate, language);
      return `${index + 1}. *${visit.nom}* (${visit.congregation}) - ${dateFormatted} à ${visit.visitTime}`;
    })
    .join('\n');

  // Remplacer les variables
  let message = template;
  message = message.replace(/{visitsList}/g, visitsList);
  message = message.replace(/{hospitalityOverseer}/g, congregationProfile.hospitalityOverseer);
  message = message.replace(/{hospitalityOverseerPhone}/g, congregationProfile.hospitalityOverseerPhone);

  return message;
}

// ============================================================================
// GÉNÉRATION D'URL WHATSAPP
// ============================================================================

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Nettoyer le numéro de téléphone
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  // Encoder le message
  const encodedMessage = encodeURIComponent(message);

  // Détection mobile vs desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const baseUrl = isMobile ? 'whatsapp://send' : 'https://web.whatsapp.com/send';

  return `${baseUrl}?phone=${cleanPhone}&text=${encodedMessage}`;
}

// ============================================================================
// COPIER DANS LE PRESSE-PAPIERS
// ============================================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Méthode moderne
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback pour anciens navigateurs
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return success;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

// ============================================================================
// PARTAGE NATIF (MOBILE)
// ============================================================================

export async function shareMessage(message: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({
        text: message,
      });
      return true;
    }
    return false;
  } catch (error) {
    // L'utilisateur a annulé le partage
    return false;
  }
}

// ============================================================================
// GÉNÉRATION AVEC IA (GOOGLE GEMINI)
// ============================================================================

export async function generateWithAI(
  message: string,
  action: 'rewrite' | 'shorten' | 'expand' | 'formal' | 'friendly',
  apiKey: string,
  temperature: number = 0.7
): Promise<string> {
  try {
    // Import dynamique de la bibliothèque Gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature,
        maxOutputTokens: 1000,
      },
    });

    // Définir les prompts selon l'action
    const prompts = {
      rewrite: 'Réécris ce message de manière plus claire et professionnelle tout en gardant le sens:',
      shorten: 'Raccourcis ce message en gardant uniquement les informations essentielles:',
      expand: 'Développe ce message en ajoutant plus de détails et de chaleur:',
      formal: 'Réécris ce message avec un ton plus formel et respectueux:',
      friendly: 'Réécris ce message avec un ton plus amical et chaleureux:',
    };

    const prompt = `${prompts[action]}\n\n${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating with AI:', error);
    throw new Error("Erreur lors de la génération avec l'IA");
  }
}

// ============================================================================
// EXTRACTION DE VARIABLES D'UN MODÈLE
// ============================================================================

export function extractVariables(template: string): string[] {
  const regex = /{([^}]+)}/g;
  const matches = template.matchAll(regex);
  const variables = Array.from(matches, (m) => m[1]);
  return [...new Set(variables)]; // Dédupliquer
}

// ============================================================================
// VALIDATION DE MODÈLE
// ============================================================================

export function validateTemplate(template: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Vérifier que les accolades sont équilibrées
  const openBraces = (template.match(/{/g) || []).length;
  const closeBraces = (template.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    errors.push('Les accolades ne sont pas équilibrées');
  }

  // Vérifier que le template n'est pas vide
  if (template.trim() === '') {
    errors.push('Le modèle ne peut pas être vide');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
