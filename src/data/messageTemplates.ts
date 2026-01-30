import { MessageTemplate, Gender } from '@/types';

// ============================================================================
// NOUVEAUX MODÈLES DE MESSAGES KBV LYON - 8 ÉTAPES WORKFLOW COMPLET
// ============================================================================

export const messageTemplates: MessageTemplate = {
  // ========== FRANÇAIS ==========
  fr: {
    // ÉTAPE 1 : 1ER CONTACT ORATEUR - Confirmation
    confirmation: {
      speaker: `Bonjour Frère *{prenom_orateur}*,

Je m'appelle {ton_nom}, je suis responsable de l'accueil auprès du Groupe Capverdien de Lyon. 🙏

J'ai grand plaisir à te contacter pour te proposer une visite à notre Salle du Royaume.

Nous aimerions t'accueillir le *{jour_semaine} {date_visite} à {heure_visite}*
(Salle du Royaume de Lyon)

Pourrais-tu me confirmer si :
- ✅ Tu peux venir à cette date et heure ?
- 🏠 Nécessites-tu un hébergement ?
- 🍽️ Besoin d'aide pour les repas ?
- 🚗 Transport depuis la gare ou l'aéroport ?
- ⚠️ **Allergies alimentaires à signaler** (toi + accompagnants) ?

Merci de me répondre rapidement.

Fraternellement,
{ton_nom}
Groupe Capverdien de Lyon 🙏`,

      // ÉTAPE 5a : MESSAGE À L'HÉBERGEUR
      host: `Bonjour Frère *{prenom_hotesse}*,

Merci d'accueillir Frère *{prenom_orateur}* chez toi ! 🙏

📋 *INFOS SUR L'ORATEUR :*
• Nom : {nom_orateur} ({congregation_orateur})
• Origine : Cap-Vert
• Tél. : {tel_orateur}
• Accompagnants : {nb_accompagnants} (noms : {noms_accompagnants})

📅 *DATES :*
• Arrivée : {jour_arrivee} {date_arrivee} vers {heure_arrivee}
• Départ : {jour_depart} {date_depart} vers {heure_depart}

⚠️ *ALLERGIES IMPORTANTES :*
{allergies_orateur_et_accompagnants}

📍 *LIEU DE LA RÉUNION :*
Salle du Royaume de Lyon - *{jour_visite} {heure_visite}*

Si tu as des questions, appelle-moi : {mon_tel}

Merci pour ton aide précieuse ! 🙏`,
    },

    // ÉTAPE 2 : DEMANDE VOLONTAIRES AU GROUPE
    host_request_message: {
      host: `Bonjour à tous ! 👋

Nous recherchons des VOLONTAIRES pour accueillir notre orateur visiteur :

🎤 *Orateur :* Frère {prenom_orateur} {nom_orateur} ({congregation_orateur})
📅 *Date & Heure :* *{jour_semaine} {date_visite} à {heure_visite}*
🏠 *Lieu :* Salle du Royaume de Lyon

Nous avons besoin de volontaires pour :

1️⃣ **HÉBERGEMENT** (1-2 nuits si nécessaire)
2️⃣ **REPAS** (dimanche matin et/ou samedi soir)
3️⃣ **TRANSPORT** (ramassage gare/aéroport, trajets locaux)

⚠️ *Allergies à connaître :* {allergies_orateur}

Si vous pouvez aider, répondez-moi rapidement !

Que Jéhovah vous bénisse 🙏
{ton_nom}`,
    },

    // ÉTAPE 3 : PLANNING COMPLET À L'ORATEUR
    preparation: {
      speaker: `Bonjour Frère *{prenom_orateur}*,

Merci de ta confirmation ! 😊

Voici l'organisation complète de ta visite :

📅 *DATES & HORAIRES :*
• Arrivée : {jour_arrivee} {date_arrivee} (vers {heure_arrivee})
• Réunion : *{jour_visite} {date_visite} à {heure_visite}*
• Départ : {jour_depart} {date_depart} (vers {heure_depart})

🏠 *HÉBERGEMENT :*
• Chez : {nom_hebergeur}
• Adresse : {adresse_hebergeur}
• Tél. : {tel_hebergeur}

*REPAS & ALLERGIES :*
• Responsable : {nom_responsable_repas}
• Tél. : {tel_responsable_repas}
• ⚠️ Allergies signalées : {allergies_orateur_et_accompagnants}

*TRANSPORT :*
• Ramassage : {nom_chauffeur}
• Tél. : {tel_chauffeur}

*TRANSPORT ACCOMPAGNANTS :*
• Mode : {mode_transport_accompagnants}
• Véhicule : {accompagnants_vehicule}
• Point RDV : {rdv_accompagnants}

*RÉUNION :*
• Lieu : Salle du Royaume de Lyon
• Heure : *{heure_visite}*
• Thème : {theme_discours}
• N° discours : {numero_discours}

Si tu as des questions, n'hésite pas à nous contacter !

Fraternellement,
{ton_nom}`,

      // ÉTAPE 4 : PLANNING RÉCAPITULATIF AU GROUPE
      host: `Bonjour à tous ! 👋

Voici le planning complet de la visite de Frère *{prenom_orateur}* ({congregation_orateur}) :

📅 *DATES & HORAIRES :*
• Arrivée : {jour_arrivee} {date_arrivee}
• Réunion : *{jour_visite} {date_visite} à {heure_visite}*
• Départ : {jour_depart} {date_depart}

🏠 *HÉBERGEMENT :*
Chez {nom_hebergeur} - Tél. {tel_hebergeur}

🍽️ *REPAS :*
{nom_responsable_repas} s'en charge
⚠️ Allergies : {allergies_orateur_et_accompagnants}

🚗 *TRANSPORT :*
{nom_chauffeur} ira chercher à la gare - Tél. {tel_chauffeur}

👥 *RÉUNION :*
Salle du Royaume - *{heure_visite}*
Thème : {theme_discours}

Merci à tous les volontaires ! 🙏✨

N'hésitez pas à vérifier les détails ou contacter {ton_nom} si besoin.`,
    },

    // ÉTAPE 5b : MESSAGE AU RESPONSABLE DES REPAS
    meals_message: {
      host: `Bonjour {prenom_responsable_repas},

Merci de t'occuper des repas pour Frère *{prenom_orateur}* ! 🍽️

📋 *INFOS SUR L'ORATEUR & ACCOMPAGNANTS :*
• Orateur : {nom_orateur} ({congregation_orateur})
• Accompagnants : {nb_accompagnants} personnes
• Total à nourrir : {nb_total_personnes}

📅 *REPAS À ORGANISER :*
• {jour_arrivee} {date_arrivee} : dîner (vers {heure_diner_arrivee})
• {jour_visite} {date_visite} : petit-déj + déjeuner
• {jour_depart} {date_depart} : petit-déj (avant départ vers {heure_depart})

⚠️ *ALLERGIES ALIMENTAIRES (TRÈS IMPORTANT) :*
{allergies_orateur_et_accompagnants}

📍 *LIEU HÉBERGEMENT :*
Chez {nom_hebergeur}
{adresse_hebergeur}
Tél. {tel_hebergeur}

Pour toute question, contacte-moi : {mon_tel}

Merci pour ton généreux soutien ! 🙏`,
    },

    // ÉTAPE 5c : MESSAGE AU RESPONSABLE DU TRANSPORT
    transport_message: {
      host: `Bonjour {prenom_chauffeur},

Pourrais-tu assurer le transport pour Frère *{prenom_orateur}* ? 🚗

📋 *INFOS SUR L'ORATEUR & ACCOMPAGNANTS :*
• Orateur : {nom_orateur} ({congregation_orateur})
• Accompagnants : {nb_accompagnants}
• Total : {nb_total_personnes} passagers
• Tél. orateur : {tel_orateur}

📅 *TRAJETS À ORGANISER :*
• *{jour_arrivee} {date_arrivee}* : Gare/Aéroport → Hébergement (arrivée vers {heure_arrivee})
• *{jour_visite} {date_visite}* : Hébergement → Salle du Royaume (départ {heure_visite_moins_30_min})
• *{jour_depart} {date_depart}* : Hébergement → Gare/Aéroport (départ {heure_depart})

📍 *ADRESSES CLÉS :*
• Hébergement : {adresse_hebergeur}
• Salle du Royaume : Lyon (près de la Part-Dieu)
• Gare SNCF : Place Bellecour

👥 *PASSAGERS :*
{nb_total_personnes} personnes au total

Pour confirmer ou poser des questions : {mon_tel}

Merci pour ton aide ! `,
},

// ÉTAPE 6 : RAPPEL AUTOMATIQUE J-5
'reminder-5': {
  speaker: `Bonjour Frère *{prenom_orateur}*,

Petit rappel : nous t'attendons dans *5 jours* ! 

*{jour_visite} {date_visite} à {heure_visite}*

*Ton accueil :*
• Hébergement chez {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Lieu de la réunion :*
Salle du Royaume de Lyon

*Tes allergies bien notées :* {allergies_orateur_et_accompagnants}

Si besoin de précisions, je suis disponible : {mon_tel}

À très vite ! `,
},

// RAPPEL J-7
'reminder-7': {
  speaker: `Bonjour Frère *{prenom_orateur}*,

Petit rappel : nous t'attendons dans *7 jours* ! 

*{jour_visite} {date_visite} à {heure_visite}*

*Ton accueil :*
• Hébergement chez {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Lieu de la réunion :*
Salle du Royaume de Lyon

*Tes allergies bien notées :* {allergies_orateur_et_accompagnants}

Si besoin de précisions, je suis disponible : {mon_tel}

À très vite ! `,
},

// RAPPEL J-2
'reminder-2': {
  speaker: `Bonjour Frère *{prenom_orateur}*,

Petit rappel : nous t'attendons dans *2 jours* ! 

*{jour_visite} {date_visite} à {heure_visite}*

*Ton accueil :*
• Hébergement chez {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Lieu de la réunion :*
Salle du Royaume de Lyon

*Tes allergies bien notées :* {allergies_orateur_et_accompagnants}

Si besoin de précisions, je suis disponible : {mon_tel}

À très vite ! `,
},

// ÉTAPE 7 : REMERCIEMENTS À L'ORATEUR (post-visite)
thanks_speaker: {
  speaker: `Bonjour Frère *{prenom_orateur}*,

Merci infiniment pour ta visite et ton discours édifiant ! 

Ce fut un vrai plaisir de t'accueillir au Groupe Capverdien de Lyon. Ton message a touché beaucoup de cœurs et renforcé notre foi.

Nous espérons très sincèrement te revoir bientôt pour une prochaine visite !

Que Jéhovah continue de te bénir, toi et ta famille.

Fraternellement,
{ton_nom}
Groupe Capverdien de Lyon 🙏`,
    },

    // ÉTAPE 8 : REMERCIEMENTS AUX HÔTES (post-visite)
    thanks_hosts: {
      host: `Bonjour {prenom_hotesse},

Un grand merci pour ton aide généreuse lors de la visite de Frère *{prenom_orateur}* ! 🙏

✅ {ta_tache} - Parfait ! ✨

Ton dévouement a contribué à rendre cette visite mémorable et à accueillir chaleureusement notre frère visiteur. C'est grâce à des personnes comme toi que notre groupe s'épanouit.

Que Jéhovah te bénisse !

Fraternellement,
{ton_nom}`,
    },

    // Messages libres pour personnalisation
    free_message: {
      speaker: `Bonjour Frère *{prenom_orateur}*,

[Personnalisez votre message ici]

Fraternellement,
{ton_nom}`,

      host: `Bonjour {prenom_hotesse},

[Personnalisez votre message ici]

Fraternellement,
{ton_nom}`,
    },
  },

  // ========== CAPVERDIEN ==========
  cv: {
    confirmation: {
      speaker: `Bon dia Mon *{prenom_orateur}*,

N som e {ton_nom}, n responsavel di akolhimentu ku Grupu Kapverdianu di Lion. 🙏

N ten grandi prazeri di entra en kontatu ku bo pa propusi un bizita na nu Sala di Reino.

N gostari di akolhe bo dia *{jour_semaine} {date_visite} na {heure_visite}*
(Sala di Reino di Lion)

Bu pode konfirma-m si :
- ✅ Bu pode ben dia es data i ora ?
- 🏠 Bu nesesita alojamentu ?
- 🍽️ Bu presiza ajuda ku kumida ?
- 🚗 Transporte partandu di stason ô aeroportu ?
- ⚠️ **Alerjia alimentaria pa sinyala** (bo + akompayantis) ?

Favor responde-m liu !

Fraternalmenti,
{ton_nom}
Grupu Kapverdianu di Lion 🙏`,

      host: `Bon dia Mana *{prenom_hotesse}*,

Obrigadu pa akolhe Mon *{prenom_orateur}* na bo kaza! 🙏

📋 *INFORMASON SUBRI ORADOR:*
• Nom : {nom_orateur} ({congregation_orateur})
• Origem : Kap-Vert
• Tél. : {tel_orateur}
• Akompayantis : {nb_accompagnants} (noms : {noms_accompagnants})

📅 *DATAS :*
• Txegada : {jour_arrivee} {date_arrivee} vers {heure_arrivee}
• Partida : {jour_depart} {date_depart} vers {heure_depart}

⚠️ *ALERJIAS IMPORTANTIS :*
{allergies_orateur_et_accompagnants}

📍 *LUGAR DI RUNION :*
Sala di Reino di Lion - *{jour_visite} {heure_visite}*

Si bu ten perguntas, txoma-m : {mon_tel}

Obrigadu pa bu ajuda prezioza! 🙏`,
    },

    host_request_message: {
      host: `Bon dia tudu! 👋

N ta buska VOLUNTARIUS pa akolhe nu orador vizitante :

🎤 *Orador :* Mon {prenom_orateur} {nom_orateur} ({congregation_orateur})
📅 *Data & Ora :* *{jour_semaine} {date_visite} na {heure_visite}*
🏠 *Lugar :* Sala di Reino di Lion

N presiza di voluntarius pa :

1️⃣ **ALOJAMENTU** (1-2 nuits si nesesariu)
2️⃣ **KUMIDA** (dumingu di manhã i/ô sabadu noti)
3️⃣ **TRANSPORTE** (buska na stason/aeroportu, trajetus lokalis)

⚠️ *Alerjias pa konxe :* {allergies_orateur}

Si bu pode ajuda, responde-m liu !

Ma Jeová abensoa-bu! 🙏
{ton_nom}`,
    },

    preparation: {
      speaker: `Bon dia Mon *{prenom_orateur}*,

Obrigadu pa bu konfirmasón! 😊

Aki es organizasón kompletu di bu bizita :

📅 *DATAS & ORARIUS :*
• Txegada : {jour_arrivee} {date_arrivee} (vers {heure_arrivee})
• Runion : *{jour_visite} {date_visite} na {heure_visite}*
• Partida : {jour_depart} {date_depart} (vers {heure_depart})

🏠 *ALOJAMENTU :*
• Na kaza di : {nom_hebergeur}
• Adresa : {adresse_hebergeur}
• Tél. : {tel_hebergeur}

🍽️ *KUMIDA & ALERJIAS :*
• Responsavel : {nom_responsable_repas}
• Tél. : {tel_responsable_repas}
• ⚠️ Alerjias sinyaladas : {allergies_orateur_et_accompagnants}

🚗 *TRANSPORTE :*
• Buska : {nom_chauffeur}
• Tél. : {tel_chauffeur}

👥 *TRANSPORTE AKOMPAYANTIS :*
• Modu : {mode_transport_accompagnants}
• Vehículu : {accompagnants_vehicule}
• Puntu RDV : {rdv_accompagnants}

👥 *RUNION :*
• Lugar : Sala di Reino di Lion
• Ora : *{heure_visite}*
• Tema : {theme_discours}
• N° diskursu : {numero_discours}

Si bu ten perguntas, n'hésite pas à nous contacter !

Fraternalmenti,
{ton_nom}`,

      host: `Bon dia tudu! 👋

Aki es planu kompletu di bizita di Mon *{prenom_orateur}* ({congregation_orateur}) :

📅 *DATAS & ORARIUS :*
• Txegada : {jour_arrivee} {date_arrivee}
• Runion : *{jour_visite} {date_visite} na {heure_visite}*
• Partida : {jour_depart} {date_depart}

🏠 *ALOJAMENTU :*
Na kaza di {nom_hebergeur} - Tél. {tel_hebergeur}

🍽️ *KUMIDA :*
{nom_responsable_repas} ta trata
⚠️ Alerjias : {allergies_orateur_et_accompagnants}

🚗 *TRANSPORTE :*
• Buska : {nom_chauffeur}
• Tél. : {tel_chauffeur}

👥 *TRANSPORTE AKOMPAYANTIS :*
• Modu : {mode_transport_accompagnants}
• Vehículu : {accompagnants_vehicule}
• Puntu RDV : {rdv_accompagnants}

👥 *RUNION :*
Sala di Reino - *{heure_visite}*
Tema : {theme_discours}

Obrigadu tudu voluntarius! 🙏✨

N'hésite pas à vérifier les détails ou contacter {ton_nom} si besoin.`,
    },

    meals_message: {
      host: `Bon dia {prenom_responsable_repas},

Obrigadu pa trata di kumida pa Mon *{prenom_orateur}*! 🍽️

📋 *INFORMASON SUBRI ORADOR & AKOMPAYANTIS :*
• Orador : {nom_orateur} ({congregation_orateur})
• Akompayantis : {nb_accompagnants} pessoas
• Total pa alimenta : {nb_total_personnes}

📅 *KUMIDA PA ORGANIZA :*
• {jour_arrivee} {date_arrivee} : jantu (vers {heure_diner_arrivee})
• {jour_visite} {date_visite} : limpu + almorsu
• {jour_depart} {date_depart} : limpu (antes di partida vers {heure_depart})

⚠️ *ALERJIAS ALIMENTARIA (TXEIU IMPORTANTI) :*
{allergies_orateur_et_accompagnants}

📍 *LUGAR ALOJAMENTU :*
Na kaza di {nom_hebergeur}
{adresse_hebergeur}
Tél. {tel_hebergeur}

Pa todu pergunta, kontakta-m : {mon_tel}

Obrigadu pa bu apoiu djenerozu! 🙏`,
    },

    transport_message: {
      host: `Bon dia {prenom_chauffeur},

Bu pode trata di transporte pa Mon *{prenom_orateur}*? 🚗

📋 *INFORMASON SUBRI ORADOR & AKOMPAYANTIS :*
• Orador : {nom_orateur} ({congregation_orateur})
• Akompayantis : {nb_accompagnants}
• Total : {nb_total_personnes} pasajerus
• Tél. orador : {tel_orateur}

📅 *TRAJETUS PA ORGANIZA :*
• *{jour_arrivee} {date_arrivee}* : Stason/Aeroportu → Alojamentu (txegada vers {heure_arrivee})
• *{jour_visite} {date_visite}* : Alojamentu → Sala di Reino (partida {heure_visite_moins_30_min})
• *{jour_depart} {date_depart}* : Alojamentu → Stason/Aeroportu (partida {heure_depart})

📍 *ADRESAS TXAVE :*
• Alojamentu : {adresse_hebergeur}
• Sala di Reino : Lion (pertu di Part-Dieu)
• Stason SNCF : Plasa Bellecour

👥 *PASAJERUS :*
{nb_total_personnes} pessoas ao total

Pa konfirma ô faze perguntas : {mon_tel}

Obrigadu pa bu ajuda! 
{ton_nom}`,
    },

    'reminder-5': {
      speaker: `Bon dia Mon *{prenom_orateur}*,

Limbransá : nu ta spera-u dento di *5 dia*! 

{jou_visite} {date_visite} na {heure_visite}*

*Bu akolhimentu :*
Alojamentu na kaza di {nom_hebergeur}
Tél. : {tel_hebergeur}

*Lugar di runion :*
Sala di Reino di Lion

*Bu alerjias ben notadas :* {allergies_orateur_et_accompagnants}

Si presiza di klarifikason, n ta disponivel : {mon_tel}

Te logu! 
{ton_nom}`,
    },

    'reminder-7': {
      speaker: `Bon dia Mon *{prenom_orateur}*,

Limbransá : nu ta spera-u dento di *7 dia*! 

{jou_visite} {date_visite} na {heure_visite}*

*Bu akolhimentu :*
Alojamentu na kaza di {nom_hebergeur}
Tél. : {tel_hebergeur}

*Lugar di runion :*
Sala di Reino di Lion

*Bu alerjias ben notadas :* {allergies_orateur_et_accompagnants}

Si presiza di klarifikason, n ta disponivel : {mon_tel}

Te logu! 
{ton_nom}`,
    },

    'reminder-2': {
      speaker: `Bon dia Mon *{prenom_orateur}*,

Limbransá : nu ta spera-u dento di *2 dia*! 

{jou_visite} {date_visite} na {heure_visite}*

*Bu akolhimentu :*
Alojamentu na kaza di {nom_hebergeur}
Tél. : {tel_hebergeur}

*Lugar di runion :*
Sala di Reino di Lion

*Bu alerjias ben notadas :* {allergies_orateur_et_accompagnants}

Si presiza di klarifikason, n ta disponivel : {mon_tel}

Te logu! 
{ton_nom}`,
    },

    thanks_speaker: {
      speaker: `Bon dia Mon *{prenom_orateur}*,

Obrigadu infinitamenti pa bu bizita i bu diskursu idifikanti! 

Foi un prazeri riali di akolhe-u ku Grupu Kapverdianu di Lion. Bu messajem txoka muntu kuraçons i refora nu fe.

N ta spera bo i-u logu pa un próxima bizita!

Ma Jeová koutinu abensoando-u, bo i bo familía.

Fraternalmenti,
{ton_nom}
Grupu Kapverdianu di Lion 🙏`,
    },

    thanks_hosts: {
      host: `Bon dia {prenom_hotesse},

Un grandi obrigadu pa bu ajuda djenerozu durante di bizita di Mon *{prenom_orateur}*! 🙏

✅ {ta_tache} - Perfetu! ✨

Bu dedikasón ta kontribui pa torna es bizita memoravel i pa akolhe kalorozamenti nu mon vizitante. E grazas na pessoas manera bo ki nu grupu ta floresce.

Ma Jeová abensoando-u!

Fraternalmenti,
{ton_nom}`,
    },

    free_message: {
      speaker: `Bon dia Mon *{prenom_orateur}*,

[Personalize bu messajem aki]

Fraternalmenti,
{ton_nom}`,

      host: `Bon dia {prenom_hotesse},

[Personalize bu messajem aki]

Fraternalmenti,
{ton_nom}`,
    },
  },

  // ========== PORTUGAIS ==========
  pt: {
    confirmation: {
      speaker: `Olá Irmão *{prenom_orateur}*,

Eu me chamo {ton_nom}, sou responsável pela hospitalidade junto do Grupo Capverdiano de Lyon. 🙏

Tenho grande prazer em contactar-te para propor uma visita à nossa Sala do Reino.

Gostaríamos de te receber no dia *{jour_semaine} {date_visite} às {heure_visite}*
(Sala do Reino de Lyon)

Podes confirmar-me se :
- ✅ Podes vir nesta data e hora ?
- 🏠 Necessitas de alojamento ?
- 🍽️ Precisas de ajuda com as refeições ?
- 🚗 Transporte a partir da estação ou aeroporto ?
- ⚠️ **Alergias alimentares a assinalar** (tu + acompanhantes) ?

Obrigado por responderes rapidamente !

Fraternalmente,
{ton_nom}
Grupo Capverdiano de Lyon 🙏`,

      host: `Olá Irmã *{prenom_hotesse}*,

Obrigado por acolheres o Irmão *{prenom_orateur}* em tua casa! 🙏

📋 *INFORMAÇÕES SOBRE O ORADOR :*
• Nome : {nom_orateur} ({congregation_orateur})
• Origem : Cabo Verde
• Tél. : {tel_orateur}
• Acompanhantes : {nb_accompagnants} (nomes : {noms_accompagnants})

📅 *DATAS :*
• Chegada : {jour_arrivee} {date_arrivee} por volta de {heure_arrivee}
• Partida : {jour_depart} {date_depart} por volta de {heure_depart}

⚠️ *ALERGIAS IMPORTANTES :*
{allergies_orateur_et_accompagnants}

📍 *LOCAL DA REUNIÃO :*
Sala do Reino de Lyon - *{jour_visite} {heure_visite}*

Se tiveres perguntas, liga-me : {mon_tel}

Obrigado pela tua ajuda preciosa! 🙏`,
    },

    host_request_message: {
      host: `Olá a todos! 👋

Estamos à procura de VOLUNTÁRIOS para acolher o nosso orador visitante :

🎤 *Orador :* Irmão {prenom_orateur} {nom_orateur} ({congregation_orateur})
📅 *Data & Hora :* *{jour_semaine} {date_visite} às {heure_visite}*
🏠 *Local :* Sala do Reino de Lyon

Precisamos de voluntários para :

1️⃣ **ALOJAMENTO** (1-2 noites se necessário)
2️⃣ **REFEIÇÕES** (domingo de manhã e/ou sábado à noite)
3️⃣ **TRANSPORTE** (recolha estação/aeroporto, trajetos locais)

⚠️ *Alergias a conhecer :* {allergies_orateur}

Se puderes ajudar, responde-me rapidamente !

Que Jeová vos abençoe! 🙏
{ton_nom}`,
    },

    preparation: {
      speaker: `Olá Irmão *{prenom_orateur}*,

Obrigado pela tua confirmação! 😊

Aqui está a organização completa da tua visita :

📅 *DATAS & HORÁRIOS :*
• Chegada : {jour_arrivee} {date_arrivee} (por volta de {heure_arrivee})
• Reunião : *{jour_visite} {date_visite} às {heure_visite}*
• Partida : {jour_depart} {date_depart} (por volta de {heure_depart})

🏠 *ALOJAMENTO :*
• Em casa de : {nom_hebergeur}
• Morada : {adresse_hebergeur}
• Tél. : {tel_hebergeur}

🍽️ *REFEIÇÕES & ALERGIAS :*
• Responsável : {nom_responsable_repas}
• Tél. : {tel_responsable_repas}
• ⚠️ Alergias assinaladas : {allergies_orateur_et_accompagnants}

🚗 *TRANSPORTE :*
• Recolha : {nom_chauffeur}
• Tél. : {tel_chauffeur}

👥 *TRANSPORTE ACOMPANHANTES :*
• Modo : {mode_transport_accompagnants}
• Veículo : {accompagnants_vehicule}
• Ponto RDV : {rdv_accompagnants}

👥 *REUNIÃO :*
• Local : Sala do Reino de Lyon
• Hora : *{heure_visite}*
• Tema : {theme_discours}
• N° discurso : {numero_discours}

Se tiveres perguntas, não hesites em contactar-nos !

Fraternalmente,
{ton_nom}`,

      host: `Olá a todos! 👋

Aqui está o plano completo da visita do Irmão *{prenom_orateur}* ({congregation_orateur}) :

📅 *DATAS & HORÁRIOS :*
• Chegada : {jour_arrivee} {date_arrivee}
• Reunião : *{jour_visite} {date_visite} às {heure_visite}*
• Partida : {jour_depart} {date_depart}

🏠 *ALOJAMENTO :*
Em casa de {nom_hebergeur} - Tél. {tel_hebergeur}

🍽️ *REFEIÇÕES :*
{nom_responsable_repas} trata disso
⚠️ Alergias : {allergies_orateur_et_accompagnants}

🚗 *TRANSPORTE :*
{nom_chauffeur} irá buscar à estação - Tél. {tel_chauffeur}

👥 *TRANSPORTE ACOMPANHANTES :*
• Modo : {mode_transport_accompagnants}
• Veículo : {accompagnants_vehicule}
• Ponto RDV : {rdv_accompagnants}

👥 *REUNIÃO :*
Sala do Reino - *{heure_visite}*
Tema : {theme_discours}

Obrigado a todos os voluntários! 🙏✨

Não hesites em verificar os detalhes ou contactar {ton_nom} se necessário.`,
    },

    meals_message: {
      host: `Olá {prenom_responsable_repas},

Obrigado por tratares das refeições para o Irmão *{prenom_orateur}*! 🍽️

📋 *INFORMAÇÕES SOBRE O ORADOR & ACOMPANHANTES :*
• Orador : {nom_orateur} ({congregation_orateur})
• Acompanhantes : {nb_accompagnants} pessoas
• Total a alimentar : {nb_total_personnes}

📅 *REFEIÇÕES A ORGANIZAR :*
• {jour_arrivee} {date_arrivee} : jantar (por volta de {heure_diner_arrivee})
• {jour_visite} {date_visite} : pequeno-almoço + almoço
• {jour_depart} {date_depart} : pequeno-almoço (antes da partida por volta de {heure_depart})

⚠️ *ALERGIAS ALIMENTARES (MUITO IMPORTANTE) :*
{allergies_orateur_et_accompagnants}

📍 *LOCAL DE ALOJAMENTO :*
Em casa de {nom_hebergeur}
{adresse_hebergeur}
Tél. {tel_hebergeur}

Para qualquer questão, contacta-me : {mon_tel}

Obrigado pelo teu generoso apoio! 🙏`,
    },

    transport_message: {
      host: `Olá {prenom_chauffeur},

Poderias assegurar o transporte para o Irmão *{prenom_orateur}*? 🚗

📋 *INFORMAÇÕES SOBRE O ORADOR & ACOMPANHANTES :*
• Orador : {nom_orateur} ({congregation_orateur})
• Acompanhantes : {nb_accompagnants}
• Total : {nb_total_personnes} passageiros
• Tél. orador : {tel_orateur}

📅 *PERCURSOS A ORGANIZAR :*
• *{jour_arrivee} {date_arrivee}* : Estação/Aeroporto → Alojamento (chegada por volta de {heure_arrivee})
• *{jour_visite} {date_visite}* : Alojamento → Sala do Reino (partida {heure_visite_moins_30_min})
• *{jour_depart} {date_depart}* : Alojamento → Estação/Aeroporto (partida {heure_depart})

📍 *MORADAS-CHAVE :*
• Alojamento : {adresse_hebergeur}
• Sala do Reino : Lyon (perto da Part-Dieu)
• Estação SNCF : Place Bellecour

👥 *PASSAGEIROS :*
{nb_total_personnes} pessoas ao total

Para confirmar ou fazer perguntas : {mon_tel}

Obrigado pela tua ajuda! `,

    },

    'reminder-5': {
      speaker: `Olá Irmão *{prenom_orateur}*,

Lembrar : esperamos-te dentro de *5 dias*! 

*{jour_visite} {date_visite} às {heure_visite}*

*A tua receção :*
• Alojamento em casa de {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Local da reunião :*
Sala do Reino de Lyon

*As tuas alergias bem anotadas :* {allergies_orateur_et_accompagnants}

Se precisares de esclarecimentos, estou disponível : {mon_tel}

Até muito breve! `,

    },

    'reminder-7': {
      speaker: `Olá Irmão *{prenom_orateur}*,

Lembrar : esperamos-te dentro de *7 dias*! 

*{jour_visite} {date_visite} às {heure_visite}*

*A tua receção :*
• Alojamento em casa de {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Local da reunião :*
Sala do Reino de Lyon

*As tuas alergias bem anotadas :* {allergies_orateur_et_accompagnants}

Se precisares de esclarecimentos, estou disponível : {mon_tel}

Até muito breve! `,

    },

    'reminder-2': {
      speaker: `Olá Irmão *{prenom_orateur}*,

Lembrar : esperamos-te dentro de *2 dias*! 

*{jour_visite} {date_visite} às {heure_visite}*

*A tua receção :*
• Alojamento em casa de {nom_hebergeur}
• Tél. : {tel_hebergeur}

*Local da reunião :*
Sala do Reino de Lyon

*As tuas alergias bem anotadas :* {allergies_orateur_et_accompagnants}

Se precisares de esclarecimentos, estou disponível : {mon_tel}

Até muito breve! `,

    },

    thanks_speaker: {
      speaker: `Olá Irmão *{prenom_orateur}*,

Muito obrigado pela tua visita e pelo teu discurso edificante! 

Foi um verdadeiro prazer receber-te no Grupo Capverdiano de Lyon. A tua mensagem tocou muitos corações e reforçou a nossa fé.

Esperamos sinceramente voltar a ver-te em breve para uma próxima visita!

Que Jeová continue a abençoar-te, a ti e à tua família.

Fraternalmente,
{ton_nom}
Grupo Capverdiano de Lyon 🙏`,
    },

    thanks_hosts: {
      host: `Olá {prenom_hotesse},

Um grande obrigado pela tua ajuda generosa durante a visita do Irmão *{prenom_orateur}*! 🙏

✅ {ta_tache} - Perfeito! ✨

O teu devotamento contribuiu para tornar esta visita memorável e para acolher calorosamente o nosso irmão visitante. É graças a pessoas como tu que o nosso grupo floresce.

Que Jeová te abençoe!

Fraternalmente,
{ton_nom}`,
    },

    free_message: {
      speaker: `Olá Irmão *{prenom_orateur}*,

[Personalize a sua mensagem aqui]

Fraternalmente,
{ton_nom}`,

      host: `Olá {prenom_hotesse},

[Personalize a sua mensagem aqui]

Fraternalmente,
{ton_nom}`,
    },
  },
};

