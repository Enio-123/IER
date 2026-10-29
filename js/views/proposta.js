// Montador de proposta de intervenção: os 5 elementos que a Competência 5 avalia.
import { S, uid, salvar } from '../store.js';
import { ic } from '../icons.js';
import { esc, toast, copiar, confirmar, fmtData } from '../ui.js';
import { ELEMENTOS, COMPETENCIAS } from '../dados/matriz.js';
import { TEMAS } from '../dados/temas.js';
import { sortearTema } from '../redacao.js';
import { pistasProposta } from '../analise.js';
import { linkClaude, linkChatGPT } from '../prompt.js';

// Exemplos de forma (como escrever cada elemento), não de conteúdo para copiar.
const DICAS = {
  acao: 'Um verbo concreto: criar, ampliar, fiscalizar, incluir, divulgar…',
  agente: 'Quem tem poder para fazer: um ministério, as escolas, a mídia, as ONGs, o Congresso… Evite "alguém" ou "todos".',
  meio: 'Como: "por meio de…", "mediante…", "com o auxílio de…".',
  efeito: 'Para quê: "a fim de…", "para que…", "com o intuito de…".',
  detalhe: 'Uma informação a mais sobre um dos elementos: explique o agente, a ação ou o meio.',
};
const VAGOS = ['alguém', 'alguem', 'todos', 'todo mundo', 'eles', 'a gente', 'as pessoas'];

const vazioP = () => ({ id: null, tema: '', acao: '', agente: '', meio: '', efeito: '', detalhe: '', texto: '' });

function montar(p) {
  const v = (k, ph) => (p[k].trim() ? `<mark>${esc(p[k].trim())}</mark>` : `<span class="vaz">[${ph}]</span>`);
  return `Portanto, ${v('agente', 'agente')} deve ${v('acao', 'ação')}, ${v('meio', 'modo/meio')}, ${v('efeito', 'efeito/finalidade')}. ${v('detalhe', 'detalhamento')}`;
}
const montarTexto = (p) => {
  const t = (k) => p[k].trim();
  const frase = [t('agente') && t('acao') ? `${t('agente')} deve ${t('acao')}` : t('agente') || t('acao'), t('meio'), t('efeito')].filter(Boolean).join(', ');
  return [frase ? `Portanto, ${frase}.` : '', t('detalhe')].filter(Boolean).join(' ').replace(/\.\./g, '.');
};

function estadoElemento(k, val) {
  const t = val.trim();
  if (!t) return { ok: false, txt: 'vazio' };
  if (k === 'agente' && VAGOS.some((w) => t.toLowerCase() === w || t.toLowerCase().startsWith(w + ' '))) return { ok: false, txt: 'agente vago' };
  if (t.split(/\s+/).length < 2) return { ok: false, txt: 'curto demais' };
  return { ok: true, txt: 'ok' };
}

function pedidoIA(p, texto) {
  const c5 = COMPETENCIAS[4];
  return `Você é avaliador(a) da redação do ENEM. Avalie só a proposta de intervenção abaixo pela Competência 5.

Tema: "${p.tema}"

Proposta:
${texto}

Níveis oficiais da Competência 5:
${[200, 160, 120, 80, 40, 0].map((n) => `${n}: ${c5.niveis[n]}`).join('\n')}

Diga: quais dos 5 elementos aparecem (ação, agente, modo/meio, efeito/finalidade, detalhamento), citando o trecho de cada um; o que falta ou está vago; se a proposta se liga ao tema e respeita os direitos humanos; e uma versão melhorada mantendo as ideias. Não invente dados.`;
}

