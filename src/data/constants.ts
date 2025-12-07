import { Speaker, Host, PublicTalk, CongregationProfile } from '@/types';

export const initialCongregationProfile: CongregationProfile = {
  name: 'KBV DV LYON .FP',
  city: 'Lyon',
  hospitalityOverseer: 'Responsable Accueil',
  hospitalityOverseerPhone: '+33 6 12 34 56 78',
  meetingDay: 'Samedi',
  meetingTime: '14:30',
};

export const initialSpeakers: Speaker[] = [
    {
        "id": "4",
        "nom": "Alexis CARVALHO",
        "congregation": "Lyon KBV",
        "talkHistory": [
            {
                "date": "2026-01-03",
                "talkNo": null,
                "theme": null
            }
        ],
        "telephone": "33644556677"
    },
    {
        "id": "25",
        "nom": "José DA SILVA",
        "congregation": "Creil KBV",
        "talkHistory": [
            {
                "date": "2026-01-10",
                "talkNo": "179",
                "theme": "Nega iluzon di mundu, sforsa pa kes kuza di Reinu ki ta izisti di verdadi"
            }
        ],
        "telephone": "33618772533"
    },
    {
        "id": "20",
        "nom": "João CECCON",
        "congregation": "Villiers KBV",
        "talkHistory": [
            {
                "date": "2026-01-17",
                "talkNo": "1",
                "theme": "Bu konxe Deus dretu?"
            }
        ],
        "telephone": "33601234567"
    },
    {
        "id": "30",
        "nom": "Marcelino DOS SANTOS",
        "congregation": "Plaisir KBV",
        "talkHistory": [
            {
                "date": "2026-01-10",
                "talkNo": "100",
                "theme": "Modi ki nu pode faze bons amizadi"
            },
            {
                "date": "2026-01-24",
                "talkNo": "36",
                "theme": "Vida é só kel-li?"
            }
        ],
        "telephone": "33650015128"
    },
    {
        "id": "9",
        "nom": "David MOREIRA",
        "congregation": "Steinsel KBV",
        "talkHistory": [
            {
                "date": "2026-01-31",
                "talkNo": "56",
                "theme": "Na ki lider ki bu pode kunfia?"
            }
        ],
        "telephone": "352621386797"
    },
    {
        "id": "11",
        "nom": "Eddy SILVA",
        "congregation": "Steinsel KBV",
        "talkHistory": [
            {
                "date": "2026-02-07",
                "talkNo": "9",
                "theme": "Obi i kunpri Palavra di Deus"
            },
            {
                "date": "2026-02-28",
                "talkNo": "9",
                "theme": "Obi i kunpri Palavra di Deus"
            }
        ],
        "telephone": "352691574935"
    },
    {
        "id": "37",
        "nom": "Valdir DIOGO",
        "congregation": "Porto KBV",
        "talkHistory": [
            {
                "date": "2026-02-14",
                "talkNo": "189",
                "theme": "Anda ku Deus ta traze-nu bensons gosi i pa tudu témpu"
            }
        ],
        "telephone": "33677788899"
    },
    {
        "id": "23",
        "nom": "Jorge GONÇALVES",
        "congregation": "Porto KBV",
        "talkHistory": [
            {
                "date": "2026-02-21",
                "talkNo": "4",
                "theme": "Ki próvas ten ma Deus ta izisti?"
            }
        ],
        "telephone": "33633456789"
    },
    {
        "id": "57",
        "nom": "Jeje ou JP",
        "congregation": "",
        "talkHistory": [
            {
                "date": "2026-02-28",
                "talkNo": null,
                "theme": null
            }
        ],
        "gender": "male"
    },
    {
        "id": "18",
        "nom": "Jefersen BOELJIN",
        "congregation": "Rotterdam KBV",
        "talkHistory": [
            {
                "date": "2026-03-07",
                "talkNo": null,
                "theme": null
            }
        ],
        "telephone": "31618513034"
    },
    {
        "id": "58",
        "nom": "Dimitri GIVAC",
        "congregation": "Marseille KBV",
        "talkHistory": [
            {
                "date": "2025-10-18",
                "talkNo": null,
                "theme": null
            },
            {
                "date": "2026-03-14",
                "talkNo": "3",
                "theme": "Bu sta ta anda ku organizason unidu di Jeová?"
            }
        ],
        "gender": "male"
    },
    {
        "id": "38",
        "nom": "Jonatã ALVES",
        "congregation": "Albufeira KBV Zoom",
        "talkHistory": [
            {
                "date": "2026-03-21",
                "talkNo": "11",
                "theme": "Sima Jizus, nu 'ka ta faze párti di mundu'"
            }
        ],
        "telephone": "",
        "tags": [
            "zoom",
            "expérimenté"
        ]
    },
    {
        "id": "event-59",
        "nom": "Diskursu Spesial",
        "congregation": "Événement spécial",
        "talkHistory": [
            {
                "date": "2026-03-28",
                "talkNo": "DS",
                "theme": "Ken ki ta ben konpo téra?"
            }
        ]
    },
    {
        "id": "6",
        "nom": "Dany TAVARES",
        "congregation": "Plaisir KBV",
        "talkHistory": [
            {
                "date": "2025-05-03",
                "talkNo": "32",
                "theme": "Modi ki nu pode lida ku preokupasons di vida"
            },
            {
                "date": "2025-09-20",
                "talkNo": "102",
                "theme": "Presta atenson na \"profesia\""
            }
        ],
        "telephone": "33668121101"
    },
    {
        "id": "24",
        "nom": "José BATALHA",
        "congregation": "Marseille KBV",
        "talkHistory": [
            {
                "date": "2025-05-31",
                "talkNo": "17",
                "theme": "Da Deus glória ku tudu kel ki bu ten"
            },
            {
                "date": "2026-04-04",
                "talkNo": "18",
                "theme": "Faze Jeová bu fortaléza"
            }
        ],
        "telephone": "33618505292"
    },
    {
        "id": "22",
        "nom": "Joel CARDOSO",
        "congregation": "Nice KBV",
        "talkHistory": [
            {
                "date": "2025-06-14",
                "talkNo": "30",
                "theme": "Modi ki familia pode pápia ku kunpanheru midjór"
            }
        ],
        "telephone": "33658943038"
    },
    {
        "id": "19",
        "nom": "Jérémy TORRES",
        "congregation": "Lyon KBV",
        "talkHistory": [
            {
                "date": "2025-07-05",
                "talkNo": "12",
                "theme": "Deus kré pa bu ruspeta kes ki ren autoridadi"
            },
            {
                "date": "2026-02-07",
                "talkNo": "76",
                "theme": "Prinsípius di Bíblia pode djuda-nu lida ku prublémas di oji?"
            }
        ],
        "telephone": "33690123456",
        "notes": "Allergique aux chats.",
        "tags": [
            "allergie-chat"
        ],
        "isVehiculed": false
    },
    {
        "id": "10",
        "nom": "David VIEIRA",
        "congregation": "Villiers KBV",
        "talkHistory": [
            {
                "date": "2024-05-26",
                "talkNo": "48",
                "theme": "Modi ki nu pode kontinua lial pa Deus óras ki nu ta pasa pa próva"
            },
            {
                "date": "2025-08-30",
                "talkNo": "108",
                "theme": "Bu pode kunfia ma nu ta ben ten un futuru sóbi!"
            }
        ],
        "telephone": "33771670140"
    },
    {
        "id": "27",
        "nom": "Luis CARDOSO",
        "congregation": "Nice KBV",
        "talkHistory": [
            {
                "date": "2025-09-06",
                "talkNo": "15",
                "theme": "Mostra bondadi pa tudu algen"
            }
        ],
        "telephone": "33669519131"
    },
    {
        "id": "60",
        "nom": "Paulo COSTA",
        "congregation": "Streaming",
        "talkHistory": [
            {
                "date": "2025-09-13",
                "talkNo": "43",
                "theme": "Kel ki Deus ta fla sénpri é midjór pa nos"
            }
        ],
        "gender": "male"
    },
    {
        "id": "61",
        "nom": "João Paulo BAPTISTA",
        "congregation": "Lyon KBV",
        "talkHistory": [
            {
                "date": "2025-09-27",
                "talkNo": "DS",
                "theme": "Modi ki géra ta ben kaba ?"
            }
        ],
        "gender": "male"
    },
    {
        "id": "8",
        "nom": "David LUCIO",
        "congregation": "Porto KBV",
        "talkHistory": [
            {
                "date": "2025-10-04",
                "talkNo": "16",
                "theme": "Kontinua ta bira bu amizadi ku Deus más fórti"
            }
        ],
        "telephone": "351960413461"
    },
    {
        "id": "33",
        "nom": "Moises CALDES",
        "congregation": "Cannes KBV",
        "talkHistory": [
            {
                "date": "2024-11-17",
                "talkNo": "64",
                "theme": "Bu 'krê sô pasa sábi' ô bu ta 'ama Deus'?"
            },
            {
                "date": "2025-10-11",
                "talkNo": "183",
                "theme": "Tra odju di kuzas ki ka ten valor!"
            },
            {
                "date": "2026-03-07",
                "talkNo": "183",
                "theme": "Tra odju di kuzas ki ka ten valor!"
            }
        ],
        "telephone": "33627826869"
    },
    {
        "id": "31",
        "nom": "Mario MIRANDA",
        "congregation": "Cannes KBV Zoom",
        "talkHistory": [
            {
                "date": "2025-10-25",
                "talkNo": "100",
                "theme": "Modi ki nu pode faze bons amizadi"
            }
        ],
        "telephone": "33615879709"
    },
    {
        "id": "15",
        "nom": "Gilberto FERNANDES",
        "congregation": "St Denis KBV",
        "talkHistory": [
            {
                "date": "2025-11-01",
                "talkNo": "2",
                "theme": "Bu ta skapa na témpu di fin?"
            }
        ],
        "telephone": "33769017274"
    },
    {
        "id": "14",
        "nom": "Gianni FARIA",
        "congregation": "Plaisir KBV",
        "talkHistory": [
            {
                "date": "2025-11-08",
                "talkNo": "26",
                "theme": "Abo é inportanti pa Deus?"
            }
        ],
        "telephone": "33698657173"
    },
    {
        "id": "event-62",
        "nom": "Visita do Superintendente de Circuito",
        "congregation": "Événement spécial",
        "talkHistory": [
            {
                "date": "2025-11-15",
                "talkNo": "Visita do Superintendente de Circuito",
                "theme": "Visita do Superintendente de Circuito"
            }
        ]
    },
    {
        "id": "event-63",
        "nom": "Assembleia de Circuito com Representante da Filial",
        "congregation": "Événement spécial",
        "talkHistory": [
            {
                "date": "2025-11-22",
                "talkNo": "Assembleia de Circuito com Representante da Filial",
                "theme": "Assembleia de Circuito com Representante da Filial"
            }
        ]
    },
    {
        "id": "36",
        "nom": "Thomas FREITAS",
        "congregation": "Lyon KBV",
        "talkHistory": [
            {
                "date": "2025-11-29",
                "talkNo": "70",
                "theme": "Pamodi ki Deus merese nos kunfiansa?"
            },
            {
                "date": "2026-06-06",
                "talkNo": "31",
                "theme": "Bu ten konsénsia ma bu ten nisisidadi spritual?"
            }
        ],
        "telephone": "33666677788"
    },
    {
        "id": "32",
        "nom": "Matthieu DHALENNE",
        "congregation": "Steinsel KBV",
        "talkHistory": [
            {
                "date": "2025-12-06",
                "talkNo": "194",
                "theme": "Modi ki sabedoria di Deus ta djuda-nu"
            }
        ],
        "telephone": "33628253599"
    },
    {
        "id": "12",
        "nom": "François GIANNINO",
        "congregation": "St Denis KBV",
        "talkHistory": [
            {
                "date": "2025-12-13",
                "talkNo": "7",
                "theme": "Imita mizerikordia di Jeová"
            }
        ],
        "telephone": "33633891566"
    },
    {
        "id": "event-64",
        "nom": "Asenbleia ku enkaregadu di grupu di kongregason",
        "congregation": "Événement spécial",
        "talkHistory": [
            {
                "date": "2025-12-20",
                "talkNo": "Asenbleia ku enkaregadu di grupu di kongregason",
                "theme": "Asenbleia ku enkaregadu di grupu di kongregason"
            }
        ]
    },
    {
        "id": "26",
        "nom": "José FREITAS",
        "congregation": "Lyon KBV",
        "talkHistory": [
            {
                "date": "2025-12-27",
                "talkNo": "55",
                "theme": "Modi ki bu pode faze un bon nómi ki ta agrada Deus?"
            }
        ],
        "telephone": "33666789012"
    },
    {
        "id": "1",
        "nom": "Ailton DIAS",
        "congregation": "Villiers-sur-Marne",
        "talkHistory": [],
        "telephone": "33611223344",
        "gender": "male"
    },
    {
        "id": "2",
        "nom": "Alain CURTIS",
        "congregation": "Marseille KBV",
        "talkHistory": [],
        "telephone": "33606630000",
        "notes": "Préfère un repas léger le soir. Pas d'hébergement nécessaire, a de la famille à proximité.",
        "gender": "male",
        "tags": [
            "sans escaliers",
            "calme"
        ]
    },
    {
        "id": "3",
        "nom": "Alexandre NOGUEIRA",
        "congregation": "Creil",
        "talkHistory": [],
        "telephone": "33612526605",
        "gender": "male"
    },
    {
        "id": "5",
        "nom": "Daniel FORTES",
        "congregation": "Villiers-sur-Marne",
        "talkHistory": [],
        "telephone": "33655667788",
        "gender": "male"
    },
    {
        "id": "7",
        "nom": "David DE FARIA",
        "congregation": "Villiers-sur-Marne",
        "talkHistory": [],
        "telephone": "33677889900",
        "gender": "male"
    },
    {
        "id": "13",
        "nom": "Fred MARQUES",
        "congregation": "Villiers-sur-Marne",
        "talkHistory": [],
        "telephone": "33634567890",
        "gender": "male"
    },
    {
        "id": "16",
        "nom": "Isaque PEREIRA",
        "congregation": "St Denis KBV",
        "talkHistory": [
            {
                "date": "2024-02-18",
                "talkNo": "50",
                "theme": "Modi ki nu pode toma disizons ki ta djuda-nu ten bons rezultadu na vida"
            }
        ],
        "telephone": "33652851904",
        "gender": "male"
    },
    {
        "id": "17",
        "nom": "Jean-Paul BATISTA",
        "congregation": "Lyon",
        "talkHistory": [],
        "telephone": "33678901234",
        "gender": "male"
    },
    {
        "id": "21",
        "nom": "João-Paulo BAPTISTA",
        "congregation": "Lyon KBV",
        "talkHistory": [],
        "telephone": "33611234567",
        "gender": "male"
    },
    {
        "id": "28",
        "nom": "Luis FARIA",
        "congregation": "Plaisir",
        "talkHistory": [],
        "telephone": "33670748952",
        "gender": "male"
    },
    {
        "id": "29",
        "nom": "Manuel ANTUNES",
        "congregation": "Villiers KBV",
        "talkHistory": [
            {
                "date": "2025-01-19",
                "talkNo": "77",
                "theme": "'Nhos mostra sénpri ma nhos sabe resebe algen dretu'"
            }
        ],
        "telephone": "33670872232",
        "gender": "male"
    },
    {
        "id": "35",
        "nom": "Santiago MONIZ",
        "congregation": "Esch",
        "talkHistory": [],
        "telephone": "352691253068",
        "gender": "male"
    },
    {
        "id": "39",
        "nom": "Lionel ALMEIDA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33632461762",
        "gender": "male"
    },
    {
        "id": "40",
        "nom": "Arthur FELICIANO",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352621283777",
        "gender": "male"
    },
    {
        "id": "41",
        "nom": "Andrea MENARA",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2026-04-11",
                "talkNo": "103",
                "theme": "Modi ki bu pode xinti alegria di verdadi?"
            }
        ],
        "telephone": "352691295018",
        "gender": "male"
    },
    {
        "id": "42",
        "nom": "Victor RIBEIRO",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352621625893",
        "gender": "male"
    },
    {
        "id": "43",
        "nom": "Benvindo SILVA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352691453468",
        "gender": "male"
    },
    {
        "id": "44",
        "nom": "Miguel SILVA",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2026-06-13",
                "talkNo": "65",
                "theme": "Modi ki nu pode luta pa pas na un mundu xeiu di ódiu"
            }
        ],
        "telephone": "352621651610",
        "gender": "male"
    },
    {
        "id": "45",
        "nom": "José BARBOSA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352661931153",
        "gender": "male"
    },
    {
        "id": "46",
        "nom": "Yuri BRADA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352691556138",
        "gender": "male"
    },
    {
        "id": "47",
        "nom": "João CUSTEIRA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "41799014137",
        "gender": "male"
    },
    {
        "id": "48",
        "nom": "António GONGA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352661230114",
        "gender": "male"
    },
    {
        "id": "49",
        "nom": "Ashley RAMOS",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33695564747",
        "gender": "male"
    },
    {
        "id": "50",
        "nom": "Júlio TAVARES",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "352621510176",
        "gender": "male"
    },
    {
        "id": "51",
        "nom": "Paulo CORREIA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33661712640",
        "gender": "male"
    },
    {
        "id": "52",
        "nom": "José FERNANDES",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33661881589",
        "gender": "male"
    },
    {
        "id": "53",
        "nom": "António MELÍCIO",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "31610337402",
        "gender": "male"
    },
    {
        "id": "54",
        "nom": "Patrick SOUSA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "31640081710",
        "gender": "male"
    },
    {
        "id": "55",
        "nom": "Franck BHAGOOA",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33782551793",
        "gender": "male"
    },
    {
        "id": "56",
        "nom": "Van'dredi DOMINGOS",
        "congregation": "À definir",
        "talkHistory": [],
        "telephone": "33769111390",
        "gender": "male"
    },
    {
        "id": "62",
        "nom": "STREAM",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2025-09-13",
                "talkNo": "43",
                "theme": "Kel ki Deus ta fla sénpri é midjór pa nos"
            },
            {
                "date": "2025-10-11",
                "talkNo": "5",
                "theme": "Kuzê ki ta djuda bu família ser filís?"
            }
        ],
        "telephone": ""
    },
    {
        "id": "63",
        "nom": "Rémy CAPELA",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2023-12-18",
                "talkNo": "26",
                "theme": "Abo é inportanti pa Deus?"
            }
        ],
        "telephone": ""
    },
    {
        "id": "64",
        "nom": "JP BAPTISTA",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2026-05-09",
                "talkNo": "61",
                "theme": "Na promésas di kenha ki bu ta kunfia?"
            }
        ],
        "telephone": ""
    },
    {
        "id": "65",
        "nom": "Octávio PEREIRA",
        "congregation": "À definir",
        "talkHistory": [
            {
                "date": "2026-04-25",
                "talkNo": "186",
                "theme": "Faze vontadi di Deus djuntu ku se povu filís"
            }
        ],
        "telephone": ""
    }
  ];

