'use strict';
/* Mis Cuentas — gastos e inversiones. Todo se guarda en este dispositivo (localStorage). */

// ---------- Constantes ----------
const STORE_KEY = 'misCuentas.v1';
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const CATS = {
  super: { label: 'Súper', long: 'Supermercado', path: 'M2 3h3l2.5 12h11l2-8H6.2M9 20h.01M18 20h.01' },
  comida: { label: 'Comer fuera', long: 'Comer fuera', path: 'M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3' },
  gasolina: { label: 'Gasolina', long: 'Gasolina', path: 'M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 10h11M15 8l3 2v7a1.5 1.5 0 0 0 3 0V9l-3-3' },
  coche: { label: 'Coche', long: 'Coche', path: 'M3 13l2-6h14l2 6v4H3zM5 17v2M19 17v2M7.5 14.5h.01M16.5 14.5h.01' },
  hogar: { label: 'Hogar', long: 'Hogar', path: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  perro: { label: 'Perro', long: 'Perro', path: 'M12 12c-3 0-6 4-6 6.5 0 1.5 1.2 2.5 2.7 2.5 1.2 0 2.1-.7 3.3-.7s2.1.7 3.3.7c1.5 0 2.7-1 2.7-2.5C18 16 15 12 12 12zM5.5 8v.01M9.5 4v.01M14.5 4v.01M18.5 8v.01' },
  salud: { label: 'Salud', long: 'Salud', path: 'M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z' },
  ocio: { label: 'Ocio', long: 'Ocio', path: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
  compras: { label: 'Compras', long: 'Compras', path: 'M6 7h12l1 14H5zM9 7a3 3 0 0 1 6 0' },
  subs: { label: 'Suscripción', long: 'Suscripciones', path: 'M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z' },
  transporte: { label: 'Transporte', long: 'Transporte', path: 'M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM4 11h16M8 21l2-4M16 21l-2-4' },
  otros: { label: 'Otros', long: 'Otros', path: 'M5 12h.01M12 12h.01M19 12h.01' }
};
const CAT_ORDER = Object.keys(CATS);
const INC_TYPES = ['Nómina', 'Paga extra', 'Reembolso', 'Otro'];
const P = {
  inv: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  ing: 'M12 4v12M6 10l6 6 6-6M5 20h14',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  cal: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4',
  gear: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  back: 'M15 6l-6 6 6 6',
  chev: 'M9 6l6 6-6 6',
  pencil: 'M4 20h4L19 9l-4-4L4 16z',
  wallet: 'M5.5 6h13A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-9A2.5 2.5 0 0 1 5.5 6zM3 10h18M16 15h2',
  check: 'M5 12l5 5 9-10',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  paste: 'M9 4h6v3H9zM7 5H5v16h14V5h-2'
};

// ---------- Utilidades ----------
const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (path, size = 22, sw = 1.8) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const round2 = (n) => Math.round(n * 100) / 100;
function fmtNum(n) {
  const s = Math.abs(n).toFixed(2).split('.');
  return (n < 0 ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1];
}
const fmt = (n) => fmtNum(n) + ' €';
function parseAmount(str) {
  let s = String(str == null ? '' : str).replace(/[€\s ]/g, '').replace(/^EUR|EUR$/i, '');
  if (s.includes(',') && s.includes('.')) {
    // el último separador es el decimal
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  }
  const v = parseFloat(s);
  return isNaN(v) ? 0 : round2(Math.abs(v));
}
const pad = (n) => String(n).padStart(2, '0');
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const monthKeyOf = (iso) => iso.slice(0, 7);
const monthName = (key) => MONTHS[parseInt(key.slice(5, 7), 10) - 1];
const monthLabel = (key) => monthName(key) + ' ' + key.slice(0, 4);
function shiftMonth(key, delta) {
  let y = parseInt(key.slice(0, 4), 10), m = parseInt(key.slice(5, 7), 10) - 1 + delta;
  y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
  return `${y}-${pad(m + 1)}`;
}
function dateLabel(iso) {
  const t = todayISO();
  if (iso === t) return 'Hoy';
  const d = new Date(t + 'T12:00:00'); d.setDate(d.getDate() - 1);
  if (iso === `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`) return 'Ayer';
  return parseInt(iso.slice(8, 10), 10) + ' ' + MONTHS_SHORT[parseInt(iso.slice(5, 7), 10) - 1];
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---------- Datos ----------
function emptyData() {
  return { version: 1, months: {}, fixed: [], rules: {}, positions: [], pending: [], invSubtract: false, payday: 1, payNext: false, starts: {} };
}
let data = load();
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(emptyData(), JSON.parse(raw));
  } catch (e) { /* datos corruptos o almacenamiento bloqueado */ }
  return emptyData();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
  catch (e) { toast('No se pudo guardar en el dispositivo'); }
}
function ensureMonth(key) {
  if (!data.months[key]) {
    const prevKeys = Object.keys(data.months).filter((k) => k < key).sort();
    const prev = prevKeys.length ? data.months[prevKeys[prevKeys.length - 1]] : null;
    data.months[key] = {
      cobro: null,
      suggested: prev ? prev.cobro : null,
      fixed: data.fixed.map((f) => Object.assign({}, f)),
      movs: []
    };
  }
  return data.months[key];
}
// ---------- Día de cobro ----------
// El "mes" de la app va desde el día de cobro hasta el día anterior al siguiente cobro.
// Si el día no existe en un mes (p. ej. 31 en abril), se usa el último día de ese mes.
const daysIn = (y, m0) => new Date(y, m0 + 1, 0).getDate();
const payDay = () => { const d = parseInt(data.payday, 10); return d >= 1 && d <= 31 ? d : 1; };
const labelNext = () => !!data.payNext && payDay() > 1;
const startDayOf = (key) => Math.min(payDay(), daysIn(parseInt(key.slice(0, 4), 10), parseInt(key.slice(5, 7), 10) - 1));
// Cada periodo puede tener su propia fecha de inicio (data.starts[clave] = 'AAAA-MM-DD').
// Si no la tiene, se calcula con el día de cobro. El final es siempre el día antes del inicio del siguiente.
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return isoOf(d); };
const shortD = (iso) => parseInt(iso.slice(8, 10), 10) + ' ' + MONTHS_SHORT[parseInt(iso.slice(5, 7), 10) - 1];
function defaultStart(key) {
  const k = labelNext() ? shiftMonth(key, -1) : key;
  return `${k}-${pad(startDayOf(k))}`;
}
function startISO(key) {
  const st = data.starts && data.starts[key];
  return /^\d{4}-\d{2}-\d{2}$/.test(st || '') ? st : defaultStart(key);
}
const endISO = (key) => addDays(startISO(shiftMonth(key, 1)), -1);
function periodKeyOf(iso) {
  let key = iso.slice(0, 7);
  if (parseInt(iso.slice(8, 10), 10) < startDayOf(key)) key = shiftMonth(key, -1);
  if (labelNext()) key = shiftMonth(key, 1);
  for (let i = 0; i < 4 && iso < startISO(key); i++) key = shiftMonth(key, -1);
  for (let i = 0; i < 4 && iso >= startISO(shiftMonth(key, 1)); i++) key = shiftMonth(key, 1);
  return key;
}
function periodRange(key) {
  const st = startISO(key), en = endISO(key);
  const natural = st === key + '-01' && en.slice(0, 7) === key && addDays(en, 1).slice(8, 10) === '01';
  return natural ? '' : `${shortD(st)} – ${shortD(en)}`;
}
// Guarda inicio y fin de un periodo (el fin mueve el inicio del siguiente). Devuelve un error o ''.
function setPeriod(key, st, en) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(st) || !/^\d{4}-\d{2}-\d{2}$/.test(en)) return 'Elige las dos fechas';
  const prevSt = startISO(shiftMonth(key, -1)), next = shiftMonth(key, 1), next2St = startISO(shiftMonth(key, 2));
  if (st <= prevSt) return 'El inicio tiene que ser después del ' + shortD(prevSt);
  if (en < st) return 'El final no puede ser antes del inicio';
  if (addDays(en, 1) >= next2St) return 'El final tiene que ser antes del ' + shortD(next2St);
  if (!data.starts) data.starts = {};
  const put = (k, v) => { if (v === defaultStart(k)) delete data.starts[k]; else data.starts[k] = v; };
  put(key, st); put(next, addDays(en, 1));
  return '';
}
// Recoloca todos los movimientos en su periodo según su fecha (al cambiar el día de cobro).
function rebucket() {
  const all = [];
  Object.keys(data.months).forEach((k) => { all.push(...data.months[k].movs); data.months[k].movs = []; });
  all.forEach((x) => ensureMonth(periodKeyOf(x.date)).movs.push(x));
  Object.keys(data.months).forEach((k) => {
    const m = data.months[k];
    if (!m.movs.length && m.cobro == null && k !== curKey()) delete data.months[k];
  });
}
const curKey = () => periodKeyOf(todayISO());
function totals(key) {
  const m = data.months[key] || { cobro: 0, fixed: [], movs: [] };
  let fixed = 0, variable = 0, invested = 0, extra = 0;
  m.fixed.forEach((f) => { if (f.on) fixed += f.amount; });
  m.movs.forEach((x) => {
    if (x.kind === 'gasto') variable += x.amount;
    else if (x.kind === 'inv') invested += x.amount;
    else if (x.kind === 'ing') extra += x.amount;
  });
  const income = (m.cobro || 0) + extra;
  const spent = fixed + variable;
  const left = income - spent - (data.invSubtract ? invested : 0);
  return { fixed, variable, invested, extra, income, spent, left, cobro: m.cobro };
}
function sortedMovs(key) {
  const m = data.months[key];
  if (!m) return [];
  return m.movs.slice().sort((a, b) => (b.date + b.created).localeCompare(a.date + a.created));
}

