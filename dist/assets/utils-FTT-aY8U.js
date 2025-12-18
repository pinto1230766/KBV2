const et = (t, e) => e.some((n) => t instanceof n);
let L, q;
function nt() {
  return L || (L = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
function rt() {
  return (
    q ||
    (q = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const X = new WeakMap(),
  F = new WeakMap(),
  G = new WeakMap(),
  v = new WeakMap(),
  B = new WeakMap();
function at(t) {
  const e = new Promise((n, r) => {
    const a = () => {
        (t.removeEventListener('success', o), t.removeEventListener('error', i));
      },
      o = () => {
        (n(w(t.result)), a());
      },
      i = () => {
        (r(t.error), a());
      };
    (t.addEventListener('success', o), t.addEventListener('error', i));
  });
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && X.set(n, t);
      })
      .catch(() => {}),
    B.set(e, t),
    e
  );
}
function ot(t) {
  if (F.has(t)) return;
  const e = new Promise((n, r) => {
    const a = () => {
        (t.removeEventListener('complete', o),
          t.removeEventListener('error', i),
          t.removeEventListener('abort', i));
      },
      o = () => {
        (n(), a());
      },
      i = () => {
        (r(t.error || new DOMException('AbortError', 'AbortError')), a());
      };
    (t.addEventListener('complete', o),
      t.addEventListener('error', i),
      t.addEventListener('abort', i));
  });
  F.set(t, e);
}
let I = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === 'done') return F.get(t);
      if (e === 'objectStoreNames') return t.objectStoreNames || G.get(t);
      if (e === 'store')
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return w(t[e]);
  },
  set(t, e, n) {
    return ((t[e] = n), !0);
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === 'done' || e === 'store') ? !0 : e in t;
  },
};
function it(t) {
  I = t(I);
}
function st(t) {
  return t === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...n) {
        const r = t.call(Y(this), e, ...n);
        return (G.set(r, e.sort ? e.sort() : [e]), w(r));
      }
    : rt().includes(t)
      ? function (...e) {
          return (t.apply(Y(this), e), w(X.get(this)));
        }
      : function (...e) {
          return w(t.apply(Y(this), e));
        };
}
function ct(t) {
  return typeof t == 'function'
    ? st(t)
    : (t instanceof IDBTransaction && ot(t), et(t, nt()) ? new Proxy(t, I) : t);
}
function w(t) {
  if (t instanceof IDBRequest) return at(t);
  if (v.has(t)) return v.get(t);
  const e = ct(t);
  return (e !== t && (v.set(t, e), B.set(e, t)), e);
}
const Y = (t) => B.get(t);
function Ie(t, e, { blocked: n, upgrade: r, blocking: a, terminated: o } = {}) {
  const i = indexedDB.open(t, e),
    s = w(i);
  return (
    r &&
      i.addEventListener('upgradeneeded', (c) => {
        r(w(i.result), c.oldVersion, c.newVersion, w(i.transaction), c);
      }),
    n && i.addEventListener('blocked', (c) => n(c.oldVersion, c.newVersion, c)),
    s
      .then((c) => {
        (o && c.addEventListener('close', () => o()),
          a && c.addEventListener('versionchange', (u) => a(u.oldVersion, u.newVersion, u)));
      })
      .catch(() => {}),
    s
  );
}
const ut = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  dt = ['put', 'add', 'delete', 'clear'],
  N = new Map();
function H(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == 'string')) return;
  if (N.get(e)) return N.get(e);
  const n = e.replace(/FromIndex$/, ''),
    r = e !== n,
    a = dt.includes(n);
  if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(a || ut.includes(n))) return;
  const o = async function (i, ...s) {
    const c = this.transaction(i, a ? 'readwrite' : 'readonly');
    let u = c.store;
    return (r && (u = u.index(s.shift())), (await Promise.all([u[n](...s), a && c.done]))[0]);
  };
  return (N.set(e, o), o);
}
it((t) => ({
  ...t,
  get: (e, n, r) => H(e, n) || t.get(e, n, r),
  has: (e, n) => !!H(e, n) || t.has(e, n),
}));
const U = 6048e5,
  ft = 864e5,
  $ = 6e4,
  z = 36e5,
  _ = Symbol.for('constructDateFrom');
