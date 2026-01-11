import {
  Visit,
  Speaker,
  Host,
  Language,
  MessageType,
  MessageRole,
  CongregationProfile,
} from '@/types';
import {
  messageTemplates,
  hostRequestMessageTemplates,
  individualHostRequestTemplates,
  adaptMessageGender,
} from '@/data/messageTemplates';
import { formatFullDate } from './formatters';

// ============================================================================
// GÉNÉRATION DE MESSAGE POUR UNE VISITE
// ============================================================================

export function generateMessage(
  visit: Visit | null,
  speaker: Speaker | null | undefined,
  host: Host | null | undefined,
  congregationProfile: CongregationProfile,
  messageType: MessageType,
  role: MessageRole,
  language: Language,
  customTemplate?: string,
  allHosts: Host[] = []
): string {
  // Utiliser le modèle personnalisé si fourni, sinon le modèle par défaut
  const template = customTemplate || messageTemplates[language]?.[messageType]?.[role];
  
  console.log('Generating message:', { language, messageType, role, templateFound: !!template });

  if (!template) {
    return `Modèle non trouvé pour: ${language}/${messageType}/${role}`;
  }

  // Remplacer les variables
  let message = replaceVariables(template, visit, host, congregationProfile, language, allHosts);

  // Adapter selon le genre
  message = adaptMessageGender(message, speaker?.gender, host?.gender);

  return message;
}

// ============================================================================
// REMPLACEMENT DES VARIABLES
// ============================================================================