// ---------- Estado de la interfaz ----------
const ui = { tab: 'inicio', sheet: null, form: {}, histKey: null, toast: '' };
let toastTimer = null;
function toast(msg) {
  ui.toast = msg;
  renderToast();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { ui.toast = ''; renderToast(); }, 2400);
}

// ---------- Render ----------
const app = document.getElementById('app');
function render() {
  ensureMonth(curKey());
  let html = '';
  if (ui.tab === 'inicio') html += viewInicio();
  else if (ui.tab === 'historial') html += ui.histKey ? viewMes(ui.histKey) : viewHistorial();
  else if (ui.tab === 'inversiones') html += viewInversiones();
  else if (ui.tab === 'ajustes') html += viewAjustes();
  html += tabbar();
  html += '<div id="sheet-root"></div><div id="toast-root"></div>';
  const scroller = app.querySelector('.screen');
  const scrollTop = scroller && scroller.dataset.tab === ui.tab + (ui.histKey || '') ? scroller.scrollTop : 0;
  app.innerHTML = html;
  const ns = app.querySelector('.screen');
  if (ns) { ns.dataset.tab = ui.tab + (ui.histKey || ''); ns.scrollTop = scrollTop; }
  renderSheet();
  renderToast();
}
function renderToast() {
  const r = document.getElementById('toast-root');
  if (r) r.innerHTML = ui.toast ? `<div class="toast" role="status"><span style="color:#15803D">${icon(P.check, 16, 2.6)}</span>${esc(ui.toast)}</div>` : '';
}

function tabbar() {
  const t = (id, label, path) => `<button class="tab ${ui.tab === id ? 'on' : ''}" data-act="tab" data-tab="${id}" ${ui.tab === id ? 'aria-current="page"' : ''}>${icon(path, 24)}<span>${label}</span></button>`;
  return `<nav class="tabbar" aria-label="Principal">
    ${t('inicio', 'Inicio', P.home)}
    ${t('historial', 'Historial', P.cal)}
    <button class="fab" data-act="add" data-type="gasto" aria-label="Añadir movimiento">${icon(P.plus, 26, 2.4)}</button>
    ${t('inversiones', 'Inversiones', P.inv)}
    ${t('ajustes', 'Ajustes', P.gear)}
  </nav>`;
}

function movRow(x, withMonthKey) {
  let path, amount, sub;
  if (x.kind === 'gasto') {
    const c = CATS[x.cat] || CATS.otros;
    path = c.path; amount = fmt(-x.amount); sub = `${c.long} · ${x.via} · ${dateLabel(x.date)}`;
  } else if (x.kind === 'inv') {
    path = P.inv; amount = fmt(x.amount); sub = `Inversión · ${x.via} · ${dateLabel(x.date)}`;
  } else {
    path = P.ing; amount = '+' + fmt(x.amount); sub = `Ingreso · ${x.via} · ${dateLabel(x.date)}`;
  }
  return `<li><button class="mov k-${x.kind}" data-act="mov" data-id="${x.id}" data-month="${withMonthKey}">
    <span class="ic">${icon(path, 19)}</span>
    <span class="txt"><span class="t">${esc(x.title)}</span><span class="s">${esc(sub)}</span></span>
    <span class="a">${amount}</span>
  </button></li>`;
}

function viewInicio() {
  const key = curKey();
  const m = data.months[key];
  const t = totals(key);
  const pct = t.income > 0 ? Math.min(100, (t.spent / t.income) * 100) : 0;
  const movs = sortedMovs(key).slice(0, 6);
  const p = data.pending[0];
  let h = `<main class="screen">
  <header class="head">
    <div><div class="eyebrow">${monthLabel(key)}${periodRange(key) ? ' · ' + periodRange(key) : ''}</div><h1 class="title">Resumen</h1></div>
    <button class="pill-btn" data-act="paste">${icon(P.wallet, 16)}Pegar pago</button>
  </header>`;
  if (m.cobro == null) {
    h += `<button class="alert" data-act="cobro">
      <span class="ic">${icon(P.ing, 22)}</span>
      <span class="txt"><span class="t">Nuevo mes: ${monthName(key)}</span><span class="small muted">¿Cuánto has cobrado este mes? Toca para indicarlo.</span></span>
      <span class="badge">Empezar</span></button>`;
  }
  h += `<section class="card">
    <div class="row-between" style="align-items:center">
      <span class="muted" style="font-size:15px;font-weight:500">Te quedan este mes</span>
      <button class="small muted" data-act="cobro" style="display:flex;align-items:center;gap:6px;min-height:32px">${icon(P.pencil, 14, 2)}Cobro: ${m.cobro == null ? '—' : fmt(t.income)}</button>
    </div>
    <div class="hero-amount ${t.left >= 0 ? 'green' : 'red'}">${fmt(t.left)}</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="bar"><span style="width:${pct.toFixed(1)}%;background:${pct >= 90 ? 'var(--red)' : 'var(--orange)'}"></span></div>
      <div class="row-between xs muted"><span>Has gastado el ${pct.toFixed(1).replace('.', ',')} %</span><span>Fijos: ${fmt(t.fixed)}</span></div>
    </div>
    <div class="divider"></div>
    <div class="grid2">
      <div class="stat"><span class="k"><span class="dot" style="background:var(--orange)"></span>Gastado</span><span class="v">${fmt(t.spent)}</span></div>
      <button class="stat" data-act="tab" data-tab="inversiones"><span class="k"><span class="dot" style="background:var(--blue)"></span>Invertido</span><span class="v">${fmt(t.invested)}</span></button>
    </div>
  </section>`;
  if (p) {
    h += `<button class="alert" data-act="ap">
      <span class="ic">${icon(P.wallet, 22)}</span>
      <span class="txt"><span class="t">${data.pending.length > 1 ? data.pending.length + ' pagos por revisar' : 'Pago con Apple Pay'}</span><span class="small muted">${esc(p.m)} · ${fmt(p.a)}</span></span>
      <span class="badge">Revisar</span></button>`;
  }
  h += `<div class="row-between" style="margin-top:4px"><h2 class="h2">Últimos movimientos</h2><button class="link" data-act="hist-month" data-month="${key}">Ver todo</button></div>`;
  h += movs.length ? `<ul class="list">${movs.map((x) => movRow(x, key)).join('')}</ul>` : `<div class="empty">Aún no hay movimientos este mes.<br>Pulsa + para añadir uno.</div>`;
  h += `</main>`;
  return h;
}