function m(t, e) {
  return typeof t == 'function'
    ? t(e)
    : t && typeof t == 'object' && _ in t
      ? t[_](e)
      : t instanceof Date
        ? new t.constructor(e)
        : new Date(e);
}
function f(t, e) {
  return m(e || t, t);
}
function lt(t, e, n) {
  const r = f(t, n?.in);
  if (isNaN(e)) return m(t, NaN);
  if (!e) return r;
  const a = r.getDate(),
    o = m(t, r.getTime());
  o.setMonth(r.getMonth() + e + 1, 0);
  const i = o.getDate();
  return a >= i ? o : (r.setFullYear(o.getFullYear(), o.getMonth(), a), r);
}
let ht = {};
function P() {
  return ht;
}
function O(t, e) {
  const n = P(),
    r =
      e?.weekStartsOn ??
      e?.locale?.options?.weekStartsOn ??
      n.weekStartsOn ??
      n.locale?.options?.weekStartsOn ??
      0,
    a = f(t, e?.in),
    o = a.getDay(),
    i = (o < r ? 7 : 0) + o - r;
  return (a.setDate(a.getDate() - i), a.setHours(0, 0, 0, 0), a);
}
function x(t, e) {
  return O(t, { ...e, weekStartsOn: 1 });
}
function J(t, e) {
  const n = f(t, e?.in),
    r = n.getFullYear(),
    a = m(n, 0);
  (a.setFullYear(r + 1, 0, 4), a.setHours(0, 0, 0, 0));
  const o = x(a),
    i = m(n, 0);
  (i.setFullYear(r, 0, 4), i.setHours(0, 0, 0, 0));
  const s = x(i);
  return n.getTime() >= o.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
function j(t) {
  const e = f(t),
    n = new Date(
      Date.UTC(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        e.getHours(),
        e.getMinutes(),
        e.getSeconds(),
        e.getMilliseconds()
      )
    );
  return (n.setUTCFullYear(e.getFullYear()), +t - +n);
}
function W(t, ...e) {
  const n = m.bind(
    null,
    e.find((r) => typeof r == 'object')
  );
  return e.map(n);
}
function T(t, e) {
  const n = f(t, e?.in);
  return (n.setHours(0, 0, 0, 0), n);
}
function mt(t, e, n) {
  const [r, a] = W(n?.in, t, e),
    o = T(r),
    i = T(a),
    s = +o - j(o),
    c = +i - j(i);
  return Math.round((s - c) / ft);
}
function gt(t, e) {
  const n = J(t, e),
    r = m(t, 0);
  return (r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), x(r));
}
function wt(t) {
  return m(t, Date.now());
}
function yt(t, e, n) {
  const [r, a] = W(n?.in, t, e);
  return +T(r) == +T(a);
}
function bt(t) {
  return (
    t instanceof Date ||
    (typeof t == 'object' && Object.prototype.toString.call(t) === '[object Date]')
  );
}
function Dt(t) {
  return !((!bt(t) && typeof t != 'number') || isNaN(+f(t)));
}
function Be(t, e) {
  const n = f(t, e?.in),
    r = n.getMonth();
  return (n.setFullYear(n.getFullYear(), r + 1, 0), n.setHours(23, 59, 59, 999), n);
}
function pt(t, e) {
  const [n, r] = W(t, e.start, e.end);
  return { start: n, end: r };
}
function Le(t, e) {
  const { start: n, end: r } = pt(e?.in, t);
  let a = +n > +r;
  const o = a ? +n : +r,
    i = a ? r : n;
  i.setHours(0, 0, 0, 0);
  let s = 1;
  const c = [];
  for (; +i <= o; ) (c.push(m(n, i)), i.setDate(i.getDate() + s), i.setHours(0, 0, 0, 0));
  return a ? c.reverse() : c;
}
function qe(t, e) {
  const n = f(t, e?.in);
  return (n.setDate(1), n.setHours(0, 0, 0, 0), n);
}
function Mt(t, e) {
  const n = f(t, e?.in);
  return (n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n);
}
function He(t, e) {
  const n = P(),
    r =
      e?.weekStartsOn ??
      e?.locale?.options?.weekStartsOn ??
      n.weekStartsOn ??
      n.locale?.options?.weekStartsOn ??
      0,
    a = f(t, e?.in),
    o = a.getDay(),
    i = (o < r ? -7 : 0) + 6 - (o - r);
  return (a.setDate(a.getDate() + i), a.setHours(23, 59, 59, 999), a);
}
const Ot = {
    lessThanXSeconds: { one: 'less than a second', other: 'less than {{count}} seconds' },
    xSeconds: { one: '1 second', other: '{{count}} seconds' },
    halfAMinute: 'half a minute',
    lessThanXMinutes: { one: 'less than a minute', other: 'less than {{count}} minutes' },
    xMinutes: { one: '1 minute', other: '{{count}} minutes' },
    aboutXHours: { one: 'about 1 hour', other: 'about {{count}} hours' },
    xHours: { one: '1 hour', other: '{{count}} hours' },
    xDays: { one: '1 day', other: '{{count}} days' },
    aboutXWeeks: { one: 'about 1 week', other: 'about {{count}} weeks' },
    xWeeks: { one: '1 week', other: '{{count}} weeks' },
    aboutXMonths: { one: 'about 1 month', other: 'about {{count}} months' },
    xMonths: { one: '1 month', other: '{{count}} months' },
    aboutXYears: { one: 'about 1 year', other: 'about {{count}} years' },
    xYears: { one: '1 year', other: '{{count}} years' },
    overXYears: { one: 'over 1 year', other: 'over {{count}} years' },
    almostXYears: { one: 'almost 1 year', other: 'almost {{count}} years' },
  },
  Pt = (t, e, n) => {
    let r;
    const a = Ot[t];
    return (
      typeof a == 'string'
        ? (r = a)
        : e === 1
          ? (r = a.one)
          : (r = a.other.replace('{{count}}', e.toString())),
      n?.addSuffix ? (n.comparison && n.comparison > 0 ? 'in ' + r : r + ' ago') : r
    );
  };
