// Folha de redação: texto, cronômetro e análise ao vivo.
import { S, salvar, salvarQuieto, registrarDia } from '../store.js';
import { ic } from '../icons.js';
import { marcarAba } from '../app.js';
import { esc, fmtTempo, toast, vazio, cronometro, confirmar } from '../ui.js';
import { achar } from '../redacao.js';
import { analisar } from '../analise.js';
import { PARTES } from '../dados/checklist.js';

const NOME_C = ['Geral', 'C1', 'C2', 'C3', 'C4', 'C5'];
export const listaAvisos = (avisos) => avisos.length
  ? `<ul class="avisos">${avisos.map((a) => `<li class="${a.nivel}"><span class="cx">${NOME_C[a.c]}</span><span>${esc(a.txt)}</span></li>`).join('')}</ul>`
  : '<p class="sub">Comece a escrever para ver as pistas.</p>';

export function render(el, [id]) {
  const r = achar(id);
  if (!r) { el.innerHTML = vazio('Redação não encontrada', 'Ela pode ter sido apagada.', '<a class="btn" href="#/redacoes">Ver redações</a>'); return; }
  const p = S.perfil;
  const paragrafo = r.tipo === 'paragrafo';
  if (paragrafo) marcarAba('treino');
  const tipoAnalise = paragrafo ? r.parte : 'completa';
  el.innerHTML = `
    <div class="escrita">
      <div class="grade" style="gap:14px">
        <div><div class="rot">${paragrafo ? 'Treino · ' + esc(PARTES[r.parte]?.rot || '') : 'Tema'}</div><div class="tema-faixa">${esc(r.tema)}</div></div>
        <div class="folha-wrap"><textarea class="folha" id="folha" spellcheck="true" lang="pt-BR" aria-label="Texto da redação" placeholder="${paragrafo ? 'Escreva o parágrafo aqui.' : 'Escreva aqui. Aperte Enter para começar um novo parágrafo.'}">${esc(r.texto)}</textarea></div>
        <p class="mini">O corretor ortográfico do aparelho fica ligado para você treinar; na prova não há. Salva sozinho a cada letra.</p>
      </div>
      <aside class="lado">
        <div class="cartao grade" style="gap:10px">
          <div class="entre"><span class="rot">${r.limite ? 'Tempo restante' : 'Tempo escrevendo'}</span><button class="btn peq" id="play">${ic('play', 14)}Começar</button></div>
          <div class="relogio" id="relogio">0:00</div>
        </div>
        <div class="medidor" aria-live="polite">
          <div><b id="m-linhas">0</b><small>${paragrafo ? 'linhas' : 'de 30 linhas'}</small></div>
          <div><b id="m-pal">0</b><small>palavras</small></div>
          <div><b id="m-par">0</b><small>parágrafos</small></div>
        </div>
        <div class="cartao"><h3>Pistas automáticas</h3><div id="avisos" style="margin-top:10px"></div></div>
        <button class="btn primario grande" id="fim">${ic('check', 18)}Terminar e corrigir</button>
        <button class="btn fantasma" id="apagar">${ic('trash-2', 16)}Apagar ${paragrafo ? 'treino' : 'redação'}</button>
      </aside>
    </div>`;
  const $ = (s) => el.querySelector(s);
  const folha = $('#folha');

  // Cronômetro: regressivo quando há limite, progressivo quando não há.
  let gasto = r.seg || 0, inicioSessao = null, avisouFim = false;
  const relogio = () => {
    const agora = gasto + (inicioSessao ? (Date.now() - inicioSessao) / 1000 : 0);
    if (r.limite) {
      const resta = r.limite * 60 - agora;
      $('#relogio').textContent = resta >= 0 ? fmtTempo(resta) : '+' + fmtTempo(-resta);
      $('#relogio').classList.toggle('fim', resta < 0);
      if (resta < 0 && !avisouFim) { avisouFim = true; toast('Tempo da prova acabou. Termine a frase e finalize.'); }
    } else $('#relogio').textContent = fmtTempo(agora);
    return agora;
  };
  const relo = cronometro({ segundos: 1e9, aoTique: relogio });
  const play = () => {
    if (relo.rodando()) { relo.parar(); gasto += (Date.now() - inicioSessao) / 1000; inicioSessao = null; r.seg = Math.round(gasto); salvarQuieto(); $('#play').innerHTML = `${ic('play', 14)}Continuar`; }
    else { inicioSessao = Date.now(); relo.iniciar(); $('#play').innerHTML = `${ic('pause', 14)}Pausar`; }
  };
  $('#play').onclick = play;
  if (gasto) $('#play').innerHTML = `${ic('play', 14)}Continuar`;
  relogio();

  const medir = () => {
    const a = analisar(folha.value, { tema: r.tema, charsLinha: p.charsLinha, tipo: tipoAnalise });
    $('#m-linhas').textContent = a.linhas; $('#m-pal').textContent = a.palavras; $('#m-par').textContent = a.pars;
    $('#avisos').innerHTML = listaAvisos(folha.value.trim() ? a.avisos : []);
  };
  let tAn = null;
  folha.oninput = () => {
    if (!relo.rodando() && folha.value.length > r.texto.length) play(); // começar a digitar liga o relógio
    r.texto = folha.value; r.editado = Date.now(); salvarQuieto();
    clearTimeout(tAn); tAn = setTimeout(medir, 350);
  };
  medir();

  const guardarTempo = () => { if (relo.rodando()) { gasto += (Date.now() - inicioSessao) / 1000; inicioSessao = Date.now(); } r.seg = Math.round(gasto); };
  $('#fim').onclick = async () => {
    if (!folha.value.trim()) { toast('Escreva o texto antes de terminar.'); return; }
    guardarTempo(); relo.parar(); inicioSessao = null;
    if (!r.fim) { r.fim = Date.now(); registrarDia(Math.round(r.seg / 60)); }
    salvar();
    location.hash = '#/avaliar/' + r.id;
  };
  $('#apagar').onclick = async () => {
    if (!(await confirmar('Apagar este texto? Não dá para desfazer.', 'Apagar'))) return;
    relo.parar(); S.redacoes = S.redacoes.filter((x) => x.id !== r.id); salvar();
    location.hash = paragrafo ? '#/treino' : '#/redacoes';
  };
  if (!r.texto) folha.focus();
  return () => { guardarTempo(); relo.parar(); salvar(); };
}