export function render(el, [id]) {
  let p = id ? { ...(S.propostas.find((x) => x.id === id) || vazioP()) } : vazioP();
  if (!p.tema) p.tema = sortearTema();

  const pintar = () => {
    el.innerHTML = `
      <div class="topo-pagina"><div><h1>Montar proposta</h1><p>A Competência 5 vale 200 pontos. Preencha os 5 elementos e veja a proposta tomar forma.</p></div>
        ${p.id ? `<a class="btn" href="#/proposta">${ic('plus', 16)}Nova proposta</a>` : ''}</div>
      <div class="cartao grade" style="gap:10px">
        <label class="campo">Tema<input type="text" id="tema" list="temas-of" value="${esc(p.tema)}"></label>
        <datalist id="temas-of">${TEMAS.map((t) => `<option value="${esc(t.tema)}">`).join('')}</datalist>
        <div><button class="btn peq" id="sortear">${ic('rotate-ccw', 14)}Sortear tema oficial</button></div>
      </div>
      <div class="grade g2 secao" style="align-items:start">
        <div class="cartao grade">${ELEMENTOS.map((e) => { const s = estadoElemento(e.k, p[e.k]); return `
          <div class="elemento"><div class="entre"><b>${esc(e.rot)}</b><span class="estado-el ${s.ok ? 'ok' : ''}" id="st-${e.k}">${s.ok ? ic('check', 14) : ''}${esc(s.txt)}</span></div>
            <span class="sub">${esc(e.pergunta)}</span>
            <textarea rows="2" data-k="${e.k}" placeholder="${esc(DICAS[e.k])}" style="min-height:60px">${esc(p[e.k])}</textarea></div>`; }).join('')}
        </div>
        <div class="grade" style="position:sticky;top:76px">
          <div class="cartao grade"><div class="entre"><h2>Prévia</h2><span class="sub" id="cont"></span></div><div class="previa" id="previa">${montar(p)}</div>
            <p class="mini">Modelo de encaixe. Depois ajuste a redação no campo abaixo para soar natural.</p></div>
          <div class="cartao grade">
            <label class="campo">Texto final da proposta<textarea id="texto" rows="6">${esc(p.texto)}</textarea></label>
            <div class="linha-acoes" style="margin:0"><button class="btn" id="usar">${ic('rotate-ccw', 16)}Usar a prévia</button><button class="btn primario" id="salvar">${ic('check', 16)}Salvar</button></div>
            <div id="pistas"></div>
            <div class="linha-acoes" style="margin:0"><a class="btn peq" id="claude" target="_blank" rel="noopener">${ic('external-link', 14)}Avaliar no Claude</a><a class="btn peq" id="gpt" target="_blank" rel="noopener">${ic('external-link', 14)}Avaliar no ChatGPT</a><button class="btn peq" id="copiar">${ic('copy', 14)}Copiar pedido</button></div>
          </div>
        </div>
      </div>
      <div class="secao"><h2>Propostas salvas</h2>
        ${S.propostas.length ? `<div class="cartao"><ul class="lista">${S.propostas.map((x) => `<li><div class="cresce"><div>${esc(x.tema)}</div><div class="mini">${fmtData(x.criado)} · ${ELEMENTOS.filter((e) => estadoElemento(e.k, x[e.k]).ok).length} de 5 elementos</div></div>
          <a class="btn peq" href="#/proposta/${x.id}">Abrir</a><button class="btn-icone" data-del="${x.id}" aria-label="Apagar">${ic('trash-2', 16)}</button></li>`).join('')}</ul></div>` : '<p class="sub">Nenhuma ainda.</p>'}
      </div>`;
    const $ = (s) => el.querySelector(s);
    const atualizarPrevia = () => {
      $('#previa').innerHTML = montar(p);
      const n = ELEMENTOS.filter((e) => estadoElemento(e.k, p[e.k]).ok).length;
      $('#cont').textContent = `${n} de 5 elementos`;
      for (const e of ELEMENTOS) { const s = estadoElemento(e.k, p[e.k]); const st = $('#st-' + e.k); st.className = 'estado-el ' + (s.ok ? 'ok' : ''); st.innerHTML = (s.ok ? ic('check', 14) : '') + esc(s.txt); }
    };
    const atualizarTexto = () => {
      const t = $('#texto').value.trim();
      const pi = t ? pistasProposta(t) : null;
      $('#pistas').innerHTML = pi ? `<p class="mini">Sinais no texto final: ${[['agente', pi.agente], ['modo/meio', pi.meio], ['finalidade', pi.efeito], ['detalhamento', pi.detalhe]].map(([k, v]) => `${k} ${v ? 'sim' : 'não encontrado'}`).join(' · ')}.</p>` : '';
      const ped = pedidoIA(p, t || montarTexto(p));
      $('#claude').href = linkClaude(ped); $('#gpt').href = linkChatGPT(ped);
      $('#copiar').onclick = async () => toast((await copiar(ped)) ? 'Pedido copiado' : 'Não consegui copiar');
    };
    el.querySelectorAll('[data-k]').forEach((t) => t.oninput = () => { p[t.dataset.k] = t.value; atualizarPrevia(); atualizarTexto(); });
    $('#tema').onchange = () => { p.tema = $('#tema').value.trim(); atualizarTexto(); };
    $('#sortear').onclick = () => { p.tema = sortearTema(); $('#tema').value = p.tema; atualizarTexto(); };
    $('#texto').oninput = atualizarTexto;
    $('#usar').onclick = () => { $('#texto').value = montarTexto(p); atualizarTexto(); };
    $('#salvar').onclick = () => {
      p.texto = $('#texto').value.trim() || montarTexto(p);
      if (!ELEMENTOS.some((e) => p[e.k].trim())) { toast('Preencha pelo menos um elemento.'); return; }
      if (p.id) { const i = S.propostas.findIndex((x) => x.id === p.id); S.propostas[i] = { ...p }; }
      else { p.id = uid(); p.criado = Date.now(); S.propostas.unshift({ ...p }); }
      salvar(); toast('Proposta salva');
      if (location.hash !== '#/proposta/' + p.id) location.hash = '#/proposta/' + p.id; else pintar();
    };
    el.querySelectorAll('[data-del]').forEach((b) => b.onclick = async () => {
      if (!(await confirmar('Apagar esta proposta?', 'Apagar'))) return;
      S.propostas = S.propostas.filter((x) => x.id !== b.dataset.del); salvar();
      if (p.id === b.dataset.del) location.hash = '#/proposta'; else pintar();
    });
    atualizarPrevia(); atualizarTexto();
  };
  pintar();
}