export const initialHosts: Host[] = [
    { "nom": "Jean-Paul Batista", "telephone": "", "gender": "male", "address": "182 Avenue Felix Faure, 69003", "notes": "Logement en centre-ville, idéal pour orateur sans voiture. Pas d'animaux.", "unavailabilities": [], "tags": ["centre-ville", "sans-animaux"] },
    { "nom": "Suzy", "telephone": "", "gender": "female", "address": "14 bis Montée des Roches, 69009", "unavailabilities": [], "tags": ["calme"] },
    { "nom": "Alexis", "telephone": "", "gender": "male", "address": "13 Avenue Debrousse, 69005", "unavailabilities": [] },
    { "nom": "Andréa", "telephone": "", "gender": "female", "address": "25c Rue Georges Courteline, Villeurbanne", "unavailabilities": [] },
    { "nom": "Dara & Lia", "telephone": "", "gender": "couple", "address": "16 Rue Imbert Colomes, 69001", "unavailabilities": [], "tags": ["proche salle", "escaliers"] },
    { "nom": "José Freitas", "telephone": "", "gender": "male", "address": "27 Av Maréchal Foch, 69110", "notes": "Possède un chat. Idéal pour un orateur seul.", "unavailabilities": [], "tags": ["animaux", "chat"] },
    { "nom": "Paulo Martins", "telephone": "", "gender": "male", "address": "18 Rue des Soeurs Bouviers, 69005", "unavailabilities": [], "tags": ["escaliers"] },
    { "nom": "Fátima", "telephone": "", "gender": "female", "address": "9 Chemin de la Vire, Caluire", "unavailabilities": [] },
    { "nom": "Sanches", "telephone": "", "gender": "male", "address": "132 Av. L'Aqueduc de Beaunant, 69110 Ste Foy", "unavailabilities": [], "tags": ["sans escaliers"] },
    { "nom": "Torres", "telephone": "", "gender": "male", "address": "15 Cours Rouget de l'Isle, Rillieux", "notes": "Famille avec jeunes enfants, très accueillants.", "unavailabilities": [], "tags": ["enfants"] },
    { "nom": "Nathalie", "telephone": "", "gender": "female", "address": "86 Rue Pierre Delore, 69008", "unavailabilities": [] },
    { "nom": "Francisco Pinto", "telephone": "", "gender": "male", "address": "20 Rue Professeur Patel, 69009", "unavailabilities": [] }
  ];