function monthKeysDesc() {
  return Object.keys(data.months).sort().reverse();
}
function viewHistorial() {
  const keys = monthKeysDesc();
  const chartKeys = keys.slice(0, 6).reverse();
  const cur = curKey();
  let sumS = 0, sumL = 0, n = 0;
  const cols = chartKeys.map((k) => {
    const t = totals(k);
    if (t.income > 0) { sumS += t.spent; sumL += t.income - t.spent; n++; }
    const hgt = t.income > 0 ? Math.min(130, Math.round((t.spent / t.income) * 130)) : (t.spent > 0 ? 130 : 0);
    return `<button class="col" data-act="hist-month" data-month="${k}" aria-label="${monthLabel(k)}">
      <div class="bar-v ${k === cur ? 'cur' : ''}"><div class="fill"></div><div class="sp" style="height:${hgt}px"></div></div>
      <span class="lbl ${k === cur ? 'cur' : ''}">${MONTHS_SHORT[parseInt(k.slice(5, 7), 10) - 1]}</span></button>`;
  }).join('');
  let h = `<main class="screen">
  <header class="head"><h1 class="title">Historial</h1></header>
  <section class="card">
    <div class="row-between" style="align-items:center"><span style="font-size:15px;font-weight:600">Cobro de cada mes</span>
      <span class="legend"><span><span class="sq" style="background:var(--orange)"></span>Gastado</span><span><span class="sq" style="background:#1E5B36"></span>Sobrante</span></span></div>
    <div class="chart" style="grid-template-columns:repeat(6,minmax(0,1fr))">${cols}</div>
    <div class="divider"></div>
    <div class="grid2">
      <div class="stat"><span class="k">Gasto medio</span><span class="v" style="font-size:17px">${n ? fmt(sumS / n) : '—'}</span></div>
      <div class="stat"><span class="k">Sobrante medio</span><span class="v green" style="font-size:17px">${n ? fmt(sumL / n) : '—'}</span></div>
    </div>
  </section>
  <h2 class="h2" style="margin-top:4px">Meses</h2>
  <ul class="list">`;
  h += keys.map((k) => {
    const t = totals(k);
    const left = t.income - t.spent;
    return `<li><button class="mov" data-act="hist-month" data-month="${k}">
      <span class="txt"><span class="t" style="display:flex;align-items:center;gap:8px">${k.slice(0, 4) === cur.slice(0, 4) ? monthName(k) : monthLabel(k)}${k === cur ? '<span class="tag">En curso</span>' : ''}</span>
      <span class="s">Gastado ${fmt(t.spent)}${t.invested > 0 ? ' · Invertido ' + fmt(t.invested) : ''}</span></span>
      <span class="a ${left >= 0 ? 'green' : 'red'}">${left >= 0 ? '+' : ''}${fmt(left)}</span>
      <span style="color:var(--text3)">${icon(P.chev, 16, 2)}</span></button></li>`;
  }).join('');
  h += `</ul></main>`;
  return h;
}

function viewMes(key) {
  const m = ensureMonth(key);
  const t = totals(key);
  const movs = sortedMovs(key);
  const byCat = {};
  m.movs.forEach((x) => { if (x.kind === 'gasto') byCat[x.cat] = (byCat[x.cat] || 0) + x.amount; });
  const bd = [{ label: 'Gastos fijos', v: t.fixed }].concat(Object.keys(byCat).map((k) => ({ label: (CATS[k] || CATS.otros).long, v: byCat[k] })))
    .filter((c) => c.v > 0).sort((a, b) => b.v - a.v);
  const max = bd.length ? bd[0].v : 1;
  let h = `<main class="screen">
  <button class="link" data-act="hist-back" style="align-self:flex-start;font-size:17px;gap:2px">${icon(P.back, 22, 2.2)}Historial</button>
  <h1 class="title">${monthLabel(key)}</h1>
  ${periodRange(key) ? `<p class="small muted" style="margin-top:-8px">Del ${periodRange(key).replace(' – ', ' al ')}</p>` : ''}
  <section class="card">
    <div class="grid2">
      <div class="stat"><span class="k">Cobrado</span><span class="v">${m.cobro == null ? '—' : fmt(t.income)}</span></div>
      <div class="stat"><span class="k">Sobrante</span><span class="v ${t.income - t.spent >= 0 ? 'green' : 'red'}">${fmt(t.income - t.spent)}</span></div>
      <div class="stat"><span class="k"><span class="dot" style="background:var(--orange)"></span>Gastado</span><span class="v">${fmt(t.spent)}</span></div>
      <div class="stat"><span class="k"><span class="dot" style="background:var(--blue)"></span>Invertido</span><span class="v">${fmt(t.invested)}</span></div>
    </div>
    <button class="secondary" data-act="cobro" data-month="${key}" style="min-height:40px;background:var(--card2)">Editar cobro y fijos del mes</button>
  </section>`;
  if (bd.length) {
    h += `<h2 class="h2" style="margin-top:4px">Por categoría</h2><section class="card" style="gap:12px">` +
      bd.map((c) => `<div style="display:flex;flex-direction:column;gap:6px"><div class="row-between" style="font-size:14px"><span>${esc(c.label)}</span><span style="font-weight:600">${fmt(c.v)}</span></div><div class="hbar"><span style="width:${Math.max(2, (c.v / max) * 100).toFixed(1)}%"></span></div></div>`).join('') +
      `</section>`;
  }
  h += `<h2 class="h2" style="margin-top:4px">Movimientos</h2>`;
  h += movs.length ? `<ul class="list">${movs.map((x) => movRow(x, key)).join('')}</ul>` : `<div class="empty">Sin movimientos.</div>`;
  h += `</main>`;
  return h;
}

