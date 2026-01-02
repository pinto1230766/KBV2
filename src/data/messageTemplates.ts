import { MessageTemplate, Gender } from '@/types';

// ============================================================================
// MODÈLES DE MESSAGES PAR LANGUE ET TYPE
// ============================================================================

export const messageTemplates: MessageTemplate = {
  // ========== FRANÇAIS ==========
  fr: {
    confirmation: {
      speaker: `Bonjour Frère *{speakerName}*,{firstTimeIntroduction}

J'espère que tu vas bien. 🙏

C'est avec joie que nous attendons ta visite le *{visitDate} à {visitTime}*.

Pourrais-tu me confirmer ta présence et me faire savoir si tu as besoin de quelque chose de spécial (hébergement, repas, transport) ?

Merci beaucoup et à bientôt !

Fraternellement,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

      host: `Bonjour Frère *{hostName}*,

J'espère que tu vas bien. 🏠

Nous avons le plaisir d'accueillir *{speakerName}* de la congrégation de *{congregation}* le *{visitDate}*.

Pourrais-tu te charger de son accueil ? Merci de me confirmer.

Fraternellement,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },

    preparation: {
      speaker: `Bonjour Frère *{speakerName}*,

Merci pour ta confirmation ! 😊

Voici les détails pour ta visite du *{visitDate} à {visitTime}* :

🏠 *Contact d'accueil* : {hostName}
📞 *Téléphone* : {hostPhone}
📍 *Adresse* : {hostAddress}

N'hésite pas à contacter directement notre frère {hostName} si besoin.

Au plaisir de te voir bientôt !

Fraternellement,
{hospitalityOverseer}`,

      host: `Bonjour Frère *{hostName}*,

Merci pour ta disponibilité ! 🙏

Voici les coordonnées de notre orateur invité pour le *{visitDate}* :

👤 *Orateur* : {speakerName}
🏛️ *Congrégation* : {congregation}
📞 *Téléphone* : {speakerPhone}

Merci de prendre contact avec lui pour coordonner l'accueil.

Fraternellement,
{hospitalityOverseer}`,
    },

    'reminder-7': {
      speaker: `Bonjour Frère *{speakerName}*,

Petit rappel amical : nous attendons ta visite avec joie dans *7 jours*, le *{visitDate} à {visitTime}* ! 🎉

📍 Adresse : {hostAddress}
📞 Contact : {hostName} - {hostPhone}

Bon voyage et à très bientôt !

Fraternellement,
{hospitalityOverseer}`,

      host: `Bonjour Frère *{hostName}*,

Petit rappel : tu accueilles *{speakerName}* dans *7 jours*, le *{visitDate}* ! 🏠

Merci pour ton hospitalité !

Fraternellement,
{hospitalityOverseer}`,
    },

    'reminder-2': {
      speaker: `Bonjour Frère *{speakerName}*,

Dernier rappel : nous t'attendons *après-demain*, le *{visitDate} à {visitTime}* ! 😊

📍 {hostAddress}
📞 {hostName} : {hostPhone}

Bon voyage et à très vite !

Fraternellement,
{hospitalityOverseer}`,
    },

    thanks: {
      speaker: `Bonjour Frère *{speakerName}*,

Merci infiniment pour ta visite et ton discours édifiant ! 🙏✨

Ce fut un réel plaisir de t'accueillir parmi nous. Nous espérons te revoir très bientôt !

Fraternellement,
{hospitalityOverseer}`,

      host: `Bonjour Frère *{hostName}*,

Un grand merci pour ton hospitalité envers notre orateur invité, {speakerName} ! 🏠❤️

Ton accueil chaleureux contribue grandement à la réussite de ces visites.

Fraternellement,
{hospitalityOverseer}`,
    },
  },

  // ========== CAPVERDIEN ==========
  cv: {
    confirmation: {
      speaker: `Bon dia Mon *{speakerName}*,{firstTimeIntroduction}

N ta spera ma bu sta bon. 🙏

E ku alegria ma nu ta spera bu bizita dia *{visitDate} na {visitTime}*.

Bu pode confirma-m bu prezensa i txoma-m si bu ten nesesidadi di kualker koza (alojamentu, kumida, transporte)?

Obrigadu di more i te logu!

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

      host: `Bon dia Mon *{hostName}*,

N ta spera ma bu sta bon. 🏠

Nu ten prazer di akolhe *{speakerName}* di kongregason di *{congregation}* dia *{visitDate}*.

Bu pode inkarga-u di akolhimentu? Favor konfirma-m.

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },

    preparation: {
      speaker: `Bon dia Mon *{speakerName}*,
 
Obrigadu pa bu konfirmasón! 😊
 
Aki es detalhis pa bu bizita dia *{visitDate} na {visitTime}* :

🏠 *Kontaktu di akolhimentu* : {hostName}
📞 *Telefone* : {hostPhone}
📍 *Morada* : {hostAddress}

Si bu prisize, bu pode kontakta diretamenti nu mon {hostName}.

Te logu!

Fraternalmenti,
{hospitalityOverseer}`,

      host: `Bon dia Mon *{hostName}*,

Obrigadu pa bu dizponibilidadi! 🙏

Aki es kontaktu di nu orador kombidadu pa dia *{visitDate}* :

👤 *Orador* : {speakerName}
🏛️ *Kongregason* : {congregation}
📞 *Telefone* : {speakerPhone}

Favor kontakta-l pa kordina akolhimentu.

Fraternalmenti,
{hospitalityOverseer}`,
    },

    'reminder-7': {
      speaker: `Bon dia Mon *{speakerName}*,
 
Limbransá di amizadi: nu ta spera bu bizita ku alegria dento di *7 dia*, dia *{visitDate} na {visitTime}*! 🎉

📍 Morada : {hostAddress}
📞 Kontaktu : {hostName} - {hostPhone}

Bon biaji i te logu!

Fraternalmenti,
{hospitalityOverseer}`,

      host: `Bon dia Mon *{hostName}*,
 
Limbransá : bu ta akolhe *{speakerName}* dento di *7 dia*, dia *{visitDate}*! 🏠

Obrigadu pa bu ospitalidadi!

Fraternalmenti,
{hospitalityOverseer}`,
    },

    'reminder-2': {
      speaker: `Bon dia Mon *{speakerName}*,
 
Últimu limbransá : nu ta sperá-u *dizpois di manhã*, dia *{visitDate} na {visitTime}*! 😊

📍 {hostAddress}
📞 {hostName} : {hostPhone}

Bon biaji i te ja!

Fraternalmenti,
{hospitalityOverseer}`,
    },

    thanks: {
      speaker: `Bon dia Mon *{speakerName}*,

Obrigadu infinitamenti pa bu bizita i bu diskursu idifikanti! 🙏✨

Foi un prazer riali di akolhe-u entre nu. Nu ta spera bo i-u logu!

Fraternalmenti,
{hospitalityOverseer}`,

      host: `Bon dia Mon *{hostName}*,

Un grandi obrigadu pa bu ospitalidadi pa ku nu orador kombidadu, {speakerName}! 🏠❤️

Bu akolhimentu kalorozi ta kontribui munti pa susesu di es bizitas.

Fraternalmenti,
{hospitalityOverseer}`,
    },
  },

  // ========== PORTUGAIS ==========
  pt: {
    confirmation: {
      speaker: `Olá Irmão *{speakerName}*,{firstTimeIntroduction}

Espero que estejas bem. 🙏

Aguardamos com alegria a tua visita no dia *{visitDate} às {visitTime}*.

Poderias confirmar a tua presença e dizer-me se precisas de algo especial (alojamento, refeições, transporte)?

Muito obrigado e até breve!

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

      host: `Olá Irmão *{hostName}*,

Espero que estejas bem. 🏠

Temos o prazer de receber *{speakerName}* da congregação de *{congregation}* no dia *{visitDate}*.

Poderias encarregar-te do seu acolhimento? Por favor, confirma-me.

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },

    preparation: {
      speaker: `Olá Irmão *{speakerName}*,

Obrigado pela tua confirmação! 😊

Aqui estão os detalhes para a tua visita de *{visitDate} às {visitTime}*:

🏠 *Contacto de acolhimento*: {hostName}
📞 *Telefone*: {hostPhone}
📍 *Morada*: {hostAddress}

Não hesites em contactar diretamente o nosso irmão {hostName} se precisares.

Até breve!

Fraternalmente,
{hospitalityOverseer}`,

      host: `Olá Irmão *{hostName}*,

Obrigado pela tua disponibilidade! 🙏

Aqui estão os contactos do nosso orador convidado para *{visitDate}*:

👤 *Orador*: {speakerName}
🏛️ *Congregação*: {congregation}
📞 *Telefone*: {speakerPhone}

Por favor, contacta-o para coordenar o acolhimento.

Fraternalmente,
{hospitalityOverseer}`,
    },

    'reminder-7': {
      speaker: `Olá Irmão *{speakerName}*,

Lembrete amigável: aguardamos a tua visita com alegria daqui a *7 dias*, no dia *{visitDate} às {visitTime}*! 🎉

📍 Morada: {hostAddress}
📞 Contacto: {hostName} - {hostPhone}

Boa viagem e até breve!

Fraternalmente,
{hospitalityOverseer}`,

      host: `Olá Irmão *{hostName}*,

Lembrete: irás acolher *{speakerName}* daqui a *7 dias*, no dia *{visitDate}*! 🏠

Obrigado pela tua hospitalidade!

Fraternalmente,
{hospitalityOverseer}`,
    },

    'reminder-2': {
      speaker: `Olá Irmão *{speakerName}*,

Último lembrete: esperamos-te *depois de amanhã*, no dia *{visitDate} às {visitTime}*! 😊

📍 {hostAddress}
📞 {hostName}: {hostPhone}

Boa viagem e até muito breve!

Fraternalmente,
{hospitalityOverseer}`,
    },

    thanks: {
      speaker: `Olá Irmão *{speakerName}*,
 
Muito obrigado pela tua visita e pelo teu discurso edificante! 🙏✨
 
Foi um verdadeiro prazer receber-te entre nós. Esperamos ver-te novamente em breve!

Fraternalmente,
{hospitalityOverseer}`,

      host: `Olá Irmão *{hostName}*,

Um grande obrigado pela tua hospitalidade para com o nosso orador convidado, {speakerName}! 🏠❤️

O teu acolhimento caloroso contribui muito para o sucesso destas visitas.

Fraternalmente,
{hospitalityOverseer}`,
    },
  },
};