// Exportation des données d'application par défaut
export const defaultAppData = {
  speakers: initialSpeakers,
  visits: [],
  hosts: initialHosts,
  archivedVisits: [],
  customTemplates: {},
  customHostRequestTemplates: {},
  congregationProfile: initialCongregationProfile,
  publicTalks: [],
  savedViews: [],
  specialDates: [],
  speakerMessages: [],
  lastSync: undefined,
  dataVersion: '1.0.0',
};

// Liste complète de 134 discours en cap-verdien
export const initialPublicTalks: PublicTalk[] = [
  { number: 1, theme: 'Bu konxe Deus dretu?', language: 'cv' },
  { number: 2, theme: 'Bu ta skapa na ténpu di fin?', language: 'cv' },
  { number: 3, theme: 'Bu sta ta anda ku organizason unidu di Jeová?', language: 'cv' },
  { number: 4, theme: 'Ki próvas ten ma Deus ta izisti?', language: 'cv' },
  { number: 5, theme: 'Kuzê ki ta djuda bu família ser filís?', language: 'cv' },
  { number: 6, theme: 'Kuzê ki nu pode prende di dilúviu di ténpu di Nué?', language: 'cv' },
  { number: 7, theme: 'Imita mizerikórnia di Jeová', language: 'cv' },
  { number: 8, theme: 'Vive pa faze vontadi di Deus', language: 'cv' },
  { number: 9, theme: 'Obi i kunpri Palavra di Deus', language: 'cv' },
  { number: 10, theme: 'Ser onéstu na tudu kuza ki bu ta fla i ki bu ta faze', language: 'cv' },
  { number: 11, theme: "Sima Jizus, nu 'ka ta faze párti di mundu'", language: 'cv' },
  { number: 12, theme: 'Deus krê pa bu ruspeta kes ki ten autoridadi', language: 'cv' },
  { number: 13, theme: 'Kuzê ki Deus ta pensa sobri séksu i kazamentu', language: 'cv' },
  { number: 14, theme: 'Pamodi ki povu di Deus deve ser linpu?', language: 'cv' },
  { number: 15, theme: 'Mostra bondadi pa tudu algen', language: 'cv' },
  { number: 16, theme: 'Kontinua ta bira bu amizadi ku Deus mais fórti', language: 'cv' },
  { number: 17, theme: 'Da Deus glória ku tudu kel ki bu ten', language: 'cv' },
  { number: 18, theme: 'Faze Jeová bu fortaléza', language: 'cv' },
  { number: 19, theme: 'Modi ki bu pode sabe bu futuru?', language: 'cv' },
  { number: 20, theme: 'Dja txiga ténpu di Deus governa mundu?', language: 'cv' },
  { number: 21, theme: 'Da valor pa bu lugar na Reinu di Deus', language: 'cv' },
  { number: 22, theme: 'Bu sta pruveta dretu kes kuza ki Jeová ta da-u?', language: 'cv' },
  { number: 23, theme: 'Pamodi ki Deus faze-nu?', language: 'cv' },
  { number: 24, theme: "Dja bu atxa un 'jóia di txeu valor'?", language: 'cv' },
  { number: 25, theme: 'Luta kóntra spritu di mundu!', language: 'cv' },
  { number: 26, theme: 'Abo é inportanti pa Deus?', language: 'cv' },
  { number: 27, theme: 'Modi ki bu pode kumesa bu kazamentu dretu', language: 'cv' },
  { number: 28, theme: 'Mostra amor i ruspetu na bu kazamentu', language: 'cv' },
  { number: 29, theme: 'Responsabilidadis i bensons pa pai ku mai', language: 'cv' },
  { number: 30, theme: 'Modi ki família pode pâpia ku kunpanheru midjór', language: 'cv' },
  { number: 31, theme: 'Bu ten konsénsia ma bu ten nisisidadi spritual?', language: 'cv' },
  { number: 32, theme: 'Modi ki nu pode lida ku preokupasons di vida', language: 'cv' },
  { number: 33, theme: 'Algun dia nu ta ben ten justisa di verdadi?', language: 'cv' },
  { number: 34, theme: 'Bu ta ser markadu pa salvason?', language: 'cv' },
  { number: 35, theme: 'Bu ta kridita ma bu pode ben vive pa tudu ténpu?', language: 'cv' },
  { number: 36, theme: 'Vida é sô kel-li?', language: 'cv' },
  { number: 37, theme: 'Bale péna sigi kaminhus di Deus?', language: 'cv' },
  { number: 38, theme: 'Modi ki bu pode salva óras ki es mundu ben distruídu?', language: 'cv' },
  { number: 39, theme: 'Modi i na ki ténpu ki Jizus ta ben vense mundu?', language: 'cv' },
  { number: 40, theme: 'Kuzê ki sta ben kontise na futuru?', language: 'cv' },
  { number: 41, theme: "'Fika paradu i odja salvason ki ta ben di Jeová'", language: 'cv' },
  { number: 42, theme: 'Amor ta vense ódiu', language: 'cv' },
  { number: 43, theme: 'Kel ki Deus ta fla sénpri é midjór pa nos', language: 'cv' },
  { number: 44, theme: 'Modi ki kuzas ki Jizus inxina ta djuda-nu?', language: 'cv' },
  { number: 45, theme: 'Sigi kaminhu di vida', language: 'cv' },
  { number: 46, theme: 'Nu mante nos kunfiansa firmi ti fin', language: 'cv' },
  { number: 47, theme: '(Pa ka uza)', language: 'cv' },
  { number: 48, theme: 'Modi ki nu pode kontinua lial pa Deus óras ki nu ta pasa pa próva', language: 'cv' },
  { number: 49, theme: 'Algum dia Téra ta ben fika linpu?', language: 'cv' },
  { number: 50, theme: 'Modi ki nu pode toma disizons ki ta djuda-nu ten bons rezultadu na vida', language: 'cv' },
  { number: 51, theme: 'Verdadi sta ta muda bu vida?', language: 'cv' },
  { number: 52, theme: 'Kenha ki é bu Deus?', language: 'cv' },
  { number: 53, theme: 'Bu ta pensa sima Deus?', language: 'cv' },
  { number: 54, theme: 'Bira bu fé na Deus i na se promésas mais fórti', language: 'cv' },
  { number: 55, theme: 'Modi ki bu pode faze un bon nómi ki ta agrada Deus?', language: 'cv' },
  { number: 56, theme: 'Na ki líder ki bu pode kunfia?', language: 'cv' },
  { number: 57, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 58, theme: 'Ken ki é kristons verdaderu?', language: 'cv' },
  { number: 59, theme: '(Pa ka uza)', language: 'cv' },
  { number: 60, theme: 'Kal ki é bu obijetivu na vida?', language: 'cv' },
  { number: 61, theme: 'Na promésas di kenha ki bu ta kunfia?', language: 'cv' },
  { number: 62, theme: 'Na undi ki nu pode atxa un speransa sértu?', language: 'cv' },
  { number: 63, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 64, theme: "Bu 'krê sô passa sábi' ô bu ta 'ama Deus'?", language: 'cv' },
  { number: 65, theme: 'Modi ki nu pode luta pa pas na un mundu xeiu di ódiu', language: 'cv' },
  { number: 66, theme: 'Bu ta ben partisipa na kodjéta?', language: 'cv' },
  { number: 67, theme: 'Midita na Bíblia i na kuzas ki Jeová kria', language: 'cv' },
  { number: 68, theme: "'Nhos kontinua ta púrdua kunpanheru di korason'", language: 'cv' },
  { number: 69, theme: 'Pamodi ki nu deve faze sakrifisiu pa otus ku amor?', language: 'cv' },
  { number: 70, theme: 'Pamodi ki Deus merese nos kunfiansa?', language: 'cv' },
  { number: 71, theme: "Modi i pamodi ki nu deve 'mante sienti'?", language: 'cv' },
  { number: 72, theme: 'Amor ta mostra ken ki é sigidoris di Jizus di verdadi', language: 'cv' },
  { number: 73, theme: "Sforsa pa 'ten un korason ki ten sabedoria'", language: 'cv' },
  { number: 74, theme: 'Jeová ta odja kuzê ki nu ta faze', language: 'cv' },
  { number: 75, theme: 'Mostra na bu vida ma bu ta apoia direitu ki Jeová ten di governa', language: 'cv' },
  { number: 76, theme: 'Prinsípius di Bíblia pode djuda-nu lida ku prublémas di oji?', language: 'cv' },
  { number: 77, theme: "'Nhos mostra sénpri ma nhos sabe resebe algen dretu'", language: 'cv' },
  { number: 78, theme: 'Sirbi Jeová ku alegria', language: 'cv' },
  { number: 79, theme: 'Amizadi di kenha ki bu ta skodje?', language: 'cv' },
  { number: 80, theme: 'Bu speransa sta na siênsia ô na Bíblia?', language: 'cv' },
  { number: 81, theme: 'Ken ki sta kualifikadu pa faze disiplus?', language: 'cv' },
  { number: 82, theme: '(Pa ka uza)', language: 'cv' },
  { number: 83, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 84, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 85, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 86, theme: 'Orasons ki Deus ta obi', language: 'cv' },
  { number: 87, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 88, theme: 'Pamodi ki nu deve vive di akordu ku prinsípius di Bíblia?', language: 'cv' },
  { number: 89, theme: 'Nhos ben, nhos ki tene sedi di verdadi!', language: 'cv' },
  { number: 90, theme: 'Faze tudu ki bu pode pa bu ten kel vida di verdadi', language: 'cv' },
  { number: 91, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 92, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 93, theme: 'Ki ténpu ki dizastris na naturéza ta ben kaba?', language: 'cv' },
  { number: 94, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 95, theme: 'Ka bu dexa fitisaria ô bruxaria ingana-u!', language: 'cv' },
  { number: 96, theme: 'Kuzê ki ta ben kontise ku relijion?', language: 'cv' },
  { number: 97, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 98, theme: "'Séna di es mundu sta ta muda'", language: 'cv' },
  { number: 99, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 100, theme: 'Modi ki nu pode faze bons amizadi', language: 'cv' },
  { number: 101, theme: "Jeová é kel 'Grandiozu Kriador'", language: 'cv' },
  { number: 102, theme: 'Presta atenson na "profesia"', language: 'cv' },
  { number: 103, theme: 'Modi ki bu pode xinti alegria di verdadi?', language: 'cv' },
  { number: 104, theme: 'Pai ku mai — Nhos sta ta construi ku material ki ka ta kema?', language: 'cv' },
  { number: 105, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 106, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 107, theme: 'Ten un konsénsia trenadu sta ta djuda-u?', language: 'cv' },
  { number: 108, theme: 'Bu pode xinti suguru na es mundu xeiu di prubléma!', language: 'cv' },
  { number: 109, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 110, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 111, theme: 'Modi ki pesoas ta ben kuradu?', language: 'cv' },
  { number: 112, theme: '(Pa ka uza)', language: 'cv' },
  { number: 113, theme: 'Modi ki jóvens pode ten bon rezultadu na vida i ser filís?', language: 'cv' },
  { number: 114, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 115, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 116, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 117, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 118, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 119, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 120, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 121, theme: 'Un família di irmons na mundu interu ta ben salva', language: 'cv' },
  { number: 122, theme: '(Pa ka uza)', language: 'cv' },
  { number: 123, theme: '(Pa ka uza)', language: 'cv' },
  { number: 124, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 125, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 126, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 127, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 128, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 129, theme: 'Trindadi é un ensinu di Bíblia?', language: 'cv' },
  { number: 130, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 131, theme: '(Pa ka uza)', language: 'cv' },
  { number: 132, theme: 'Resureison ta ben vense mórti!', language: 'cv' },
  { number: 133, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
  { number: 134, theme: '(Ka sta disponível na Kabuverdianu)', language: 'cv' },
];
