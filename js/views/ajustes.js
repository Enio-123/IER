import { S, salvar, exportar, importar, zerar } from '../store.js';
import { APP } from '../config.js';
import { ic } from '../icons.js';
import { esc, toast, confirmar } from '../ui.js';
import { aplicarTema } from '../app.js';
import { instalado, instalar } from '../instalar.js';

export function render(el) {
  const p = S.perfil;
  el.innerHTML = `
    <div class="topo-pagina"><div><h1>Ajustes</h1><p>${esc(APP.nome)} · ${esc(APP.longo)} · versão ${APP.versao}</p></div></div>
    <div class="grade g2">
      <div class="cartao grade">
        <h2>Prova e tempo</h2>
        <label class="campo">Seu nome<input type="text" id="nome" value="${esc(p.nome)}" placeholder="Como quer ser chamada"></label>
        <label class="campo">Data da redação<input type="date" id="data" value="${esc(p.dataProva || '')}"></label>
        <p class="mini" style="margin-top:-8px">ENEM 2026: redação no 1º dia, 8 de novembro.</p>
        <div class="grade g2"><label class="campo">Minutos por redação<input type="number" min="10" max="180" id="tr" value="${p.tempoRedacao}"></label>
        <label class="campo">Minutos por parágrafo<input type="number" min="3" max="60" id="tp" value="${p.tempoParagrafo}"></label></div>
      </div>
      <div class="cartao grade">
        <h2>Contagem de linhas</h2>
        <label class="campo">Caracteres por linha da sua letra<input type="number" min="35" max="110" id="cl" value="${p.charsLinha}"></label>
        <p class="mini">O app estima as linhas da folha oficial dividindo cada parágrafo por este número. Para acertar: copie à mão uma linha inteira de um texto seu, conte os caracteres (com espaços) e coloque aqui.</p>
        <h2 style="margin-top:8px">Aparência</h2>
        <div class="seg">${[['claro', 'Papel'], ['escuro', 'Grafite'], ['sistema', 'Igual ao aparelho']].map(([k, r]) => `<button data-tema="${k}" class="${(p.tema || 'claro') === k ? 'on' : ''}">${r}</button>`).join('')}</div>
      </div>
    </div>
    <div class="cartao secao entre" style="flex-wrap:wrap;gap:12px">
      <div><h2>App no celular</h2><p class="sub">${instalado() ? 'Você está usando o IER pelo ícone instalado.' : 'Instale o IER na tela inicial: abre como app e funciona sem internet.'}</p></div>
      <button class="btn ${instalado() ? '' : 'primario'}" id="instalar">${ic('download', 16)}${instalado() ? 'Como instalar' : 'Instalar app'}</button>
    </div>
    <div class="cartao secao grade">
      <h2>Seus dados</h2>
      <p class="sub">Tudo fica salvo neste aparelho, sem conta. Faça backup de vez em quando e use o arquivo para passar as redações para outro aparelho.</p>
      <div class="linha-acoes" style="margin:0">
        <button class="btn" id="exp">${ic('download', 16)}Baixar backup</button>
        <label class="btn">${ic('upload', 16)}Restaurar backup<input type="file" id="imp" accept="application/json" hidden></label>
        <span style="flex:1"></span>
        <button class="btn" id="zerar">${ic('trash-2', 16)}Apagar tudo</button>
      </div>
    </div>
    <div class="cartao secao">
      <h2>Fontes</h2>
      <ul class="lista sub">
        <li>Competências, níveis, situações de nota zero e regras de correção: A redação no Enem — Cartilha do Participante (INEP).</li>
        <li>Temas: frases-tema oficiais das provas do ENEM de 2009 a 2025.</li>
        <li>A correção por IA é feita no Claude ou no ChatGPT, na sua conta; o IER só monta o pedido com a rubrica oficial.</li>
        <li>Ícones: Lucide.</li>
      </ul>
    </div>`;
  const $ = (s) => el.querySelector(s);
  const campo = (sel, k, conv = (v) => v) => { $(sel).onchange = (e) => { p[k] = conv(e.target.value); salvar(); toast('Salvo'); }; };
  campo('#nome', 'nome', (v) => v.trim());
  campo('#data', 'dataProva', (v) => v || null);
  campo('#tr', 'tempoRedacao', (v) => Math.max(10, Math.min(180, +v || 60)));
  campo('#tp', 'tempoParagrafo', (v) => Math.max(3, Math.min(60, +v || 10)));
  campo('#cl', 'charsLinha', (v) => Math.max(35, Math.min(110, +v || 65)));
  el.querySelectorAll('[data-tema]').forEach((b) => b.onclick = () => { p.tema = b.dataset.tema; salvar(); aplicarTema(); render(el); });
  $('#instalar').onclick = instalar;
  $('#exp').onclick = exportar;
  $('#imp').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (!(await confirmar('Restaurar este backup? Os dados atuais deste aparelho serão substituídos.', 'Restaurar'))) return;
    try { await importar(f); aplicarTema(); toast('Backup restaurado'); render(el); } catch (err) { toast(err.message); }
  };
  $('#zerar').onclick = async () => {
    if (!(await confirmar('Apagar todas as redações e propostas deste aparelho? Não dá para desfazer. Baixe um backup antes, se quiser.', 'Apagar tudo'))) return;
    zerar(); aplicarTema(); toast('Dados apagados'); render(el);
  };
}