function E(t) {
  return (e = {}) => {
    const n = e.width ? String(e.width) : t.defaultWidth;
    return t.formats[n] || t.formats[t.defaultWidth];
  };
}
const kt = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy',
  },
  xt = { full: 'h:mm:ss a zzzz', long: 'h:mm:ss a z', medium: 'h:mm:ss a', short: 'h:mm a' },
  Tt = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}',
  },
  Wt = {
    date: E({ formats: kt, defaultWidth: 'full' }),
    time: E({ formats: xt, defaultWidth: 'full' }),
    dateTime: E({ formats: Tt, defaultWidth: 'full' }),
  },
  St = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P',
  },
  vt = (t, e, n, r) => St[t];
function D(t) {
  return (e, n) => {
    const r = n?.context ? String(n.context) : 'standalone';
    let a;
    if (r === 'formatting' && t.formattingValues) {
      const i = t.defaultFormattingWidth || t.defaultWidth,
        s = n?.width ? String(n.width) : i;
      a = t.formattingValues[s] || t.formattingValues[i];
    } else {
      const i = t.defaultWidth,
        s = n?.width ? String(n.width) : t.defaultWidth;
      a = t.values[s] || t.values[i];
    }
    const o = t.argumentCallback ? t.argumentCallback(e) : e;
    return a[o];
  };
}
const Yt = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini'],
  },
  Nt = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  },
  Et = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    wide: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  Ct = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  Ft = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
  },
  It = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
  },
  Bt = (t, e) => {
    const n = Number(t),
      r = n % 100;
    if (r > 20 || r < 10)
      switch (r % 10) {
        case 1:
          return n + 'st';
        case 2:
          return n + 'nd';
        case 3:
          return n + 'rd';
      }
    return n + 'th';
  },
  Lt = {
    ordinalNumber: Bt,
    era: D({ values: Yt, defaultWidth: 'wide' }),
    quarter: D({ values: Nt, defaultWidth: 'wide', argumentCallback: (t) => t - 1 }),
    month: D({ values: Et, defaultWidth: 'wide' }),
    day: D({ values: Ct, defaultWidth: 'wide' }),
    dayPeriod: D({
      values: Ft,
      defaultWidth: 'wide',
      formattingValues: It,
      defaultFormattingWidth: 'wide',
    }),
  };
function p(t) {
  return (e, n = {}) => {
    const r = n.width,
      a = (r && t.matchPatterns[r]) || t.matchPatterns[t.defaultMatchWidth],
      o = e.match(a);
    if (!o) return null;
    const i = o[0],
      s = (r && t.parsePatterns[r]) || t.parsePatterns[t.defaultParseWidth],
      c = Array.isArray(s) ? Ht(s, (h) => h.test(i)) : qt(s, (h) => h.test(i));
    let u;
    ((u = t.valueCallback ? t.valueCallback(c) : c),
      (u = n.valueCallback ? n.valueCallback(u) : u));
    const l = e.slice(i.length);
    return { value: u, rest: l };
  };
}
function qt(t, e) {
  for (const n in t) if (Object.prototype.hasOwnProperty.call(t, n) && e(t[n])) return n;
}
function Ht(t, e) {
  for (let n = 0; n < t.length; n++) if (e(t[n])) return n;
}
function _t(t) {
  return (e, n = {}) => {
    const r = e.match(t.matchPattern);
    if (!r) return null;
    const a = r[0],
      o = e.match(t.parsePattern);
    if (!o) return null;
    let i = t.valueCallback ? t.valueCallback(o[0]) : o[0];
    i = n.valueCallback ? n.valueCallback(i) : i;
    const s = e.slice(a.length);
    return { value: i, rest: s };
  };
}
const jt = /^(\d+)(th|st|nd|rd)?/i,
  Rt = /\d+/i,
  At = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  Qt = { any: [/^b/i, /^(a|c)/i] },
  Vt = { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i },
  Xt = { any: [/1/i, /2/i, /3/i, /4/i] },
  Gt = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  Ut = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  },
  $t = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  zt = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  Jt = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  Zt = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  Kt = {
    ordinalNumber: _t({
      matchPattern: jt,
      parsePattern: Rt,
      valueCallback: (t) => parseInt(t, 10),
    }),
    era: p({
      matchPatterns: At,
      defaultMatchWidth: 'wide',
      parsePatterns: Qt,
      defaultParseWidth: 'any',
    }),
    quarter: p({
      matchPatterns: Vt,
      defaultMatchWidth: 'wide',
      parsePatterns: Xt,
      defaultParseWidth: 'any',
      valueCallback: (t) => t + 1,
    }),
    month: p({
      matchPatterns: Gt,
      defaultMatchWidth: 'wide',
      parsePatterns: Ut,
      defaultParseWidth: 'any',
    }),
    day: p({
      matchPatterns: $t,
      defaultMatchWidth: 'wide',
      parsePatterns: zt,
      defaultParseWidth: 'any',
    }),
    dayPeriod: p({
      matchPatterns: Jt,
      defaultMatchWidth: 'any',
      parsePatterns: Zt,
      defaultParseWidth: 'any',
    }),
  },
  te = {
    code: 'en-US',
    formatDistance: Pt,
    formatLong: Wt,
    formatRelative: vt,
    localize: Lt,
    match: Kt,
    options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
  };
