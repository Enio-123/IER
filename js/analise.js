// Análise automática do texto: só o que dá para medir com segurança.
// Não dá nota: aponta pistas para a aluna revisar.
const CONECTIVOS = [
  'além disso', 'ademais', 'outrossim', 'somado a isso', 'aliado a isso', 'em adição', 'não só', 'bem como', 'também',
  'entretanto', 'contudo', 'todavia', 'no entanto', 'porém', 'mas', 'ainda assim', 'apesar de', 'embora', 'não obstante', 'em contrapartida', 'por outro lado',
  'portanto', 'logo', 'dessa forma', 'desse modo', 'dessa maneira', 'assim', 'sendo assim', 'por conseguinte', 'por isso', 'consequentemente', 'diante disso', 'diante do exposto', 'em suma', 'por fim', 'finalmente',
  'porque', 'pois', 'visto que', 'uma vez que', 'já que', 'dado que', 'haja vista', 'em virtude de', 'devido a', 'em razão de',
  'nesse sentido', 'nesse contexto', 'sob esse viés', 'sob essa ótica', 'nessa perspectiva', 'nesse cenário', 'em primeiro lugar', 'em segundo lugar', 'primeiramente', 'inicialmente',
  'conforme', 'consoante', 'segundo', 'de acordo com', 'como', 'tal como', 'assim como', 'ou seja', 'isto é', 'por exemplo', 'a fim de', 'para que', 'com o intuito de', 'com o objetivo de',
];
const INFORMAL = ['vc', 'vcs', 'pq', 'tbm', 'tb', 'pra', 'pro', 'tá', 'né', 'a gente', 'tipo assim', 'galera'];
const MARCAS = {
  meio: ['por meio de', 'por meio da', 'por meio do', 'mediante', 'através de', 'através da', 'através do', 'por intermédio de', 'com o auxílio de', 'via ', 'utilizando', 'com a criação de', 'com a implementação de'],
  efeito: ['a fim de', 'para que', 'com o intuito de', 'com o objetivo de', 'com a finalidade de', 'de modo a', 'de modo que', 'visando', 'para garantir', 'para promover', 'para assegurar', 'para reduzir', 'para combater', 'para mitigar'],
  agente: ['governo', 'estado', 'ministério', 'ministerio', 'poder público', 'congresso', 'legislativo', 'judiciário', 'escola', 'escolas', 'mídia', 'midia', 'imprensa', 'ong', 'ongs', 'família', 'familias', 'famílias', 'sociedade civil', 'empresas', 'prefeituras', 'secretarias', 'universidades', 'instituições', 'defensoria', 'ministério público', 'iniciativa privada', 'organizações'],
  detalhe: ['ou seja', 'isto é', 'como, por exemplo', 'por exemplo', 'a exemplo de', 'tal como', 'que é', 'que são', 'responsável por', ' — ', ', que '],
};
const PARADAS = new Set('a o as os um uma uns umas de da do das dos em na no nas nos por para pela pelo pelas pelos com sem sob sobre entre e ou que se seu sua seus suas ao aos à às é são ser foi como mais menos muito muita muitos muitas mas não também isso esse essa esses essas este esta estes estas aquele aquela tal tais já ainda quando onde cujo cuja qual quais ele ela eles elas lhe lhes nos nós eu meu minha há ter tem têm sendo assim dessa desse nessa nesse pois porque embora todo toda todos todas cada outro outra outros outras forma modo maneira brasil brasileira brasileiro sociedade'.split(' '));

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tem = (txt, termo) => new RegExp(`(^|[^\\p{L}])${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'iu').test(txt);

export function paragrafosDe(texto) {
  return String(texto || '').split(/\n+/).map((p) => p.trim()).filter(Boolean);
}

// Linhas manuscritas estimadas: cada parágrafo ocupa ceil(caracteres / charsLinha) linhas.
export function linhasEstimadas(texto, charsLinha = 65) {
  return paragrafosDe(texto).reduce((s, p) => s + Math.max(1, Math.ceil(p.length / charsLinha)), 0);
}

export function contar(texto, charsLinha) {
  const pars = paragrafosDe(texto);
  const palavras = (String(texto).match(/[\p{L}\p{N}]+(?:[-'][\p{L}]+)*/gu) || []).length;
  return { palavras, pars: pars.length, linhas: linhasEstimadas(texto, charsLinha), chars: String(texto).replace(/\s+/g, ' ').trim().length };
}

export function conectivosEm(trecho) {
  const t = trecho.toLowerCase();
  return CONECTIVOS.filter((c) => tem(t, c));
}

// Abertura do parágrafo: conectivo nas primeiras 6 palavras.
function abreComConectivo(p) {
  const inicio = p.toLowerCase().split(/\s+/).slice(0, 6).join(' ');
  return CONECTIVOS.some((c) => tem(inicio, c));
}

export function analisar(texto, { tema = '', charsLinha = 65, tipo = 'completa' } = {}) {
  const pars = paragrafosDe(texto);
  const c = contar(texto, charsLinha);
  const avisos = []; // {nivel:'alerta'|'dica'|'ok', c, txt}
  const add = (nivel, comp, txt) => avisos.push({ nivel, c: comp, txt });

  if (tipo === 'completa') {
    if (c.linhas <= 7) add('alerta', 0, `Cerca de ${c.linhas} linhas. Até 7 linhas manuscritas a redação recebe nota zero (texto insuficiente).`);
    else if (c.linhas > 30) add('alerta', 0, `Cerca de ${c.linhas} linhas: passa das 30 linhas da folha oficial. Corte para caber.`);
    else if (c.linhas < 20) add('dica', 3, `Cerca de ${c.linhas} linhas. Textos curtos costumam desenvolver pouco os argumentos; a maioria das notas altas usa quase toda a folha.`);
    else add('ok', 0, `Cerca de ${c.linhas} de 30 linhas.`);
    if (pars.length < 4) add('dica', 2, `${pars.length} parágrafo(s). A estrutura mais usada tem 4: introdução, dois desenvolvimentos e conclusão.`);
  }

  // Coesão entre parágrafos
  if (pars.length > 1) {
    const semLiga = pars.slice(1).map((p, i) => (abreComConectivo(p) ? null : i + 2)).filter(Boolean);
    if (semLiga.length) add('dica', 4, `Parágrafo ${semLiga.join(', ')} começa sem conectivo. Confira se ele se liga ao anterior de outra forma (retomada, pronome).`);
    else add('ok', 4, 'Todos os parágrafos começam com um elemento de ligação.');
  }
  const usados = {};
  for (const p of pars) for (const k of conectivosEm(p)) usados[k] = (usados[k] || 0) + 1;
  const repetidos = Object.entries(usados).filter(([k, n]) => n >= 3 && !['como', 'também', 'mas', 'segundo'].includes(k));
  if (repetidos.length) add('dica', 4, `Conectivo repetido: ${repetidos.map(([k, n]) => `"${k}" (${n}x)`).join(', ')}. Varie.`);
  const variedade = Object.keys(usados).length;
  if (tipo === 'completa' && c.palavras > 120) add(variedade >= 8 ? 'ok' : 'dica', 4, `${variedade} conectivos diferentes no texto.${variedade < 8 ? ' Redações com nota alta costumam variar mais.' : ''}`);

  // Palavras repetidas
  const freq = {};
  for (const w of (String(texto).toLowerCase().match(/\p{L}{5,}/gu) || [])) if (!PARADAS.has(w)) freq[w] = (freq[w] || 0) + 1;
  const rep = Object.entries(freq).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (rep.length) add('dica', 4, `Palavras repetidas: ${rep.map(([w, n]) => `"${w}" (${n}x)`).join(', ')}. Use sinônimos ou pronomes.`);

  // Informalidade
  const inf = INFORMAL.filter((w) => tem(String(texto).toLowerCase(), w));
  if (inf.length) add('alerta', 1, `Marcas de informalidade: ${inf.map((w) => `"${w}"`).join(', ')}.`);

  // Frases muito longas
  const frases = String(texto).split(/(?<=[.!?])\s+/).filter((f) => f.trim());
  const longas = frases.filter((f) => f.split(/\s+/).length > 55).length;
  if (longas) add('dica', 1, `${longas} frase(s) com mais de 55 palavras. Períodos longos demais aumentam o risco de truncamento e erro de pontuação.`);

  // Tema
  if (tema) {
    const IGNORAR = ['desafios', 'caminhos', 'brasil', 'questao', 'acerca', 'perspectivas', 'medidas', 'enfrentamento'];
    const chaves = [...new Set((tema.toLowerCase().match(/\p{L}{5,}/gu) || []).filter((w) => !PARADAS.has(w) && !IGNORAR.includes(norm(w))))];
    if (chaves.length && pars.length) {
      const raiz = (w) => { const n = norm(w); return n.slice(0, Math.max(5, n.length - 3)); };
      const presentes = (p) => chaves.filter((k) => norm(p).includes(raiz(k)));
      const intro = presentes(pars[0]);
      const falta = chaves.filter((k) => !intro.includes(k));
      if (tipo === 'completa' || tipo === 'introducao') {
        if (falta.length) add('dica', 2, `A introdução não retoma: ${falta.map((w) => `"${w}"`).join(', ')}. Confira se o recorte do tema está completo.`);
        else add('ok', 2, 'A introdução retoma as palavras-chave do tema.');
      }
    }
  }

  // Proposta (último parágrafo)
  const ult = (tipo === 'completa' || tipo === 'conclusao') ? pars[pars.length - 1] : null;
  const proposta = ult ? pistasProposta(ult) : null;
  if (proposta) {
    const faltam = Object.entries(proposta).filter(([, v]) => !v).map(([k]) => ({ agente: 'agente', meio: 'modo/meio', efeito: 'efeito/finalidade', detalhe: 'detalhamento' }[k]));
    if (faltam.length) add('dica', 5, `Na conclusão não encontrei sinal de: ${faltam.join(', ')}. Confira os 5 elementos.`);
    else add('ok', 5, 'A conclusão tem sinais de agente, meio, finalidade e detalhamento.');
  }
  return { ...c, avisos, conectivos: usados, proposta };
}

export function pistasProposta(p) {
  const t = p.toLowerCase();
  const achou = (lista) => lista.some((m) => (m.startsWith(' ') || m.endsWith(' ') || m.includes(',') ? t.includes(m) : tem(t, m)));
  return { agente: achou(MARCAS.agente), meio: achou(MARCAS.meio), efeito: achou(MARCAS.efeito), detalhe: achou(MARCAS.detalhe) };
}
