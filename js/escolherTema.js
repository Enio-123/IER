// Janela para escolher o tema: oficial do ENEM, sorteado ou próprio.
import { TEMAS, rotTema } from './dados/temas.js';
import { janela, esc } from './ui.js';
import { ic } from './icons.js';

export function escolherTema({ titulo = 'Nova redação', tempos = [0, 30, 45, 60, 75, 90], tempoPadrao = 60, rotuloOk = 'Começar' } = {}) {
  return new Promise((res) => {
    let escolhido = null;
    const { el, fechar } = janela(titulo, `
      <label class="campo">Buscar tema oficial<input type="search" id="busca" placeholder="Ex.: internet, mulher, cinema, 2023"></label>
      <ul class="lista" id="temas" style="max-height:260px;overflow-y:auto"></ul>
      <label class="campo">Ou escreva um tema próprio (simulado do cursinho, por exemplo)<input type="text" id="proprio" placeholder="Frase-tema"></label>
      ${tempos.length ? `<label class="campo">Tempo<select id="tempo">${tempos.map((t) => `<option value="${t}" ${t === tempoPadrao ? 'selected' : ''}>${t ? t + ' minutos' : 'Sem cronômetro'}</option>`).join('')}</select></label>` : ''}
      <div class="linha-acoes" style="margin:0"><button class="btn" id="sortear">${ic('rotate-ccw', 16)}Sortear tema oficial</button><span style="flex:1"></span><button class="btn primario" id="ok" disabled>${esc(rotuloOk)}</button></div>`, { aoFechar: () => res(null) });
    const $ = (s) => el.querySelector(s);
    const pintar = () => {
      const q = $('#busca').value.trim().toLowerCase();
      const lista = TEMAS.filter((t) => !q || (t.tema + ' ' + t.ano).toLowerCase().includes(q));
      $('#temas').innerHTML = lista.map((t) => `<li><label class="check cresce"><input type="radio" name="tema" value="${esc(t.tema)}" ${escolhido === t.tema ? 'checked' : ''}><span><span class="mini">${esc(rotTema(t))}</span><br>${esc(t.tema)}</span></label></li>`).join('') || '<li class="sub">Nenhum tema oficial com essa busca.</li>';
      $('#temas').querySelectorAll('input').forEach((i) => i.onchange = () => { escolhido = i.value; $('#proprio').value = ''; atualizar(); });
    };
    const atualizar = () => { $('#ok').disabled = !(escolhido || $('#proprio').value.trim()); };
    $('#busca').oninput = pintar;
    $('#proprio').oninput = () => { if ($('#proprio').value.trim()) { escolhido = null; el.querySelectorAll('input[name=tema]').forEach((i) => i.checked = false); } atualizar(); };
    $('#sortear').onclick = () => { escolhido = TEMAS[Math.floor(Math.random() * TEMAS.length)].tema; $('#busca').value = ''; $('#proprio').value = ''; pintar(); atualizar(); el.querySelector('input[name=tema]:checked')?.scrollIntoView({ block: 'nearest' }); };
    $('#ok').onclick = () => {
      const tema = $('#proprio').value.trim() || escolhido;
      const limite = $('#tempo') ? +$('#tempo').value || null : null;
      res({ tema, limite }); fechar();
    };
    pintar();
  });
}