function ee(t, e) {
  const n = f(t, e?.in);
  return mt(n, Mt(n)) + 1;
}
function ne(t, e) {
  const n = f(t, e?.in),
    r = +x(n) - +gt(n);
  return Math.round(r / U) + 1;
}
function Z(t, e) {
  const n = f(t, e?.in),
    r = n.getFullYear(),
    a = P(),
    o =
      e?.firstWeekContainsDate ??
      e?.locale?.options?.firstWeekContainsDate ??
      a.firstWeekContainsDate ??
      a.locale?.options?.firstWeekContainsDate ??
      1,
    i = m(e?.in || t, 0);
  (i.setFullYear(r + 1, 0, o), i.setHours(0, 0, 0, 0));
  const s = O(i, e),
    c = m(e?.in || t, 0);
  (c.setFullYear(r, 0, o), c.setHours(0, 0, 0, 0));
  const u = O(c, e);
  return +n >= +s ? r + 1 : +n >= +u ? r : r - 1;
}
function re(t, e) {
  const n = P(),
    r =
      e?.firstWeekContainsDate ??
      e?.locale?.options?.firstWeekContainsDate ??
      n.firstWeekContainsDate ??
      n.locale?.options?.firstWeekContainsDate ??
      1,
    a = Z(t, e),
    o = m(e?.in || t, 0);
  return (o.setFullYear(a, 0, r), o.setHours(0, 0, 0, 0), O(o, e));
}
function ae(t, e) {
  const n = f(t, e?.in),
    r = +O(n, e) - +re(n, e);
  return Math.round(r / U) + 1;
}
function d(t, e) {
  const n = t < 0 ? '-' : '',
    r = Math.abs(t).toString().padStart(e, '0');
  return n + r;
}
const g = {
    y(t, e) {
      const n = t.getFullYear(),
        r = n > 0 ? n : 1 - n;
      return d(e === 'yy' ? r % 100 : r, e.length);
    },
    M(t, e) {
      const n = t.getMonth();
      return e === 'M' ? String(n + 1) : d(n + 1, 2);
    },
    d(t, e) {
      return d(t.getDate(), e.length);
    },
    a(t, e) {
      const n = t.getHours() / 12 >= 1 ? 'pm' : 'am';
      switch (e) {
        case 'a':
        case 'aa':
          return n.toUpperCase();
        case 'aaa':
          return n;
        case 'aaaaa':
          return n[0];
        case 'aaaa':
        default:
          return n === 'am' ? 'a.m.' : 'p.m.';
      }
    },
    h(t, e) {
      return d(t.getHours() % 12 || 12, e.length);
    },
    H(t, e) {
      return d(t.getHours(), e.length);
    },
    m(t, e) {
      return d(t.getMinutes(), e.length);
    },
    s(t, e) {
      return d(t.getSeconds(), e.length);
    },
    S(t, e) {
      const n = e.length,
        r = t.getMilliseconds(),
        a = Math.trunc(r * Math.pow(10, n - 3));
      return d(a, e.length);
    },
  },
  b = {
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night',
  },
  R = {
    G: function (t, e, n) {
      const r = t.getFullYear() > 0 ? 1 : 0;
      switch (e) {
        case 'G':
        case 'GG':
        case 'GGG':
          return n.era(r, { width: 'abbreviated' });
        case 'GGGGG':
          return n.era(r, { width: 'narrow' });
        case 'GGGG':
        default:
          return n.era(r, { width: 'wide' });
      }
    },
    y: function (t, e, n) {
      if (e === 'yo') {
        const r = t.getFullYear(),
          a = r > 0 ? r : 1 - r;
        return n.ordinalNumber(a, { unit: 'year' });
      }
      return g.y(t, e);
    },
    Y: function (t, e, n, r) {
      const a = Z(t, r),
        o = a > 0 ? a : 1 - a;
      if (e === 'YY') {
        const i = o % 100;
        return d(i, 2);
      }
      return e === 'Yo' ? n.ordinalNumber(o, { unit: 'year' }) : d(o, e.length);
    },
    R: function (t, e) {
      const n = J(t);
      return d(n, e.length);
    },
    u: function (t, e) {
      const n = t.getFullYear();
      return d(n, e.length);
    },
    Q: function (t, e, n) {
      const r = Math.ceil((t.getMonth() + 1) / 3);
      switch (e) {
        case 'Q':
          return String(r);
        case 'QQ':
          return d(r, 2);
        case 'Qo':
          return n.ordinalNumber(r, { unit: 'quarter' });
        case 'QQQ':
          return n.quarter(r, { width: 'abbreviated', context: 'formatting' });
        case 'QQQQQ':
          return n.quarter(r, { width: 'narrow', context: 'formatting' });
        case 'QQQQ':
        default:
          return n.quarter(r, { width: 'wide', context: 'formatting' });
      }
    },
    q: function (t, e, n) {
      const r = Math.ceil((t.getMonth() + 1) / 3);
      switch (e) {
        case 'q':
          return String(r);
        case 'qq':
          return d(r, 2);
        case 'qo':
          return n.ordinalNumber(r, { unit: 'quarter' });
        case 'qqq':
          return n.quarter(r, { width: 'abbreviated', context: 'standalone' });
        case 'qqqqq':
          return n.quarter(r, { width: 'narrow', context: 'standalone' });
        case 'qqqq':
        default:
          return n.quarter(r, { width: 'wide', context: 'standalone' });
      }
    },
    M: function (t, e, n) {
      const r = t.getMonth();
      switch (e) {
        case 'M':
        case 'MM':
          return g.M(t, e);
        case 'Mo':
          return n.ordinalNumber(r + 1, { unit: 'month' });
        case 'MMM':
          return n.month(r, { width: 'abbreviated', context: 'formatting' });
        case 'MMMMM':
          return n.month(r, { width: 'narrow', context: 'formatting' });
        case 'MMMM':
        default:
          return n.month(r, { width: 'wide', context: 'formatting' });
      }
    },
    L: function (t, e, n) {
      const r = t.getMonth();
      switch (e) {
        case 'L':
          return String(r + 1);
        case 'LL':
          return d(r + 1, 2);
        case 'Lo':
          return n.ordinalNumber(r + 1, { unit: 'month' });
        case 'LLL':
          return n.month(r, { width: 'abbreviated', context: 'standalone' });
        case 'LLLLL':
          return n.month(r, { width: 'narrow', context: 'standalone' });
        case 'LLLL':
        default:
          return n.month(r, { width: 'wide', context: 'standalone' });
      }
    },
    w: function (t, e, n, r) {
      const a = ae(t, r);
      return e === 'wo' ? n.ordinalNumber(a, { unit: 'week' }) : d(a, e.length);
    },
    I: function (t, e, n) {
      const r = ne(t);
      return e === 'Io' ? n.ordinalNumber(r, { unit: 'week' }) : d(r, e.length);
    },
    d: function (t, e, n) {
      return e === 'do' ? n.ordinalNumber(t.getDate(), { unit: 'date' }) : g.d(t, e);
    },
    D: function (t, e, n) {
      const r = ee(t);
      return e === 'Do' ? n.ordinalNumber(r, { unit: 'dayOfYear' }) : d(r, e.length);
    },
    E: function (t, e, n) {
      const r = t.getDay();
      switch (e) {
        case 'E':
        case 'EE':
        case 'EEE':
          return n.day(r, { width: 'abbreviated', context: 'formatting' });
        case 'EEEEE':
          return n.day(r, { width: 'narrow', context: 'formatting' });
        case 'EEEEEE':
          return n.day(r, { width: 'short', context: 'formatting' });
        case 'EEEE':
        default:
          return n.day(r, { width: 'wide', context: 'formatting' });
      }
    },
    e: function (t, e, n, r) {
      const a = t.getDay(),
        o = (a - r.weekStartsOn + 8) % 7 || 7;
      switch (e) {
        case 'e':
          return String(o);
        case 'ee':
          return d(o, 2);
        case 'eo':
          return n.ordinalNumber(o, { unit: 'day' });
        case 'eee':
          return n.day(a, { width: 'abbreviated', context: 'formatting' });
        case 'eeeee':
          return n.day(a, { width: 'narrow', context: 'formatting' });
        case 'eeeeee':
          return n.day(a, { width: 'short', context: 'formatting' });
        case 'eeee':
        default:
          return n.day(a, { width: 'wide', context: 'formatting' });
      }
    },
    c: function (t, e, n, r) {
      const a = t.getDay(),
        o = (a - r.weekStartsOn + 8) % 7 || 7;
      switch (e) {
        case 'c':
          return String(o);
        case 'cc':
          return d(o, e.length);
        case 'co':
          return n.ordinalNumber(o, { unit: 'day' });
        case 'ccc':
          return n.day(a, { width: 'abbreviated', context: 'standalone' });
        case 'ccccc':
          return n.day(a, { width: 'narrow', context: 'standalone' });
        case 'cccccc':
          return n.day(a, { width: 'short', context: 'standalone' });
        case 'cccc':
        default:
          return n.day(a, { width: 'wide', context: 'standalone' });
      }
    },
    i: function (t, e, n) {
      const r = t.getDay(),
        a = r === 0 ? 7 : r;
      switch (e) {
        case 'i':
          return String(a);
        case 'ii':
          return d(a, e.length);
        case 'io':
          return n.ordinalNumber(a, { unit: 'day' });
        case 'iii':
          return n.day(r, { width: 'abbreviated', context: 'formatting' });
        case 'iiiii':
          return n.day(r, { width: 'narrow', context: 'formatting' });
        case 'iiiiii':
          return n.day(r, { width: 'short', context: 'formatting' });
        case 'iiii':
        default:
          return n.day(r, { width: 'wide', context: 'formatting' });
      }
    },
    a: function (t, e, n) {
      const a = t.getHours() / 12 >= 1 ? 'pm' : 'am';
      switch (e) {
        case 'a':
        case 'aa':
          return n.dayPeriod(a, { width: 'abbreviated', context: 'formatting' });
        case 'aaa':
          return n.dayPeriod(a, { width: 'abbreviated', context: 'formatting' }).toLowerCase();
        case 'aaaaa':
          return n.dayPeriod(a, { width: 'narrow', context: 'formatting' });
        case 'aaaa':
        default:
          return n.dayPeriod(a, { width: 'wide', context: 'formatting' });
      }
    },
    b: function (t, e, n) {
      const r = t.getHours();
      let a;
      switch (
        (r === 12 ? (a = b.noon) : r === 0 ? (a = b.midnight) : (a = r / 12 >= 1 ? 'pm' : 'am'), e)
      ) {
        case 'b':
        case 'bb':
          return n.dayPeriod(a, { width: 'abbreviated', context: 'formatting' });
        case 'bbb':
          return n.dayPeriod(a, { width: 'abbreviated', context: 'formatting' }).toLowerCase();
        case 'bbbbb':
          return n.dayPeriod(a, { width: 'narrow', context: 'formatting' });
        case 'bbbb':
        default:
          return n.dayPeriod(a, { width: 'wide', context: 'formatting' });
      }
    },
    B: function (t, e, n) {
      const r = t.getHours();
      let a;
      switch (
        (r >= 17
          ? (a = b.evening)
          : r >= 12
            ? (a = b.afternoon)
            : r >= 4
              ? (a = b.morning)
              : (a = b.night),
        e)
      ) {
        case 'B':
        case 'BB':
        case 'BBB':
          return n.dayPeriod(a, { width: 'abbreviated', context: 'formatting' });
        case 'BBBBB':
          return n.dayPeriod(a, { width: 'narrow', context: 'formatting' });
        case 'BBBB':
        default:
          return n.dayPeriod(a, { width: 'wide', context: 'formatting' });
      }
    },
    h: function (t, e, n) {
      if (e === 'ho') {
        let r = t.getHours() % 12;
        return (r === 0 && (r = 12), n.ordinalNumber(r, { unit: 'hour' }));
      }
      return g.h(t, e);
    },
    H: function (t, e, n) {
      return e === 'Ho' ? n.ordinalNumber(t.getHours(), { unit: 'hour' }) : g.H(t, e);
    },
    K: function (t, e, n) {
      const r = t.getHours() % 12;
      return e === 'Ko' ? n.ordinalNumber(r, { unit: 'hour' }) : d(r, e.length);
    },
    k: function (t, e, n) {
      let r = t.getHours();
      return (
        r === 0 && (r = 24),
        e === 'ko' ? n.ordinalNumber(r, { unit: 'hour' }) : d(r, e.length)
      );
    },
    m: function (t, e, n) {
      return e === 'mo' ? n.ordinalNumber(t.getMinutes(), { unit: 'minute' }) : g.m(t, e);
    },
    s: function (t, e, n) {
      return e === 'so' ? n.ordinalNumber(t.getSeconds(), { unit: 'second' }) : g.s(t, e);
    },
    S: function (t, e) {
      return g.S(t, e);
    },
    X: function (t, e, n) {
      const r = t.getTimezoneOffset();
      if (r === 0) return 'Z';
      switch (e) {
        case 'X':
          return Q(r);
        case 'XXXX':
        case 'XX':
          return y(r);
        case 'XXXXX':
        case 'XXX':
        default:
          return y(r, ':');
      }
    },
    x: function (t, e, n) {
      const r = t.getTimezoneOffset();
      switch (e) {
        case 'x':
          return Q(r);
        case 'xxxx':
        case 'xx':
          return y(r);
        case 'xxxxx':
        case 'xxx':
        default:
          return y(r, ':');
      }
    },
    O: function (t, e, n) {
      const r = t.getTimezoneOffset();
      switch (e) {
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + A(r, ':');
        case 'OOOO':
        default:
          return 'GMT' + y(r, ':');
      }
    },
    z: function (t, e, n) {
      const r = t.getTimezoneOffset();
      switch (e) {
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + A(r, ':');
        case 'zzzz':
        default:
          return 'GMT' + y(r, ':');
      }
    },
    t: function (t, e, n) {
      const r = Math.trunc(+t / 1e3);
      return d(r, e.length);
    },
    T: function (t, e, n) {
      return d(+t, e.length);
    },
  };
