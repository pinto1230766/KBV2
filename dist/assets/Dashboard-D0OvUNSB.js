import {
  c as q,
  j as e,
  L as se,
  u as ae,
  a as re,
  b as ne,
  d as le,
  U as H,
  C as Y,
  A as S,
  e as K,
  f as N,
  g as C,
  h as T,
  T as oe,
  B as D,
  Z as ie,
  M as ce,
  F as de,
  i as E,
  Q as he,
  R as me,
} from './index-D4MkNNtG.js';
import {
  r,
  R as Q,
  b as W,
  B as xe,
  C as ue,
  X as pe,
  Y as ge,
  T as G,
  d as fe,
  P as ye,
  e as be,
  f as je,
} from './charts-CCOFnOOy.js';
import { V as ke } from './VisitActionModal-BGIvcVq8.js';
import { C as ve } from './copy-DwuKvwjM.js';
import './react-vendor-B9D_A6Vq.js';
import './utils-FTT-aY8U.js';
import './Select-Cs8xHSai.js';
import './trash-2-avPRzuE0.js';
import './FeedbackFormModal-D34kdZHa.js';
import './link-BcWZK_UP.js';
import './MessageGeneratorModal-DsejHfJr.js';
const we = q('CalendarPlus', [
  ['path', { d: 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8', key: '3spt84' }],
  ['line', { x1: '16', x2: '16', y1: '2', y2: '6', key: 'm3sa8f' }],
  ['line', { x1: '8', x2: '8', y1: '2', y2: '6', key: '18kwsl' }],
  ['line', { x1: '3', x2: '21', y1: '10', y2: '10', key: 'xt86sb' }],
  ['line', { x1: '19', x2: '19', y1: '16', y2: '22', key: '1ttwzi' }],
  ['line', { x1: '16', x2: '22', y1: '19', y2: '19', key: '1g9955' }],
]);
const Ne = q('UserPlus', [
  ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
  ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
  ['line', { x1: '19', x2: '19', y1: '8', y2: '14', key: '1bvyxn' }],
  ['line', { x1: '22', x2: '16', y1: '11', y2: '11', key: '1shjgl' }],
]);
const Ce = q('WifiOff', [
    ['line', { x1: '2', x2: '22', y1: '2', y2: '22', key: 'a6p6uj' }],
    ['path', { d: 'M8.5 16.5a5 5 0 0 1 7 0', key: 'sej527' }],
    ['path', { d: 'M2 8.82a15 15 0 0 1 4.17-2.65', key: '11utq1' }],
    ['path', { d: 'M10.66 5c4.01-.36 8.14.9 11.34 3.76', key: 'hxefdu' }],
    ['path', { d: 'M16.85 11.25a10 10 0 0 1 2.22 1.68', key: 'q734kn' }],
    ['path', { d: 'M5 13a10 10 0 0 1 5.24-2.76', key: 'piq4yl' }],
    ['line', { x1: '12', x2: '12.01', y1: '20', y2: '20', key: 'of4bc4' }],
  ]),
  De = (a) => {
    const { onRefresh: d, threshold: x = 80, resistance: c = 2.5 } = a,
      [u, h] = r.useState(!1),
      [k, l] = r.useState(0),
      O = r.useRef(0),
      v = r.useRef(!1),
      M = r.useCallback((f) => {
        window.scrollY === 0 && ((O.current = f.touches[0].clientY), (v.current = !0));
      }, []),
      w = r.useCallback(
        (f) => {
          if (!v.current || u) return;
          const R = f.touches[0].clientY - O.current;
          if (R > 0) {
            const P = R / c;
            (l(Math.min(P, x * 1.5)), R > 10 && f.preventDefault());
          }
        },
        [u, x, c]
      ),
      L = r.useCallback(async () => {
        if (v.current)
          if (((v.current = !1), k >= x && !u)) {
            h(!0);
            try {
              await d();
            } finally {
              (h(!1), l(0));
            }
          } else l(0);
      }, [k, x, u, d]);
    return (
      r.useEffect(
        () => (
          document.addEventListener('touchstart', M, { passive: !0 }),
          document.addEventListener('touchmove', w, { passive: !1 }),
          document.addEventListener('touchend', L),
          () => {
            (document.removeEventListener('touchstart', M),
              document.removeEventListener('touchmove', w),
              document.removeEventListener('touchend', L));
          }
        ),
        [M, w, L]
      ),
      { isRefreshing: u, pullDistance: k }
    );
  },
  Me = ({ pullDistance: a, isRefreshing: d, threshold: x = 80 }) => {
    const c = Math.min((a / x) * 100, 100),
      u = Math.min(a / x, 1);
    return a === 0 && !d
      ? null
      : (Q.useEffect(() => {
          const h = document.documentElement;
          (h.style.setProperty('--ptr-transform', `translateY(${d ? '60px' : `${a}px`})`),
            h.style.setProperty('--ptr-opacity', d ? '1' : u.toString()));
        }, [a, d, u]),
        e.jsx('div', {
          className:
            'pull-refresh-indicator fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all duration-200',
          children: e.jsx('div', {
            className: 'bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg',
            children: d
              ? e.jsx(se, { className: 'w-6 h-6 text-ios-blue animate-spin' })
              : e.jsx('div', {
                  className: 'relative w-6 h-6',
                  children: e.jsxs('svg', {
                    className: 'w-6 h-6 transform -rotate-90',
                    viewBox: '0 0 24 24',
                    children: [
                      e.jsx('circle', {
                        cx: '12',
                        cy: '12',
                        r: '10',
                        stroke: 'currentColor',
                        strokeWidth: '2',
                        fill: 'none',
                        className: 'text-gray-200 dark:text-gray-700',
                      }),
                      e.jsx('circle', {
                        cx: '12',
                        cy: '12',
                        r: '10',
                        stroke: 'currentColor',
                        strokeWidth: '2',
                        fill: 'none',
                        strokeDasharray: `${2 * Math.PI * 10}`,
                        strokeDashoffset: `${2 * Math.PI * 10 * (1 - c / 100)}`,
                        className: 'text-ios-blue transition-all duration-200',
                        strokeLinecap: 'round',
                      }),
                    ],
                  }),
                }),
          }),
        }));
  },
  Le = ({ isOnline: a }) =>
    a
      ? null
      : e.jsxs('div', {
          className:
            'fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg',
          children: [
            e.jsx(Ce, { className: 'w-4 h-4' }),
            e.jsx('span', { children: 'Mode hors ligne - Données en cache' }),
          ],
        });
function Re() {
  return 'deviceMemory' in navigator
    ? navigator.deviceMemory <= 2
    : 'hardwareConcurrency' in navigator
      ? navigator.hardwareConcurrency <= 2
      : !1;
}
const $e = r.memo(({ visit: a, onClick: d, showStatus: x = !1 }) => {
    const c = () => {
      switch (a.status) {
        case 'confirmed':
          return e.jsx(E, { variant: 'success', className: 'text-xs', children: 'Confirmé' });
        case 'pending':
          return e.jsx(E, { variant: 'warning', className: 'text-xs', children: 'En attente' });
        case 'completed':
          return e.jsx(E, { variant: 'default', className: 'text-xs', children: 'Terminé' });
        case 'cancelled':
          return e.jsx(E, { variant: 'danger', className: 'text-xs', children: 'Annulé' });
        default:
          return null;
      }
    };
    return e.jsxs('div', {
      className:
        'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer',
      onClick: d,
      children: [
        e.jsxs('div', {
          className: 'flex items-center gap-3',
          children: [
            e.jsx('div', {
              className:
                'w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold',
              children: a.nom.charAt(0).toUpperCase(),
            }),
            e.jsxs('div', {
              children: [
                e.jsx('p', {
                  className: 'font-medium text-gray-900 dark:text-white',
                  children: a.nom,
                }),
                e.jsxs('p', {
                  className: 'text-sm text-gray-500 dark:text-gray-400',
                  children: [
                    new Date(a.visitDate).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    }),
                    ' à ',
                    a.visitTime,
                  ],
                }),
                a.talkTheme &&
                  e.jsxs('p', {
                    className: 'text-xs text-gray-600 dark:text-gray-500 mt-1',
                    children: ['N°', a.talkNoOrType, ' - ', a.talkTheme],
                  }),
              ],
            }),
          ],
        }),
        x && c(),
      ],
    });
  }),
  qe = () => {
    const { visits: a, speakers: d, hosts: x } = ae(),
      { addToast: c } = re(),
      { deviceType: u, orientation: h, isPhoneS25Ultra: k } = ne(),
      l = le(),
      [O, v] = r.useState(navigator.onLine),
      [M, w] = r.useState(!1),
      [L, f] = r.useState(!1),
      [F, R] = r.useState(null),
      [P, A] = r.useState(!1),
      B = r.useCallback((t) => {
        (R(t), A(!0));
      }, []),
      y = u === 'tablet',
      $ = y && window.innerWidth >= 1200,
      { isRefreshing: Z, pullDistance: X } = De({
        onRefresh: async () => {
          window.location.reload();
        },
      });
    Q.useEffect(() => {
      const t = () => v(!0),
        s = () => v(!1);
      return (
        window.addEventListener('online', t),
        window.addEventListener('offline', s),
        () => {
          (window.removeEventListener('online', t), window.removeEventListener('offline', s));
        }
      );
    }, []);
    const V = typeof window < 'u' && window.innerWidth < 768,
      J = Re(),
      b = r.useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        const s = new Date(t.getFullYear(), t.getMonth() + 1, 0);
        return (s.setHours(23, 59, 59, 999), { today: t, endOfMonth: s });
      }, []),
      z = r.useMemo(
        () =>
          a
            .filter((t) => {
              const s = new Date(t.visitDate);
              return (
                s >= b.today &&
                s <= b.endOfMonth &&
                (t.status === 'confirmed' || t.status === 'pending')
              );
            })
            .sort((t, s) => new Date(t.visitDate).getTime() - new Date(s.visitDate).getTime()),
        [a, b]
      ),
      j = r.useMemo(
        () =>
          a.filter(
            (t) =>
              t.status === 'pending' ||
              (t.status === 'confirmed' && new Date(t.visitDate) < b.today)
          ),
        [a, b]
      ),
      I = r.useMemo(() => {
        const t = b.today;
        return a.filter((s) => {
          const p = new Date(s.visitDate);
          return p.getMonth() === t.getMonth() && p.getFullYear() === t.getFullYear();
        }).length;
      }, [a, b]),
      _ = r.useMemo(
        () => [
          {
            label: 'Orateurs actifs',
            value: d.length,
            icon: H,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            trend: '+2 ce mois',
          },
          {
            label: "Contacts d'accueil",
            value: x.length,
            icon: H,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20',
            trend: '+1 cette semaine',
          },
          {
            label: 'Visites ce mois',
            value: I,
            icon: Y,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/20',
            trend: '+15%',
          },
          {
            label: 'Actions requises',
            value: j.length,
            icon: S,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/20',
            trend: j.length > 0 ? 'Urgent' : 'À jour',
          },
        ],
        [d.length, x.length, I, j.length]
      ),
      ee = r.useMemo(() => {
        const t = [],
          s = b.today;
        for (let p = 5; p >= 0; p--) {
          const i = new Date(s.getFullYear(), s.getMonth() - p, 1),
            g = a.filter((m) => {
              const o = new Date(m.visitDate);
              return o.getMonth() === i.getMonth() && o.getFullYear() === i.getFullYear();
            }).length;
          t.push({ name: i.toLocaleDateString('fr-FR', { month: 'short' }), visites: g });
        }
        return t;
      }, [a, b]),
      U = r.useMemo(
        () => [
          {
            name: 'Physique',
            value: a.filter((t) => t.locationType === 'physical').length,
            color: '#3B82F6',
          },
          {
            name: 'Zoom',
            value: a.filter((t) => t.locationType === 'zoom').length,
            color: '#10B981',
          },
          {
            name: 'Streaming',
            value: a.filter((t) => t.locationType === 'streaming').length,
            color: '#F59E0B',
          },
        ],
        [a]
      );
    r.useEffect(() => {
      const t = (s) => {
        (s.ctrlKey || s.metaKey) && s.key === 'k' && (s.preventDefault(), w(!0));
      };
      return (
        window.addEventListener('keydown', t),
        () => window.removeEventListener('keydown', t)
      );
    }, []);
    const te = r.useCallback(() => l('/planning'), [l]);
    return e.jsxs(e.Fragment, {
      children: [
        e.jsxs('div', {
          className: K(
            'h-full',
            k && 's25-ultra-optimized',
            y ? 'flex flex-col space-y-3 pb-4' : V ? 'space-y-4' : 'space-y-6',
            'px-4',
            J && 'optimize-rendering'
          ),
          children: [
            e.jsx(Me, { pullDistance: X, isRefreshing: Z }),
            e.jsx(Le, { isOnline: O }),
            e.jsx('div', {
              className: `flex-shrink-0 grid gap-3 sm:gap-6 ${k || V ? 'grid-cols-2' : (u === 'tablet' && h === 'landscape') || u === 'tablet' ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`,
              children: _.map((t, s) =>
                e.jsx(
                  N,
                  {
                    hoverable: !0,
                    className: K('relative overflow-hidden cursor-pointer', k && 's25-card'),
                    onClick: () => {
                      s === 0 || s === 1 ? l('/speakers') : (s === 2 || s === 3) && l('/planning');
                    },
                    children: e.jsxs(C, {
                      className: 'flex items-center',
                      children: [
                        e.jsx('div', {
                          className: `p-2 sm:p-3 rounded-xl ${t.bg} mr-3 sm:mr-4`,
                          children: e.jsx(t.icon, {
                            className: `w-5 h-5 sm:w-6 sm:h-6 ${t.color}`,
                          }),
                        }),
                        e.jsxs('div', {
                          className: 'flex-1 min-w-0',
                          children: [
                            e.jsx('p', {
                              className:
                                'text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400',
                              children: t.label,
                            }),
                            e.jsx('p', {
                              className:
                                'text-lg sm:text-2xl font-bold text-gray-900 dark:text-white',
                              children: t.value,
                            }),
                            e.jsx('p', {
                              className: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
                              children: t.trend,
                            }),
                          ],
                        }),
                      ],
                    }),
                  },
                  t.label
                )
              ),
            }),
            e.jsxs('div', {
              className: `
        grid gap-4 sm:gap-6
        ${y && $ && h === 'landscape' ? 'grid-cols-12' : 'grid-cols-1 lg:grid-cols-12'}
      `,
              children: [
                e.jsx('div', {
                  className: `
          ${y && $ && h === 'landscape' ? 'col-span-8' : 'col-span-1 lg:col-span-8'}
        `,
                  children: e.jsxs(N, {
                    className: 'h-full',
                    children: [
                      e.jsx(T, {
                        children: e.jsxs('h3', {
                          className:
                            'text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2',
                          children: [
                            e.jsx(oe, { className: 'w-4 h-4 md:w-5 md:h-5' }),
                            'Évolution mensuelle',
                          ],
                        }),
                      }),
                      e.jsx(C, {
                        children: e.jsx('div', {
                          className: `${V ? 'h-48' : 'h-64'} w-full`,
                          children: e.jsx(W, {
                            width: '100%',
                            height: '100%',
                            children: e.jsxs(xe, {
                              data: ee,
                              children: [
                                e.jsx(ue, {
                                  strokeDasharray: '3 3',
                                  stroke: '#E5E7EB',
                                  className: 'dark:stroke-gray-700',
                                }),
                                e.jsx(pe, {
                                  dataKey: 'name',
                                  stroke: '#6B7280',
                                  fontSize: 12,
                                  tickLine: !1,
                                  axisLine: !1,
                                }),
                                e.jsx(ge, {
                                  stroke: '#6B7280',
                                  fontSize: 12,
                                  tickLine: !1,
                                  axisLine: !1,
                                }),
                                e.jsx(G, {
                                  cursor: { fill: '#F3F4F6' },
                                  contentStyle: { borderRadius: '8px', border: 'none' },
                                }),
                                e.jsx(fe, {
                                  dataKey: 'visites',
                                  fill: '#4F46E5',
                                  radius: [4, 4, 0, 0],
                                }),
                              ],
                            }),
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
                e.jsx('div', {
                  className: `
          ${y && $ && h === 'landscape' ? 'col-span-4' : 'col-span-1 lg:col-span-4'}
        `,
                  children: e.jsxs(N, {
                    className: 'h-full flex flex-col',
                    children: [
                      e.jsxs(T, {
                        className: 'flex items-center justify-between flex-shrink-0',
                        children: [
                          e.jsxs('h3', {
                            className:
                              'text-sm md:text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2',
                            children: [e.jsx(ve, { className: 'w-4 h-4' }), 'Prochaines visites'],
                          }),
                          e.jsx(D, {
                            variant: 'secondary',
                            size: 'sm',
                            onClick: te,
                            children: 'Voir tout',
                          }),
                        ],
                      }),
                      e.jsx(C, {
                        className: 'flex-1 overflow-y-auto min-h-[200px]',
                        children:
                          z.length > 0
                            ? e.jsx('div', {
                                className: 'space-y-3',
                                children: z
                                  .slice(0, 5)
                                  .map((t) =>
                                    e.jsx(
                                      $e,
                                      { visit: t, onClick: () => B(t), showStatus: !0 },
                                      t.id
                                    )
                                  ),
                              })
                            : e.jsxs('div', {
                                className:
                                  'text-center py-8 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center',
                                children: [
                                  e.jsx(Y, { className: 'w-10 h-10 mx-auto mb-2 opacity-20' }),
                                  e.jsx('p', {
                                    className: 'font-medium text-sm',
                                    children: 'Aucune visite',
                                  }),
                                ],
                              }),
                      }),
                    ],
                  }),
                }),
                e.jsxs('div', {
                  className: `
          ${y && $ && h === 'landscape' ? 'col-span-4' : 'col-span-1 lg:col-span-4'}
          flex flex-col gap-4 sm:gap-6
        `,
                  children: [
                    e.jsxs(N, {
                      children: [
                        e.jsx(T, {
                          className: 'py-3',
                          children: e.jsxs('h3', {
                            className:
                              'text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2',
                            children: [e.jsx(Y, { className: 'w-4 h-4' }), 'Répartition'],
                          }),
                        }),
                        e.jsxs(C, {
                          className: 'py-2',
                          children: [
                            e.jsx('div', {
                              className: 'h-32 w-full',
                              children: e.jsx(W, {
                                width: '100%',
                                height: '100%',
                                children: e.jsxs(ye, {
                                  children: [
                                    e.jsx(be, {
                                      data: U,
                                      cx: '50%',
                                      cy: '50%',
                                      innerRadius: 30,
                                      outerRadius: 50,
                                      paddingAngle: 5,
                                      dataKey: 'value',
                                      children: U.map((t, s) =>
                                        e.jsx(je, { fill: t.color }, `cell-${s}`)
                                      ),
                                    }),
                                    e.jsx(G, {}),
                                  ],
                                }),
                              }),
                            }),
                            e.jsx('div', {
                              className: 'flex justify-center gap-3 mt-1 pb-2',
                              children: U.map((t) => {
                                const s =
                                  t.name === 'Physique'
                                    ? 'bg-blue-500'
                                    : t.name === 'Zoom'
                                      ? 'bg-green-500'
                                      : 'bg-amber-500';
                                return e.jsxs(
                                  'div',
                                  {
                                    className: 'flex items-center gap-1.5',
                                    children: [
                                      e.jsx('div', { className: `w-1.5 h-1.5 rounded-full ${s}` }),
                                      e.jsx('span', {
                                        className: 'text-xs text-gray-600 dark:text-gray-400',
                                        children: t.name,
                                      }),
                                      e.jsx('span', {
                                        className:
                                          'text-xs font-bold text-gray-900 dark:text-white',
                                        children: t.value,
                                      }),
                                    ],
                                  },
                                  t.name
                                );
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs(N, {
                      className: 'flex-1',
                      children: [
                        e.jsx(T, {
                          className: 'py-3',
                          children: e.jsxs('h3', {
                            className:
                              'text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2',
                            children: [
                              e.jsx(ie, { className: 'w-4 h-4 text-yellow-500' }),
                              'Accès Rapide',
                            ],
                          }),
                        }),
                        e.jsx(C, {
                          children: e.jsxs('div', {
                            className: 'grid grid-cols-2 gap-3',
                            children: [
                              e.jsxs(D, {
                                variant: 'secondary',
                                className:
                                  'h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20',
                                onClick: () => A(!0),
                                children: [
                                  e.jsx('div', {
                                    className:
                                      'p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400',
                                    children: e.jsx(we, { className: 'w-5 h-5' }),
                                  }),
                                  e.jsx('span', {
                                    className: 'text-xs font-medium',
                                    children: 'Nouvelle Visite',
                                  }),
                                ],
                              }),
                              e.jsxs(D, {
                                variant: 'secondary',
                                className:
                                  'h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20',
                                onClick: () => l('/speakers'),
                                children: [
                                  e.jsx('div', {
                                    className:
                                      'p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400',
                                    children: e.jsx(Ne, { className: 'w-5 h-5' }),
                                  }),
                                  e.jsx('span', {
                                    className: 'text-xs font-medium',
                                    children: 'Nouvel Orateur',
                                  }),
                                ],
                              }),
                              e.jsxs(D, {
                                variant: 'secondary',
                                className:
                                  'h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20',
                                onClick: () => l('/messages'),
                                children: [
                                  e.jsx('div', {
                                    className:
                                      'p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400',
                                    children: e.jsx(ce, { className: 'w-5 h-5' }),
                                  }),
                                  e.jsx('span', {
                                    className: 'text-xs font-medium',
                                    children: 'Messages',
                                  }),
                                ],
                              }),
                              e.jsxs(D, {
                                variant: 'secondary',
                                className:
                                  'h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20',
                                onClick: () => f(!0),
                                children: [
                                  e.jsx('div', {
                                    className:
                                      'p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400',
                                    children: e.jsx(de, { className: 'w-5 h-5' }),
                                  }),
                                  e.jsx('span', {
                                    className: 'text-xs font-medium',
                                    children: 'Rapports',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsx('div', {
                  className: `
          ${y && $ && h === 'landscape' ? 'col-span-8' : 'col-span-1 lg:col-span-8'}
        `,
                  children: e.jsxs(N, {
                    className: 'h-full flex flex-col',
                    children: [
                      e.jsxs(T, {
                        className: 'flex items-center justify-between flex-shrink-0',
                        children: [
                          e.jsxs('h3', {
                            className:
                              'text-sm md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2',
                            children: [
                              e.jsx(S, { className: 'w-4 h-4 md:w-5 md:h-5' }),
                              'Actions requises',
                            ],
                          }),
                          j.length > 0 &&
                            e.jsxs(E, {
                              variant: 'danger',
                              className: 'text-xs',
                              children: [j.length, ' alerte', j.length > 1 ? 's' : ''],
                            }),
                        ],
                      }),
                      e.jsx(C, {
                        className: 'flex-1 overflow-y-auto min-h-[250px]',
                        children: e.jsx('div', {
                          className: 'space-y-3',
                          children:
                            j.length > 0
                              ? e.jsx('div', {
                                  className: 'grid grid-cols-1 md:grid-cols-2 gap-3',
                                  children: j.slice(0, 10).map((t) =>
                                    e.jsxs(
                                      'div',
                                      {
                                        className:
                                          'flex items-center justify-between p-3 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 rounded-lg',
                                        children: [
                                          e.jsxs('div', {
                                            className:
                                              'flex items-center gap-3 cursor-pointer overflow-hidden',
                                            onClick: () => B(t),
                                            children: [
                                              e.jsx(S, {
                                                className: 'w-8 h-8 text-orange-500 flex-shrink-0',
                                              }),
                                              e.jsxs('div', {
                                                className: 'min-w-0',
                                                children: [
                                                  e.jsx('p', {
                                                    className:
                                                      'font-medium text-gray-900 dark:text-white truncate',
                                                    children:
                                                      t.status === 'pending'
                                                        ? 'Validation requise'
                                                        : 'Visite passée',
                                                  }),
                                                  e.jsx('p', {
                                                    className:
                                                      'text-sm text-gray-500 dark:text-gray-400 truncate',
                                                    children: t.nom,
                                                  }),
                                                  e.jsx('p', {
                                                    className:
                                                      'text-xs text-orange-600 dark:text-orange-400',
                                                    children: new Date(
                                                      t.visitDate
                                                    ).toLocaleDateString('fr-FR', {
                                                      day: 'numeric',
                                                      month: 'long',
                                                    }),
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsx(D, {
                                            variant: 'secondary',
                                            size: 'sm',
                                            onClick: (s) => {
                                              (s.stopPropagation(), B(t));
                                            },
                                            children: 'Traiter',
                                          }),
                                        ],
                                      },
                                      t.id
                                    )
                                  ),
                                })
                              : e.jsxs('div', {
                                  className:
                                    'text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full',
                                  children: [
                                    e.jsx(S, { className: 'w-16 h-16 mx-auto mb-4 opacity-20' }),
                                    e.jsx('p', {
                                      className: 'font-medium text-lg',
                                      children: 'Aucune action requise',
                                    }),
                                    e.jsx('p', {
                                      className: 'text-sm mt-1',
                                      children: 'Tout est à jour !',
                                    }),
                                  ],
                                }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
        F && e.jsx(ke, { isOpen: P, onClose: () => A(!1), visit: F, action: 'edit' }),
        e.jsx(he, {
          isOpen: M,
          onClose: () => w(!1),
          onAction: (t) => {
            switch ((w(!1), t)) {
              case 'schedule-visit':
                l('/planning');
                break;
              case 'add-speaker':
                l('/speakers');
                break;
              case 'add-host':
                l('/speakers');
                break;
              case 'send-message':
                l('/messages');
                break;
              case 'generate-report':
                f(!0);
                break;
              case 'check-conflicts':
                l('/planning');
                break;
              case 'backup-data':
                l('/settings');
                break;
              case 'import-data':
                l('/settings');
                break;
              case 'sync-sheets':
                (l('/settings'), c('Synchronisation Google Sheets lancée...', 'info'));
                break;
              case 'export-all-data':
                (l('/settings'), c('Exportation de toutes les données lancée...', 'info'));
                break;
              case 'search-entities':
                (l('/planning'), c("Redirection vers la recherche d'entités", 'info'));
                break;
              case 'show-statistics':
                c('Affichage des statistiques...', 'info');
                break;
            }
          },
        }),
        e.jsx(me, {
          isOpen: L,
          onClose: () => f(!1),
          onGenerate: (t) => {
            const s = a.filter((i) => {
                if (t.period === 'current-month') {
                  const g = new Date(),
                    m = new Date(i.visitDate);
                  return m.getMonth() === g.getMonth() && m.getFullYear() === g.getFullYear();
                }
                return !0;
              }),
              p = `rapport-kbv-${new Date().toISOString().slice(0, 10)}`;
            if (t.format === 'csv') {
              let i = `Date,Orateur,Congrégation,Discours,Thème,Hôte,Statut
`;
              s.forEach((n) => {
                i += `${n.visitDate},${n.nom},${n.congregation},${n.talkNoOrType || ''},${n.talkTheme || ''},${n.host || ''},${n.status}
`;
              });
              const g = new Blob([i], { type: 'text/csv;charset=utf-8;' }),
                m = URL.createObjectURL(g),
                o = document.createElement('a');
              ((o.href = m),
                (o.download = `${p}.csv`),
                document.body.appendChild(o),
                o.click(),
                document.body.removeChild(o),
                URL.revokeObjectURL(m),
                c('Rapport CSV généré !', 'success'));
            } else if (t.format === 'excel') {
              let i =
                '<html><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid black;padding:8px;text-align:left;}th{background-color:#4F46E5;color:white;}</style></head><body><h1>Rapport KBV Lyon</h1><table><tr><th>Date</th><th>Orateur</th><th>Congrégation</th><th>Discours</th><th>Thème</th><th>Hôte</th><th>Statut</th></tr>';
              (s.forEach((n) => {
                i += `<tr><td>${n.visitDate}</td><td>${n.nom}</td><td>${n.congregation}</td><td>${n.talkNoOrType || ''}</td><td>${n.talkTheme || ''}</td><td>${n.host || ''}</td><td>${n.status}</td></tr>`;
              }),
                (i += '</table></body></html>'));
              const g = new Blob([i], { type: 'application/vnd.ms-excel' }),
                m = URL.createObjectURL(g),
                o = document.createElement('a');
              ((o.href = m),
                (o.download = `${p}.xls`),
                document.body.appendChild(o),
                o.click(),
                document.body.removeChild(o),
                URL.revokeObjectURL(m),
                c('Rapport Excel généré !', 'success'));
            } else if (t.format === 'pdf') {
              let i = `<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px;}h1{color:#4F46E5;}table{border-collapse:collapse;width:100%;margin-top:20px;}th,td{border:1px solid #ddd;padding:12px;text-align:left;}th{background-color:#4F46E5;color:white;}</style></head><body><h1>Rapport KBV Lyon</h1><p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p><table><tr><th>Date</th><th>Orateur</th><th>Congrégation</th><th>Discours</th><th>Thème</th><th>Hôte</th><th>Statut</th></tr>`;
              (s.forEach((n) => {
                i += `<tr><td>${new Date(n.visitDate).toLocaleDateString('fr-FR')}</td><td>${n.nom}</td><td>${n.congregation}</td><td>${n.talkNoOrType || ''}</td><td>${n.talkTheme || ''}</td><td>${n.host || ''}</td><td>${n.status}</td></tr>`;
              }),
                (i += `</table><p style="margin-top:30px;color:#666;">Total: ${s.length} visite(s)</p></body></html>`));
              const g = new Blob([i], { type: 'text/html' }),
                m = URL.createObjectURL(g),
                o = document.createElement('a');
              ((o.href = m),
                (o.download = `${p}.html`),
                document.body.appendChild(o),
                o.click(),
                document.body.removeChild(o),
                URL.revokeObjectURL(m),
                c('Rapport HTML généré ! Ouvrez-le et imprimez en PDF', 'success'));
            }
            f(!1);
          },
        }),
      ],
    });
  };
export { qe as Dashboard };
//# sourceMappingURL=Dashboard-D0OvUNSB.js.map