// ============================================================================
// MODÈLES DE DEMANDE D'ACCUEIL INDIVIDUELLE (COMPATIBILITÉ)
// ============================================================================

export const individualHostRequestTemplates = {
  fr: `Bonjour {hostName}, 🏠

J'espère que vous allez bien.

Nous avons le plaisir d'accueillir *{speakerName}* de la congrégation de *{congregation}* pour *{talkTitle}* le *{visitDate} à {visitTime}*.

Seriez-vous disponible pour l'accueillir chez vous ? Voici les détails de sa visite :

🗓️ Date : {visitDate} à {visitTime}
🏛️ Salle : {location}
👤 Orateur : {speakerName}
📞 Contact : {speakerPhone}

Merci de me faire savoir si vous êtes disponible pour ce service.

Fraternellement,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  cv: `Bon dia {hostName}, 🏠

N ta spera ma bu sta bon.

Nu ten prazer di akolhe *{speakerName}* di kongregason di *{congregation}* pa *{talkTitle}* dia *{visitDate} na {visitTime}*.

Bu ta disponivel pa akolhe-l na bu kaza ? Aki es detalhis di bu vizita :

🗓️ Data : {visitDate} na {visitTime}
🏛️ Sala : {location}
👤 Orador : {speakerName}
📞 Kontaktu : {speakerPhone}

Favor txoma-m si bu ta disponivel pa es servisu.

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  pt: `Olá {hostName}, 🏠

Espero que esteja bem.

Temos o prazer de receber *{speakerName}* da congregação de *{congregation}* para *{talkTitle}* no dia *{visitDate} às {visitTime}*.

Estaria disponível para o acolher em sua casa? Aqui estão os detalhes da visita:

🗓️ Data: {visitDate} às {visitTime}
🏛️ Sala: {location}
👤 Orador: {speakerName}
📞 Contacto: {speakerPhone}

Por favor, diga-me se está disponível para este serviço.

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
};

// ============================================================================
// MODÈLES DE DEMANDE D'ACCUEIL (COMPATIBILITÉ)
// ============================================================================

export const hostRequestMessageTemplates = {
  fr: `Bonjour à tous ! 🏠

Nous recherchons des volontaires pour accueillir nos orateurs visiteurs aux dates suivantes :

{visitsList}

Si vous êtes disponible pour accueillir un ou plusieurs de ces orateurs, merci de me contacter.

Que Jéhovah vous bénisse !

Fraternellement,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  cv: `Bon dia tudu! 🏠

Nu ta buska voluntáriu pa akolhe nu oradoris vizitantis na es datas li :

{visitsList}

Si bu sta disponivel pa akolhe un ô más di es oradoris, favor kontakta-m.

Ma Jeová abensoa-bu!

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  pt: `Olá a todos! 🏠

Estamos à procura de voluntários para acolher os nossos oradores visitantes nas seguintes datas:

{visitsList}

Se estiveres disponível para acolher um ou mais destes oradores, por favor contacta-me.

Que Jeová vos abençoe!

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
};

