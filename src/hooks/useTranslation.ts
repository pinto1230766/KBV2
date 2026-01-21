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

    // Messages de HostRequestModal
    "Demande d'accueil individuelle": "Demande d'accueil individuelle",
    "Demande d'accueil groupée": "Demande d'accueil groupée",
    'Copier': 'Copier',
    'Envoyer sur WhatsApp': 'Envoyer sur WhatsApp',
    'Sélectionnez au moins une visite': 'Sélectionnez au moins une visite',
    "visite sans contact d'accueil": "visite sans contact d'accueil",
    "visites sans contact d'accueil": "visites sans contact d'accueil",
    'sélectionnée': 'sélectionnée',
    'sélectionnées': 'sélectionnées',
    'Demande groupée': 'Demande groupée',
    'Demande individuelle': 'Demande individuelle',
    'Langue du message': 'Langue du message',
    '🇫🇷 Français': '🇫🇷 Français',
    '🇨🇻 Capverdien': '🇨🇻 Capverdien',
    '🇵🇹 Portugais': '🇵🇹 Portugais',
    'Sélectionnez l\'hôte': 'Sélectionnez l\'hôte',
    "Nom de l'hôte": "Nom de l'hôte",
    'Sélectionnez une visite': 'Sélectionnez une visite',
    'Sélectionnez les visites': 'Sélectionnez les visites',
    'Tout désélectionner': 'Tout désélectionner',
    'Tout sélectionner': 'Tout sélectionner',
    'À définir': 'À définir',
    'Défini': 'Défini',
    'Aperçu du message': 'Aperçu du message',
    'Sélectionnez au moins une visite pour générer le message...': 'Sélectionnez au moins une visite pour générer le message...',
    'Génération du message...': 'Génération du message...',
    'Message prêt': 'Message prêt',
    'Vous pouvez modifier le message avant de l\'envoyer': 'Vous pouvez modifier le message avant de l\'envoyer',

    // Messages de AccommodationMatchingModal
    'Matching intelligent hôte/orateur': 'Matching intelligent hôte/orateur',
    'Excellent match': 'Excellent match',
    'Bon match': 'Bon match',
    'Match acceptable': 'Match acceptable',
    'Match faible': 'Match faible',
    'Homme': 'Homme',
    'Femme': 'Femme',
    'Véhiculé': 'Véhiculé',
    'Afficher uniquement les hôtes disponibles': 'Afficher uniquement les hôtes disponibles',
    'hôte(s) trouvé(s)': 'hôte(s) trouvé(s)',
    'Aucun hôte trouvé': 'Aucun hôte trouvé',
    'Essayez de désactiver le filtre de disponibilité': 'Essayez de désactiver le filtre de disponibilité',
    'Hôte sélectionné :': 'Hôte sélectionné :',
    'Téléphone :': 'Téléphone :',
    'Email :': 'Email :',
    'Sélectionner cet hôte': 'Sélectionner cet hôte',

    // Messages de compatibilité
    'Disponible à cette date': 'Disponible à cette date',
    'Indisponible à cette date': 'Indisponible à cette date',
    'Couple accueille couple': 'Couple accueille couple',
    'Genre compatible': 'Genre compatible',
    'Genre partiellement compatible': 'Genre partiellement compatible',
    'personne(s)': 'personne(s)',
    'Capacité limitée (1 personne)': 'Capacité limitée (1 personne)',
    'Parking disponible': 'Parking disponible',
    'Ascenseur disponible': 'Ascenseur disponible',
    'Orateur véhiculé mais pas de parking': 'Orateur véhiculé mais pas de parking',
    'Animaux de compagnie': 'Animaux de compagnie',
    "Présence d'animaux": "Présence d'animaux",
    'accueil(s) réussi(s)': 'accueil(s) réussi(s)',
    'A accueilli récemment': 'A accueilli récemment',
    'Disponible depuis longtemps': 'Disponible depuis longtemps',
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
    'familia@example.com': 'família@ezemplu.com',
    'Allergies, escaliers, régimes particuliers...': 'Alerjias, skadas, rejims spesiais...',

    // Descriptions
    "Gérez les capacités d'accueil de la congrégation.":
      'Djéra kapasidadis di aselimentu di kongregason.',

    // Messages de la liste des hôtes
    'Capacité:': 'Kapasidadi:',
    'pers.': 'pess.',
    'Aucun contact trouvé': 'Nenhum kontaktu atxadu',

    // Messages pour les hôtes (modèles)
    'Chers frères et sœurs,': 'Kumésheru irmanu i irmañan,',
    'Nous tenons à vous remercier chaleureusement pour votre accueil lors de nos visites. Votre hospitalité et votre disponibilité ont beaucoup compté pour nous.':
      'Nhos ta kontenti pa skase-mos obridju ku kredu di bu kontribuidu duranti nhos visita. Bu hospitalidadi i bu disponibilidade ta konta mutchu pa nhos.',
    'Que Dieu vous bénisse,': 'Deus ta da-mosibu bençan,',
    "L'assemblée de Lyon": 'Asembleia di Lyon',
    "L'assemblée de Lyon recherche des frères et sœurs disponibles pour accueillir des visiteurs lors de nos réunions.":
      'Asembleia di Lyon ta buska irmon i irman disponivel pa akolhe vizitanti na nos runion.',
    "Auriez-vous la possibilité d'accueillir des visiteurs ? Votre aide serait très appréciée.":
      'Ta ten bu posibilidadi pa akodja ospitanti? Bu ajudu ta sê very estimadu.',
    'Cordialement,': 'Ku korden,',
    "L'équipe d'accueil": 'Ekipa di akodjamentu',
    '[Votre message personnalisé ici]': '[Bu mensagem personalisadu aki]',
    'Bonjour à tous,': 'Bons dia pa tur,',
    "Ceci est un message de l'assemblée de Lyon.": 'Es é un mensajen di Asembleia di Lyon.',
    'Cher/Chère': 'Kumer/ Kumera',
    Bonjour: 'Bons dia',

    // Interface des modèles de messages
    'Modèles sauvegardés:': 'Modelos guardados:',
    Charger: 'Carregar',
    Suppr: 'Apagar',
    'Nom du modèle...': 'Nome do modelo...',
    Sauvegarder: 'Guardar',
    'Veuillez saisir un nom pour le modèle et un message':
      'Favor intruduz un nomi pa mudelu i un mensajen',
    'Modèle de message sauvegardé': 'Mudelu di mensajen guardadu',
    Modèle: 'Mudelu',
    chargé: 'karregadu',
    'Modèle supprimé': 'Mudelu apagadu',
    'Erreur lors de la sauvegarde du modèle': 'Erô na ora di guarda mudelu',
    'Message copié dans le presse-papier': 'Mensajen kopiadu pa area di transferensia',
    'Erreur lors de la copie': 'Erô na ora di kopiá',
    'Erreur lors de la génération du message': 'Erô na ora di jera mensajen',
    'Le message généré apparaîtra ici...': 'Mensajen jeradu ta parsi li...',
    Régénérer: 'Rejenerá',
    Copier: 'Kopiá',
    Envoyer: 'Enviá',
    WhatsApp: 'WhatsApp',
    Email: 'Email',
    SMS: 'SMS',
    'Message pour': 'Mensajen pa',
    "Demande d'accueil": 'Pedidu di akolhimentu',
    Remerciements: 'Agradisimentu',
    'Message libre': 'Mensajen livri',
    Confirmation: 'Konfirmasón',
    'Rappel (J-7)': 'Limbransá (J-7)',
    'Rappel (J-2)': 'Limbransá (J-2)',
    Préparation: 'Preparasón',
    Langue: 'Língua',
    Français: 'Fransês',
    Capverdien: 'Kabuverdianu',
    Português: 'Portugês',
    Canal: 'Canal',

    // Messages d'envoi
    'Envoi groupé à': 'Enviu grupal pa',
    'destinataires...': 'destinatáriu...',
    'Messages envoyés à': 'Mensajen enviadu pa',

    "Demande d'accueil individuelle": 'Pedidu individuali di akodjamentu',
    "Demande d'accueil groupée": 'Pedidu grupal di akodjamentu',
    'Copiar': 'Kopiá',
    'Enviar no WhatsApp': 'Enviá no WhatsApp',
    'Seleçionà un visit pa menoz': 'Seleçionà un visit pa menoz',
    'visit sem kontaktu di akodjamentu': 'visit sem kontaktu di akodjamentu',
    'visits sem kontaktu di akodjamentu': 'visits sem kontaktu di akodjamentu',
    'seleçionà': 'seleçionà',
    'seleçionàdas': 'seleçionàdas',
    'Pedidu grupal': 'Pedidu grupal',
    'Pedidu individuali': 'Pedidu individuali',
    'Lingua di mensagem': 'Lingua di mensagem',
    '🇫🇷 Françes': '🇫🇷 Françes',
    '🇨🇻 Kabuverdianu': '🇨🇻 Kabuverdianu',
    '🇵🇹 Portuges': '🇵🇹 Portuges',
    'Seleçionà host': 'Seleçionà host',
    'Nomi di host': 'Nomi di host',
    'Seleçionà un visit': 'Seleçionà un visit',
    'Seleçionà visits': 'Seleçionà visits',
    'Tudu déseleçioná': 'Tudu déseleçioná',
    'Tudu seleçioná': 'Tudu seleçioná',
    'Pa define': 'Pa define',
    'Defini': 'Defini',
    'Vizualizaçao di mensagem': 'Vizualizaçao di mensagem',
    'Seleçionà un visit pa jera mensagem...': 'Seleçionà un visit pa jera mensagem...',
    'Jeramentu di mensagem...': 'Jeramentu di mensagem...',
    'Mensagem prontu': 'Mensagem prontu',
    'Bu pode móda mensagem anti di enviá': 'Bu pode móda mensagem anti di enviá',

    // Messages de AccommodationMatchingModal
    'Matching intelijenti host/orador': 'Matching intelijenti host/orador',
    'Match eselsente': 'Match eselsente',
    'Match bon': 'Match bon',
    'Match aketavel': 'Match aketavel',
    'Match fraku': 'Match fraku',
    'Omin': 'Omin',
    'Femininu': 'Femininu',
    'Ku vetura': 'Ku vetura',
    'Mostra solu host diponivel': 'Mostra solu host diponivel',
    'host(s) enkontrá(s)': 'host(s) enkontrá(s)',
    'Nunka host enkontrá': 'Nunka host enkontrá',
    'Tenta desabilita filtro di diponibilidade': 'Tenta desabilita filtro di diponibilidade',
    'Host seleçionà :': 'Host seleçionà :',
    'Telefone :': 'Telefone :',
    'Email :': 'Email :',
    'Seleçionà es host': 'Seleçionà es host',

    // Messages de kompatibilidade
    'Diponivel pa es data': 'Diponivel pa es data',
    'Indiponivel pa es data': 'Indiponivel pa es data',
    'Kasal akodja kasal': 'Kasal akodja kasal',
    'Jeneru kompatibel': 'Jeneru kompatibel',
    'Jeneru parcialmenti kompatibel': 'Jeneru parcialmenti kompatibel',
    'pessoa(s)': 'pessoa(s)',
    'Kapasidadi limitá (1 pessoa)': 'Kapasidadi limitá (1 pessoa)',
    'Parkamentu diponivel': 'Parkamentu diponivel',
    'Asensor diponivel': 'Asensor diponivel',
    'Orador ku vetura mas nunka parkamentu': 'Orador ku vetura mas nunka parkamentu',
    'Animais di kompania': 'Animais di kompania',
    'Presensia di animais': 'Presensia di animais',
    'akodjamentu(s) susesu(s)': 'akodjamentu(s) susesu(s)',
    'Akodja rezentimenti': 'Akodja rezentimenti',
    'Diponivel ha tempu': 'Diponivel ha tempu',
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

    "Demande d'accueil individuelle": 'Pedido individual de acolhimento',
    "Demande d'accueil groupée": 'Pedido grupal de acolhimento',
    'Copiar': 'Copiar',
    'Envoyer sur WhatsApp': 'Enviar no WhatsApp',
    'Sélectionnez au moins une visite': 'Seleccione pelo menos uma visita',
    'visite sans contact d\'accueil': 'visita sem contacto de acolhimento',
    'visites sans contact d\'accueil': 'visitas sem contacto de acolhimento',
    'sélectionnée': 'seleccionada',
    'sélectionnées': 'seleccionadas',
    'Demande groupée': 'Pedido grupal',
    'Demande individuelle': 'Pedido individual',
    'Langue du message': 'Língua da mensagem',
    '🇫🇷 Français': '🇫🇷 Francês',
    '🇨🇻 Capverdien': '🇨🇻 Cabo-verdiano',
    '🇵🇹 Portugais': '🇵🇹 Português',
    'Sélectionnez l\'hôte': 'Seleccione o hóspede',
    "Nom de l'hôte": "Nome do hóspede",
    'Sélectionnez une visite': 'Seleccione uma visita',
    'Sélectionnez les visites': 'Seleccione as visitas',
    'Tout désélectionner': 'Deseleccionar tudo',
    'Tout sélectionner': 'Seleccionar tudo',
    'À définir': 'A definir',
    'Défini': 'Definido',
    'Aperçu du message': 'Pré-visualização da mensagem',
    'Sélectionnez au moins une visite pour générer le message...': 'Seleccione pelo menos uma visita para gerar a mensagem...',
    'Génération du message...': 'A gerar a mensagem...',
    'Message prêt': 'Mensagem pronta',
    'Vous pouvez modifier le message avant de l\'envoyer': 'Pode modificar a mensagem antes de a enviar',

    // Messages de AccommodationMatchingModal
    'Matching intelligent hôte/orateur': 'Matching inteligente hóspede/orador',
    'Excellent match': 'Excelente correspondência',
    'Bon match': 'Boa correspondência',
    'Match acceptable': 'Correspondência aceitável',
    'Match faible': 'Correspondência fraca',
    'Homme': 'Homem',
    'Femme': 'Mulher',
    'Véhiculé': 'Com veículo',
    'Afficher uniquement les hôtes disponibles': 'Mostrar apenas os hóspedes disponíveis',
    'hôte(s) trouvé(s)': 'hóspede(s) encontrado(s)',
    'Aucun hôte trouvé': 'Nenhum hóspede encontrado',
    'Essayez de désactiver le filtre de disponibilité': 'Tente desactivar o filtro de disponibilidade',
    'Hôte sélectionné :': 'Hóspede seleccionado :',
    'Téléphone :': 'Telefone :',
    'Email :': 'Email :',
    'Sélectionner cet hôte': 'Seleccionar este hóspede',

    // Messages de compatibilidade
    'Disponible à cette date': 'Disponível nesta data',
    'Indisponible à cette date': 'Indisponível nesta data',
    'Couple accueille couple': 'Casal acolhe casal',
    'Genre compatible': 'Género compatível',
    'Genre partiellement compatible': 'Género parcialmente compatível',
    'personne(s)': 'pessoa(s)',
    'Capacité limitée (1 personne)': 'Capacidade limitada (1 pessoa)',
    'Parking disponible': 'Parque de estacionamento disponível',
    'Ascenseur disponible': 'Elevador disponível',
    'Orateur véhiculé mais pas de parking': 'Orador com veículo mas sem estacionamento',
    'Animaux de compagnie': 'Animais de estimação',
    "Présence d'animaux": "Presença de animais",
    'accueil(s) réussi(s)': 'acolhimento(s) bem-sucedido(s)',
    'A accueilli récemment': 'Acolheu recentemente',
    'Disponible depuis longtemps': 'Disponível há muito tempo',
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
