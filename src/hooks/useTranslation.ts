import { useSettings } from '@/contexts/SettingsContext';

// Dictionnaire de traductions
const translations = {
  fr: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'Le nom est obligatoire',
    'Un contact avec ce nom existe déjà': 'Un contact avec ce nom existe déjà',
    Erreur: 'Erreur',

    // Messages de succès
    'Contact mis à jour avec succès': 'Contact mis à jour avec succès',
    'Contact ajouté avec succès': 'Contact ajouté avec succès',

    // Titres et labels
    'Modifier le foyer': 'Modifier le foyer',
    'Nouveau Foyer': 'Nouveau Foyer',
    'Le Foyer': 'Le Foyer',
    'Nom du foyer': 'Nom du foyer',
    Type: 'Type',
    Adresse: 'Adresse',
    Contact: 'Contact',
    'Capacité & Particularités': 'Capacité & Particularités',
    'Capacité (personnes)': 'Capacité (personnes)',
    'Contraintes / Préférences': 'Contraintes / Préférences',
    Annuler: 'Annuler',
    Enregistrer: 'Enregistrer',

    // Valeurs et options
    Couple: 'Couple',
    Frère: 'Frère',
    Sœur: 'Sœur',
    Animaux: 'Animaux',

    // Placeholders
    'Ex: Famille Martin': 'Ex: Famille Martin',
    '12 rue de la Paix, Lyon': '12 rue de la Paix, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'famille@example.com': 'famille@example.com',
    'Allergies, escaliers, régimes particuliers...':
      'Allergies, escaliers, régimes particuliers...',

    // Descriptions
    "Gérez les capacités d'accueil de la congrégation.":
      "Gérez les capacités d'accueil de la congrégation.",

    // Messages de la liste des hôtes
    'Capacité:': 'Capacité:',
    'pers.': 'pers.',
    'Aucun contact trouvé': 'Aucun contact trouvé',

    // Messages pour les hôtes (modèles)
    'Chers frères et sœurs,': 'Chers frères et sœurs,',
    'Nous tenons à vous remercier chaleureusement pour votre accueil lors de nos visites. Votre hospitalité et votre disponibilité ont beaucoup compté pour nous.':
      'Nous tenons à vous remercier chaleureusement pour votre accueil lors de nos visites. Votre hospitalité et votre disponibilité ont beaucoup compté pour nous.',
    'Que Dieu vous bénisse,': 'Que Dieu vous bénisse,',
    "L'assemblée de Lyon": "L'assemblée de Lyon",
    "L'assemblée de Lyon recherche des frères et sœurs disponibles pour accueillir des visiteurs lors de nos réunions.":
      "L'assemblée de Lyon recherche des frères et sœurs disponibles pour accueillir des visiteurs lors de nos réunions.",
    "Auriez-vous la possibilité d'accueillir des visiteurs ? Votre aide serait très appréciée.":
      "Auriez-vous la possibilité d'accueillir des visiteurs ? Votre aide serait très appréciée.",
    'Cordialement,': 'Cordialement,',
    "L'équipe d'accueil": "L'équipe d'accueil",
    '[Votre message personnalisé ici]': '[Votre message personnalisé ici]',
    'Bonjour à tous,': 'Bonjour à tous,',
    "Ceci est un message de l'assemblée de Lyon.": "Ceci est un message de l'assemblée de Lyon.",
    'Cher/Chère': 'Cher/Chère',
    Bonjour: 'Bonjour',

    // Interface des modèles de messages
    'Modèles sauvegardés:': 'Modèles sauvegardés:',
    Charger: 'Charger',
    Suppr: 'Suppr',
    'Nom du modèle...': 'Nom du modèle...',
    Sauvegarder: 'Sauvegarder',
    'Veuillez saisir un nom pour le modèle et un message':
      'Veuillez saisir un nom pour le modèle et un message',
    'Modèle de message sauvegardé': 'Modèle de message sauvegardé',
    Modèle: 'Modèle',
    chargé: 'chargé',
    'Modèle supprimé': 'Modèle supprimé',
    'Erreur lors de la sauvegarde du modèle': 'Erreur lors de la sauvegarde du modèle',
    'Message copié dans le presse-papier': 'Message copié dans le presse-papier',
    'Erreur lors de la copie': 'Erreur lors de la copie',
    'Erreur lors de la génération du message': 'Erreur lors de la génération du message',
    'Le message généré apparaîtra ici...': 'Le message généré apparaîtra ici...',
    Régénérer: 'Régénérer',

    // Messages d'envoi
    'Envoi groupé à': 'Envoi groupé à',
    'destinataires...': 'destinataires...',
    'Messages envoyés à': 'Messages envoyés à',
  },
  cv: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'Nomi ta obligatoriu',
    'Un contact avec ce nom existe déjà': 'Un kontaktu ku esi nomi ja ta existe',
    Erreur: 'Erô',

    // Messages de succès
    'Contact mis à jour avec succès': 'Kontaktu mudadu ku suksesu',
    'Contact ajouté avec succès': 'Kontaktu djuntu ku suksesu',

    // Titres et labels
    'Modifier le foyer': 'Muda foyér',
    'Nouveau Foyer': 'Foyér Nobu',
    'Le Foyer': 'Foyér',
    'Nom du foyer': 'Nomi di foyér',
    Type: 'Tipu',
    Adresse: 'Adresi',
    Contact: 'Kontaktu',
    'Capacité & Particularités': 'Kapasidadi & Partikularidadis',
    'Capacité (personnes)': 'Kapasidadi (pessoas)',
    'Contraintes / Préférences': 'Konstrantis / Preferensias',
    Annuler: 'Kansela',
    Enregistrer: 'Grava',

    // Valeurs et options
    Couple: 'Kasal',
    Frère: 'Irmon',
    Sœur: 'Irmã',
    Animaux: 'Animais',

    // Placeholders
    'Ex: Famille Martin': 'Ezemplu: Família Martin',
    '12 rue de la Paix, Lyon': '12 rua da Pas, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'familia@example.com': 'familia@ezemplu.com',
    'Allergies, escaliers, régimes particuliers...': 'Alerjias, skadas, rejims spesiais...',

    // Descriptions
    "Gérez les capacités d'accueil de la congrégation.":
      'Djéra kapasidadis di aselimentu di kongregason.',

    // Messages de la liste des hôtes
    'Capacité:': 'Kapasidadi:',
    'pers.': 'pess.',
    'Aucun contact trouvé': 'Nenhum kontaktu atxadu',

    // Messages pour les hôtes (modèles)
    'Chers frères et sœurs,': 'Queridos irmãos e irmãs,',
    'Nous tenons à vous remercier chaleureusement pour votre accueil lors de nos visites. Votre hospitalité et votre disponibilité ont beaucoup compté pour nous.':
      'Nós queremos agradecer-vos calorosamente pelo acolhimento durante as nossas visitas. A vossa hospitalidade e disponibilidade contaram muito para nós.',
    'Que Dieu vous bénisse,': 'Que Deus vos abençoe,',
    "L'assemblée de Lyon": 'A assembleia de Lyon',
    "L'assemblée de Lyon recherche des frères et sœurs disponibles pour accueillir des visiteurs lors de nos réunions.":
      'A assembleia de Lyon está à procura de irmãos e irmãs disponíveis para acolher visitantes durante as nossas reuniões.',
    "Auriez-vous la possibilité d'accueillir des visiteurs ? Votre aide serait très appréciée.":
      'Teriam a possibilidade de acolher visitantes? A vossa ajuda seria muito apreciada.',
    'Cordialement,': 'Atenciosamente,',
    "L'équipe d'accueil": 'A equipa de acolhimento',
    '[Votre message personnalisé ici]': '[A vossa mensagem personalizada aqui]',
    'Bonjour à tous,': 'Bom dia a todos,',
    "Ceci est un message de l'assemblée de Lyon.": 'Esta é uma mensagem da assembleia de Lyon.',
    'Cher/Chère': 'Querido/Querida',
    Bonjour: 'Bom dia',

    // Interface des modèles de messages
    'Modèles sauvegardés:': 'Modelos guardados:',
    Charger: 'Carregar',
    Suppr: 'Apagar',
    'Nom du modèle...': 'Nome do modelo...',
    Sauvegarder: 'Guardar',
    'Veuillez saisir un nom pour le modèle et un message':
      'Por favor introduza um nome para o modelo e uma mensagem',
    'Modèle de message sauvegardé': 'Modelo de mensagem guardado',
    Modèle: 'Modelo',
    chargé: 'carregado',
    'Modèle supprimé': 'Modelo apagado',
    'Erreur lors de la sauvegarde du modèle': 'Erro ao guardar o modelo',
    'Message copié dans le presse-papier': 'Mensagem copiada para a área de transferência',
    'Erreur lors de la copie': 'Erro ao copiar',
    'Erreur lors de la génération du message': 'Erro ao gerar a mensagem',
    'Le message généré apparaîtra ici...': 'A mensagem gerada aparecerá aqui...',
    Régénérer: 'Regenerar',
    Copier: 'Copiar',
    Envoyer: 'Enviar',
    WhatsApp: 'WhatsApp',
    Email: 'Email',
    SMS: 'SMS',
    'Message pour': 'Mensagem para',
    "Demande d'accueil": 'Pedido de acolhimento',
    Remerciements: 'Agradecimentos',
    'Message libre': 'Mensagem livre',
    Confirmation: 'Confirmação',
    'Rappel (J-7)': 'Lembrete (J-7)',
    'Rappel (J-2)': 'Lembrete (J-2)',
    Préparation: 'Preparação',
    Langue: 'Língua',
    Français: 'Francês',
    Capverdien: 'Caboverdiano',
    Português: 'Português',
    Canal: 'Canal',

    // Messages d'envoi
    'Envoi groupé à': 'Envio grupal para',
    'destinataires...': 'destinatários...',
    'Messages envoyés à': 'Mensagens enviadas para',
  },
  pt: {
    // Messages d'erreur et validation
    'Le nom est obligatoire': 'O nome é obrigatório',
    'Un contact avec ce nom existe déjà': 'Já existe um contato com este nome',
    Erreur: 'Erro',

    // Messages de succès
    'Contact mis à jour avec succès': 'Contato atualizado com sucesso',
    'Contact ajouté avec succès': 'Contato adicionado com sucesso',

    // Titres et labels
    'Modifier le foyer': 'Modificar o lar',
    'Nouveau Foyer': 'Novo Lar',
    'Le Foyer': 'O Lar',
    'Nom du foyer': 'Nome do lar',
    Type: 'Tipo',
    Adresse: 'Endereço',
    Contact: 'Contato',
    'Capacité & Particularités': 'Capacidade & Particularidades',
    'Capacité (personnes)': 'Capacidade (pessoas)',
    'Contraintes / Préférences': 'Restrições / Preferências',
    Annuler: 'Cancelar',
    Enregistrer: 'Salvar',

    // Valeurs et options
    Couple: 'Casal',
    Frère: 'Irmão',
    Sœur: 'Irmã',
    Animaux: 'Animais',

    // Placeholders
    'Ex: Famille Martin': 'Ex: Família Martin',
    '12 rue de la Paix, Lyon': '12 rue de la Paix, Lyon',
    '06 12 34 56 78': '06 12 34 56 78',
    'famille@example.com': 'familia@exemplo.com',
    'Allergies, escaliers, régimes particuliers...': 'Alergias, escadas, regimes especiais...',

    // Descriptions
    "Gérez les capacités d'accueil de la congrégation.":
      'Gerencie as capacidades de acolhimento da congregação.',

    // Messages de la liste des hôtes
    'Capacité:': 'Capacidade:',
    'pers.': 'pess.',
    'Aucun contact trouvé': 'Nenhum contato encontrado',

    // Messages pour les hôtes (modèles)
    'Chers frères et sœurs,': 'Queridos irmãos e irmãs,',
    'Nous tenons à vous remercier chaleureusement pour votre accueil lors de nos visites. Votre hospitalité et votre disponibilité ont beaucoup compté pour nous.':
      'Queremos agradecer calorosamente pelo acolhimento durante as nossas visitas. A vossa hospitalidade e disponibilidade contaram muito para nós.',
    'Que Dieu vous bénisse,': 'Que Deus vos abençoe,',
    "L'assemblée de Lyon": 'A assembleia de Lyon',
    "L'assemblée de Lyon recherche des frères et sœurs disponibles pour accueillir des visiteurs lors de nos réunions.":
      'A assembleia de Lyon está à procura de irmãos e irmãs disponíveis para acolher visitantes durante as nossas reuniões.',
    "Auriez-vous la possibilité d'accueillir des visiteurs ? Votre aide serait très appréciée.":
      'Teriam a possibilidade de acolher visitantes? A vossa ajuda seria muito apreciada.',
    'Cordialement,': 'Atenciosamente,',
    "L'équipe d'accueil": 'A equipa de acolhimento',
    '[Votre message personnalisé ici]': '[A vossa mensagem personalizada aqui]',
    'Bonjour à tous,': 'Bom dia a todos,',
    "Ceci est un message de l'assemblée de Lyon.": 'Esta é uma mensagem da assembleia de Lyon.',
    'Cher/Chère': 'Querido/Querida',
    Bonjour: 'Bom dia',

    // Interface des modèles de messages
    'Modèles sauvegardés:': 'Modelos guardados:',
    Charger: 'Carregar',
    Suppr: 'Apagar',
    'Nom du modèle...': 'Nome do modelo...',
    Sauvegarder: 'Guardar',
    'Veuillez saisir un nom pour le modèle et un message':
      'Por favor introduza um nome para o modelo e uma mensagem',
    'Modèle de message sauvegardé': 'Modelo de mensagem guardado',
    Modèle: 'Modelo',
    chargé: 'carregado',
    'Modèle supprimé': 'Modelo apagado',
    'Erreur lors de la sauvegarde du modèle': 'Erro ao guardar o modelo',
    'Message copié dans le presse-papier': 'Mensagem copiada para a área de transferência',
    'Erreur lors de la copie': 'Erro ao copiar',
    'Erreur lors de la génération du message': 'Erro ao gerar a mensagem',
    'Le message généré apparaîtra ici...': 'A mensagem gerada aparecerá aqui...',
    Régénérer: 'Regenerar',
    Copier: 'Copiar',
    Envoyer: 'Enviar',
    WhatsApp: 'WhatsApp',
    Email: 'Email',
    SMS: 'SMS',
    'Message pour': 'Mensagem para',
    "Demande d'accueil": 'Pedido de acolhimento',
    Remerciements: 'Agradecimentos',
    'Message libre': 'Mensagem livre',
    Confirmation: 'Confirmação',
    'Rappel (J-7)': 'Lembrete (J-7)',
    'Rappel (J-2)': 'Lembrete (J-2)',
    Préparation: 'Preparação',
    Langue: 'Língua',
    Français: 'Francês',
    Capverdien: 'Caboverdiano',
    Português: 'Português',
    Canal: 'Canal',
  },
};

export const useTranslation = () => {
  const { settings } = useSettings();

  const t = (key: string): string => {
    const language = settings.language || 'fr';
    const langTranslations = translations[language as keyof typeof translations];
    const translation = langTranslations
      ? langTranslations[key as keyof typeof langTranslations]
      : undefined;

    // Retourner la traduction si elle existe, sinon la clé originale
    return translation || key;
  };

  return { t };
};
