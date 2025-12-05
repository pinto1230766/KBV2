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

Nu ten prazer di akolhe *{speakerName}* di kongregas on di *{congregation}* dia *{visitDate}*.

Bu pode inkarga-u di akolhimentu? Favor konfirma-m.

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },
    
    preparation: {
      speaker: `Bon dia Mon *{speakerName}*,

Obrigadu pa bu konfirmas on! 😊

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
🏛️ *Kongregas on* : {congregation}
📞 *Telefone* : {speakerPhone}

Favor kontakta-l pa kordina akolhimentu.

Fraternalmenti,
{hospitalityOverseer}`,
    },
    
    'reminder-7': {
      speaker: `Bon dia Mon *{speakerName}*,

Limbrans a di amisti: nu ta spera bu bizita ku alegria dento di *7 dia*, dia *{visitDate} na {visitTime}*! 🎉

📍 Morada : {hostAddress}
📞 Kontaktu : {hostName} - {hostPhone}

Bon biaji i te logu!

Fraternalmenti,
{hospitalityOverseer}`,
      
      host: `Bon dia Mon *{hostName}*,

Limbrans a : bu ta akolhe *{speakerName}* dento di *7 dia*, dia *{visitDate}*! 🏠

Obrigadu pa bu ospitalidadi!

Fraternalmenti,
{hospitalityOverseer}`,
    },
    
    'reminder-2': {
      speaker: `Bon dia Mon *{speakerName}*,

Ultimu limbrans a : nu ta sperá-u *dizpois di manha*, dia *{visitDate} na {visitTime}*! 😊

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

  // ========== ANGLAIS ==========
  en: {
    confirmation: {
      speaker: `Hello Brother *{speakerName}*,{firstTimeIntroduction}

I hope you are doing well. 🙏

We are looking forward to your visit on *{visitDate} at {visitTime}*.

Could you please confirm your attendance and let me know if you need anything special (accommodation, meals, transportation)?

Thank you very much and see you soon!

Fraternally,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
      
      host: `Hello Brother *{hostName}*,

I hope you are doing well. 🏠

We have the pleasure of welcoming *{speakerName}* from the *{congregation}* congregation on *{visitDate}*.

Could you take care of his hospitality? Please confirm.

Fraternally,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },
    
    preparation: {
      speaker: `Hello Brother *{speakerName}*,

Thank you for your confirmation! 😊

Here are the details for your visit on *{visitDate} at {visitTime}*:

🏠 *Host contact*: {hostName}
📞 *Phone*: {hostPhone}
📍 *Address*: {hostAddress}

Feel free to contact brother {hostName} directly if needed.

Looking forward to seeing you!

Fraternally,
{hospitalityOverseer}`,
      
      host: `Hello Brother *{hostName}*,

Thank you for your availability! 🙏

Here are the contact details of our guest speaker for *{visitDate}*:

👤 *Speaker*: {speakerName}
🏛️ *Congregation*: {congregation}
📞 *Phone*: {speakerPhone}

Please contact him to coordinate the hospitality.

Fraternally,
{hospitalityOverseer}`,
    },
    
    'reminder-7': {
      speaker: `Hello Brother *{speakerName}*,

Friendly reminder: we are joyfully expecting your visit in *7 days*, on *{visitDate} at {visitTime}*! 🎉

📍 Address: {hostAddress}
📞 Contact: {hostName} - {hostPhone}

Safe travels and see you soon!

Fraternally,
{hospitalityOverseer}`,
      
      host: `Hello Brother *{hostName}*,

Reminder: you will be hosting *{speakerName}* in *7 days*, on *{visitDate}*! 🏠

Thank you for your hospitality!

Fraternally,
{hospitalityOverseer}`,
    },
    
    'reminder-2': {
      speaker: `Hello Brother *{speakerName}*,

Final reminder: we are expecting you *the day after tomorrow*, on *{visitDate} at {visitTime}*! 😊

📍 {hostAddress}
📞 {hostName}: {hostPhone}

Safe travels and see you very soon!

Fraternally,
{hospitalityOverseer}`,
    },
    
    thanks: {
      speaker: `Hello Brother *{speakerName}*,

Thank you so much for your visit and your upbuilding talk! 🙏✨

It was a real pleasure to welcome you among us. We hope to see you again very soon!

Fraternally,
{hospitalityOverseer}`,
      
      host: `Hello Brother *{hostName}*,

A big thank you for your hospitality towards our guest speaker, {speakerName}! 🏠❤️

Your warm welcome greatly contributes to the success of these visits.

Fraternally,
{hospitalityOverseer}`,
    },
  },

  // ========== ESPAGNOL ==========
  es: {
    confirmation: {
      speaker: `Hola Hermano *{speakerName}*,{firstTimeIntroduction}

Espero que esté bien. 🙏

Esperamos con alegría su visita el *{visitDate} a las {visitTime}*.

¿Podría confirmarme su asistencia y hacerme saber si necesita algo especial (alojamiento, comidas, transporte)?

¡Muchas gracias y hasta pronto!

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
      
      host: `Hola Hermano *{hostName}*,

Espero que esté bien. 🏠

Tenemos el placer de recibir a *{speakerName}* de la congregación de *{congregation}* el *{visitDate}*.

¿Podría encargarse de su hospitalidad? Por favor, confírmeme.

Fraternalmente,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,
    },
    
    preparation: {
      speaker: `Hola Hermano *{speakerName}*,

¡Gracias por su confirmación! 😊

Aquí están los detalles para su visita del *{visitDate} a las {visitTime}*:

🏠 *Contacto de hospitalidad*: {hostName}
📞 *Teléfono*: {hostPhone}
📍 *Dirección*: {hostAddress}

No dude en contactar directamente con el hermano {hostName} si lo necesita.

¡Hasta pronto!

Fraternalmente,
{hospitalityOverseer}`,
      
      host: `Hola Hermano *{hostName}*,

¡Gracias por su disponibilidad! 🙏

Aquí están los datos de contacto de nuestro orador invitado para el *{visitDate}*:

👤 *Orador*: {speakerName}
🏛️ *Congregación*: {congregation}
📞 *Teléfono*: {speakerPhone}

Por favor, póngase en contacto con él para coordinar la hospitalidad.

Fraternalmente,
{hospitalityOverseer}`,
    },
    
    'reminder-7': {
      speaker: `Hola Hermano *{speakerName}*,

Recordatorio amistoso: ¡esperamos con alegría su visita en *7 días*, el *{visitDate} a las {visitTime}*! 🎉

📍 Dirección: {hostAddress}
📞 Contacto: {hostName} - {hostPhone}

¡Buen viaje y hasta pronto!

Fraternalmente,
{hospitalityOverseer}`,
      
      host: `Hola Hermano *{hostName}*,

Recordatorio: recibirá a *{speakerName}* en *7 días*, el *{visitDate}*! 🏠

¡Gracias por su hospitalidad!

Fraternalmente,
{hospitalityOverseer}`,
    },
    
    'reminder-2': {
      speaker: `Hola Hermano *{speakerName}*,

Último recordatorio: ¡lo esperamos *pasado mañana*, el *{visitDate} a las {visitTime}*! 😊

📍 {hostAddress}
📞 {hostName}: {hostPhone}

¡Buen viaje y hasta muy pronto!

Fraternalmente,
{hospitalityOverseer}`,
    },
    
    thanks: {
      speaker: `Hola Hermano *{speakerName}*,

¡Muchas gracias por su visita y su discurso edificante! 🙏✨

Fue un verdadero placer recibirlo entre nosotros. ¡Esperamos volver a verlo muy pronto!

Fraternalmente,
{hospitalityOverseer}`,
      
      host: `Hola Hermano *{hostName}*,

¡Un gran agradecimiento por su hospitalidad hacia nuestro orador invitado, {speakerName}! 🏠❤️

Su cálida acogida contribuye enormemente al éxito de estas visitas.

Fraternalmente,
{hospitalityOverseer}`,
    },
  },
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

Nu ta busca voluntariuoppa akolhe nu oradorisvizitantis na es datas li :

{visitsList}

Si bu sta dizponivel pa akolhe un o mas di es oradaris, favor kontakta-m.

Ma Jeova abensoa-bu!

Fraternalmenti,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  en: `Hello everyone! 🏠

We are looking for volunteers to host our visiting speakers on the following dates:

{visitsList}

If you are available to host one or more of these speakers, please contact me.

May Jehovah bless you!

Fraternally,
{hospitalityOverseer}
📞 {hospitalityOverseerPhone}`,

  es: `¡Hola a todos! 🏠

Estamos buscando voluntarios para recibir a nuestros oradores visitantes en las siguientes fechas:

{visitsList}

Si está disponible para recibir a uno o más de estos oradores, por favor contácteme.

¡Que Jehová los bendiga!

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
    adapted = adapted.replace(/Bonjour Frère/g, 'Bonjour Sœur');
    adapted = adapted.replace(/Frère \*{speakerName}\*/g, 'Sœur *{speakerName}*');
    adapted = adapted.replace(/notre orateur invité/g, 'notre oratrice invitée');
    adapted = adapted.replace(/Hello Brother/g, 'Hello Sister');
    adapted = adapted.replace(/Brother \*{speakerName}\*/g, 'Sister *{speakerName}*');
    adapted = adapted.replace(/our guest speaker/g, 'our guest speaker');
    adapted = adapted.replace(/Hola Hermano/g, 'Hola Hermana');
    adapted = adapted.replace(/Hermano \*{speakerName}\*/g, 'Hermana *{speakerName}*');
    adapted = adapted.replace(/Bon dia Mon/g, 'Bon dia Mana');
    adapted = adapted.replace(/Mon \*{speakerName}\*/g, 'Mana *{speakerName}*');
  }

  // Adaptation pour contact d'accueil féminin
  if (hostGender === 'female') {
    adapted = adapted.replace(/Frère \*{hostName}\*/g, 'Sœur *{hostName}*');
    adapted = adapted.replace(/Brother \*{hostName}\*/g, 'Sister *{hostName}*');
    adapted = adapted.replace(/Hermano \*{hostName}\*/g, 'Hermana *{hostName}*');
    adapted = adapted.replace(/Mon \*{hostName}\*/g, 'Mana *{hostName}*');
    adapted = adapted.replace(/notre frère/g, 'notre sœur');
    adapted = adapted.replace(/brother {hostName}/g, 'sister {hostName}');
    adapted = adapted.replace(/nu mon {hostName}/g, 'nu mana {hostName}');
  }

  // Adaptation pour couple
  if (hostGender === 'couple') {
    adapted = adapted.replace(/Frère \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/Brother \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/Hermano \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/Mon \*{hostName}\*/g, '*{hostName}*');
    adapted = adapted.replace(/tu vas bien/g, 'vous allez bien');
    adapted = adapted.replace(/bu sta bon/g, 'nhós sta bon');
    adapted = adapted.replace(/you are doing well/gi, 'you are doing well');
    adapted = adapted.replace(/esté bien/g, 'estén bien');
  }

  return adapted;
}