function viewInversiones() {
  const pos = data.positions;
  let val = 0, apo = 0;
  pos.forEach((p) => { val += p.valor; apo += p.aportado; });
  const gain = val - apo;
  const gpct = apo > 0 ? (gain / apo) * 100 : 0;
  const plats = {};
  pos.forEach((p) => { (plats[p.platform] = plats[p.platform] || []).push(p); });
  const platNames = Object.keys(plats).sort((a, b) => plats[b].reduce((s, p) => s + p.valor, 0) - plats[a].reduce((s, p) => s + p.valor, 0));
  const palette = ['var(--blue)', 'var(--violet)', '#FCD34D', '#5EEAD4', '#F9A8D4'];
  const signCls = (n) => (n >= 0 ? 'green' : 'red');
  const signTxt = (n) => (n >= 0 ? '+' : '') + fmtNum(n);
  const t = totals(curKey());
  let h = `<main class="screen">
  <header class="head"><h1 class="title">Inversiones</h1>
    <div style="display:flex;gap:8px"><button class="pill-btn" data-act="add" data-type="inversion" style="background:var(--blue-bg);color:var(--blue)">Aportar</button>
    <button class="icon-btn" data-act="pos-new" aria-label="Nueva posición" style="background:var(--blue-bg);color:var(--blue)">${icon(P.plus, 20, 2.2)}</button></div></header>
  <section class="card">
    <div style="display:flex;flex-direction:column;gap:6px">
      <span class="muted" style="font-size:15px;font-weight:500">Valor de la cartera</span>
      <span class="hero-amount" style="font-size:42px">${fmt(val)}</span>
      <span style="font-size:14px" class="muted"><span class="${signCls(gain)}" style="font-weight:600">${signTxt(gain)} € (${signTxt(gpct)} %)</span> · aportado ${fmt(apo)}</span>
    </div>`;
  if (val > 0) {
    h += `<div style="display:flex;flex-direction:column;gap:8px">
      <div style="height:10px;border-radius:5px;overflow:hidden;display:flex;gap:2px">${platNames.map((pn, i) => `<span style="width:${(plats[pn].reduce((s, p) => s + p.valor, 0) / val * 100).toFixed(1)}%;background:${palette[i % palette.length]}"></span>`).join('')}</div>
      <div class="legend" style="flex-wrap:wrap">${platNames.map((pn, i) => `<span><span class="sq" style="background:${palette[i % palette.length]}"></span>${esc(pn)} ${Math.round(plats[pn].reduce((s, p) => s + p.valor, 0) / val * 100)} %</span>`).join('')}</div></div>`;
  }
  h += `</section>
  <div class="list">
    <div class="setrow" style="border-bottom:1px solid var(--line)"><span class="muted">Aportado en ${monthName(curKey())}</span><span class="blue" style="font-weight:650">${fmt(t.invested)}</span></div>
    <label class="setrow"><span>Las aportaciones restan de lo que me queda</span><input class="sw" type="checkbox" role="switch" data-act="inv-subtract" ${data.invSubtract ? 'checked' : ''}></label>
  </div>`;
  if (!pos.length) {
    h += `<div class="empty">Añade tus posiciones (fondos, acciones, carteras) con el botón +.<br>Luego actualiza su valor cuando quieras.</div>`;
  }
  platNames.forEach((pn) => {
    const ps = plats[pn];
    const v = ps.reduce((s, p) => s + p.valor, 0), a = ps.reduce((s, p) => s + p.aportado, 0);
    const pc = a > 0 ? ((v - a) / a) * 100 : 0;
    h += `<div class="row-between" style="margin-top:6px"><h2 class="h2">${esc(pn)}</h2><span style="font-size:14px"><span style="font-weight:650">${fmt(v)}</span> <span class="${signCls(v - a)}">${signTxt(pc)} %</span></span></div>
    <ul class="list">${ps.map((p) => {
      const g = p.valor - p.aportado, gp = p.aportado > 0 ? (g / p.aportado) * 100 : 0;
      return `<li><button class="mov" data-act="pos" data-id="${p.id}">
        <span class="txt"><span class="t">${esc(p.name)}</span><span class="s">${esc(p.note || 'Aportado ' + fmt(p.aportado))}</span></span>
        <span class="a2"><span class="a">${fmt(p.valor)}</span><span class="xs ${signCls(g)}">${signTxt(g)} € · ${signTxt(gp)} %</span></span></button></li>`;
    }).join('')}</ul>`;
  });
  h += `</main>`;
  return h;
}

