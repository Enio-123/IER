// Estado do app salvo no próprio aparelho (IndexedDB), com exportação e importação de backup.
const DB_NAME = 'ier';
const KEY = 'estado';
const VERSAO = 1;

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const hojeStr = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const addDias = (str, n) => {
  const d = new Date(str + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return hojeStr(d);
};
export const diffDias = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);

function estadoInicial() {
  return {
    v: VERSAO,
    criado: Date.now(),
    perfil: {
      nome: '',
      dataProva: '2026-11-08', // ENEM 2026: redação no 1º dia
      tempoRedacao: 60,        // minutos para a redação completa
      tempoParagrafo: 10,      // minutos para o treino de parágrafo
      charsLinha: 65,          // caracteres por linha manuscrita (estimativa ajustável)
      tema: 'claro',
    },
    // {id, tipo:'completa'|'paragrafo', parte, tema, texto, criado, editado, seg, limite, fim, check:{}, notas:{auto,ia,prof}, iaTexto}
    redacoes: [],
    // {id, tema, agente, acao, meio, efeito, detalhe, texto, criado}
    propostas: [],
    // respostas do Corretor por um dia: {id, notas:[5], em}
    corretor: [],
    dias: {},
  };
}

function abrir() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

let db = null;
export let S = null;
let timer = null;
const ouvintes = new Set();

export async function carregar() {
  try {
    db = await abrir();
    S = await new Promise((res) => {
      const t = db.transaction('kv').objectStore('kv').get(KEY);
      t.onsuccess = () => res(t.result || null);
      t.onerror = () => res(null);
    });
  } catch (e) {
    console.warn('IndexedDB indisponível, usando localStorage', e);
    try { S = JSON.parse(localStorage.getItem(DB_NAME) || 'null'); } catch { S = null; }
  }
  if (!S) { S = estadoInicial(); salvarJa(); }
  migrar();
  return S;
}

function migrar() {
  const base = estadoInicial();
  for (const k of Object.keys(base)) if (S[k] === undefined) S[k] = base[k];
  for (const k of Object.keys(base.perfil)) if (S.perfil[k] === undefined) S.perfil[k] = base.perfil[k];
}

function salvarJa() {
  if (db) {
    const t = db.transaction('kv', 'readwrite');
    t.objectStore('kv').put(S, KEY);
  } else {
    try { localStorage.setItem(DB_NAME, JSON.stringify(S)); } catch (e) { console.warn(e); }
  }
}

export function salvar() {
  clearTimeout(timer);
  timer = setTimeout(salvarJa, 250);
  ouvintes.forEach((f) => f());
}
// Salva sem avisar a tela (usado enquanto ela digita).
export function salvarQuieto() {
  clearTimeout(timer);
  timer = setTimeout(salvarJa, 400);
}
export const aoMudar = (f) => { ouvintes.add(f); return () => ouvintes.delete(f); };

export function registrarDia(min = 0) {
  const d = hojeStr();
  S.dias[d] = S.dias[d] || { min: 0, textos: 0 };
  S.dias[d].min += min;
  S.dias[d].textos += 1;
}

export function sequencia() {
  // Dias seguidos com alguma escrita. Hoje ainda sem escrita não quebra a sequência.
  const ativo = (d) => !!S.dias[d];
  let d = hojeStr();
  if (!ativo(d)) d = addDias(d, -1);
  let n = 0;
  while (ativo(d)) { n++; d = addDias(d, -1); }
  return n;
}

export function exportar() {
  const blob = new Blob([JSON.stringify(S)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ier-backup-${hojeStr()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function importar(arquivo) {
  const novo = JSON.parse(await arquivo.text());
  if (!novo || typeof novo !== 'object' || !novo.perfil || !Array.isArray(novo.redacoes)) throw new Error('Arquivo não parece um backup do IER.');
  S = novo; migrar(); salvarJa(); ouvintes.forEach((f) => f());
}

export function zerar() {
  S = estadoInicial(); salvarJa(); ouvintes.forEach((f) => f());
}
