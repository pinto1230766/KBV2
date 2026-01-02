import { useSettings } from '@/contexts/SettingsContext';

// Dictionnaire de traductions
const translations = {
  fr: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'Le nom est obligatoire',
    'Un contact avec ce nom existe déjà': 'Un contact avec ce nom existe déjà',
    'Erreur': 'Erreur',

    // Messages de succès
    'Contact mis à jour avec succès': 'Contact mis à jour avec succès',
    'Contact ajouté avec succès': 'Contact ajouté avec succès',

    // Titres et labels
    'Modifier le foyer': 'Modifier le foyer',
    'Nouveau Foyer': 'Nouveau Foyer',
    'Le Foyer': 'Le Foyer',
    'Nom du foyer': 'Nom du foyer',
    'Type': 'Type',
    'Adresse': 'Adresse',
    'Contact': 'Contact',
    'Capacité & Particularités': 'Capacité & Particularités',
    'Capacité (personnes)': 'Capacité (personnes)',
    'Contraintes / Préférences': 'Contraintes / Préférences',
    'Annuler': 'Annuler',
    'Enregistrer': 'Enregistrer',

    // Valeurs et options
    'Couple': 'Couple',
    'Frère': 'Frère',
    'Sœur': 'Sœur',
    'Animaux': 'Animaux',

    // Placeholders
    'Ex: Famille Martin': 'Ex: Famille Martin',
    '12 rue de la Paix, Lyon': '12 rue de la Paix, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'famille@example.com': 'famille@example.com',
    'Allergies, escaliers, régimes particuliers...': 'Allergies, escaliers, régimes particuliers...',

    // Descriptions
    'Gérez les capacités d\'accueil de la congrégation.': 'Gérez les capacités d\'accueil de la congrégation.',

    // Messages de la liste des hôtes
    'Capacité:': 'Capacité:',
    'pers.': 'pers.',
    'Aucun contact trouvé': 'Aucun contact trouvé',
  },
  cv: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'Nomi ta obligatoriu',
    'Un contact avec ce nom existe déjà': 'Un kontaktu ku esi nomi ja ta existe',
    'Erreur': 'Erô',

    // Messages de succès
    'Contact mis à jour avec succès': 'Kontaktu mudadu ku suksesu',
    'Contact ajouté avec succès': 'Kontaktu djuntu ku suksesu',

    // Titres et labels
    'Modifier le foyer': 'Muda foyér',
    'Nouveau Foyer': 'Foyér Nobu',
    'Le Foyer': 'Foyér',
    'Nom du foyer': 'Nomi di foyér',
    'Type': 'Tipu',
    'Adresse': 'Adresi',
    'Contact': 'Kontaktu',
    'Capacité & Particularités': 'Kapasidadi & Partikularidadis',
    'Capacité (personnes)': 'Kapasidadi (pessoas)',
    'Contraintes / Préférences': 'Konstrantis / Preferensias',
    'Annuler': 'Kansela',
    'Enregistrer': 'Grava',

    // Valeurs et options
    'Couple': 'Kasal',
    'Frère': 'Irmon',
    'Sœur': 'Irmã',
    'Animaux': 'Animais',

    // Placeholders
    'Ex: Famille Martin': 'Ezemplu: Família Martin',
    '12 rue de la Paix, Lyon': '12 rua da Pas, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'familia@example.com': 'familia@ezemplu.com',
    'Allergies, escaliers, régimes particuliers...': 'Alerjias, skadas, rejims spesiais...',

    // Descriptions
    'Gérez les capacités d\'accueil de la congrégation.': 'Djéra kapasidadis di aselimentu di kongregason.',

    // Messages de la liste des hôtes
    'Capacité:': 'Kapasidadi:',
    'pers.': 'pess.',
    'Aucun contact trouvé': 'Nenhum kontaktu atxadu',
  },
  pt: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'O nome é obrigatório',
    'Un contact avec ce nom existe déjà': 'Já existe um contato com este nome',
    'Erreur': 'Erro',

    // Messages de succès
    'Contact mis à jour avec succès': 'Contato atualizado com sucesso',
    'Contact ajouté avec succès': 'Contato adicionado com sucesso',

    // Titres et labels
    'Modifier le foyer': 'Modificar o lar',
    'Nouveau Foyer': 'Novo Lar',
    'Le Foyer': 'O Lar',
    'Nom du foyer': 'Nome do lar',
    'Type': 'Tipo',
    'Adresse': 'Endereço',
    'Contact': 'Contato',
    'Capacité & Particularités': 'Capacidade & Particularidades',
    'Capacité (personnes)': 'Capacidade (pessoas)',
    'Contraintes / Préférences': 'Restrições / Preferências',
    'Annuler': 'Cancelar',
    'Enregistrer': 'Salvar',

    // Valeurs et options
    'Couple': 'Casal',
    'Frère': 'Irmão',
    'Sœur': 'Irmã',
    'Animaux': 'Animais',

    // Placeholders
    'Ex: Famille Martin': 'Ex: Família Martin',
    '12 rue de la Paix, Lyon': '12 rue de la Paix, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'famille@example.com': 'familia@exemplo.com',
    'Allergies, escaliers, régimes particuliers...': 'Alergias, escadas, regimes especiais...',

    // Descriptions
    'Gérez les capacités d\'accueil de la congrégation.': 'Gerencie as capacidades de acolhimento da congregação.',

    // Messages de la liste des hôtes
    'Capacité:': 'Capacidade:',
    'pers.': 'pess.',
    'Aucun contact trouvé': 'Nenhum contato encontrado',
  },
};

export const useTranslation = () => {
  const { settings } = useSettings();

  const t = (key: string): string => {
    const language = settings.language || 'fr';
    const langTranslations = translations[language as keyof typeof translations];
    const translation = langTranslations ? langTranslations[key as keyof typeof langTranslations] : undefined;

    // Retourner la traduction si elle existe, sinon la clé originale
    return translation || key;
  };

  return { t };
};