// ============================================================================
// FONCTION D'ADAPTATION DU GENRE
// ============================================================================

export function adaptMessageGender(
  message: string,
  speakerGender?: Gender,
  hostGender?: Gender
): string {
  let adapted = message;

  // Adaptation pour orateur féminin
  if (speakerGender === 'female') {
    // Fr
    adapted = adapted.replace(/Bonjour Frère/g, 'Bonjour Sœur');
    adapted = adapted.replace(/Frère \*{prenom_orateur}\*/g, 'Sœur *{prenom_orateur}*');
    adapted = adapted.replace(/notre orateur invité/g, 'notre oratrice invitée');
    adapted = adapted.replace(/ta visite/g, 'ta visite');
    // Pt
    adapted = adapted.replace(/Olá Irmão/g, 'Olá Irmã');
    adapted = adapted.replace(/Irmão \*{prenom_orateur}\*/g, 'Irmã *{prenom_orateur}*');
    adapted = adapted.replace(/nosso orador convidado/g, 'nossa oradora convidada');
    // Cv
    adapted = adapted.replace(/Bon dia Mon/g, 'Bon dia Mana');
    adapted = adapted.replace(/Mon \*{prenom_orateur}\*/g, 'Mana *{prenom_orateur}*');
  }

  // Adaptation pour contact d'accueil féminin
  if (hostGender === 'female') {
    // Fr
    adapted = adapted.replace(/Frère \*{prenom_hotesse}\*/g, 'Sœur *{prenom_hotesse}*');
    adapted = adapted.replace(/notre frère/g, 'notre sœur');
    adapted = adapted.replace(/chez toi/g, 'chez toi');
    // Pt
    adapted = adapted.replace(/Irmã \*{prenom_hotesse}\*/g, 'Irmã *{prenom_hotesse}*');
    adapted = adapted.replace(/nosso irmão/g, 'nossa irmã');
    adapted = adapted.replace(/em tua casa/g, 'em tua casa');
    adapted = adapted.replace(/teu acolhimento/g, 'teu acolhimento');
    // Cv
    adapted = adapted.replace(/Mon \*{prenom_hotesse}\*/g, 'Mana *{prenom_hotesse}*');
    adapted = adapted.replace(/na bo kaza/g, 'na bo kaza');
  }

  // Adaptation pour couple
  if (hostGender === 'couple') {
    // Fr
    adapted = adapted.replace(/Frère \*{prenom_hotesse}\*/g, '*{prenom_hotesse}*');
    adapted = adapted.replace(/tu vas bien/g, 'vous allez bien');
    adapted = adapted.replace(/chez toi/g, 'chez vous');
    // Pt
    adapted = adapted.replace(/Irmã \*{prenom_hotesse}\*/g, '*{prenom_hotesse}*');
    adapted = adapted.replace(/estejas bem/g, 'estejam bem');
    adapted = adapted.replace(/em tua casa/g, 'em vossa casa');
    adapted = adapted.replace(/teu acolhimento/g, 'vosso acolhimento');
    // Cv
    adapted = adapted.replace(/Mon \*{prenom_hotesse}\*/g, '*{prenom_hotesse}*');
    adapted = adapted.replace(/bu sta bon/g, 'nhós sta bon');
    adapted = adapted.replace(/na bo kaza/g, 'na nhós kaza');
  }

  return adapted;
}