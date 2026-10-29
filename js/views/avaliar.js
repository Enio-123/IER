// Correção: análise automática, checklist, autoavaliação, IA e espelho no formato do INEP.
import { S, salvar } from '../store.js';
import { ic } from '../icons.js';
import { marcarAba } from '../app.js';
import { esc, paragrafos, toast, vazio, copiar, confirmar, fmtTempo, janela } from '../ui.js';
import { achar, nova, notaFinal, discrepancias, notasCompletas } from '../redacao.js';
import { analisar } from '../analise.js';
import { CHECKLIST, PARTES } from '../dados/checklist.js';
import { COMPETENCIAS, NIVEIS, total } from '../dados/matriz.js';
import { pedidoCorrecao, lerNotas, linkClaude, linkChatGPT } from '../prompt.js';
import { listaAvisos } from './escrever.js';

const blocosDe = (r) => (r.tipo === 'paragrafo' ? PARTES[r.parte].blocos : ['introducao', 'desenvolvimento', 'conclusao', 'geral']);

function seletorNotas(nome, notas) {
  return COMPETENCIAS.map((c, i) => `<div class="comp-linha"><div><b>C${c.n}</b> <span class="sub">${esc(c.curto)}</span></div>
    <div class="notas-sel" data-grupo="${nome}" data-i="${i}">${[0, 40, 80, 120, 160, 200].map((n) => `<button type="button" data-n="${n}" class="${notas && notas[i] === n ? 'on' : ''}" aria-pressed="${notas && notas[i] === n}">${n}</button>`).join('')}</div></div>`).join('');
}

function espelho(r) {
  const n = notasCompletas(r), nf = notaFinal(r);
  const col = [['Você', n.auto], ['IA', n.ia], ['Professor', n.prof]].filter(([, v]) => v);
  if (!col.length) return '<p class="sub">Ainda sem notas. Faça a autoavaliação ou cole a correção da IA abaixo.</p>';
  const disc = discrepancias(r);
  return `<div style="overflow-x:auto"><table class="espelho">
    <thead><tr><th>Competência</th>${col.map(([t]) => `<th class="n">${t}</th>`).join('')}<th class="n">Final</th></tr></thead>
    <tbody>${COMPETENCIAS.map((c, i) => `<tr><td>C${c.n} · ${esc(c.curto)}</td>${col.map(([, v]) => `<td class="n">${v[i]}</td>`).join('')}<td class="n"><b>${nf.comps[i]}</b></td></tr>`).join('')}
    <tr class="total"><td>Total</td>${col.map(([, v]) => `<td class="n">${total(v)}</td>`).join('')}<td class="n">${nf.total}</td></tr></tbody></table></div>
    <p class="mini" style="margin-top:8px">Final: ${esc(nf.fonte)}. ${disc.length ? `<b>Discrepância entre ${esc(disc.join(' e entre '))}</b>: mais de 100 pontos no total ou de 80 em uma competência. No ENEM, isso leva a redação para um terceiro avaliador. Releia a competência onde vocês mais discordaram.` : ''}</p>`;
}

