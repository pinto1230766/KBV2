import { c as b, j as e, k as F, M as y, B as j } from './index-D4MkNNtG.js';
import { r as l } from './charts-CCOFnOOy.js';
import { S as O } from './trash-2-avPRzuE0.js';
const L = b('Car', [
  [
    'path',
    {
      d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2',
      key: '5owen',
    },
  ],
  ['circle', { cx: '7', cy: '17', r: '2', key: 'u2ysq9' }],
  ['path', { d: 'M9 17h6', key: 'r8uit2' }],
  ['circle', { cx: '17', cy: '17', r: '2', key: 'axvx0g' }],
]);
const h = b('Star', [
  [
    'polygon',
    {
      points:
        '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
      key: '8f66p6',
    },
  ],
]);
const P = b('ThumbsUp', [
    ['path', { d: 'M7 10v12', key: '1qc93n' }],
    [
      'path',
      {
        d: 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z',
        key: 'y3tblf',
      },
    ],
  ]),
  T = [
    { id: 'content', label: 'Contenu du discours', icon: '📖' },
    { id: 'delivery', label: 'Présentation', icon: '🎤' },
    { id: 'punctuality', label: 'Ponctualité', icon: '⏰' },
    { id: 'interaction', label: 'Interaction', icon: '🤝' },
    { id: 'preparation', label: 'Préparation', icon: '📝' },
  ],
  z = [
    'Volume de la voix',
    'Rythme de parole',
    'Contact visuel',
    'Gestion du temps',
    'Utilisation des Écritures',
    'Applications pratiques',
    "Interaction avec l'auditoire",
    "Clarté de l'expression",
  ],
  U = ({ isOpen: k, onClose: x, visit: n, onSubmit: v }) => {
    const [s, N] = l.useState(0),
      [i, f] = l.useState(0),
      [o, w] = l.useState(0),
      [m, R] = l.useState(''),
      [d, S] = l.useState([]),
      [p, C] = l.useState(!1),
      [I, A] = l.useState({}),
      g = (a, t) => {
        t === 'speaker' ? N(a) : t === 'host' ? f(a) : w(a);
      },
      E = (a, t) => {
        A((r) => ({ ...r, [a]: t }));
      },
      M = (a) => {
        S((t) => (t.includes(a) ? t.filter((r) => r !== a) : [...t, a]));
      },
      $ = () => {
        const a = {
          id: `feedback-${Date.now()}`,
          visitId: n.visitId,
          speakerRating: s,
          hostRating: i || void 0,
          organizationRating: o || void 0,
          comments: m,
          areasForImprovement: d.length > 0 ? d : void 0,
          isPrivate: p,
          submittedBy: 'Coordinateur',
          submittedAt: new Date().toISOString(),
        };
        (v(a), x());
      },
      u = ({ rating: a, onRate: t, label: r }) =>
        e.jsxs('div', {
          className: 'space-y-2',
          children: [
            e.jsx('label', {
              className: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
              children: r,
            }),
            e.jsxs('div', {
              className: 'flex gap-2',
              children: [
                [1, 2, 3, 4, 5].map((c) =>
                  e.jsx(
                    'button',
                    {
                      type: 'button',
                      onClick: () => t(c),
                      'aria-label': `Noter ${c} étoile${c > 1 ? 's' : ''}`,
                      className: 'focus:outline-none transition-transform hover:scale-110',
                      children: e.jsx(h, {
                        className: `w-8 h-8 ${c <= a ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`,
                      }),
                    },
                    c
                  )
                ),
                a > 0 &&
                  e.jsxs('span', {
                    className: 'ml-2 text-sm text-gray-600 dark:text-gray-400 self-center',
                    children: [a, '/5'],
                  }),
              ],
            }),
          ],
        }),
      D = () => {
        const a = [s, i, o].filter((t) => t > 0);
        return a.length === 0 ? 0 : (a.reduce((t, r) => t + r, 0) / a.length).toFixed(1);
      };
    return e.jsx(F, {
      isOpen: k,
      onClose: x,
      title: 'Évaluation de la visite',
      size: 'lg',
      children: e.jsxs('div', {
        className: 'space-y-6',
        children: [
          e.jsxs('div', {
            className:
              'p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg',
            children: [
              e.jsx('h4', {
                className: 'font-semibold text-gray-900 dark:text-white mb-1',
                children: n.nom,
              }),
              e.jsx('p', {
                className: 'text-sm text-gray-600 dark:text-gray-400',
                children: new Date(n.visitDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
              }),
              n.talkTheme &&
                e.jsxs('p', {
                  className: 'text-sm text-gray-700 dark:text-gray-300 mt-2',
                  children: [
                    e.jsx('strong', { children: 'Discours :' }),
                    ' ',
                    n.talkNoOrType,
                    ' - ',
                    n.talkTheme,
                  ],
                }),
            ],
          }),
          s > 0 &&
            e.jsx('div', {
              className:
                'flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg',
              children: e.jsxs('div', {
                className: 'text-center',
                children: [
                  e.jsx('div', { className: 'text-4xl font-bold text-yellow-600', children: D() }),
                  e.jsx('div', {
                    className: 'text-sm text-yellow-800 dark:text-yellow-300',
                    children: 'Note globale',
                  }),
                ],
              }),
            }),
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsxs('div', {
                className:
                  'flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700',
                children: [
                  e.jsx(h, { className: 'w-5 h-5 text-primary-600' }),
                  e.jsx('h3', {
                    className: 'text-lg font-semibold text-gray-900 dark:text-white',
                    children: "Évaluation de l'orateur",
                  }),
                ],
              }),
              e.jsx(u, {
                rating: s,
                onRate: (a) => g(a, 'speaker'),
                label: "Note générale de l'orateur *",
              }),
              e.jsxs('div', {
                className: 'space-y-3',
                children: [
                  e.jsx('label', {
                    className: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
                    children: 'Évaluation détaillée (optionnel)',
                  }),
                  T.map((a) =>
                    e.jsxs(
                      'div',
                      {
                        className:
                          'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg',
                        children: [
                          e.jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              e.jsx('span', { className: 'text-xl', children: a.icon }),
                              e.jsx('span', {
                                className: 'text-sm text-gray-700 dark:text-gray-300',
                                children: a.label,
                              }),
                            ],
                          }),
                          e.jsx('div', {
                            className: 'flex gap-1',
                            children: [1, 2, 3, 4, 5].map((t) =>
                              e.jsx(
                                'button',
                                {
                                  type: 'button',
                                  onClick: () => E(a.id, t),
                                  'aria-label': `${a.label}: ${t} étoile${t > 1 ? 's' : ''}`,
                                  className: 'focus:outline-none',
                                  children: e.jsx(h, {
                                    className: `w-5 h-5 ${t <= (I[a.id] || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`,
                                  }),
                                },
                                t
                              )
                            ),
                          }),
                        ],
                      },
                      a.id
                    )
                  ),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-3',
            children: [
              e.jsx('label', {
                className: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
                children: "Axes d'amélioration suggérés (optionnel)",
              }),
              e.jsx('div', {
                className: 'grid grid-cols-2 gap-2',
                children: z.map((a) =>
                  e.jsx(
                    'button',
                    {
                      type: 'button',
                      onClick: () => M(a),
                      className: `p-2 text-sm rounded-lg border-2 transition-all ${d.includes(a) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`,
                      children: a,
                    },
                    a
                  )
                ),
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsxs('div', {
                className:
                  'flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700',
                children: [
                  e.jsx(P, { className: 'w-5 h-5 text-green-600' }),
                  e.jsx('h3', {
                    className: 'text-lg font-semibold text-gray-900 dark:text-white',
                    children: "Évaluation de l'accueil",
                  }),
                ],
              }),
              e.jsx(u, {
                rating: i,
                onRate: (a) => g(a, 'host'),
                label: "Qualité de l'accueil (optionnel)",
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsxs('div', {
                className:
                  'flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700',
                children: [
                  e.jsx(y, { className: 'w-5 h-5 text-blue-600' }),
                  e.jsx('h3', {
                    className: 'text-lg font-semibold text-gray-900 dark:text-white',
                    children: "Évaluation de l'organisation",
                  }),
                ],
              }),
              e.jsx(u, {
                rating: o,
                onRate: (a) => g(a, 'organization'),
                label: 'Organisation générale (optionnel)',
              }),
            ],
          }),
          e.jsxs('div', {
            children: [
              e.jsx('label', {
                className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
                children: 'Commentaires détaillés',
              }),
              e.jsx('textarea', {
                value: m,
                onChange: (a) => R(a.target.value),
                className:
                  'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                rows: 4,
                placeholder:
                  "Partagez vos impressions, points forts, suggestions d'amélioration...",
              }),
            ],
          }),
          e.jsx('div', {
            className: 'p-4 bg-gray-50 dark:bg-gray-800 rounded-lg',
            children: e.jsxs('label', {
              className: 'flex items-start gap-3 cursor-pointer',
              children: [
                e.jsx('input', {
                  type: 'checkbox',
                  checked: p,
                  onChange: (a) => C(a.target.checked),
                  className:
                    'mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500',
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('span', {
                      className: 'font-medium text-gray-900 dark:text-white',
                      children: 'Évaluation confidentielle',
                    }),
                    e.jsx('p', {
                      className: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
                      children:
                        "Cette évaluation sera visible uniquement par les coordinateurs et ne sera pas partagée avec l'orateur",
                    }),
                  ],
                }),
              ],
            }),
          }),
          s > 0 &&
            e.jsxs('div', {
              className:
                'p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg',
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-2 mb-2',
                  children: [
                    e.jsx(y, { className: 'w-4 h-4 text-blue-600' }),
                    e.jsx('span', {
                      className: 'text-sm font-medium text-blue-900 dark:text-blue-200',
                      children: "Résumé de l'évaluation",
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'text-sm text-blue-800 dark:text-blue-300 space-y-1',
                  children: [
                    e.jsxs('p', { children: ['• Note orateur : ', s, '/5'] }),
                    i > 0 && e.jsxs('p', { children: ['• Note accueil : ', i, '/5'] }),
                    o > 0 && e.jsxs('p', { children: ['• Note organisation : ', o, '/5'] }),
                    d.length > 0 &&
                      e.jsxs('p', {
                        children: ['• ', d.length, " axe(s) d'amélioration suggéré(s)"],
                      }),
                    m && e.jsx('p', { children: '• Commentaires ajoutés' }),
                  ],
                }),
              ],
            }),
          e.jsxs('div', {
            className: 'flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700',
            children: [
              e.jsx(j, { variant: 'secondary', onClick: x, children: 'Annuler' }),
              e.jsxs(j, {
                variant: 'primary',
                onClick: $,
                disabled: s === 0,
                children: [e.jsx(O, { className: 'w-4 h-4 mr-2' }), "Enregistrer l'évaluation"],
              }),
            ],
          }),
        ],
      }),
    });
  };
export { L as C, U as F, h as S };
//# sourceMappingURL=FeedbackFormModal-D34kdZHa.js.map
