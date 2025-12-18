import {
  j as e,
  B as p,
  f as V,
  g as $,
  s as T,
  M as S,
  C as G,
  n as L,
  u as E,
  t as B,
  a as F,
  k as H,
  i as M,
  v as W,
  b as _,
  e as m,
  U as Z,
  P as J,
  m as A,
  S as K,
  A as Q,
} from './index-D4MkNNtG.js';
import { r as o, R } from './charts-CCOFnOOy.js';
import { C as X } from './CommunicationProgress-BTMwZSJI.js';
import { P as Y, M as ee, U as se, I as ae } from './Select-Cs8xHSai.js';
import { M as re } from './mail-DRVSDs76.js';
import { C as I, a as te } from './copy-DwuKvwjM.js';
import { f as ne } from './utils-FTT-aY8U.js';
import { g as le, C as de, S as ie, M as D } from './MessageGeneratorModal-DsejHfJr.js';
import './react-vendor-B9D_A6Vq.js';
const ce = ({ speaker: t, visits: g, onAction: c }) => {
    const f = [...g].sort(
      (a, l) => new Date(l.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
    return e.jsxs('div', {
      className: 'flex flex-col h-full bg-gray-50 dark:bg-gray-900',
      children: [
        e.jsxs('div', {
          className:
            'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm',
          children: [
            e.jsxs('div', {
              className: 'flex items-center gap-4',
              children: [
                e.jsx('div', {
                  className:
                    'w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg',
                  children: t.nom.charAt(0),
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('h2', {
                      className: 'font-bold text-gray-900 dark:text-white',
                      children: t.nom,
                    }),
                    e.jsx('p', {
                      className: 'text-sm text-gray-500 dark:text-gray-400',
                      children: t.congregation,
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex gap-2',
              children: [
                t.telephone &&
                  e.jsx(p, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => window.open(`tel:${t.telephone}`),
                    children: e.jsx(Y, { className: 'w-4 h-4' }),
                  }),
                t.email &&
                  e.jsx(p, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => window.open(`mailto:${t.email}`),
                    children: e.jsx(re, { className: 'w-4 h-4' }),
                  }),
              ],
            }),
          ],
        }),
        e.jsx('div', {
          className: 'flex-1 overflow-y-auto p-4 space-y-6',
          children:
            f.length > 0
              ? f.map((a) =>
                  e.jsxs(
                    'div',
                    {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className:
                            'flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider justify-center my-4',
                          children: [
                            e.jsx('span', { className: 'bg-gray-200 dark:bg-gray-700 h-px w-12' }),
                            ne(new Date(a.visitDate), 'd MMMM yyyy', { locale: L }),
                            e.jsx('span', { className: 'bg-gray-200 dark:bg-gray-700 h-px w-12' }),
                          ],
                        }),
                        e.jsx(V, {
                          children: e.jsxs($, {
                            className: 'p-4',
                            children: [
                              e.jsxs('div', {
                                className: 'flex justify-between items-start mb-4',
                                children: [
                                  e.jsxs('div', {
                                    children: [
                                      e.jsxs('h3', {
                                        className: 'font-semibold text-gray-900 dark:text-white',
                                        children: ['Discours n°', a.talkNoOrType],
                                      }),
                                      e.jsx('p', {
                                        className: 'text-sm text-gray-500 dark:text-gray-400',
                                        children: a.talkTheme || T(a.talkNoOrType),
                                      }),
                                    ],
                                  }),
                                  e.jsx('span', {
                                    className: `
                      px-2 py-1 rounded-full text-xs font-medium
                      ${a.status === 'confirmed' ? 'bg-green-100 text-green-800' : a.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}
                    `,
                                    children:
                                      a.status === 'confirmed'
                                        ? 'Confirmé'
                                        : a.status === 'pending'
                                          ? 'En attente'
                                          : a.status,
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className:
                                  'grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      e.jsx(I, { className: 'w-4 h-4 text-gray-400' }),
                                      a.visitTime,
                                    ],
                                  }),
                                  e.jsxs('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      e.jsx(ee, { className: 'w-4 h-4 text-gray-400' }),
                                      a.locationType === 'physical' ? 'Salle du Royaume' : 'Zoom',
                                    ],
                                  }),
                                  a.host &&
                                    e.jsxs('div', {
                                      className: 'flex items-center gap-2 col-span-2',
                                      children: [
                                        e.jsx(se, { className: 'w-4 h-4 text-gray-400' }),
                                        'Hébergé par ',
                                        a.host,
                                      ],
                                    }),
                                ],
                              }),
                              e.jsx('div', {
                                className: 'mb-4',
                                children: e.jsx(X, { visit: a, showLabels: !0, size: 'md' }),
                              }),
                              e.jsxs('div', {
                                className:
                                  'flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700',
                                children: [
                                  e.jsx(p, {
                                    size: 'sm',
                                    variant: 'primary',
                                    leftIcon: e.jsx(S, { className: 'w-4 h-4' }),
                                    onClick: () => c('whatsapp', a),
                                    children: 'Générer un message',
                                  }),
                                  a.status === 'pending' &&
                                    e.jsx(p, {
                                      size: 'sm',
                                      variant: 'primary',
                                      onClick: () => c('confirm', a),
                                      children: 'Confirmer',
                                    }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    },
                    a.id
                  )
                )
              : e.jsxs('div', {
                  className: 'text-center py-12 text-gray-500 dark:text-gray-400',
                  children: [
                    e.jsx(G, { className: 'w-12 h-12 mx-auto mb-3 opacity-20' }),
                    e.jsx('p', { children: 'Aucune visite programmée avec cet orateur' }),
                  ],
                }),
        }),
      ],
    });
  },
  oe = ({ isOpen: t, onClose: g, visitsNeedingHost: c }) => {
    const { congregationProfile: f } = E(),
      { settings: a } = B(),
      { addToast: l } = F(),
      [d, h] = o.useState(new Set(c.map((r) => r.visitId))),
      [k, y] = o.useState('');
    R.useEffect(() => {
      d.size > 0 && j();
    }, [d]);
    const j = () => {
        const r = c.filter((N) => d.has(N.visitId)),
          u = le(r, f, a.language);
        y(u);
      },
      z = (r) => {
        const u = new Set(d);
        (u.has(r) ? u.delete(r) : u.add(r), h(u));
      },
      w = () => {
        d.size === c.length ? h(new Set()) : h(new Set(c.map((r) => r.visitId)));
      },
      v = async () => {
        try {
          (await navigator.clipboard.writeText(k),
            l('Message copié dans le presse-papier', 'success'));
        } catch {
          l('Erreur lors de la copie', 'error');
        }
      },
      b = () => {
        const r = encodeURIComponent(k);
        (window.open(`https://wa.me/?text=${r}`, '_blank'), g());
      };
    return e.jsx(H, {
      isOpen: t,
      onClose: g,
      title: "Demande d'accueil groupée",
      size: 'lg',
      footer: e.jsxs(e.Fragment, {
        children: [
          e.jsx(p, { variant: 'ghost', onClick: g, children: 'Annuler' }),
          e.jsx(p, {
            variant: 'secondary',
            onClick: v,
            leftIcon: e.jsx(te, { className: 'w-4 h-4' }),
            disabled: d.size === 0,
            children: 'Copier',
          }),
          e.jsx(p, {
            onClick: b,
            leftIcon: e.jsx(ie, { className: 'w-4 h-4' }),
            disabled: d.size === 0,
            children: 'Envoyer (WhatsApp)',
          }),
        ],
      }),
      children: e.jsxs('div', {
        className: 'space-y-6',
        children: [
          e.jsxs('div', {
            className:
              'flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsxs('h3', {
                    className: 'font-semibold text-orange-900 dark:text-orange-300',
                    children: [
                      c.length,
                      ' visite',
                      c.length > 1 ? 's' : '',
                      " sans contact d'accueil",
                    ],
                  }),
                  e.jsx('p', {
                    className: 'text-sm text-orange-700 dark:text-orange-400 mt-1',
                    children: 'Sélectionnez les visites pour lesquelles demander un contact',
                  }),
                ],
              }),
              e.jsxs(M, {
                variant: 'warning',
                size: 'md',
                children: [d.size, ' sélectionnée', d.size > 1 ? 's' : ''],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-between mb-3',
                children: [
                  e.jsx('h4', {
                    className: 'font-medium text-gray-900 dark:text-white',
                    children: 'Visites',
                  }),
                  e.jsx('button', {
                    onClick: w,
                    className: 'text-sm text-primary-600 dark:text-primary-400 hover:underline',
                    children: d.size === c.length ? 'Tout désélectionner' : 'Tout sélectionner',
                  }),
                ],
              }),
              e.jsx('div', {
                className:
                  'max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3',
                children: c.map((r) =>
                  e.jsxs(
                    'label',
                    {
                      className:
                        'flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                      children: [
                        e.jsx('input', {
                          type: 'checkbox',
                          checked: d.has(r.visitId),
                          onChange: () => z(r.visitId),
                          className: 'mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500',
                        }),
                        e.jsxs('div', {
                          className: 'flex-1',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                e.jsx('p', {
                                  className: 'font-medium text-gray-900 dark:text-white',
                                  children: r.nom,
                                }),
                                e.jsx(M, {
                                  variant: 'default',
                                  size: 'sm',
                                  children: W(r.visitDate, a.language),
                                }),
                              ],
                            }),
                            e.jsxs('p', {
                              className: 'text-sm text-gray-600 dark:text-gray-400',
                              children: [r.congregation, ' • ', r.visitTime],
                            }),
                            (r.talkTheme || T(r.talkNoOrType)) &&
                              e.jsxs('p', {
                                className: 'text-xs text-gray-500 dark:text-gray-500 mt-1',
                                children: [
                                  'N°',
                                  r.talkNoOrType,
                                  ' - ',
                                  r.talkTheme || T(r.talkNoOrType),
                                ],
                              }),
                          ],
                        }),
                      ],
                    },
                    r.visitId
                  )
                ),
              }),
            ],
          }),
          e.jsxs('div', {
            children: [
              e.jsx('h4', {
                className: 'font-medium text-gray-900 dark:text-white mb-2',
                children: 'Aperçu du message',
              }),
              e.jsxs('div', {
                className: 'relative',
                children: [
                  e.jsx('textarea', {
                    className:
                      'w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm',
                    value: k,
                    onChange: (r) => y(r.target.value),
                    placeholder:
                      d.size === 0
                        ? 'Sélectionnez au moins une visite pour générer le message...'
                        : 'Génération du message...',
                    disabled: d.size === 0,
                  }),
                  d.size > 0 &&
                    e.jsx('div', {
                      className: 'absolute top-2 right-2',
                      children: e.jsxs(M, {
                        variant: 'success',
                        size: 'sm',
                        children: [e.jsx(de, { className: 'w-3 h-3 mr-1' }), 'Message prêt'],
                      }),
                    }),
                ],
              }),
              e.jsx('p', {
                className: 'text-xs text-gray-500 dark:text-gray-400 mt-2',
                children: "💡 Vous pouvez modifier le message avant de l'envoyer",
              }),
            ],
          }),
        ],
      }),
    });
  },
  be = () => {
    const { visits: t, speakers: g, updateVisit: c, refreshData: f } = E(),
      { isPhoneS25Ultra: a } = _();
    R.useEffect(() => {
      f && f();
    }, []);
    const [l, d] = o.useState(null),
      [h, k] = o.useState(''),
      [y, j] = o.useState(!1),
      [z, w] = o.useState(!1),
      [v, b] = o.useState(null),
      [r, u] = o.useState('all'),
      N = o.useMemo(() => {
        const s = [],
          n = new Set();
        return (
          g.forEach((i) => {
            if (!n.has(i.id)) {
              n.add(i.id);
              const x = t.filter((U) => U.id === i.id);
              x.length > 0 && s.push({ speaker: i, visits: x });
            }
          }),
          s
        );
      }, [t, g]),
      O = o.useMemo(
        () =>
          N.filter((s) => {
            const n =
                s.speaker.nom.toLowerCase().includes(h.toLowerCase()) ||
                s.speaker.congregation.toLowerCase().includes(h.toLowerCase()),
              i = r === 'all' || (r === 'pending' && s.visits.some((x) => x.status === 'pending'));
            return n && i;
          }),
        [N, h, r]
      ),
      C = o.useMemo(() => {
        const s = N.length,
          n = t.filter((x) => x.status === 'pending').length,
          i = t.filter((x) => !x.host || x.host === 'À définir' || x.host === '').length;
        return { total: s, pending: n, needingHost: i };
      }, [N, t]),
      P = (s) => {
        switch (s.status) {
          case 'pending':
            return e.jsx(I, { className: 'w-4 h-4 text-orange-500' });
          case 'confirmed':
            return e.jsx(A, { className: 'w-4 h-4 text-green-500' });
          default:
            return e.jsx(Q, { className: 'w-4 h-4 text-gray-500' });
        }
      },
      q = (s, n) => {
        if (s === 'whatsapp' || s === 'email') n && l && (b(n), j(!0));
        else if (s === 'confirm' && n) {
          const i = { ...n, status: 'confirmed', updatedAt: new Date().toISOString() };
          c(i);
        } else s === 'host_request' && n && (b(n), w(!0));
      };
    return e.jsxs('div', {
      className: m('min-h-[calc(100vh-12rem)] flex flex-col', a && 's25-ultra-optimized'),
      children: [
        e.jsxs('div', {
          className: m('flex justify-end gap-3 mb-6', a && 'flex-col gap-2'),
          children: [
            C.needingHost > 0 &&
              e.jsxs(p, {
                variant: 'secondary',
                className:
                  'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50',
                leftIcon: e.jsx(Z, { className: 'w-4 h-4' }),
                onClick: () => w(!0),
                children: ["Demande d'accueil (", C.needingHost, ')'],
              }),
            e.jsx(p, {
              variant: 'secondary',
              leftIcon: e.jsx(J, { className: 'w-4 h-4' }),
              onClick: () => j(!0),
              children: 'Nouveau message',
            }),
          ],
        }),
        e.jsxs('div', {
          className: m('grid gap-4 mb-6', a ? 'grid-cols-1' : 'grid-cols-3'),
          children: [
            e.jsx('div', {
              className: m(
                'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800',
                a && 's25-card'
              ),
              children: e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsx(S, { className: 'w-6 h-6 text-blue-600 dark:text-blue-400' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('div', {
                        className: 'text-lg font-semibold text-blue-900 dark:text-blue-100',
                        children: C.total,
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-blue-700 dark:text-blue-300',
                        children: 'Orateurs',
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx('div', {
              className: m(
                'bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800',
                a && 's25-card'
              ),
              children: e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsx(I, { className: 'w-6 h-6 text-orange-600 dark:text-orange-400' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('div', {
                        className: 'text-lg font-semibold text-orange-900 dark:text-orange-100',
                        children: C.pending,
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-orange-700 dark:text-orange-300',
                        children: 'En attente',
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx('div', {
              className: m(
                'bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800',
                a && 's25-card'
              ),
              children: e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsx(A, { className: 'w-6 h-6 text-green-600 dark:text-green-400' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('div', {
                        className: 'text-lg font-semibold text-green-900 dark:text-green-100',
                        children: t.filter((s) => s.status === 'confirmed').length,
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-green-700 dark:text-green-300',
                        children: 'Confirmées',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        e.jsx('div', {
          className: m(
            'flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6',
            a && 'p-3'
          ),
          children: e.jsxs('div', {
            className: 'flex flex-col sm:flex-row gap-4 w-full sm:w-auto',
            children: [
              e.jsx(ae, {
                placeholder: 'Rechercher un orateur...',
                leftIcon: e.jsx(K, { className: 'w-4 h-4' }),
                value: h,
                onChange: (s) => k(s.target.value),
                className: 'min-w-64',
              }),
              e.jsxs('div', {
                className: 'flex gap-2',
                children: [
                  e.jsx('button', {
                    onClick: () => u('all'),
                    className: `px-3 py-2 text-sm rounded-lg transition-colors ${r === 'all' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`,
                    children: 'Tous',
                  }),
                  e.jsxs('button', {
                    onClick: () => u('pending'),
                    className: `px-3 py-2 text-sm rounded-lg transition-colors ${r === 'pending' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`,
                    children: ['En attente (', C.pending, ')'],
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsxs('div', {
          className: m('flex-1 flex gap-6 min-h-0', a && 'flex-col gap-4'),
          children: [
            e.jsxs('div', {
              className: m(
                'w-full lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
                a && 'w-full min-h-0 flex-1'
              ),
              children: [
                e.jsx('div', {
                  className: 'p-4 border-b border-gray-200 dark:border-gray-700',
                  children: e.jsx('h3', {
                    className: 'font-semibold text-gray-900 dark:text-white',
                    children: 'Orateurs',
                  }),
                }),
                e.jsx('div', {
                  className: 'flex-1 overflow-y-auto',
                  children:
                    O.length > 0
                      ? e.jsx('div', {
                          className: 'divide-y divide-gray-200 dark:divide-gray-700',
                          children: O.map(({ speaker: s, visits: n }) =>
                            e.jsx(
                              'div',
                              {
                                onClick: () => d(s),
                                className: `p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${l?.id === s.id ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500' : ''}`,
                                children: e.jsxs('div', {
                                  className: 'flex items-start justify-between',
                                  children: [
                                    e.jsxs('div', {
                                      className: 'flex items-start gap-3 flex-1 min-w-0',
                                      children: [
                                        e.jsx('div', {
                                          className:
                                            'w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold flex-shrink-0',
                                          children: s.nom.charAt(0).toUpperCase(),
                                        }),
                                        e.jsxs('div', {
                                          className: 'flex-1 min-w-0',
                                          children: [
                                            e.jsxs('div', {
                                              className: 'flex items-center gap-2 mb-1',
                                              children: [
                                                e.jsx('h4', {
                                                  className:
                                                    'font-medium text-gray-900 dark:text-white truncate',
                                                  children: s.nom,
                                                }),
                                                n.some((i) => i.status === 'pending') &&
                                                  e.jsx(M, {
                                                    variant: 'danger',
                                                    className: 'text-xs px-1.5 py-0.5',
                                                    children: '!',
                                                  }),
                                              ],
                                            }),
                                            e.jsx('p', {
                                              className:
                                                'text-sm text-gray-500 dark:text-gray-400 mb-1 truncate',
                                              children: s.congregation,
                                            }),
                                            e.jsxs('div', {
                                              className:
                                                'flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500',
                                              children: [
                                                e.jsxs('span', {
                                                  children: [
                                                    n.length,
                                                    ' visite',
                                                    n.length > 1 ? 's' : '',
                                                  ],
                                                }),
                                                e.jsx('span', { children: '•' }),
                                                e.jsxs('span', {
                                                  children: [
                                                    n.filter((i) => i.status === 'pending').length,
                                                    ' en attente',
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs('div', {
                                      className: 'flex flex-col items-end gap-1 flex-shrink-0',
                                      children: [
                                        n.some((i) => P(i)),
                                        e.jsx('span', {
                                          className: 'text-xs text-gray-400 dark:text-gray-500',
                                          children:
                                            s.telephone || s.email ? 'Contacté' : 'Sans contact',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              },
                              s.id
                            )
                          ),
                        })
                      : e.jsxs('div', {
                          className:
                            'flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400',
                          children: [
                            e.jsx(S, { className: 'w-12 h-12 mb-4 opacity-20' }),
                            e.jsx('p', {
                              className: 'text-center',
                              children: h ? 'Aucun orateur trouvé' : 'Aucun orateur',
                            }),
                          ],
                        }),
                }),
              ],
            }),
            e.jsx('div', {
              className: m(
                'flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
                a && 'w-full'
              ),
              children: l
                ? e.jsx(ce, { speaker: l, visits: t.filter((s) => s.nom === l.nom), onAction: q })
                : e.jsxs('div', {
                    className:
                      'flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400',
                    children: [
                      e.jsx(S, { className: 'w-16 h-16 mb-4 opacity-20' }),
                      e.jsx('h3', {
                        className: 'text-lg font-medium mb-2',
                        children: 'Sélectionnez un orateur',
                      }),
                      e.jsx('p', {
                        className: 'text-center max-w-md',
                        children:
                          'Choisissez un orateur dans la liste pour voir les détails et envoyer des messages.',
                      }),
                    ],
                  }),
            }),
          ],
        }),
        y &&
          l &&
          v &&
          e.jsx(D, {
            isOpen: y,
            onClose: () => {
              (j(!1), b(null));
            },
            speaker: l,
            visit: v,
          }),
        y &&
          !v &&
          e.jsx(D, {
            isOpen: y,
            onClose: () => {
              (j(!1), b(null));
            },
            speaker: l || g[0],
            visit:
              (l &&
                (t.find(
                  (s) => s.id === l.id && (s.status === 'pending' || s.status === 'confirmed')
                ) ||
                  t.find((s) => s.id === l.id))) ||
              t[0],
          }),
        e.jsx(oe, {
          isOpen: z,
          onClose: () => w(!1),
          visitsNeedingHost: t.filter((s) => !s.host || s.host === 'À définir' || s.host === ''),
        }),
      ],
    });
  };
export { be as Messages };
//# sourceMappingURL=Messages-BdO3zdPR.js.map