export function render(el, [id]) {
  const r = achar(id);
  if (!r) { el.innerHTML = vazio('Redação não encontrada', 'Ela pode ter sido apagada.', '<a class="btn" href="#/redacoes">Ver redações</a>'); return; }
  const completa = r.tipo === 'completa';
  if (!completa) marcarAba('treino');
  const pintar = () => {
    const a = analisar(r.texto, { tema: r.tema, charsLinha: S.perfil.charsLinha, tipo: completa ? 'completa' : r.parte });
    const itens = blocosDe(r).flatMap((b) => CHECKLIST[b].itens);
    const marcados = itens.filter((it) => r.check[it.id]).length;
    el.innerHTML = `
      <div class="topo-pagina"><div><div class="rot">${completa ? 'Redação completa' : 'Treino · ' + esc(PARTES[r.parte].rot)}</div><h1 style="font-family:var(--leitura);font-weight:600">${esc(r.tema)}</h1>
        <p>${a.linhas} linhas estimadas · ${a.palavras} palavras · ${r.seg ? fmtTempo(r.seg) + ' escrevendo' : 'tempo não medido'}${r.limite ? ' de ' + r.limite + ' min' : ''}</p></div>
        <div class="linha-acoes" style="margin:0"><a class="btn" href="#/escrever/${r.id}">${ic('pencil', 16)}Editar texto</a><button class="btn" id="reescrever">${ic('rotate-ccw', 16)}Reescrever</button></div></div>

      <div class="grade g2" style="align-items:start">
        <div class="cartao"><h2>Seu texto</h2><div class="texto-lido">${paragrafos(r.texto)}</div></div>
        <div class="grade">
          ${completa ? `<div class="cartao"><h2>Espelho</h2><div style="margin-top:12px">${espelho(r)}</div></div>` : ''}
          <div class="cartao"><h2>Pistas automáticas</h2><div style="margin-top:12px">${listaAvisos(a.avisos)}</div>
            <p class="mini" style="margin-top:10px">Contagens feitas pelo app. Elas não dão nota: apontam onde olhar.</p></div>
        </div>
      </div>

      <div class="cartao secao">
        <div class="entre"><h2>1. Checklist nota 1000</h2><span class="sub">${marcados} de ${itens.length}</span></div>
        <p class="sub" style="margin-top:4px">Releia o texto e marque só o que ele realmente cumpre.</p>
        ${blocosDe(r).map((b) => `<h3 style="margin-top:16px">${esc(CHECKLIST[b].rot)}</h3>
          <div class="rubrica" style="margin-top:6px">${CHECKLIST[b].itens.map((it) => `<label><input type="checkbox" data-ck="${it.id}" ${r.check[it.id] ? 'checked' : ''}><span>${esc(it.txt)} <span class="mini">${it.c ? 'C' + it.c : 'nota zero'}</span></span></label>`).join('')}</div>`).join('')}
      </div>

      ${completa ? `<div class="cartao secao"><h2>2. Sua nota</h2><p class="sub" style="margin-top:4px">Dê a nota que você acha que a banca daria. Use <a href="#/competencias">os níveis oficiais</a> como régua.</p>
        <div style="margin-top:10px">${seletorNotas('auto', r.notas.auto)}</div></div>` : ''}

      <div class="cartao secao grade">
        <h2>${completa ? '3. ' : '2. '}Correção pela IA</h2>
        <p class="sub">O app monta o pedido com ${completa ? 'a Matriz de Referência oficial do INEP' : 'o que a banca olha nesta parte'}. Abra no Claude ou no ChatGPT, e depois cole a resposta aqui${completa ? ': a nota entra sozinha no espelho' : ''}.</p>
        <div class="linha-acoes" style="margin:0">
          <a class="btn primario" id="claude" target="_blank" rel="noopener">${ic('external-link', 16)}Abrir no Claude</a>
          <a class="btn" id="gpt" target="_blank" rel="noopener">${ic('external-link', 16)}Abrir no ChatGPT</a>
          <button class="btn" id="copiar">${ic('copy', 16)}Copiar pedido</button>
        </div>
        <label class="campo">Resposta da IA<textarea id="resposta" rows="6" placeholder="Cole aqui a correção completa.">${esc(r.iaTexto)}</textarea></label>
        <div class="linha-acoes" style="margin:0"><button class="btn" id="salvarIA">${ic('check', 16)}Salvar resposta</button><span class="mini" id="iaInfo">${completa && r.notas.ia ? 'Nota da IA no espelho: ' + total(r.notas.ia) : ''}</span></div>
        <p class="mini">A IA erra. Use a correção como segunda opinião e compare com a sua leitura dos níveis.</p>
      </div>

      ${completa ? `<div class="cartao secao"><h2>4. Nota de um professor (opcional)</h2><p class="sub" style="margin-top:4px">Se um professor corrigir, registre aqui para acompanhar a evolução.</p>
        <div style="margin-top:10px">${seletorNotas('prof', r.notas.prof)}</div>
        <div class="linha-acoes"><button class="btn fantasma peq" id="limparProf">Limpar nota do professor</button></div></div>` : ''}

      <div class="linha-acoes secao"><button class="btn fantasma" id="apagar">${ic('trash-2', 16)}Apagar</button></div>`;

    const $ = (s) => el.querySelector(s);
    const pedido = pedidoCorrecao(r);
    $('#claude').href = linkClaude(pedido);
    $('#gpt').href = linkChatGPT(pedido);
    $('#copiar').onclick = async () => toast((await copiar(pedido)) ? 'Pedido copiado. Cole no chat da IA.' : 'Não consegui copiar');
    el.querySelectorAll('[data-ck]').forEach((c) => c.onchange = () => { r.check[c.dataset.ck] = c.checked; salvar(); const y = scrollY; pintar(); scrollTo(0, y); });
    el.querySelectorAll('.notas-sel').forEach((g) => g.querySelectorAll('button').forEach((b) => b.onclick = () => {
      const grupo = g.dataset.grupo, i = +g.dataset.i;
      const n = r.notas[grupo] || [null, null, null, null, null];
      n[i] = +b.dataset.n;
      r.notas[grupo] = n; // pode ficar parcial; só conta no espelho quando as 5 estiverem marcadas
      salvar(); const y = scrollY; pintar(); scrollTo(0, y);
    }));
    $('#salvarIA').onclick = () => {
      r.iaTexto = $('#resposta').value.trim();
      if (completa && r.iaTexto) {
        const n = lerNotas(r.iaTexto);
        if (n) { r.notas.ia = n; toast('Nota da IA: ' + total(n)); }
        else toast('Resposta salva. Não achei a linha NOTAS: confira se a IA terminou a resposta.');
      } else toast('Resposta salva');
      salvar(); const y = scrollY; pintar(); scrollTo(0, y);
    };
    const lp = $('#limparProf'); if (lp) lp.onclick = () => { r.notas.prof = null; salvar(); pintar(); };
    $('#reescrever').onclick = () => {
      const v = nova({ tipo: r.tipo, parte: r.parte, tema: r.tema, limite: r.limite, texto: r.texto, origem: r.id });
      toast('Nova versão criada a partir desta'); location.hash = '#/escrever/' + v.id;
    };
    $('#apagar').onclick = async () => {
      if (!(await confirmar('Apagar este texto e as notas dele? Não dá para desfazer.', 'Apagar'))) return;
      S.redacoes = S.redacoes.filter((x) => x.id !== r.id); salvar(); location.hash = completa ? '#/redacoes' : '#/treino';
    };
  };
  pintar();
}