function A(t, e = '') {
  const n = t > 0 ? '-' : '+',
    r = Math.abs(t),
    a = Math.trunc(r / 60),
    o = r % 60;
  return o === 0 ? n + String(a) : n + String(a) + e + d(o, 2);
}
function Q(t, e) {
  return t % 60 === 0 ? (t > 0 ? '-' : '+') + d(Math.abs(t) / 60, 2) : y(t, e);
}
function y(t, e = '') {
  const n = t > 0 ? '-' : '+',
    r = Math.abs(t),
    a = d(Math.trunc(r / 60), 2),
    o = d(r % 60, 2);
  return n + a + e + o;
}
const V = (t, e) => {
    switch (t) {
      case 'P':
        return e.date({ width: 'short' });
      case 'PP':
        return e.date({ width: 'medium' });
      case 'PPP':
        return e.date({ width: 'long' });
      case 'PPPP':
      default:
        return e.date({ width: 'full' });
    }
  },
  K = (t, e) => {
    switch (t) {
      case 'p':
        return e.time({ width: 'short' });
      case 'pp':
        return e.time({ width: 'medium' });
      case 'ppp':
        return e.time({ width: 'long' });
      case 'pppp':
      default:
        return e.time({ width: 'full' });
    }
  },
  oe = (t, e) => {
    const n = t.match(/(P+)(p+)?/) || [],
      r = n[1],
      a = n[2];
    if (!a) return V(t, e);
    let o;
    switch (r) {
      case 'P':
        o = e.dateTime({ width: 'short' });
        break;
      case 'PP':
        o = e.dateTime({ width: 'medium' });
        break;
      case 'PPP':
        o = e.dateTime({ width: 'long' });
        break;
      case 'PPPP':
      default:
        o = e.dateTime({ width: 'full' });
        break;
    }
    return o.replace('{{date}}', V(r, e)).replace('{{time}}', K(a, e));
  },
  ie = { p: K, P: oe },
  se = /^D+$/,
  ce = /^Y+$/,
  ue = ['D', 'DD', 'YY', 'YYYY'];
