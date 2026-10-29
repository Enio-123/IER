// Regras comuns das redações: criação, nota final e escolha de tema.
import { S, uid, salvar } from './store.js';
import { TEMAS } from './dados/temas.js';
import { total, discrepancia } from './dados/matriz.js';

export function nova({ tipo = 'completa', parte = null, tema, limite = null, texto = '', origem = null }) {
  const r = { id: uid(), tipo, parte, tema, texto, criado: Date.now(), editado: Date.now(), seg: 0, limite, fim: null, check: {}, notas: { auto: null, ia: null, prof: null }, iaTexto: '', origem };
  S.redacoes.unshift(r);
  salvar();
  return r;
}

export const achar = (id) => S.redacoes.find((r) => r.id === id);
export const sortearTema = () => TEMAS[Math.floor(Math.random() * TEMAS.length)].tema;

// Nota final: média das correções de fora (IA e professor), como a média dos dois avaliadores do ENEM.
// Sem correção de fora, vale a autoavaliação.
const cheia = (n) => (n && n.length === 5 && n.every((x) => typeof x === 'number') ? n : null);
export const notasCompletas = (r) => ({ auto: cheia(r.notas.auto), ia: cheia(r.notas.ia), prof: cheia(r.notas.prof) });

export function notaFinal(r) {
  const n = notasCompletas(r);
  const fora = [n.ia, n.prof].filter(Boolean);
  const base = fora.length ? fora : (n.auto ? [n.auto] : []);
  if (!base.length) return null;
  const comps = [0, 1, 2, 3, 4].map((i) => Math.round(base.reduce((s, n) => s + n[i], 0) / base.length));
  return { comps, total: total(comps), fonte: fora.length ? (fora.length === 2 ? 'média IA e professor' : n.prof ? 'professor' : 'IA') : 'autoavaliação' };
}

// Pares de correção que discordam além do limite do INEP.
export function discrepancias(r) {
  const n = notasCompletas(r), out = [];
  if (n.auto && n.ia && discrepancia(n.auto, n.ia)) out.push('sua autoavaliação e a IA');
  if (n.auto && n.prof && discrepancia(n.auto, n.prof)) out.push('sua autoavaliação e o professor');
  if (n.ia && n.prof && discrepancia(n.ia, n.prof)) out.push('a IA e o professor');
  return out;
}

export const situacao = (r) => (!r.fim ? 'Rascunho' : r.tipo === 'paragrafo' ? (r.iaTexto ? 'Com correção' : 'Feito') : notaFinal(r) ? 'Corrigida' : 'Para corrigir');
export const completas = () => S.redacoes.filter((r) => r.tipo === 'completa');
