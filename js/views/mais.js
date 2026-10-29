// Menu do celular com as telas que não cabem nas abas.
import { ic } from '../icons.js';

const ITENS = [
  ['progresso', 'Progresso', 'bar-chart-2', 'Notas por competência e evolução'],
  ['competencias', 'As 5 competências', 'book-open', 'Níveis oficiais, estrutura e nota zero'],
  ['ajustes', 'Ajustes', 'settings', 'Tempo, data da prova, backup e instalação'],
];

export function render(el) {
  el.innerHTML = `<div class="cartao"><ul class="lista">${ITENS.map(([r, t, i, d]) => `<li class="clicavel" onclick="location.hash='#/${r}'" style="cursor:pointer">${ic(i)}<div class="cresce"><div>${t}</div><div class="mini">${d}</div></div>${ic('chevron-right', 18)}</li>`).join('')}</ul></div>`;
}