function replaceVariables(
  template: string,
  visit: Visit | null,
  host: Host | null | undefined,
  congregationProfile: CongregationProfile,
  language: Language,
  allHosts: Host[] = []
): string {
  let message = template;

  // Variables de l'orateur (si visite fournie)
  if (visit) {
    message = message.replace(/{speakerName}/g, visit.nom);
    message = message.replace(/{congregation}/g, visit.congregation);
    message = message.replace(/{speakerPhone}/g, visit.telephone || '(non renseigné)');

    // Variables du contact d'accueil principal (Hébergement par défaut)
    const hostName = visit.host !== 'À définir' ? visit.host : '(non assigné)';
    message = message.replace(/{hostName}/g, hostName);

    // Nouvelles variables logistiques intelligentes
    const assignments = visit.hostAssignments || [];
    
    // 1. Hébergement
    let accHostName = '';
    const accAssignment = assignments.find(a => a.role === 'accommodation');
    
    if (accAssignment) {
      accHostName = accAssignment.hostName;
    } else if (visit.logistics?.accommodation?.name) {
      accHostName = visit.logistics.accommodation.name;
    } else if (visit.host && visit.host !== 'À définir') {
      accHostName = visit.host; // Legacy fallback
    }

    const accHost = accHostName ? allHosts.find(h => h.nom === accHostName) : null;
    
    let accInfo = '';
    if (accHost) {
      if (language === 'pt') {
        accInfo = `🏠 *Alojamento*: ${accHost.nom}\n📞 *Telefone*: ${accHost.telephone || '(em falta)'}\n📍 *Morada*: ${accHost.address || '(em falta)'}`;
      } else if (language === 'cv') {
        accInfo = `🏠 *Alojamentu*: ${accHost.nom}\n📞 *Telefone*: ${accHost.telephone || '(falta-il)'}\n📍 *Morada*: ${accHost.address || '(falta-il)'}`;
      } else {
        accInfo = `🏠 *Hébergement* : ${accHost.nom}\n📞 *Téléphone* : ${accHost.telephone || '(non renseigné)'}\n📍 *Adresse* : ${accHost.address || '(non renseignée)'}`;
      }
    } else if (accHostName) {
       // Cas où le nom est connu mais pas l'objet Host (rare mais possible)
       accInfo = `🏠 *Hébergement* : ${accHostName}`;
    }
    message = message.replace(/{accommodationLogistics}/g, accInfo);

    // 2. Repas
    let mealsHostNames: string[] = [];
    const mealsAssignments = assignments.filter(a => a.role === 'meals');
    
    if (mealsAssignments.length > 0) {
      mealsHostNames = mealsAssignments.map(a => a.hostName);
    } else if (visit.meals && visit.meals !== 'À définir') {
      mealsHostNames = [visit.meals]; // Legacy fallback
    }

    let mealsInfo = '';
    mealsHostNames.forEach(name => {
      // N'inclure que si différent de l'hébergement
      if (name !== accHostName) {
        const mHost = allHosts.find(h => h.nom === name);
        if (mHost) {
          if (language === 'pt') {
            mealsInfo += `\n🍴 *Refeições*: ${mHost.nom}\n📞 *Telefone*: ${mHost.telephone || '(em falta)'}\n📍 *Morada*: ${mHost.address || '(em falta)'}\n`;
          } else if (language === 'cv') {
            mealsInfo += `\n🍴 *Kumida*: ${mHost.nom}\n📞 *Telefone*: ${mHost.telephone || '(falta-il)'}\n📍 *Morada*: ${mHost.address || '(falta-il)'}\n`;
          } else {
            mealsInfo += `\n🍴 *Repas* : ${mHost.nom}\n📞 *Téléphone* : ${mHost.telephone || '(non renseigné)'}\n📍 *Adresse* : ${mHost.address || '(non renseignée)'}\n`;
          }
        } else {
           mealsInfo += `\n🍴 *Repas* : ${name}\n`;
        }
      }
    });
    message = message.replace(/{mealsLogistics}/g, mealsInfo.trim());

    // 3. Ramassage
    const pickupAssignment = assignments.find(a => a.role === 'pickup');
    let pickupInfo = '';
    
    if (pickupAssignment) {
      // Différent de l'hébergement et des repas
      const isAccHost = accHostName && pickupAssignment.hostName === accHostName;
      const isMealsHost = mealsHostNames.includes(pickupAssignment.hostName);
      
      if (!isAccHost && !isMealsHost) {
        const pHost = allHosts.find(h => h.nom === pickupAssignment.hostName);
        if (pHost) {
          if (language === 'pt') {
            pickupInfo = `🚗 *Recolha*: ${pHost.nom} (📞 ${pHost.telephone || '(em falta)'})`;
          } else if (language === 'cv') {
            pickupInfo = `🚗 *Ramassage*: ${pHost.nom} (📞 ${pHost.telephone || '(falta-il)'})`;
          } else {
            pickupInfo = `🚗 *Ramassage* : ${pHost.nom} (📞 ${pHost.telephone || '(non renseigné)'})`;
          }
        }
      }
    } else if (visit.logistics?.itinerary?.meetingPoint) {
         // Fallback sur le point de rendez-vous si défini dans l'itinéraire
         pickupInfo = `🚗 *Ramassage* : ${visit.logistics.itinerary.meetingPoint}`;
    }
    
    message = message.replace(/{pickupLogistics}/g, pickupInfo);

    // Variables de la visite
    message = message.replace(/{visitDate}/g, formatFullDate(visit.visitDate, language));
    message = message.replace(/{visitTime}/g, visit.visitTime);

    // Variables du discours
    if (visit.talkNoOrType && visit.talkTheme) {
      message = message.replace(/{talkNo}/g, String(visit.talkNoOrType));
      message = message.replace(/{talkTheme}/g, visit.talkTheme);
    }

    // Introduction pour premier contact
    const isFirstContact =
      !visit.communicationStatus || Object.keys(visit.communicationStatus).length === 0;

    if (isFirstContact) {
      const intro = getFirstTimeIntroduction(congregationProfile.name, language);
      message = message.replace(/{firstTimeIntroduction}/g, intro);
    } else {
      message = message.replace(/{firstTimeIntroduction}/g, '');
    }
  } else {
    // Pas de visite - nettoyer les variables non utilisées
    message = message.replace(/{firstTimeIntroduction}/g, '');
  }

  // Variables de l'hôte (toujours disponibles)
  if (host) {
    message = message.replace(/{hostName}/g, host.nom);
    message = message.replace(/{hostPhone}/g, host.telephone || '(non renseigné)');
    message = message.replace(/{hostAddress}/g, host.address || '(non renseignée)');
  }

  // Variables de la congrégation (toujours disponibles)
  message = message.replace(/{hospitalityOverseer}/g, congregationProfile.hospitalityOverseer);
  message = message.replace(
    /{hospitalityOverseerPhone}/g,
    congregationProfile.hospitalityOverseerPhone
  );
  message = message.replace(/{congregationName}/g, congregationProfile.name);

  return message;
}

// ============================================================================
// INTRODUCTION PREMIER CONTACT
// ============================================================================

function getFirstTimeIntroduction(congregationName: string, language: Language): string {
  const introductions = {
    fr: `\n\nJe suis le responsable de l'accueil pour le ${congregationName}.`,
    cv: `\n\nNu ta responsavel di akolhimentu pa ${congregationName}.`,
    pt: `\n\nSou o responsável pela hospitalidade para o ${congregationName}.`,
  };

  return introductions[language] || introductions.fr;
}

// ============================================================================
// GÉNÉRATION DE DEMANDE D'ACCUEIL
// ============================================================================