function viewAjustes() {
  const key = curKey();
  const m = data.months[key];
  const rules = Object.keys(data.rules);
  let h = `<main class="screen">
  <header class="head"><h1 class="title">Ajustes</h1></header>
  <ul class="list">
    <li><button class="setrow" data-act="cobro"><span>Cobro de ${monthName(key)}</span><span class="chev">${m.cobro == null ? 'Sin indicar' : fmt(m.cobro)}${icon(P.chev, 16, 2)}</span></button></li>
    <li><button class="setrow" data-act="cobro"><span>Gastos fijos</span><span class="chev">${data.fixed.length} · ${fmt(data.fixed.filter((f) => f.on).reduce((s, f) => s + f.amount, 0))}${icon(P.chev, 16, 2)}</span></button></li>
    <li><label class="setrow"><span>Día de cobro</span><span class="chev"><select data-act="payday" aria-label="Día de cobro" style="background:none;border:0;color:var(--text2);font:inherit;font-size:16px;text-align:right;-webkit-appearance:none;appearance:none">${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${payDay() === i + 1 ? 'selected' : ''}>${i === 0 ? 'Día 1 (mes natural)' : 'Día ' + (i + 1)}</option>`).join('')}</select>${icon(P.chev, 16, 2)}</span></label></li>
    ${payDay() > 1 ? `<li><label class="setrow"><span>Llamar al periodo por el mes siguiente<br><span class="xs muted">Ahora: ${monthName(curKey())} = ${periodRange(curKey())}</span></span><input class="sw" type="checkbox" role="switch" data-act="paynext" ${data.payNext ? 'checked' : ''}></label></li>` : ''}
    <li><button class="setrow" data-act="help-ap"><span>Detectar pagos con Apple Pay</span><span class="chev">Configurar${icon(P.chev, 16, 2)}</span></button></li>
  </ul>`;
  if (rules.length) {
    h += `<h2 class="h2" style="margin-top:4px">Categorías recordadas</h2><ul class="list">` +
      rules.sort().map((r) => `<li class="setrow"><span>${esc(r.charAt(0).toUpperCase() + r.slice(1))} → ${esc((CATS[data.rules[r]] || CATS.otros).long)}</span><button class="icon-btn" style="background:none;color:var(--text3)" data-act="rule-del" data-rule="${esc(r)}" aria-label="Olvidar regla de ${esc(r)}">${icon(P.trash, 18)}</button></li>`).join('') +
      `</ul>`;
  }
  h += `<h2 class="h2" style="margin-top:4px">Copia de seguridad</h2>
  <p class="small muted" style="line-height:1.4">Tus datos solo están en este iPhone. Exporta una copia de vez en cuando y guárdala en Archivos o iCloud Drive.</p>
  <ul class="list">
    <li><button class="setrow" data-act="export"><span>Exportar copia</span><span class="chev">${icon(P.chev, 16, 2)}</span></button></li>
    <li><label class="setrow" style="cursor:pointer"><span>Importar copia</span><span class="chev">${icon(P.chev, 16, 2)}</span><input type="file" accept="application/json,.json" data-act="import" class="hide"></label></li>
    <li><button class="setrow danger" data-act="wipe"><span>Borrar todos los datos</span></button></li>
  </ul>
  <p class="xs muted" style="text-align:center;margin-top:8px">Mis Cuentas · v3</p>
  </main>`;
  return h;
}

// ---------- Hojas (sheets) ----------
function openSheet(name, form) {
  ui.sheet = name;
  ui.form = form || {};
  renderSheet();
}
function closeSheet() {
  ui.sheet = null;
  ui.form = {};
  renderSheet();
}
function renderSheet() {
  const root = document.getElementById('sheet-root');
  if (!root) return;
  const f = ui.form;
  let inner = '';
  if (ui.sheet === 'add') inner = sheetAdd(f);
  else if (ui.sheet === 'ap') inner = sheetAP(f);
  else if (ui.sheet === 'cobro') inner = sheetCobro(f);
  else if (ui.sheet === 'mov') inner = sheetMov(f);
  else if (ui.sheet === 'pos') inner = sheetPos(f);
  else if (ui.sheet === 'help-ap') inner = sheetHelpAP();
  root.innerHTML = inner;
}

function sheetAdd(f) {
  const colors = { gasto: 'var(--orange)', inversion: 'var(--blue)', ingreso: 'var(--green)' };
  const inks = { gasto: 'var(--orange-ink)', inversion: 'var(--blue-ink)', ingreso: 'var(--green-ink)' };
  const col = colors[f.type];
  const v = parseAmount(f.amount);
  const labels = { gasto: 'Guardar gasto', inversion: 'Guardar inversión', ingreso: 'Guardar ingreso' };
  let h = `<div class="sheet full" role="dialog" aria-modal="true" aria-label="Nuevo movimiento">
  <div class="sheet-head"><button class="icon-btn" data-act="close" aria-label="Cerrar">${icon(P.x, 18, 2)}</button><h2>Nuevo movimiento</h2><span style="width:44px"></span></div>
  <div class="seg" role="group" aria-label="Tipo">${[['gasto', 'Gasto'], ['inversion', 'Inversión'], ['ingreso', 'Ingreso']].map(([id, l]) =>
    `<button class="${f.type === id ? 'on' : ''}" style="${f.type === id ? 'color:' + colors[id] : ''}" data-act="f-type" data-v="${id}" aria-pressed="${f.type === id}">${l}</button>`).join('')}</div>
  <div class="amount-wrap"><label for="f-amount" class="lbl-sm">Importe</label>
    <div class="amount-row"><input id="f-amount" class="amount-in" inputmode="decimal" autocomplete="off" placeholder="0,00" value="${esc(f.amount)}" data-field="amount" style="color:${col}"><span class="euro" style="color:${col}">€</span></div></div>`;
  if (f.type === 'gasto') {
    h += `<div style="display:flex;flex-direction:column;gap:10px"><span class="lbl-sm">Categoría</span><div class="cats">${CAT_ORDER.map((k) =>
      `<button class="cat ${f.cat === k ? 'on' : ''}" data-act="f-cat" data-v="${k}" aria-pressed="${f.cat === k}"><span class="ic">${icon(CATS[k].path)}</span><span>${CATS[k].label}</span></button>`).join('')}</div></div>`;
  } else if (f.type === 'inversion') {
    if (data.positions.length) {
      h += `<div style="display:flex;flex-direction:column;gap:10px"><span class="lbl-sm">¿A qué posición?</span><div class="chips">${data.positions.map((p) =>
        `<button class="chip blue ${f.pos === p.id ? 'on' : ''}" data-act="f-pos" data-v="${p.id}" aria-pressed="${f.pos === p.id}">${esc(p.name)}</button>`).join('')}
        <button class="chip blue ${!f.pos ? 'on' : ''}" data-act="f-pos" data-v="" aria-pressed="${!f.pos}">Otra</button></div>
        <span class="xs muted">Se suma al aportado y al valor de esa posición.</span></div>`;
    } else {
      h += `<p class="small muted">Consejo: crea tus posiciones en Inversiones para que cada aportación se sume a su fondo o acción.</p>`;
    }
  } else {
    h += `<div style="display:flex;flex-direction:column;gap:10px"><span class="lbl-sm">Tipo de ingreso</span><div class="chips">${INC_TYPES.map((k) =>
      `<button class="chip ${f.inc === k ? 'on' : ''}" data-act="f-inc" data-v="${k}" aria-pressed="${f.inc === k}">${k}</button>`).join('')}</div>
      <span class="xs muted">Se suma a lo que te queda este mes (aparte del cobro).</span></div>`;
  }
  const ph = f.type === 'gasto' ? CATS[f.cat].long : f.type === 'inversion' ? ((data.positions.find((p) => p.id === f.pos) || {}).name || 'Ej. Trade Republic') : f.inc;
  h += `<div class="form">
    <label class="field"><span>Concepto</span><input data-field="concept" value="${esc(f.concept)}" placeholder="${esc(ph)}" autocomplete="off"></label>
    <label class="field"><span>Fecha</span><input type="date" data-field="date" value="${esc(f.date)}"></label>
  </div>
  <button class="primary" data-act="save-add" ${v > 0 ? '' : 'disabled'} style="${v > 0 ? 'background:' + col + ';color:' + inks[f.type] : ''}">${v > 0 ? labels[f.type] : 'Escribe un importe'}</button>
  </div>`;
  return h;
}

function sheetAP(f) {
  const p = data.pending[0];
  if (!p) return '';
  const t = totals(curKey());
  const cats = ['super', 'comida', 'gasolina', 'compras', 'hogar', 'perro', 'ocio', 'transporte', 'salud', 'otros'];
  return `<div class="backdrop" data-act="close"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Pago con Apple Pay">
  <div class="grabber"></div>
  <div class="row-between" style="align-items:center"><span class="chip" style="display:flex;align-items:center;gap:6px;min-height:30px;font-size:13px;font-weight:600">${icon(P.wallet, 16)}Apple Pay</span><span class="small muted">${esc(p.when || '')}</span></div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
    <span style="font-size:17px;font-weight:600;color:#D4D4D8">${esc(p.m)}</span>
    <span class="hero-amount" style="font-size:52px">${fmt(p.a)}</span></div>
  <div style="display:flex;flex-direction:column;gap:10px"><span class="lbl-sm">Categoría</span><div class="chips">${cats.map((k) =>
    `<button class="chip ${f.cat === k ? 'on' : ''}" data-act="f-cat" data-v="${k}" aria-pressed="${f.cat === k}">${CATS[k].long}</button>`).join('')}</div></div>
  <label class="box"><span>Usar siempre ${esc(CATS[f.cat].long)} para ${esc(p.m)}</span><input class="sw" type="checkbox" role="switch" data-field="remember" ${f.remember ? 'checked' : ''}></label>
  <div class="box"><span class="muted">Te quedan</span><span style="display:flex;align-items:center;gap:8px;font-size:15px"><span class="muted">${fmt(t.left)}</span><span class="muted">${icon(P.arrow, 16, 2)}</span><span class="green" style="font-weight:700">${fmt(t.left - p.a)}</span></span></div>
  <div style="display:flex;flex-direction:column;gap:6px">
    <button class="primary" data-act="ap-add">Añadir gasto</button>
    <button class="secondary" data-act="ap-ignore">No es un gasto</button></div>
  </div>`;
}

function sheetCobro(f) {
  const m = ensureMonth(f.month);
  const draft = parseAmount(f.cobro);
  const fixedOn = m.fixed.filter((x) => x.on).reduce((s, x) => s + x.amount, 0);
  const isCur = f.month === curKey();
  return `<div class="sheet full" role="dialog" aria-modal="true" aria-label="Cobro del mes">
  <div class="sheet-head"><button class="link" data-act="close" style="font-size:17px;gap:2px">${icon(P.back, 22, 2.2)}Volver</button><span></span></div>
  <div><div class="lbl-sm">Cobro y gastos fijos</div><h1 class="title" style="font-size:32px">${monthLabel(f.month)}</h1></div>
  <div class="card" style="gap:6px">
    <label for="f-cobro" style="font-size:15px;color:#D4D4D8">¿Cuánto has cobrado este mes?</label>
    <div class="amount-row" style="justify-content:flex-start"><input id="f-cobro" class="amount-in" style="text-align:left;width:210px;font-size:40px;color:var(--green)" inputmode="decimal" placeholder="0,00" autocomplete="off" data-field="cobro" value="${esc(f.cobro)}"><span class="euro green" style="font-size:32px">€</span></div>
    ${m.suggested && !f.cobro ? `<button class="chip" data-act="cobro-suggest" style="align-self:flex-start;background:var(--green-bg);color:#86EFAC;font-weight:600">Igual que el mes pasado (${fmt(m.suggested)})</button>` : ''}
  </div>
  <div><h2 class="h2">Periodo</h2><p class="small muted">Los gastos con fecha dentro de este periodo cuentan para ${monthName(f.month)}. Cambiar el final mueve el inicio del mes siguiente.</p></div>
  <div class="form">
    <label class="field"><span>Empieza</span><input type="date" data-field="pStart" value="${esc(f.pStart)}"></label>
    <label class="field"><span>Termina</span><input type="date" data-field="pEnd" value="${esc(f.pEnd)}"></label>
  </div>
  ${data.starts && (data.starts[f.month] || data.starts[shiftMonth(f.month, 1)]) ? `<button class="link" data-act="period-reset" style="align-self:flex-start;font-size:15px">Volver a usar el día de cobro</button>` : ''}
  <div><h2 class="h2">Gastos fijos</h2><p class="small muted">Se descuentan solos cada mes. ${isCur ? 'Los cambios valen también para los meses siguientes.' : 'Solo cambian este mes.'}</p></div>
  ${m.fixed.length ? `<ul class="list">${m.fixed.map((x) => `<li class="setrow">
      <label style="display:flex;align-items:center;gap:12px;flex-grow:1;min-width:0;cursor:pointer"><span style="flex-grow:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.label)}</span><span style="color:#D4D4D8">${fmt(x.amount)}</span><input class="sw" type="checkbox" role="switch" data-act="fixed-toggle" data-id="${x.id}" ${x.on ? 'checked' : ''} aria-label="Incluir ${esc(x.label)}"></label>
      <button data-act="fixed-del" data-id="${x.id}" aria-label="Eliminar ${esc(x.label)}" style="color:var(--text3);width:32px;height:44px;display:flex;align-items:center;justify-content:center">${icon(P.trash, 17)}</button></li>`).join('')}</ul>` : `<div class="empty">Añade tu hipoteca, préstamos, recibos…</div>`}
  <div class="form">
    <label class="field"><span>Nuevo fijo</span><input data-field="fxLabel" value="${esc(f.fxLabel)}" placeholder="Ej. Hipoteca" autocomplete="off"></label>
    <label class="field"><span>Importe al mes</span><input data-field="fxAmount" value="${esc(f.fxAmount)}" placeholder="0,00 €" inputmode="decimal" autocomplete="off"></label>
  </div>
  <button class="secondary" data-act="fixed-add" style="background:var(--card);color:var(--green);font-weight:600">${icon(P.plus, 18, 2.2)} Añadir gasto fijo</button>
  <div class="card" style="gap:10px">
    <div class="row-between" style="font-size:15px"><span class="muted">Cobrado</span><span id="sum-cobro">${fmt(draft)}</span></div>
    <div class="row-between" style="font-size:15px"><span class="muted">Gastos fijos</span><span class="orange">${fmt(-fixedOn)}</span></div>
    <div class="divider"></div>
    <div class="row-between"><span style="font-size:15px;font-weight:600">Empiezas el mes con</span><span style="font-size:26px;font-weight:700;white-space:nowrap" class="green" id="sum-start" data-fixed="${fixedOn}">${fmt(draft - fixedOn)}</span></div>
  </div>
  <button class="primary" data-act="save-cobro">Guardar</button>
  </div>`;
}

function sheetMov(f) {
  const m = data.months[f.month];
  const x = m && m.movs.find((y) => y.id === f.id);
  if (!x) return '';
  const kindL = x.kind === 'gasto' ? (CATS[x.cat] || CATS.otros).long : x.kind === 'inv' ? 'Inversión' : 'Ingreso';
  return `<div class="backdrop" data-act="close"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Movimiento">
  <div class="grabber"></div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
    <span style="font-size:17px;font-weight:600;color:#D4D4D8">${esc(x.title)}</span>
    <span class="hero-amount" style="font-size:44px">${x.kind === 'gasto' ? fmt(-x.amount) : fmt(x.amount)}</span>
    <span class="small muted">${esc(kindL)} · ${esc(x.via)} · ${dateLabel(x.date)}</span></div>
  <button class="secondary danger" data-act="mov-del" style="background:var(--card2)">${icon(P.trash, 18)} Eliminar movimiento</button>
  <button class="secondary" data-act="close">Cerrar</button>
  </div>`;
}

function sheetPos(f) {
  return `<div class="backdrop" data-act="close"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Posición">
  <div class="grabber"></div>
  <h2 class="h2">${f.id ? 'Editar posición' : 'Nueva posición'}</h2>
  <div class="form">
    <label class="field"><span>Nombre</span><input data-field="name" value="${esc(f.name)}" placeholder="Ej. Apple, Cartera Indie" autocomplete="off"></label>
    <label class="field"><span>Plataforma</span><input data-field="platform" value="${esc(f.platform)}" placeholder="Ej. Trade Republic" list="plats" autocomplete="off"></label>
    <label class="field"><span>Detalle</span><input data-field="note" value="${esc(f.note)}" placeholder="Ej. 1 acción, fondo indexado" autocomplete="off"></label>
    <label class="field"><span>Total aportado</span><input data-field="aportado" value="${esc(f.aportado)}" placeholder="0,00 €" inputmode="decimal" autocomplete="off"></label>
    <label class="field"><span>Valor actual</span><input data-field="valor" value="${esc(f.valor)}" placeholder="0,00 €" inputmode="decimal" autocomplete="off"></label>
  </div>
  <datalist id="plats">${[...new Set(data.positions.map((p) => p.platform))].map((p) => `<option value="${esc(p)}">`).join('')}</datalist>
  <button class="primary" data-act="save-pos">Guardar</button>
  ${f.id ? `<button class="secondary danger" data-act="pos-del">Eliminar posición</button>` : ''}
  </div>`;
}

function sheetHelpAP() {
  return `<div class="sheet full" role="dialog" aria-modal="true" aria-label="Configurar Apple Pay">
  <div class="sheet-head"><button class="link" data-act="close" style="font-size:17px;gap:2px">${icon(P.back, 22, 2.2)}Volver</button><span></span></div>
  <h1 class="title" style="font-size:28px">Detectar pagos con Apple Pay</h1>
  <p class="muted" style="line-height:1.45">iOS no deja que una web app lea tus pagos. Con una automatización de <b>Atajos</b>, cada vez que pagues con el iPhone se copia el pago y te llega un aviso. Al abrir Mis Cuentas, pulsa <b>Pegar pago</b> y lo añades en un toque.</p>
  <ol class="steps">
    <li>Abre <b>Atajos</b> → pestaña <b>Automatización</b> → <b>+</b> → <b>Transacción</b>.</li>
    <li>Elige tus tarjetas, marca <b>Ejecutar inmediatamente</b> y pulsa <b>Siguiente</b> → <b>Nueva automatización en blanco</b>.</li>
    <li>Añade la acción <b>Texto</b>. Escribe <span class="code">ApplePay|</span>, pulsa <b>Entrada del atajo</b> en la barra de variables, tócala y elige <b>Comercio</b>. Escribe <span class="code">|</span> y repite eligiendo <b>Importe</b>.<br><span class="xs muted">Comercio e Importe deben verse como fichas de color, no escritos a mano.</span></li>
    <li>Añade <b>Copiar al portapapeles</b>.</li>
    <li>Añade <b>Mostrar notificación</b> y pon como texto la variable <b>Texto</b> del paso 3. Así ves en el aviso lo que se ha copiado.</li>
    <li>Después de pagar, abre la app y pulsa <b>Pegar pago</b> arriba a la derecha. La primera vez iOS te pedirá permiso para pegar.</li>
  </ol>
  <p class="small muted" style="line-height:1.4">También puedes pegar texto como «Mercadona 43,27» copiado de cualquier sitio.</p>
  <button class="primary" data-act="close">Entendido</button>
  </div>`;
}

// ---------- Acciones ----------
function openAdd(type) {
  const firstPos = data.positions[0];
  openSheet('add', { type, amount: '', concept: '', date: todayISO(), cat: 'super', inc: 'Nómina', pos: type === 'inversion' && firstPos ? firstPos.id : '' });
  setTimeout(() => { const i = $('#f-amount'); if (i) i.focus(); }, 60);
}
function openAP() {
  const p = data.pending[0];
  if (!p) return;
  openSheet('ap', { cat: data.rules[p.m.toLowerCase()] || data.rules[p.m] || guessCat(p.m), remember: true });
}
function guessCat(m) {
  const s = m.toLowerCase();
  const table = [
    ['super', ['mercadona', 'carrefour', 'lidl', 'aldi', 'dia', 'eroski', 'alcampo', 'consum', 'hipercor', 'supermerc', 'bonpreu', 'caprabo', 'ahorramas', 'froiz', 'gadis', 'mas y mas']],
    ['gasolina', ['repsol', 'cepsa', 'galp', 'bp ', 'shell', 'petronor', 'ballenoil', 'plenoil', 'gasolin', 'moeve']],
    ['comida', ['bar ', 'rest', 'café', 'cafe', 'burger', 'mcdonald', 'kfc', 'telepizza', 'domino', 'starbucks', 'tagliatella', 'vips', 'goiko', 'glovo', 'just eat', 'uber eats']],
    ['perro', ['tiendanimal', 'kiwoko', 'zooplus', 'veterin']],
    ['transporte', ['renfe', 'metro', 'uber', 'cabify', 'bolt', 'emt', 'bus', 'parking', 'aparcamiento', 'peaje']],
    ['compras', ['zara', 'amazon', 'primark', 'decathlon', 'mango', 'h&m', 'ikea', 'fnac', 'mediamarkt', 'el corte']],
    ['ocio', ['cine', 'yelmo', 'cinesa', 'spotify', 'netflix', 'teatro', 'concierto']],
    ['salud', ['farmacia', 'clinica', 'clínica', 'dentist', 'óptica', 'optica']]
  ];
  for (const [cat, words] of table) if (words.some((w) => s.includes(w))) return cat;
  return 'otros';
}
function parseClipboard(text) {
  const tx = String(text || '').trim();
  if (!tx) return null;
  let merchant = '', amount = 0;
  const parts = tx.split('|').map((x) => x.trim());
  if (parts.length >= 3 && /apple\s*pay/i.test(parts[0])) {
    merchant = parts[1]; amount = parseAmount(parts[2]);
  } else if (parts.length === 2) {
    merchant = parts[0]; amount = parseAmount(parts[1]);
  } else {
    const mm = tx.match(/(-?\d{1,3}(?:[.\s]\d{3})*(?:[.,]\d{1,2})|-?\d+(?:[.,]\d{1,2})?)\s*€?/);
    if (mm) {
      amount = parseAmount(mm[1]);
      merchant = tx.replace(mm[0], '').replace(/[|€]/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
  if (!(amount > 0)) return null;
  return { m: merchant || 'Pago con Apple Pay', a: amount };
}
async function pastePayment() {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
  } catch (e) {
    toast('No se pudo leer el portapapeles');
    return;
  }
  const p = parseClipboard(text);
  if (!p) {
    const seen = String(text || '').trim();
    toast(seen ? 'No entiendo lo copiado: «' + (seen.length > 40 ? seen.slice(0, 40) + '…' : seen) + '»' : 'El portapapeles está vacío: el atajo no se ha ejecutado');
    return;
  }
  const d = new Date();
  p.when = `Hoy, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  p.id = uid();
  data.pending.push(p);
  save();
  render();
  openAP();
  try { await navigator.clipboard.writeText(''); } catch (e) { /* no pasa nada */ }
}
function addMov(mov) {
  const key = periodKeyOf(mov.date);
  ensureMonth(key).movs.push(Object.assign({ id: uid(), created: String(Date.now()) }, mov));
  save();
}

