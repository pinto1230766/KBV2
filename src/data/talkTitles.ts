// Titres des discours publics en Créole du Cap-Vert
export const TALK_TITLES: Record<string, string> = {
  '1': 'Bu konxe Deus dretu?',
  '2': 'Bu ta skara na témpu di fin?',
  '3': 'Bu sta ta anda ku organizason unidu di Jeová?',
  '4': 'Ki próvas ten ma Deus ta izisti?',
  '5': 'Kuzê ki ta djuda bu família ser filís?',
  '6': 'Kuzê ki bu ta faze ku bu vida?',
  '7': 'Imita mizerikordia di Jeová',
  '9': 'Obi i kunpri Palavra di Deus',
  '10': 'Modi ki nu pode faze bons amizadi',
  '11': 'Kuzê ki bu ta faze pa ten un vida ki ten sentidu?',
  '12': 'Deus kré pa bu ruspeta kes ki ren autoridadi',
  '15': 'Mostra bondadi pa tudu algen',
  '16': 'Kontinua ta bira bu amizadi ku Deus más fórti',
  '17': 'Da Deus glória ku tudu kel ki bu ten',
  '18': 'Faze Jeová bu fortaléza',
  '26': 'Abo é inportanti pa Deus?',
  '30': 'Modi ki familia pode pápia ku kunpanheru midjór',
  '31': 'Bu ten konsénsia ma bu ten nisisidadi spritual?',
  '32': 'Modi ki nu pode lida ku preokupasons di vida',
  '36': 'Vida é só kel-li?',
  '43': 'Kel ki Deus ta fla sénpri é midjór pa nos',
  '48': 'Modi ki nu pode kontinua lial pa Deus óras ki nu ta pasa pa próva',
  '50': 'Modi ki nu pode toma disizons ki ta djuda-nu ten bons rezultadu na vida',
  '55': 'Modi ki bu pode faze un bon nómi ki ta agrada Deus?',
  '56': 'Na ki lider ki bu pode kunfia?',
  '61': 'Na promésas di kenha ki bu ta kunfia?',
  '64': "Bu 'krê sô passa sábi' ô bu ta 'ama Deus'?",
  '65': 'Modi ki nu pode luta pa pas na un mundu xeiu di ódiu',
  '70': 'Pamodi ki Deus merese nos kunfiansa?',
  '76': 'Prinsípius di Bíblia pode djuda-nu lida ku prublémas di oji?',
  '77': "'Nhos mostra sénpri ma nhos sabe resebe algen dretu'",
  '89': 'Modi ki sabedoria di Deus ta djuda-nu',
  '100': 'Modi ki nu pode faze bons amizadi',
  '102': 'Presta atenson na "profesia"',
  '103': 'Modi ki bu pode xinti alegria di verdadi?',
  '108': 'Bu pode kunfia ma nu ta ben ten un futuru sóbi!',
  '179': 'Nega iluzon di mundu, sforsa pa kes kuza di Reinu ki ta izisti di verdadi',
  '183': 'Tra odju di kuzas ki ka ten valor!',
  '185': 'Nega iluzon di mundu, sforsa pa kes kuza di Reinu ki ta izisti di verdadi',
  '186': 'Faze vontadi di Deus djuntu ku se povu filís',
  '189': 'Anda ku Deus ta traze-nu bensons gosi i pa tudu témpu',
  '194': 'Modi ki sabedoria di Deus ta djuda-nu',
};

// Fonction helper pour récupérer le titre d'un discours
export function getTalkTitle(talkNo: string | number | null): string | null {
  if (!talkNo) return null;
  const key = String(talkNo);
  return TALK_TITLES[key] || null;
}
