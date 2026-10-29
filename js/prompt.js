// Pedido de correção para uma IA (Claude ou ChatGPT), com a rubrica oficial do INEP.
// A resposta volta para o app com a linha NOTAS, que é lida automaticamente.
import { COMPETENCIAS, ELEMENTOS } from './dados/matriz.js';
import { paragrafosDe } from './analise.js';
import { PARTES } from './dados/checklist.js';

const rubrica = () => COMPETENCIAS.map((c) => `Competência ${c.n}: ${c.titulo}\n${[200, 160, 120, 80, 40, 0].map((n) => `  ${n}: ${c.niveis[n]}`).join('\n')}`).join('\n\n');

export function pedidoCorrecao(r) {
  const pars = paragrafosDe(r.texto);
  const texto = pars.map((p, i) => `[§${i + 1}] ${p}`).join('\n\n');
  if (r.tipo === 'paragrafo') {
    const parte = PARTES[r.parte]?.rot || 'Parágrafo';
    return `Você é avaliador(a) da redação do ENEM, treinado(a) pelo INEP. Avalie só este parágrafo de ${parte.toLowerCase()} de uma redação dissertativo-argumentativa.

Tema: "${r.tema}"

${parte}:
${texto}

Diga, em português, de forma direta:
1. O que está bom, citando o trecho.
2. O que tiraria ponto e em qual competência do ENEM (1 a 5), citando o trecho.
3. Todos os desvios de norma culta, com a correção.
${r.parte === 'conclusao' ? `4. Quais dos 5 elementos da proposta de intervenção aparecem (${ELEMENTOS.map((e) => e.rot.toLowerCase()).join(', ')}) e quais faltam.\n5.` : '4.'} Uma versão reescrita do parágrafo, mantendo as ideias da aluna.

Não invente dados nem citações. Se sugerir repertório, só use fatos verificáveis e diga a fonte.`;
  }
  return `Você é avaliador(a) da redação do ENEM, treinado(a) pelo INEP. Corrija a redação abaixo com a Matriz de Referência oficial, como no espelho de correção. Seja rigoroso(a) como a banca: só dê 200 quando o descritor do nível 200 for cumprido.

Tema: "${r.tema}"

Redação (${pars.length} parágrafos, numerados para referência):
${texto}

Matriz de Referência (níveis de cada competência):
${rubrica()}

Responda em português, nesta ordem:
1. Para cada competência: a nota (0, 40, 80, 120, 160 ou 200), o motivo em 2 a 4 frases e os trechos que tiraram ponto, citados entre aspas.
2. Competência 1: liste cada desvio de norma culta com a correção.
3. Competência 5: diga quais dos 5 elementos aparecem (${ELEMENTOS.map((e) => e.rot.toLowerCase()).join(', ')}) e quais faltam.
4. As 3 mudanças que mais aumentariam a nota.
5. Na última linha, exatamente neste formato: NOTAS: C1=000; C2=000; C3=000; C4=000; C5=000

Não invente dados nem citações. Se sugerir repertório, só use fatos verificáveis e diga a fonte.`;
}

// Lê "NOTAS: C1=160; C2=200; ..." da resposta colada.
export function lerNotas(txt) {
  const m = String(txt || '').toUpperCase().match(/C\s*1\s*[=:]\s*(\d{1,3})[\s\S]{0,20}?C\s*2\s*[=:]\s*(\d{1,3})[\s\S]{0,20}?C\s*3\s*[=:]\s*(\d{1,3})[\s\S]{0,20}?C\s*4\s*[=:]\s*(\d{1,3})[\s\S]{0,20}?C\s*5\s*[=:]\s*(\d{1,3})/);
  if (!m) return null;
  const n = m.slice(1).map(Number);
  return n.every((x) => [0, 40, 80, 120, 160, 200].includes(x)) ? n : null;
}

export const linkClaude = (p) => 'https://claude.ai/new?q=' + encodeURIComponent(p);
export const linkChatGPT = (p) => 'https://chatgpt.com/?q=' + encodeURIComponent(p);