function handleAction(el, ev) {
  const act = el.dataset.act;
  const f = ui.form;
  switch (act) {
    case 'tab':
      ui.tab = el.dataset.tab; ui.histKey = null; render(); break;
    case 'add':
      openAdd(el.dataset.type || 'gasto'); break;
    case 'close':
      closeSheet(); break;
    case 'f-type': f.type = el.dataset.v; renderSheet(); break;
    case 'f-cat': f.cat = el.dataset.v; renderSheet(); break;
    case 'f-inc': f.inc = el.dataset.v; renderSheet(); break;
    case 'f-pos': f.pos = el.dataset.v; renderSheet(); break;
    case 'save-add': {
      const v = parseAmount(f.amount);
      if (!(v > 0)) return;
      const date = /^\d{4}-\d{2}-\d{2}$/.test(f.date) ? f.date : todayISO();
      if (f.type === 'gasto') {
        addMov({ kind: 'gasto', cat: f.cat, title: f.concept.trim() || CATS[f.cat].long, via: 'Manual', date, amount: v });
        toast('Gasto añadido: ' + fmt(-v));
      } else if (f.type === 'inversion') {
        const pos = data.positions.find((p) => p.id === f.pos);
        if (pos) { pos.aportado = round2(pos.aportado + v); pos.valor = round2(pos.valor + v); }
        addMov({ kind: 'inv', title: f.concept.trim() || (pos ? pos.name : 'Inversión'), via: pos ? pos.platform : 'Aportación', date, amount: v, pos: pos ? pos.id : null });
        toast('Inversión añadida: ' + fmt(v));
      } else {
        addMov({ kind: 'ing', title: f.concept.trim() || f.inc, via: 'Manual', date, amount: v });
        toast('Ingreso añadido: +' + fmt(v));
      }
      ui.sheet = null; ui.form = {}; render();
      break;
    }
    case 'paste': pastePayment(); break;
    case 'ap': openAP(); break;
    case 'ap-add': {
      const p = data.pending.shift();
      if (p) {
        if (f.remember) data.rules[p.m.toLowerCase()] = f.cat;
        addMov({ kind: 'gasto', cat: f.cat, title: p.m, via: 'Apple Pay', date: todayISO(), amount: p.a });
        toast('Gasto añadido: ' + fmt(-p.a));
      }
      save(); ui.sheet = null; render();
      if (data.pending.length) openAP();
      break;
    }
    case 'ap-ignore':
      data.pending.shift(); save(); ui.sheet = null; render(); toast('Pago descartado');
      if (data.pending.length) openAP();
      break;
    case 'cobro': {
      const key = el.dataset.month || curKey();
      const m = ensureMonth(key);
      openSheet('cobro', { month: key, cobro: m.cobro == null ? '' : fmtNum(m.cobro), fxLabel: '', fxAmount: '', pStart: startISO(key), pEnd: endISO(key) });
      break;
    }
    case 'cobro-suggest': {
      const m = ensureMonth(f.month); f.cobro = fmtNum(m.suggested); renderSheet(); break;
    }
    case 'fixed-add': {
      const label = (f.fxLabel || '').trim(), amount = parseAmount(f.fxAmount);
      if (!label || !(amount > 0)) { toast('Escribe nombre e importe'); return; }
      const item = { id: uid(), label, amount, on: true };
      ensureMonth(f.month).fixed.push(Object.assign({}, item));
      if (f.month === curKey()) data.fixed.push(item);
      f.fxLabel = ''; f.fxAmount = '';
      save(); renderSheet(); break;
    }
    case 'fixed-del': {
      const id = el.dataset.id, m = ensureMonth(f.month);
      m.fixed = m.fixed.filter((x) => x.id !== id);
      if (f.month === curKey()) data.fixed = data.fixed.filter((x) => x.id !== id);
      save(); renderSheet(); break;
    }
    case 'save-cobro': {
      if (f.pStart !== startISO(f.month) || f.pEnd !== endISO(f.month)) {
        const err = setPeriod(f.month, f.pStart, f.pEnd);
        if (err) { toast(err); return; }
        rebucket();
      }
      const m = ensureMonth(f.month);
      m.cobro = f.cobro === '' ? null : parseAmount(f.cobro);
      save(); ui.sheet = null; render(); toast('Guardado'); break;
    }
    case 'period-reset': {
      delete data.starts[f.month]; delete data.starts[shiftMonth(f.month, 1)];
      rebucket(); save();
      f.pStart = startISO(f.month); f.pEnd = endISO(f.month);
      renderSheet(); toast('Periodo según el día de cobro'); break;
    }
    case 'hist-month': ui.tab = 'historial'; ui.histKey = el.dataset.month; render(); break;
    case 'hist-back': ui.histKey = null; render(); break;
    case 'mov': openSheet('mov', { id: el.dataset.id, month: el.dataset.month }); break;
    case 'mov-del': {
      const m = data.months[f.month];
      const x = m && m.movs.find((y) => y.id === f.id);
      if (x) {
        if (x.kind === 'inv' && x.pos) {
          const pos = data.positions.find((p) => p.id === x.pos);
          if (pos) { pos.aportado = round2(pos.aportado - x.amount); pos.valor = round2(pos.valor - x.amount); }
        }
        m.movs = m.movs.filter((y) => y.id !== f.id);
        save();
      }
      ui.sheet = null; render(); toast('Movimiento eliminado'); break;
    }
    case 'pos-new': openSheet('pos', { name: '', platform: '', note: '', aportado: '', valor: '' }); break;
    case 'pos': {
      const p = data.positions.find((x) => x.id === el.dataset.id);
      if (p) openSheet('pos', { id: p.id, name: p.name, platform: p.platform, note: p.note || '', aportado: fmtNum(p.aportado), valor: fmtNum(p.valor) });
      break;
    }
    case 'save-pos': {
      const name = (f.name || '').trim();
      if (!name) { toast('Ponle un nombre'); return; }
      const rec = { name, platform: (f.platform || '').trim() || 'Sin plataforma', note: (f.note || '').trim(), aportado: parseAmount(f.aportado), valor: f.valor === '' ? parseAmount(f.aportado) : parseAmount(f.valor) };
      if (f.id) Object.assign(data.positions.find((x) => x.id === f.id), rec);
      else data.positions.push(Object.assign({ id: uid() }, rec));
      save(); ui.sheet = null; render(); toast('Posición guardada'); break;
    }
    case 'pos-del':
      data.positions = data.positions.filter((x) => x.id !== f.id);
      save(); ui.sheet = null; render(); toast('Posición eliminada'); break;
    case 'help-ap': openSheet('help-ap'); break;
    case 'rule-del': delete data.rules[el.dataset.rule]; save(); render(); break;
    case 'export': exportData(); break;
    case 'wipe':
      if (confirm('¿Borrar todos los datos de este dispositivo? No se puede deshacer.')) {
        data = emptyData(); save(); ui.tab = 'inicio'; render(); toast('Datos borrados');
      }
      break;
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const name = `mis-cuentas-${todayISO()}.json`;
  const file = new File([blob], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'Copia de Mis Cuentas' }).catch(() => {});
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function importData(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d || typeof d !== 'object' || !d.months) throw new Error('formato');
      if (!confirm('¿Reemplazar los datos actuales por los de la copia?')) return;
      data = Object.assign(emptyData(), d);
      save(); render(); toast('Copia importada');
    } catch (e) { toast('El archivo no es una copia válida'); }
  };
  r.readAsText(file);
}