function de(t) {
  return se.test(t);
}
function fe(t) {
  return ce.test(t);
}
function le(t, e, n) {
  const r = he(t, e, n);
  if ((console.warn(r), ue.includes(t))) throw new RangeError(r);
}
function he(t, e, n) {
  const r = t[0] === 'Y' ? 'years' : 'days of the month';
  return `Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const me = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  ge = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  we = /^'([^]*?)'?$/,
  ye = /''/g,
  be = /[a-zA-Z]/;
function _e(t, e, n) {
  const r = P(),
    a = n?.locale ?? r.locale ?? te,
    o =
      n?.firstWeekContainsDate ??
      n?.locale?.options?.firstWeekContainsDate ??
      r.firstWeekContainsDate ??
      r.locale?.options?.firstWeekContainsDate ??
      1,
    i =
      n?.weekStartsOn ??
      n?.locale?.options?.weekStartsOn ??
      r.weekStartsOn ??
      r.locale?.options?.weekStartsOn ??
      0,
    s = f(t, n?.in);
  if (!Dt(s)) throw new RangeError('Invalid time value');
  let c = e
    .match(ge)
    .map((l) => {
      const h = l[0];
      if (h === 'p' || h === 'P') {
        const S = ie[h];
        return S(l, a.formatLong);
      }
      return l;
    })
    .join('')
    .match(me)
    .map((l) => {
      if (l === "''") return { isToken: !1, value: "'" };
      const h = l[0];
      if (h === "'") return { isToken: !1, value: De(l) };
      if (R[h]) return { isToken: !0, value: l };
      if (h.match(be))
        throw new RangeError(
          'Format string contains an unescaped latin alphabet character `' + h + '`'
        );
      return { isToken: !1, value: l };
    });
  a.localize.preprocessor && (c = a.localize.preprocessor(s, c));
  const u = { firstWeekContainsDate: o, weekStartsOn: i, locale: a };
  return c
    .map((l) => {
      if (!l.isToken) return l.value;
      const h = l.value;
      ((!n?.useAdditionalWeekYearTokens && fe(h)) || (!n?.useAdditionalDayOfYearTokens && de(h))) &&
        le(h, e, String(t));
      const S = R[h[0]];
      return S(s, h, a.localize, u);
    })
    .join('');
}
function De(t) {
  const e = t.match(we);
  return e ? e[1].replace(ye, "'") : t;
}
function je(t, e) {
  return +f(t) > +f(e);
}
function Re(t, e, n) {
  const [r, a] = W(n?.in, t, e);
  return r.getFullYear() === a.getFullYear() && r.getMonth() === a.getMonth();
}
function Ae(t, e) {
  return yt(m(t, t), wt(t));
}
function Qe(t, e, n) {
  const r = +f(t, n?.in),
    [a, o] = [+f(e.start, n?.in), +f(e.end, n?.in)].sort((i, s) => i - s);
  return r >= a && r <= o;
}
function Ve(t, e) {
  const n = () => m(e?.in, NaN),
    a = Pe(t);
  let o;
  if (a.date) {
    const u = ke(a.date, 2);
    o = xe(u.restDateString, u.year);
  }
  if (!o || isNaN(+o)) return n();
  const i = +o;
  let s = 0,
    c;
  if (a.time && ((s = Te(a.time)), isNaN(s))) return n();
  if (a.timezone) {
    if (((c = We(a.timezone)), isNaN(c))) return n();
  } else {
    const u = new Date(i + s),
      l = f(0, e?.in);
    return (
      l.setFullYear(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()),
      l.setHours(u.getUTCHours(), u.getUTCMinutes(), u.getUTCSeconds(), u.getUTCMilliseconds()),
      l
    );
  }
  return f(i + s + c, e?.in);
}
const k = { dateTimeDelimiter: /[T ]/, timeZoneDelimiter: /[Z ]/i, timezone: /([Z+-].*)$/ },
  pe = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,
  Me = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,
  Oe = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function Pe(t) {
  const e = {},
    n = t.split(k.dateTimeDelimiter);
  let r;
  if (n.length > 2) return e;
  if (
    (/:/.test(n[0])
      ? (r = n[0])
      : ((e.date = n[0]),
        (r = n[1]),
        k.timeZoneDelimiter.test(e.date) &&
          ((e.date = t.split(k.timeZoneDelimiter)[0]), (r = t.substr(e.date.length, t.length)))),
    r)
  ) {
    const a = k.timezone.exec(r);
    a ? ((e.time = r.replace(a[1], '')), (e.timezone = a[1])) : (e.time = r);
  }
  return e;
}
function ke(t, e) {
  const n = new RegExp('^(?:(\\d{4}|[+-]\\d{' + (4 + e) + '})|(\\d{2}|[+-]\\d{' + (2 + e) + '})$)'),
    r = t.match(n);
  if (!r) return { year: NaN, restDateString: '' };
  const a = r[1] ? parseInt(r[1]) : null,
    o = r[2] ? parseInt(r[2]) : null;
  return { year: o === null ? a : o * 100, restDateString: t.slice((r[1] || r[2]).length) };
}
function xe(t, e) {
  if (e === null) return new Date(NaN);
  const n = t.match(pe);
  if (!n) return new Date(NaN);
  const r = !!n[4],
    a = M(n[1]),
    o = M(n[2]) - 1,
    i = M(n[3]),
    s = M(n[4]),
    c = M(n[5]) - 1;
  if (r) return Ee(e, s, c) ? Se(e, s, c) : new Date(NaN);
  {
    const u = new Date(0);
    return !Ye(e, o, i) || !Ne(e, a) ? new Date(NaN) : (u.setUTCFullYear(e, o, Math.max(a, i)), u);
  }
}
function M(t) {
  return t ? parseInt(t) : 1;
}
function Te(t) {
  const e = t.match(Me);
  if (!e) return NaN;
  const n = C(e[1]),
    r = C(e[2]),
    a = C(e[3]);
  return Ce(n, r, a) ? n * z + r * $ + a * 1e3 : NaN;
}
function C(t) {
  return (t && parseFloat(t.replace(',', '.'))) || 0;
}
function We(t) {
  if (t === 'Z') return 0;
  const e = t.match(Oe);
  if (!e) return 0;
  const n = e[1] === '+' ? -1 : 1,
    r = parseInt(e[2]),
    a = (e[3] && parseInt(e[3])) || 0;
  return Fe(r, a) ? n * (r * z + a * $) : NaN;
}
function Se(t, e, n) {
  const r = new Date(0);
  r.setUTCFullYear(t, 0, 4);
  const a = r.getUTCDay() || 7,
    o = (e - 1) * 7 + n + 1 - a;
  return (r.setUTCDate(r.getUTCDate() + o), r);
}
const ve = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function tt(t) {
  return t % 400 === 0 || (t % 4 === 0 && t % 100 !== 0);
}
function Ye(t, e, n) {
  return e >= 0 && e <= 11 && n >= 1 && n <= (ve[e] || (tt(t) ? 29 : 28));
}
function Ne(t, e) {
  return e >= 1 && e <= (tt(t) ? 366 : 365);
}
function Ee(t, e, n) {
  return e >= 1 && e <= 53 && n >= 0 && n <= 6;
}
function Ce(t, e, n) {
  return t === 24 ? e === 0 && n === 0 : n >= 0 && n < 60 && e >= 0 && e < 60 && t >= 0 && t < 25;
}
function Fe(t, e) {
  return e >= 0 && e <= 59;
}
function Xe(t, e, n) {
  return lt(t, -e, n);
}
export {
  D as a,
  E as b,
  p as c,
  _t as d,
  te as e,
  _e as f,
  Be as g,
  O as h,
  Dt as i,
  He as j,
  Le as k,
  Re as l,
  Ae as m,
  Xe as n,
  Ie as o,
  Ve as p,
  lt as q,
  yt as r,
  qe as s,
  Qe as t,
  je as u,
};
//# sourceMappingURL=utils-FTT-aY8U.js.map