export function generateHostRequestMessage(
  visits: Visit[],
  congregationProfile: CongregationProfile,
  language: Language,
  customTemplate?: string,
  isIndividualRequest: boolean = false,
  hostName: string = ''
): string {
  // Importer le modèle de demande individuelle si nécessaire
  const individualTemplates = isIndividualRequest ? individualHostRequestTemplates[language] : null;

  // Utiliser le modèle personnalisé si fourni, sinon le modèle approprié
  let template: string;

  if (customTemplate) {
    template = customTemplate;
  } else if (isIndividualRequest && individualTemplates) {
    template = individualTemplates;
  } else {
    template = hostRequestMessageTemplates[language];
  }

  if (!template) {
    return `Aucun modèle de demande d'accueil trouvé pour la langue: ${language}`;
  }

  // Générer la liste des visites ou traiter une seule visite pour une demande individuelle
  let message = template;

  if (isIndividualRequest && visits.length > 0) {
    const visit = visits[0]; // Pour une demande individuelle, on prend la première visite

    // Remplacer les variables spécifiques à la visite
    message = message
      .replace(/{speakerName}/g, visit.nom)
      .replace(/{congregation}/g, visit.congregation)
      .replace(/{speakerPhone}/g, visit.telephone || '(non renseigné)')
      .replace(/{visitDate}/g, formatFullDate(visit.visitDate))
      .replace(/{visitTime}/g, visit.visitTime)
      .replace(/{location}/g, congregationProfile.name)
      .replace(/{talkTitle}/g, visit.talkTheme || 'une intervention')
      .replace(/{hostName}/g, hostName || "[NOM DE L'HÔTE]");
  } else {
    // Générer la liste des visites pour une demande groupée
    const visitsList = visits
      .map((visit) => {
        return `• ${formatFullDate(visit.visitDate)} à ${visit.visitTime} - ${visit.nom} (${visit.congregation})`;
      })
      .join('\n\n');

    message = message.replace(/{visitsList}/g, visitsList);
  }

  // Remplacer les variables communes du modèle
  message = message
    .replace(/{congregationName}/g, congregationProfile.name)
    .replace(/{hospitalityOverseer}/g, congregationProfile.hospitalityOverseer)
    .replace(/{hospitalityOverseerPhone}/g, congregationProfile.hospitalityOverseerPhone);

  return message;
}

// ============================================================================
// GÉNÉRATION DE DEMANDE D'ACCUEIL EN BROADCAST
// ============================================================================

export function generateBroadcastHostRequest(
  visit: Visit,
  host: Host,
  congregationProfile: CongregationProfile,
  language: Language
): string {
  // TODO: Déplacer les modèles dans messageTemplates.ts
  const templates = {
    fr: `Bonjour {hostName}, \n\nNotre assemblée recherche une famille d'accueil pour un orateur qui nous visitera prochainement. Seriez-vous disponibles pour l'héberger ?\n\n- Orateur : {speakerName}\n- Congrégation : {congregation}\n- Date de la visite : {visitDate}\n\nSi vous êtes en mesure de l'accueillir, pourriez-vous s'il vous plaît contacter rapidement {hospitalityOverseer} au {hospitalityOverseerPhone} ?\n\nMerci beaucoup pour votre hospitalité !`,
    pt: `Olá {hostName}, \n\nA nossa congregação está à procura de uma família anfitriã para um orador que nos visitará em breve. Estariam disponíveis para o hospedar?\n\n- Orador: {speakerName}\n- Congregação: {congregation}\n- Data da visita: {visitDate}\n\nSe puderem recebê-lo, por favor, contactem rapidamente {hospitalityOverseer} através do {hospitalityOverseerPhone}.\n\nMuito obrigado pela vossa hospitalidade!`,
    cv: `Olá {hostName}, \n\nNôs kongregason sta ta buska un família pa resebe un orador ki ta ben vizitanu prosimamenti. Nhos sta disponível pa o-resebe?\n\n- Orador: {speakerName}\n- Kongregason: {congregation}\n- Data di vizita: {visitDate}\n\nSi nhos pode resebe-l, pur favor, entra en kontatu ku {hospitalityOverseer} pa {hospitalityOverseerPhone}.\n\nMutu obrigadu pa nhos ospitalidadi!`,
  };

  const template = templates[language] || templates.fr;

  let message = template
    .replace(/{hostName}/g, host.nom)
    .replace(/{speakerName}/g, visit.nom)
    .replace(/{congregation}/g, visit.congregation)
    .replace(/{visitDate}/g, formatFullDate(visit.visitDate))
    .replace(/{hospitalityOverseer}/g, congregationProfile.hospitalityOverseer)
    .replace(/{hospitalityOverseerPhone}/g, congregationProfile.hospitalityOverseerPhone);
  
  message = adaptMessageGender(message, undefined, host?.gender);

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