// ---------- Eventos ----------
app.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || !app.contains(el)) return;
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT') return; // se gestionan en 'change'
  handleAction(el, ev);
});
app.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.dataset.field && ui.sheet) {
    ui.form[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.field === 'cobro' && ui.sheet === 'cobro') {
      const v = parseAmount(el.value), st = document.getElementById('sum-start'), sc = document.getElementById('sum-cobro');
      if (sc) sc.textContent = fmt(v);
      if (st) st.textContent = fmt(v - parseFloat(st.dataset.fixed || '0'));
    }
    if (el.dataset.field === 'amount' && ui.sheet === 'add') {
      // actualiza solo el botón para no perder el foco
      const btn = app.querySelector('[data-act="save-add"]');
      const v = parseAmount(el.value);
      const colors = { gasto: ['var(--orange)', 'var(--orange-ink)'], inversion: ['var(--blue)', 'var(--blue-ink)'], ingreso: ['var(--green)', 'var(--green-ink)'] }[ui.form.type];
      const labels = { gasto: 'Guardar gasto', inversion: 'Guardar inversión', ingreso: 'Guardar ingreso' };
      if (btn) {
        btn.disabled = !(v > 0);
        btn.textContent = v > 0 ? labels[ui.form.type] : 'Escribe un importe';
        btn.style.background = v > 0 ? colors[0] : '';
        btn.style.color = v > 0 ? colors[1] : '';
      }
    }
  }
});
app.addEventListener('change', (ev) => {
  const el = ev.target;
  const act = el.dataset.act;
  if (el.dataset.field === 'remember') { ui.form.remember = el.checked; return; }
  if (el.dataset.field && ui.sheet && el.type === 'date') { ui.form[el.dataset.field] = el.value; return; }
  if (act === 'inv-subtract') { data.invSubtract = el.checked; save(); return; }
  if (act === 'payday') {
    data.payday = parseInt(el.value, 10) || 1; rebucket(); save(); render();
    toast(payDay() === 1 ? 'Mes natural' : 'Cobro el día ' + payDay() + ': ' + periodRange(curKey()));
    return;
  }
  if (act === 'paynext') { data.payNext = el.checked; rebucket(); save(); render(); return; }
  if (act === 'fixed-toggle') {
    const m = ensureMonth(ui.form.month);
    const x = m.fixed.find((y) => y.id === el.dataset.id);
    if (x) x.on = el.checked;
    if (ui.form.month === curKey()) { const g = data.fixed.find((y) => y.id === el.dataset.id); if (g) g.on = el.checked; }
    save(); renderSheet(); return;
  }
  if (act === 'import' && el.files && el.files[0]) { importData(el.files[0]); el.value = ''; return; }
});
app.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && ev.target.tagName === 'INPUT' && ui.sheet === 'add') {
    const btn = app.querySelector('[data-act="save-add"]');
    if (btn && !btn.disabled) { ev.target.blur(); handleAction(btn, ev); }
  }
});
// Al volver a la app, si ha cambiado el mes, se crea el nuevo automáticamente.
document.addEventListener('visibilitychange', () => { if (!document.hidden && !ui.sheet) render(); });

render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
