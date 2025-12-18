import { j as n, r as Ae } from './iframe-JL5x0-uX.js';
import { c as j } from './Button-BiCkDpf-.js';
import './preload-helper-PPVm8Dsz.js';
function Oe(e) {
  var t,
    o,
    r = '';
  if (typeof e == 'string' || typeof e == 'number') r += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++) e[t] && (o = Oe(e[t])) && (r && (r += ' '), (r += o));
    } else for (o in e) e[o] && (r && (r += ' '), (r += o));
  return r;
}
function Ze() {
  for (var e, t, o = 0, r = '', i = arguments.length; o < i; o++)
    (e = arguments[o]) && (t = Oe(e)) && (r && (r += ' '), (r += t));
  return r;
}
const Qe = j('Activity', [['path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2', key: 'd5dnw9' }]]);
const er = j('ArrowDownRight', [
  ['path', { d: 'm7 7 10 10', key: '1fmybs' }],
  ['path', { d: 'M17 7v10H7', key: '6fjiku' }],
]);
const rr = j('ArrowUpRight', [
  ['path', { d: 'M7 7h10v10', key: '1tivn9' }],
  ['path', { d: 'M7 17 17 7', key: '1vkiza' }],
]);
const tr = j('Calendar', [
  ['rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', ry: '2', key: 'eu3xkr' }],
  ['line', { x1: '16', x2: '16', y1: '2', y2: '6', key: 'm3sa8f' }],
  ['line', { x1: '8', x2: '8', y1: '2', y2: '6', key: '18kwsl' }],
  ['line', { x1: '3', x2: '21', y1: '10', y2: '10', key: 'xt86sb' }],
]);
const or = j('CheckCircle', [
  ['path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', key: 'g774vq' }],
  ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
]);
const sr = j('Clock', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['polyline', { points: '12 6 12 12 16 14', key: '68esgv' }],
]);
const ar = j('EyeOff', [
  ['path', { d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24', key: '1jxqfv' }],
  [
    'path',
    {
      d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68',
      key: '9wicm4',
    },
  ],
  [
    'path',
    { d: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61', key: '1jreej' },
  ],
  ['line', { x1: '2', x2: '22', y1: '2', y2: '22', key: 'a6p6uj' }],
]);
const nr = j('Eye', [
  ['path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z', key: 'rwhkz3' }],
  ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
]);
const Me = j('Minus', [['path', { d: 'M5 12h14', key: '1ays0h' }]]);
const ir = j('TrendingDown', [
  ['polyline', { points: '22 17 13.5 8.5 8.5 13.5 2 7', key: '1r2t7k' }],
  ['polyline', { points: '16 17 22 17 22 11', key: '11uiuu' }],
]);
const lr = j('TrendingUp', [
  ['polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17', key: '126l90' }],
  ['polyline', { points: '16 7 22 7 22 13', key: 'kwv8wd' }],
]);
const cr = j('Users', [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
    ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87', key: 'kshegd' }],
    ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75', key: '1da9ce' }],
  ]),
  Ge = ({ children: e, className: t = '', onClick: o, hoverable: r = !1 }) =>
    n.jsx('div', {
      className: `
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
        ${r || o ? 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer' : 'transition-shadow duration-200'}
        ${t}
      `,
      onClick: o,
      children: e,
    }),
  Ee = ({ children: e, className: t = '' }) => n.jsx('div', { className: `p-6 ${t}`, children: e });
Ge.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Card',
  props: {
    children: {
      required: !0,
      tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
      description: '',
    },
    className: {
      required: !1,
      tsType: { name: 'string' },
      description: '',
      defaultValue: { value: "''", computed: !1 },
    },
    onClick: {
      required: !1,
      tsType: {
        name: 'signature',
        type: 'function',
        raw: '() => void',
        signature: { arguments: [], return: { name: 'void' } },
      },
      description: '',
    },
    hoverable: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
Ee.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardBody',
  props: {
    children: {
      required: !0,
      tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
      description: '',
    },
    className: {
      required: !1,
      tsType: { name: 'string' },
      description: '',
      defaultValue: { value: "''", computed: !1 },
    },
  },
};
const dr = (e, t) => {
    const o = new Array(e.length + t.length);
    for (let r = 0; r < e.length; r++) o[r] = e[r];
    for (let r = 0; r < t.length; r++) o[e.length + r] = t[r];
    return o;
  },
  mr = (e, t) => ({ classGroupId: e, validator: t }),
  Fe = (e = new Map(), t = null, o) => ({ nextPart: e, validators: t, classGroupId: o }),
  ue = '-',
  Te = [],
  pr = 'arbitrary..',
  ur = (e) => {
    const t = fr(e),
      { conflictingClassGroups: o, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (l) => {
        if (l.startsWith('[') && l.endsWith(']')) return gr(l);
        const g = l.split(ue),
          m = g[0] === '' && g.length > 1 ? 1 : 0;
        return Le(g, m, t);
      },
      getConflictingClassGroupIds: (l, g) => {
        if (g) {
          const m = r[l],
            f = o[l];
          return m ? (f ? dr(f, m) : m) : f || Te;
        }
        return o[l] || Te;
      },
    };
  },
  Le = (e, t, o) => {
    if (e.length - t === 0) return o.classGroupId;
    const i = e[t],
      d = o.nextPart.get(i);
    if (d) {
      const f = Le(e, t + 1, d);
      if (f) return f;
    }
    const l = o.validators;
    if (l === null) return;
    const g = t === 0 ? e.join(ue) : e.slice(t).join(ue),
      m = l.length;
    for (let f = 0; f < m; f++) {
      const y = l[f];
      if (y.validator(g)) return y.classGroupId;
    }
  },
  gr = (e) =>
    e.slice(1, -1).indexOf(':') === -1
      ? void 0
      : (() => {
          const t = e.slice(1, -1),
            o = t.indexOf(':'),
            r = t.slice(0, o);
          return r ? pr + r : void 0;
        })(),
  fr = (e) => {
    const { theme: t, classGroups: o } = e;
    return br(o, t);
  },
  br = (e, t) => {
    const o = Fe();
    for (const r in e) {
      const i = e[r];
      ke(i, o, r, t);
    }
    return o;
  },
  ke = (e, t, o, r) => {
    const i = e.length;
    for (let d = 0; d < i; d++) {
      const l = e[d];
      hr(l, t, o, r);
    }
  },
  hr = (e, t, o, r) => {
    if (typeof e == 'string') {
      xr(e, t, o);
      return;
    }
    if (typeof e == 'function') {
      yr(e, t, o, r);
      return;
    }
    vr(e, t, o, r);
  },
  xr = (e, t, o) => {
    const r = e === '' ? t : qe(t, e);
    r.classGroupId = o;
  },
  yr = (e, t, o, r) => {
    if (kr(e)) {
      ke(e(r), t, o, r);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(mr(o, e)));
  },
  vr = (e, t, o, r) => {
    const i = Object.entries(e),
      d = i.length;
    for (let l = 0; l < d; l++) {
      const [g, m] = i[l];
      ke(m, qe(t, g), o, r);
    }
  },
  qe = (e, t) => {
    let o = e;
    const r = t.split(ue),
      i = r.length;
    for (let d = 0; d < i; d++) {
      const l = r[d];
      let g = o.nextPart.get(l);
      (g || ((g = Fe()), o.nextPart.set(l, g)), (o = g));
    }
    return o;
  },
  kr = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0,
  wr = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let t = 0,
      o = Object.create(null),
      r = Object.create(null);
    const i = (d, l) => {
      ((o[d] = l), t++, t > e && ((t = 0), (r = o), (o = Object.create(null))));
    };
    return {
      get(d) {
        let l = o[d];
        if (l !== void 0) return l;
        if ((l = r[d]) !== void 0) return (i(d, l), l);
      },
      set(d, l) {
        d in o ? (o[d] = l) : i(d, l);
      },
    };
  },
  ve = '!',
  Se = ':',
  Cr = [],
  _e = (e, t, o, r, i) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: o,
    maybePostfixModifierPosition: r,
    isExternal: i,
  }),
  jr = (e) => {
    const { prefix: t, experimentalParseClassName: o } = e;
    let r = (i) => {
      const d = [];
      let l = 0,
        g = 0,
        m = 0,
        f;
      const y = i.length;
      for (let N = 0; N < y; N++) {
        const w = i[N];
        if (l === 0 && g === 0) {
          if (w === Se) {
            (d.push(i.slice(m, N)), (m = N + 1));
            continue;
          }
          if (w === '/') {
            f = N;
            continue;
          }
        }
        w === '[' ? l++ : w === ']' ? l-- : w === '(' ? g++ : w === ')' && g--;
      }
      const I = d.length === 0 ? i : i.slice(m);
      let P = I,
        T = !1;
      I.endsWith(ve)
        ? ((P = I.slice(0, -1)), (T = !0))
        : I.startsWith(ve) && ((P = I.slice(1)), (T = !0));
      const S = f && f > m ? f - m : void 0;
      return _e(d, T, P, S);
    };
    if (t) {
      const i = t + Se,
        d = r;
      r = (l) => (l.startsWith(i) ? d(l.slice(i.length)) : _e(Cr, !1, l, void 0, !0));
    }
    if (o) {
      const i = r;
      r = (d) => o({ className: d, parseClassName: i });
    }
    return r;
  },
  Ir = (e) => {
    const t = new Map();
    return (
      e.orderSensitiveModifiers.forEach((o, r) => {
        t.set(o, 1e6 + r);
      }),
      (o) => {
        const r = [];
        let i = [];
        for (let d = 0; d < o.length; d++) {
          const l = o[d],
            g = l[0] === '[',
            m = t.has(l);
          g || m ? (i.length > 0 && (i.sort(), r.push(...i), (i = [])), r.push(l)) : i.push(l);
        }
        return (i.length > 0 && (i.sort(), r.push(...i)), r);
      }
    );
  },
  Nr = (e) => ({ cache: wr(e.cacheSize), parseClassName: jr(e), sortModifiers: Ir(e), ...ur(e) }),
  Pr = /\s+/,
  Rr = (e, t) => {
    const {
        parseClassName: o,
        getClassGroupId: r,
        getConflictingClassGroupIds: i,
        sortModifiers: d,
      } = t,
      l = [],
      g = e.trim().split(Pr);
    let m = '';
    for (let f = g.length - 1; f >= 0; f -= 1) {
      const y = g[f],
        {
          isExternal: I,
          modifiers: P,
          hasImportantModifier: T,
          baseClassName: S,
          maybePostfixModifierPosition: N,
        } = o(y);
      if (I) {
        m = y + (m.length > 0 ? ' ' + m : m);
        continue;
      }
      let w = !!N,
        _ = r(w ? S.substring(0, N) : S);
      if (!_) {
        if (!w) {
          m = y + (m.length > 0 ? ' ' + m : m);
          continue;
        }
        if (((_ = r(S)), !_)) {
          m = y + (m.length > 0 ? ' ' + m : m);
          continue;
        }
        w = !1;
      }
      const Y = P.length === 0 ? '' : P.length === 1 ? P[0] : d(P).join(':'),
        $ = T ? Y + ve : Y,
        F = $ + _;
      if (l.indexOf(F) > -1) continue;
      l.push(F);
      const L = i(_, w);
      for (let K = 0; K < L.length; ++K) {
        const U = L[K];
        l.push($ + U);
      }
      m = y + (m.length > 0 ? ' ' + m : m);
    }
    return m;
  },
  zr = (...e) => {
    let t = 0,
      o,
      r,
      i = '';
    for (; t < e.length; ) (o = e[t++]) && (r = Be(o)) && (i && (i += ' '), (i += r));
    return i;
  },
  Be = (e) => {
    if (typeof e == 'string') return e;
    let t,
      o = '';
    for (let r = 0; r < e.length; r++) e[r] && (t = Be(e[r])) && (o && (o += ' '), (o += t));
    return o;
  },
  Ar = (e, ...t) => {
    let o, r, i, d;
    const l = (m) => {
        const f = t.reduce((y, I) => I(y), e());
        return ((o = Nr(f)), (r = o.cache.get), (i = o.cache.set), (d = g), g(m));
      },
      g = (m) => {
        const f = r(m);
        if (f) return f;
        const y = Rr(m, o);
        return (i(m, y), y);
      };
    return ((d = l), (...m) => d(zr(...m)));
  },
  Mr = [],
  b = (e) => {
    const t = (o) => o[e] || Mr;
    return ((t.isThemeGetter = !0), t);
  },
  We = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  De = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  Tr = /^\d+\/\d+$/,
  Sr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  _r =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  Kr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  Vr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  Or =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  B = (e) => Tr.test(e),
  u = (e) => !!e && !Number.isNaN(Number(e)),
  M = (e) => !!e && Number.isInteger(Number(e)),
  he = (e) => e.endsWith('%') && u(e.slice(0, -1)),
  A = (e) => Sr.test(e),
  Gr = () => !0,
  Er = (e) => _r.test(e) && !Kr.test(e),
  $e = () => !1,
  Fr = (e) => Vr.test(e),
  Lr = (e) => Or.test(e),
  qr = (e) => !s(e) && !a(e),
  Br = (e) => W(e, Ye, $e),
  s = (e) => We.test(e),
  O = (e) => W(e, Xe, Er),
  xe = (e) => W(e, Hr, u),
  Ke = (e) => W(e, Ue, $e),
  Wr = (e) => W(e, He, Lr),
  re = (e) => W(e, Je, Fr),
  a = (e) => De.test(e),
  H = (e) => D(e, Xe),
  Dr = (e) => D(e, Yr),
  Ve = (e) => D(e, Ue),
  $r = (e) => D(e, Ye),
  Ur = (e) => D(e, He),
  te = (e) => D(e, Je, !0),
  W = (e, t, o) => {
    const r = We.exec(e);
    return r ? (r[1] ? t(r[1]) : o(r[2])) : !1;
  },
  D = (e, t, o = !1) => {
    const r = De.exec(e);
    return r ? (r[1] ? t(r[1]) : o) : !1;
  },
  Ue = (e) => e === 'position' || e === 'percentage',
  He = (e) => e === 'image' || e === 'url',
  Ye = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  Xe = (e) => e === 'length',
  Hr = (e) => e === 'number',
  Yr = (e) => e === 'family-name',
  Je = (e) => e === 'shadow',
  Xr = () => {
    const e = b('color'),
      t = b('font'),
      o = b('text'),
      r = b('font-weight'),
      i = b('tracking'),
      d = b('leading'),
      l = b('breakpoint'),
      g = b('container'),
      m = b('spacing'),
      f = b('radius'),
      y = b('shadow'),
      I = b('inset-shadow'),
      P = b('text-shadow'),
      T = b('drop-shadow'),
      S = b('blur'),
      N = b('perspective'),
      w = b('aspect'),
      _ = b('ease'),
      Y = b('animate'),
      $ = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      F = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'left-top',
        'top-right',
        'right-top',
        'bottom-right',
        'right-bottom',
        'bottom-left',
        'left-bottom',
      ],
      L = () => [...F(), a, s],
      K = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      U = () => ['auto', 'contain', 'none'],
      p = () => [a, s, m],
      R = () => [B, 'full', 'auto', ...p()],
      we = () => [M, 'none', 'subgrid', a, s],
      Ce = () => ['auto', { span: ['full', M, a, s] }, M, a, s],
      X = () => [M, 'auto', a, s],
      je = () => ['auto', 'min', 'max', 'fr', a, s],
      ge = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      q = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
      z = () => ['auto', ...p()],
      V = () => [
        B,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...p(),
      ],
      c = () => [e, a, s],
      Ie = () => [...F(), Ve, Ke, { position: [a, s] }],
      Ne = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      Pe = () => ['auto', 'cover', 'contain', $r, Br, { size: [a, s] }],
      fe = () => [he, H, O],
      k = () => ['', 'none', 'full', f, a, s],
      C = () => ['', u, H, O],
      J = () => ['solid', 'dashed', 'dotted', 'double'],
      Re = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      x = () => [u, he, Ve, Ke],
      ze = () => ['', 'none', S, a, s],
      Z = () => ['none', u, a, s],
      Q = () => ['none', u, a, s],
      be = () => [u, a, s],
      ee = () => [B, 'full', ...p()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [A],
        breakpoint: [A],
        color: [Gr],
        container: [A],
        'drop-shadow': [A],
        ease: ['in', 'out', 'in-out'],
        font: [qr],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [A],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
        radius: [A],
        shadow: [A],
        spacing: ['px', u],
        text: [A],
        'text-shadow': [A],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', B, s, a, w] }],
        container: ['container'],
        columns: [{ columns: [u, s, a, g] }],
        'break-after': [{ 'break-after': $() }],
        'break-before': [{ 'break-before': $() }],
        'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        sr: ['sr-only', 'not-sr-only'],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
        'object-position': [{ object: L() }],
        overflow: [{ overflow: K() }],
        'overflow-x': [{ 'overflow-x': K() }],
        'overflow-y': [{ 'overflow-y': K() }],
        overscroll: [{ overscroll: U() }],
        'overscroll-x': [{ 'overscroll-x': U() }],
        'overscroll-y': [{ 'overscroll-y': U() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: R() }],
        'inset-x': [{ 'inset-x': R() }],
        'inset-y': [{ 'inset-y': R() }],
        start: [{ start: R() }],
        end: [{ end: R() }],
        top: [{ top: R() }],
        right: [{ right: R() }],
        bottom: [{ bottom: R() }],
        left: [{ left: R() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [M, 'auto', a, s] }],
        basis: [{ basis: [B, 'full', 'auto', g, ...p()] }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [{ flex: [u, B, 'auto', 'initial', 'none', s] }],
        grow: [{ grow: ['', u, a, s] }],
        shrink: [{ shrink: ['', u, a, s] }],
        order: [{ order: [M, 'first', 'last', 'none', a, s] }],
        'grid-cols': [{ 'grid-cols': we() }],
        'col-start-end': [{ col: Ce() }],
        'col-start': [{ 'col-start': X() }],
        'col-end': [{ 'col-end': X() }],
        'grid-rows': [{ 'grid-rows': we() }],
        'row-start-end': [{ row: Ce() }],
        'row-start': [{ 'row-start': X() }],
        'row-end': [{ 'row-end': X() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': je() }],
        'auto-rows': [{ 'auto-rows': je() }],
        gap: [{ gap: p() }],
        'gap-x': [{ 'gap-x': p() }],
        'gap-y': [{ 'gap-y': p() }],
        'justify-content': [{ justify: [...ge(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...q(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...q()] }],
        'align-content': [{ content: ['normal', ...ge()] }],
        'align-items': [{ items: [...q(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...q(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': ge() }],
        'place-items': [{ 'place-items': [...q(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...q()] }],
        p: [{ p: p() }],
        px: [{ px: p() }],
        py: [{ py: p() }],
        ps: [{ ps: p() }],
        pe: [{ pe: p() }],
        pt: [{ pt: p() }],
        pr: [{ pr: p() }],
        pb: [{ pb: p() }],
        pl: [{ pl: p() }],
        m: [{ m: z() }],
        mx: [{ mx: z() }],
        my: [{ my: z() }],
        ms: [{ ms: z() }],
        me: [{ me: z() }],
        mt: [{ mt: z() }],
        mr: [{ mr: z() }],
        mb: [{ mb: z() }],
        ml: [{ ml: z() }],
        'space-x': [{ 'space-x': p() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': p() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: V() }],
        w: [{ w: [g, 'screen', ...V()] }],
        'min-w': [{ 'min-w': [g, 'screen', 'none', ...V()] }],
        'max-w': [{ 'max-w': [g, 'screen', 'none', 'prose', { screen: [l] }, ...V()] }],
        h: [{ h: ['screen', 'lh', ...V()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...V()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...V()] }],
        'font-size': [{ text: ['base', o, H, O] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [r, a, xe] }],
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              he,
              s,
            ],
          },
        ],
        'font-family': [{ font: [Dr, s, t] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [i, a, s] }],
        'line-clamp': [{ 'line-clamp': [u, 'none', a, xe] }],
        leading: [{ leading: [d, ...p()] }],
        'list-image': [{ 'list-image': ['none', a, s] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [{ list: ['disc', 'decimal', 'none', a, s] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'placeholder-color': [{ placeholder: c() }],
        'text-color': [{ text: c() }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...J(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: [u, 'from-font', 'auto', a, O] }],
        'text-decoration-color': [{ decoration: c() }],
        'underline-offset': [{ 'underline-offset': [u, 'auto', a, s] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: p() }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              a,
              s,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', a, s] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: Ie() }],
        'bg-repeat': [{ bg: Ne() }],
        'bg-size': [{ bg: Pe() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [{ to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, M, a, s],
                radial: ['', a, s],
                conic: [M, a, s],
              },
              Ur,
              Wr,
            ],
          },
        ],
        'bg-color': [{ bg: c() }],
        'gradient-from-pos': [{ from: fe() }],
        'gradient-via-pos': [{ via: fe() }],
        'gradient-to-pos': [{ to: fe() }],
        'gradient-from': [{ from: c() }],
        'gradient-via': [{ via: c() }],
        'gradient-to': [{ to: c() }],
        rounded: [{ rounded: k() }],
        'rounded-s': [{ 'rounded-s': k() }],
        'rounded-e': [{ 'rounded-e': k() }],
        'rounded-t': [{ 'rounded-t': k() }],
        'rounded-r': [{ 'rounded-r': k() }],
        'rounded-b': [{ 'rounded-b': k() }],
        'rounded-l': [{ 'rounded-l': k() }],
        'rounded-ss': [{ 'rounded-ss': k() }],
        'rounded-se': [{ 'rounded-se': k() }],
        'rounded-ee': [{ 'rounded-ee': k() }],
        'rounded-es': [{ 'rounded-es': k() }],
        'rounded-tl': [{ 'rounded-tl': k() }],
        'rounded-tr': [{ 'rounded-tr': k() }],
        'rounded-br': [{ 'rounded-br': k() }],
        'rounded-bl': [{ 'rounded-bl': k() }],
        'border-w': [{ border: C() }],
        'border-w-x': [{ 'border-x': C() }],
        'border-w-y': [{ 'border-y': C() }],
        'border-w-s': [{ 'border-s': C() }],
        'border-w-e': [{ 'border-e': C() }],
        'border-w-t': [{ 'border-t': C() }],
        'border-w-r': [{ 'border-r': C() }],
        'border-w-b': [{ 'border-b': C() }],
        'border-w-l': [{ 'border-l': C() }],
        'divide-x': [{ 'divide-x': C() }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': C() }],
        'divide-y-reverse': ['divide-y-reverse'],
        'border-style': [{ border: [...J(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...J(), 'hidden', 'none'] }],
        'border-color': [{ border: c() }],
        'border-color-x': [{ 'border-x': c() }],
        'border-color-y': [{ 'border-y': c() }],
        'border-color-s': [{ 'border-s': c() }],
        'border-color-e': [{ 'border-e': c() }],
        'border-color-t': [{ 'border-t': c() }],
        'border-color-r': [{ 'border-r': c() }],
        'border-color-b': [{ 'border-b': c() }],
        'border-color-l': [{ 'border-l': c() }],
        'divide-color': [{ divide: c() }],
        'outline-style': [{ outline: [...J(), 'none', 'hidden'] }],
        'outline-offset': [{ 'outline-offset': [u, a, s] }],
        'outline-w': [{ outline: ['', u, H, O] }],
        'outline-color': [{ outline: c() }],
        shadow: [{ shadow: ['', 'none', y, te, re] }],
        'shadow-color': [{ shadow: c() }],
        'inset-shadow': [{ 'inset-shadow': ['none', I, te, re] }],
        'inset-shadow-color': [{ 'inset-shadow': c() }],
        'ring-w': [{ ring: C() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: c() }],
        'ring-offset-w': [{ 'ring-offset': [u, O] }],
        'ring-offset-color': [{ 'ring-offset': c() }],
        'inset-ring-w': [{ 'inset-ring': C() }],
        'inset-ring-color': [{ 'inset-ring': c() }],
        'text-shadow': [{ 'text-shadow': ['none', P, te, re] }],
        'text-shadow-color': [{ 'text-shadow': c() }],
        opacity: [{ opacity: [u, a, s] }],
        'mix-blend': [{ 'mix-blend': [...Re(), 'plus-darker', 'plus-lighter'] }],
        'bg-blend': [{ 'bg-blend': Re() }],
        'mask-clip': [
          { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
          'mask-no-clip',
        ],
        'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
        'mask-image-linear-pos': [{ 'mask-linear': [u] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': x() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': x() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': c() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': c() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': x() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': x() }],
        'mask-image-t-from-color': [{ 'mask-t-from': c() }],
        'mask-image-t-to-color': [{ 'mask-t-to': c() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': x() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': x() }],
        'mask-image-r-from-color': [{ 'mask-r-from': c() }],
        'mask-image-r-to-color': [{ 'mask-r-to': c() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': x() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': x() }],
        'mask-image-b-from-color': [{ 'mask-b-from': c() }],
        'mask-image-b-to-color': [{ 'mask-b-to': c() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': x() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': x() }],
        'mask-image-l-from-color': [{ 'mask-l-from': c() }],
        'mask-image-l-to-color': [{ 'mask-l-to': c() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': x() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': x() }],
        'mask-image-x-from-color': [{ 'mask-x-from': c() }],
        'mask-image-x-to-color': [{ 'mask-x-to': c() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': x() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': x() }],
        'mask-image-y-from-color': [{ 'mask-y-from': c() }],
        'mask-image-y-to-color': [{ 'mask-y-to': c() }],
        'mask-image-radial': [{ 'mask-radial': [a, s] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': x() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': x() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': c() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': c() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': F() }],
        'mask-image-conic-pos': [{ 'mask-conic': [u] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': x() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': x() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': c() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': c() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          { 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
        ],
        'mask-position': [{ mask: Ie() }],
        'mask-repeat': [{ mask: Ne() }],
        'mask-size': [{ mask: Pe() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [{ mask: ['none', a, s] }],
        filter: [{ filter: ['', 'none', a, s] }],
        blur: [{ blur: ze() }],
        brightness: [{ brightness: [u, a, s] }],
        contrast: [{ contrast: [u, a, s] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', T, te, re] }],
        'drop-shadow-color': [{ 'drop-shadow': c() }],
        grayscale: [{ grayscale: ['', u, a, s] }],
        'hue-rotate': [{ 'hue-rotate': [u, a, s] }],
        invert: [{ invert: ['', u, a, s] }],
        saturate: [{ saturate: [u, a, s] }],
        sepia: [{ sepia: ['', u, a, s] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none', a, s] }],
        'backdrop-blur': [{ 'backdrop-blur': ze() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [u, a, s] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [u, a, s] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': ['', u, a, s] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [u, a, s] }],
        'backdrop-invert': [{ 'backdrop-invert': ['', u, a, s] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [u, a, s] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [u, a, s] }],
        'backdrop-sepia': [{ 'backdrop-sepia': ['', u, a, s] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': p() }],
        'border-spacing-x': [{ 'border-spacing-x': p() }],
        'border-spacing-y': [{ 'border-spacing-y': p() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', a, s] },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [{ duration: [u, 'initial', a, s] }],
        ease: [{ ease: ['linear', 'initial', _, a, s] }],
        delay: [{ delay: [u, a, s] }],
        animate: [{ animate: ['none', Y, a, s] }],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [{ perspective: [N, a, s] }],
        'perspective-origin': [{ 'perspective-origin': L() }],
        rotate: [{ rotate: Z() }],
        'rotate-x': [{ 'rotate-x': Z() }],
        'rotate-y': [{ 'rotate-y': Z() }],
        'rotate-z': [{ 'rotate-z': Z() }],
        scale: [{ scale: Q() }],
        'scale-x': [{ 'scale-x': Q() }],
        'scale-y': [{ 'scale-y': Q() }],
        'scale-z': [{ 'scale-z': Q() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: be() }],
        'skew-x': [{ 'skew-x': be() }],
        'skew-y': [{ 'skew-y': be() }],
        transform: [{ transform: [a, s, '', 'none', 'gpu', 'cpu'] }],
        'transform-origin': [{ origin: L() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: ee() }],
        'translate-x': [{ 'translate-x': ee() }],
        'translate-y': [{ 'translate-y': ee() }],
        'translate-z': [{ 'translate-z': ee() }],
        'translate-none': ['translate-none'],
        accent: [{ accent: c() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: c() }],
        'color-scheme': [
          { scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'] },
        ],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              a,
              s,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': p() }],
        'scroll-mx': [{ 'scroll-mx': p() }],
        'scroll-my': [{ 'scroll-my': p() }],
        'scroll-ms': [{ 'scroll-ms': p() }],
        'scroll-me': [{ 'scroll-me': p() }],
        'scroll-mt': [{ 'scroll-mt': p() }],
        'scroll-mr': [{ 'scroll-mr': p() }],
        'scroll-mb': [{ 'scroll-mb': p() }],
        'scroll-ml': [{ 'scroll-ml': p() }],
        'scroll-p': [{ 'scroll-p': p() }],
        'scroll-px': [{ 'scroll-px': p() }],
        'scroll-py': [{ 'scroll-py': p() }],
        'scroll-ps': [{ 'scroll-ps': p() }],
        'scroll-pe': [{ 'scroll-pe': p() }],
        'scroll-pt': [{ 'scroll-pt': p() }],
        'scroll-pr': [{ 'scroll-pr': p() }],
        'scroll-pb': [{ 'scroll-pb': p() }],
        'scroll-pl': [{ 'scroll-pl': p() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', a, s] }],
        fill: [{ fill: ['none', ...c()] }],
        'stroke-w': [{ stroke: [u, H, O, xe] }],
        stroke: [{ stroke: ['none', ...c()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    };
  },
  Jr = Ar(Xr);
function G(...e) {
  return Jr(Ze(e));
}
const Zr = '_progressBar_5vwry_3',
  Qr = '_progressBarFill_5vwry_27',
  et = '_complete_5vwry_75',
  rt = '_high_5vwry_83',
  tt = '_medium_5vwry_91',
  ot = '_low_5vwry_99',
  st = '_chartContainer_5vwry_109',
  E = {
    progressBar: Zr,
    progressBarFill: Qr,
    complete: et,
    high: rt,
    medium: tt,
    low: ot,
    chartContainer: st,
  },
  at = (e, t) => {
    if (t === 0) return { direction: e > 0 ? 'up' : 'stable', percentage: 100 };
    const o = e - t,
      r = Math.round((o / t) * 100);
    return r > 5
      ? { direction: 'up', percentage: r }
      : r < -5
        ? { direction: 'down', percentage: Math.abs(r) }
        : { direction: 'stable', percentage: Math.abs(r) };
  },
  ye = (e, t = 'number') => {
    switch (t) {
      case 'percentage':
        return `${e.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(e);
      case 'time':
        const o = Math.floor(e / 60),
          r = e % 60;
        return o > 0 ? `${o}h ${r}m` : `${r}m`;
      default:
        return new Intl.NumberFormat('fr-FR').format(e);
    }
  },
  v = ({ kpi: e, onToggleVisibility: t, compact: o = !1 }) => {
    const r = Ae.useMemo(
        () => (e.previousValue === void 0 ? null : at(e.value, e.previousValue)),
        [e.value, e.previousValue]
      ),
      i = Ae.useMemo(
        () => (e.target ? Math.min(100, (e.value / e.target) * 100) : null),
        [e.value, e.target]
      ),
      d = e.icon || Qe,
      l = e.color || 'text-primary-600',
      g = e.color?.replace('text-', 'bg-').replace('-600', '-100') || 'bg-primary-100';
    return o
      ? n.jsxs('div', {
          className: 'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg',
          children: [
            n.jsx('div', {
              className: G('p-2 rounded-lg', g, 'dark:bg-opacity-20'),
              children: n.jsx(d, { className: G('w-4 h-4', l) }),
            }),
            n.jsxs('div', {
              className: 'flex-1 min-w-0',
              children: [
                n.jsx('p', {
                  className: 'text-xs text-gray-500 dark:text-gray-400 truncate',
                  children: e.label,
                }),
                n.jsx('p', {
                  className: 'font-bold text-gray-900 dark:text-white',
                  children: ye(e.value, e.format),
                }),
              ],
            }),
            r &&
              n.jsxs('div', {
                className: G(
                  'flex items-center gap-1 text-xs font-medium',
                  r.direction === 'up'
                    ? 'text-green-600'
                    : r.direction === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500'
                ),
                children: [
                  r.direction === 'up' && n.jsx(rr, { className: 'w-3 h-3' }),
                  r.direction === 'down' && n.jsx(er, { className: 'w-3 h-3' }),
                  r.direction === 'stable' && n.jsx(Me, { className: 'w-3 h-3' }),
                  r.percentage,
                  '%',
                ],
              }),
          ],
        })
      : n.jsxs(Ge, {
          className: 'relative overflow-hidden',
          children: [
            t &&
              n.jsx('button', {
                onClick: () => t(e.id),
                className:
                  'absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                children:
                  e.visible !== !1
                    ? n.jsx(nr, { className: 'w-4 h-4' })
                    : n.jsx(ar, { className: 'w-4 h-4' }),
              }),
            n.jsx(Ee, {
              className: 'p-4',
              children: n.jsxs('div', {
                className: 'flex items-start gap-4',
                children: [
                  n.jsx('div', {
                    className: G('p-3 rounded-xl', g, 'dark:bg-opacity-20'),
                    children: n.jsx(d, { className: G('w-6 h-6', l) }),
                  }),
                  n.jsxs('div', {
                    className: E.chartContainer,
                    children: [
                      n.jsx('p', {
                        className: 'text-sm font-medium text-gray-500 dark:text-gray-400',
                        children: e.label,
                      }),
                      n.jsxs('div', {
                        className: 'flex items-end gap-2 mt-1',
                        children: [
                          n.jsx('span', {
                            className: 'text-2xl font-bold text-gray-900 dark:text-white',
                            children: ye(e.value, e.format),
                          }),
                          r &&
                            n.jsxs('span', {
                              className: G(
                                'flex items-center gap-0.5 text-sm font-medium pb-0.5',
                                r.direction === 'up'
                                  ? 'text-green-600'
                                  : r.direction === 'down'
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                              ),
                              children: [
                                r.direction === 'up' && n.jsx(lr, { className: 'w-4 h-4' }),
                                r.direction === 'down' && n.jsx(ir, { className: 'w-4 h-4' }),
                                r.direction === 'stable' && n.jsx(Me, { className: 'w-4 h-4' }),
                                r.percentage,
                                '%',
                              ],
                            }),
                        ],
                      }),
                      i !== null &&
                        n.jsxs('div', {
                          className: 'mt-3',
                          children: [
                            n.jsxs('div', {
                              className:
                                'flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1',
                              children: [
                                n.jsxs('span', {
                                  children: ['Objectif: ', ye(e.target, e.format)],
                                }),
                                n.jsxs('span', { children: [i.toFixed(0), '%'] }),
                              ],
                            }),
                            n.jsx('div', {
                              className:
                                'h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
                              children: n.jsx('div', {
                                className: E.progressBar,
                                children: n.jsx('div', {
                                  className: G(
                                    E.progressBarFill,
                                    `progressBarFillWidth${Math.round(Math.min(100, i) / 10) * 10}`,
                                    i >= 100
                                      ? E.complete
                                      : i >= 75
                                        ? E.high
                                        : i >= 50
                                          ? E.medium
                                          : E.low
                                  ),
                                }),
                              }),
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        });
  };
v.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'KPICard',
  props: {
    kpi: { required: !0, tsType: { name: 'KPIConfig' }, description: '' },
    onToggleVisibility: {
      required: !1,
      tsType: {
        name: 'signature',
        type: 'function',
        raw: '(id: string) => void',
        signature: {
          arguments: [{ type: { name: 'string' }, name: 'id' }],
          return: { name: 'void' },
        },
      },
      description: '',
    },
    compact: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
const ct = {
    title: 'Components/Dashboard/KPICard',
    component: v,
    parameters: {
      docs: {
        description: {
          component:
            'KPICard affiche un indicateur clé de performance avec sa valeur, tendance et objectif.',
        },
      },
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      kpi: { control: 'object', description: "Configuration de l'indicateur" },
      onToggleVisibility: {
        action: 'Toggle Visibility',
        description: 'Handler pour masquer/afficher le widget',
      },
      compact: { control: 'boolean', description: 'Mode compact pour les listes' },
    },
  },
  h = {
    visits: {
      id: 'total-visits',
      label: 'Visites ce mois',
      value: 12,
      previousValue: 8,
      target: 15,
      format: 'number',
      icon: tr,
      color: 'text-blue-600',
    },
    speakers: {
      id: 'active-speakers',
      label: 'Orateurs actifs',
      value: 24,
      format: 'number',
      icon: cr,
      color: 'text-purple-600',
    },
    confirmationRate: {
      id: 'confirmation-rate',
      label: 'Taux de confirmation',
      value: 87.5,
      previousValue: 82.1,
      format: 'percentage',
      icon: or,
      color: 'text-green-600',
    },
    pendingActions: {
      id: 'pending-actions',
      label: 'Actions en attente',
      value: 5,
      previousValue: 2,
      target: 0,
      format: 'number',
      icon: sr,
      color: 'text-red-600',
    },
  },
  oe = { args: { kpi: h.visits } },
  se = { args: { kpi: h.confirmationRate } },
  ae = { args: { kpi: h.visits } },
  ne = { args: { kpi: h.speakers, compact: !0 } },
  ie = { args: { kpi: { ...h.visits, value: 0 } } },
  le = {
    render: () =>
      n.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl',
        children: [
          n.jsx(v, { kpi: h.visits }),
          n.jsx(v, { kpi: h.confirmationRate }),
          n.jsx(v, { kpi: h.speakers }),
          n.jsx(v, { kpi: h.pendingActions }),
        ],
      }),
    parameters: {
      docs: { description: { story: "Vue d'ensemble de toutes les variantes de KPICard." } },
    },
  },
  ce = {
    render: () =>
      n.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl',
        children: [n.jsx(v, { kpi: h.visits }), n.jsx(v, { kpi: h.confirmationRate })],
      }),
    parameters: { docs: { description: { story: 'KPI avec calcul automatique des tendances.' } } },
  },
  de = {
    render: () =>
      n.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl',
        children: [
          n.jsx(v, { kpi: { ...h.visits, value: 18, target: 15 } }),
          n.jsx(v, { kpi: { ...h.pendingActions, value: 0, target: 0 } }),
        ],
      }),
    parameters: {
      docs: { description: { story: 'KPI avec objectifs atteints et barres de progression.' } },
    },
  },
  me = {
    render: (e) =>
      n.jsxs('div', {
        className: 'space-y-4',
        children: [
          n.jsx('p', {
            className: 'text-sm text-gray-600',
            children: "Cliquez sur l'icône 👁️ pour masquer/afficher le widget",
          }),
          n.jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl',
            children: [
              n.jsx(v, {
                ...e,
                kpi: h.visits,
                onToggleVisibility: (t) => console.log('Toggle visibility:', t),
              }),
              n.jsx(v, {
                ...e,
                kpi: h.confirmationRate,
                onToggleVisibility: (t) => console.log('Toggle visibility:', t),
              }),
            ],
          }),
        ],
      }),
    parameters: {
      docs: { description: { story: 'KPICard interactifs avec gestion de visibilité.' } },
    },
  },
  pe = {
    render: () =>
      n.jsxs('div', {
        className: 'space-y-8',
        children: [
          n.jsxs('div', {
            className: 'block lg:hidden',
            children: [
              n.jsx('h3', { className: 'text-lg font-semibold mb-4', children: 'Vue Mobile' }),
              n.jsxs('div', {
                className: 'space-y-3',
                children: [
                  n.jsx(v, { kpi: h.visits, compact: !0 }),
                  n.jsx(v, { kpi: h.confirmationRate, compact: !0 }),
                ],
              }),
            ],
          }),
          n.jsxs('div', {
            className: 'hidden lg:block',
            children: [
              n.jsx('h3', { className: 'text-lg font-semibold mb-4', children: 'Vue Desktop' }),
              n.jsxs('div', {
                className: 'grid grid-cols-2 gap-4',
                children: [n.jsx(v, { kpi: h.visits }), n.jsx(v, { kpi: h.confirmationRate })],
              }),
            ],
          }),
        ],
      }),
    parameters: {
      docs: { description: { story: "Adaptation du layout selon la taille d'écran." } },
    },
  };
oe.parameters = {
  ...oe.parameters,
  docs: {
    ...oe.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    kpi: sampleKPIs.visits
  }
}`,
      ...oe.parameters?.docs?.source,
    },
  },
};
se.parameters = {
  ...se.parameters,
  docs: {
    ...se.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    kpi: sampleKPIs.confirmationRate
  }
}`,
      ...se.parameters?.docs?.source,
    },
  },
};
ae.parameters = {
  ...ae.parameters,
  docs: {
    ...ae.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    kpi: sampleKPIs.visits
  }
}`,
      ...ae.parameters?.docs?.source,
    },
  },
};
ne.parameters = {
  ...ne.parameters,
  docs: {
    ...ne.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    kpi: sampleKPIs.speakers,
    compact: true
  }
}`,
      ...ne.parameters?.docs?.source,
    },
  },
};
ie.parameters = {
  ...ie.parameters,
  docs: {
    ...ie.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    kpi: {
      ...sampleKPIs.visits,
      value: 0
    }
  }
}`,
      ...ie.parameters?.docs?.source,
    },
  },
};
le.parameters = {
  ...le.parameters,
  docs: {
    ...le.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">\r
      <KPICard kpi={sampleKPIs.visits} />\r
      <KPICard kpi={sampleKPIs.confirmationRate} />\r
      <KPICard kpi={sampleKPIs.speakers} />\r
      <KPICard kpi={sampleKPIs.pendingActions} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Vue d\\'ensemble de toutes les variantes de KPICard.'
      }
    }
  }
}`,
      ...le.parameters?.docs?.source,
    },
  },
};
ce.parameters = {
  ...ce.parameters,
  docs: {
    ...ce.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">\r
      <KPICard kpi={sampleKPIs.visits} />\r
      <KPICard kpi={sampleKPIs.confirmationRate} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPI avec calcul automatique des tendances.'
      }
    }
  }
}`,
      ...ce.parameters?.docs?.source,
    },
  },
};
de.parameters = {
  ...de.parameters,
  docs: {
    ...de.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">\r
      <KPICard kpi={{
      ...sampleKPIs.visits,
      value: 18,
      target: 15
    }} />\r
      <KPICard kpi={{
      ...sampleKPIs.pendingActions,
      value: 0,
      target: 0
    }} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPI avec objectifs atteints et barres de progression.'
      }
    }
  }
}`,
      ...de.parameters?.docs?.source,
    },
  },
};
me.parameters = {
  ...me.parameters,
  docs: {
    ...me.parameters?.docs,
    source: {
      originalSource: `{
  render: args => <div className="space-y-4">\r
      <p className="text-sm text-gray-600">\r
        Cliquez sur l'icône 👁️ pour masquer/afficher le widget\r
      </p>\r
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">\r
        <KPICard {...args} kpi={sampleKPIs.visits} onToggleVisibility={id => console.log('Toggle visibility:', id)} />\r
        <KPICard {...args} kpi={sampleKPIs.confirmationRate} onToggleVisibility={id => console.log('Toggle visibility:', id)} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'KPICard interactifs avec gestion de visibilité.'
      }
    }
  }
}`,
      ...me.parameters?.docs?.source,
    },
  },
};
pe.parameters = {
  ...pe.parameters,
  docs: {
    ...pe.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="space-y-8">\r
      {/* Mobile */}\r
      <div className="block lg:hidden">\r
        <h3 className="text-lg font-semibold mb-4">Vue Mobile</h3>\r
        <div className="space-y-3">\r
          <KPICard kpi={sampleKPIs.visits} compact />\r
          <KPICard kpi={sampleKPIs.confirmationRate} compact />\r
        </div>\r
      </div>\r
      \r
      {/* Desktop */}\r
      <div className="hidden lg:block">\r
        <h3 className="text-lg font-semibold mb-4">Vue Desktop</h3>\r
        <div className="grid grid-cols-2 gap-4">\r
          <KPICard kpi={sampleKPIs.visits} />\r
          <KPICard kpi={sampleKPIs.confirmationRate} />\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Adaptation du layout selon la taille d\\'écran.'
      }
    }
  }
}`,
      ...pe.parameters?.docs?.source,
    },
  },
};
const dt = [
  'Default',
  'WithTrend',
  'WithTarget',
  'Compact',
  'LoadingState',
  'AllVariants',
  'TrendsOnly',
  'Objectives',
  'Interactive',
  'Responsive',
];
export {
  le as AllVariants,
  ne as Compact,
  oe as Default,
  me as Interactive,
  ie as LoadingState,
  de as Objectives,
  pe as Responsive,
  ce as TrendsOnly,
  ae as WithTarget,
  se as WithTrend,
  dt as __namedExportsOrder,
  ct as default,
};