// ============================================================================
// MODÈLES DE DEMANDE D'ACCUEIL INDIVIDUELLE
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
// MODÈLES DE DEMANDE D'ACCUEIL
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
    adapted = adapted.replace(/Frère \*{speakerName}\*/g, 'Sœur *{speakerName}*');
    adapted = adapted.replace(/notre orateur invité/g, 'notre oratrice invitée');
    // Pt
    adapted = adapted.replace(/Olá Irmão/g, 'Olá Irmã');
    adapted = adapted.replace(/Irmão \*{speakerName}\*/g, 'Irmã *{speakerName}*');
    adapted = adapted.replace(/nosso orador convidado/g, 'nossa oradora convidada');
    // Cv
    adapted = adapted.replace(/Bon dia Mon/g, 'Bon dia Mana');
    adapted = adapted.replace(/Mon \*{speakerName}\*/g, 'Mana *{speakerName}*');
  }

  // Adaptation pour contact d'accueil féminin
  if (hostGender === 'female') {
    // Fr
    adapted = adapted.replace(/Frère \*{hostName}\*/g, 'Sœur *{hostName}*');
    adapted = adapted.replace(/notre frère/g, 'notre sœur');
    // Pt
    adapted = adapted.replace(/Irmão \*{hostName}\*/g, 'Irmã *{hostName}*');
    adapted = adapted.replace(/nosso irmão/g, 'nossa irmã');
    // Cv
    adapted = adapted.replace(/Mon \*{hostName}\*/g, 'Mana *{hostName}*');
    adapted = adapted.replace(/nu mon {hostName}/g, 'nu mana {hostName}');
  }

  // Adaptation pour couple
  if (hostGender === 'couple') {
    // Fr
    adapted = adapted.replace(/Frère \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/tu vas bien/g, 'vous allez bien');
    // Pt
    adapted = adapted.replace(/Irmão \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/estejas bem/g, 'estejam bem');
    adapted = adapted.replace(/tua disponibilidade/g, 'vossa disponibilidade');
    adapted = adapted.replace(/teu acolhimento/g, 'vosso acolhimento');
    // Cv
    adapted = adapted.replace(/Mon \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/bu sta bon/g, 'nhós sta bon');
  }

  return adapted;
}
