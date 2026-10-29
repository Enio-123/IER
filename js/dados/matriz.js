// Matriz de Referência da redação do ENEM (INEP). Descritores de cada nível conforme
// "A redação no Enem — Cartilha do Participante" (edições 2024 a 2026).
export const FONTE_CARTILHA = 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/acervo-linha-editorial/publicacoes-institucionais/avaliacoes-e-exames-da-educacao-basica/a-redacao-do-enem-2026-cartilha-do-a-participante';

export const NIVEIS = [200, 160, 120, 80, 40, 0];

export const COMPETENCIAS = [
  {
    n: 1, curto: 'Norma culta',
    titulo: 'Demonstrar domínio da modalidade escrita formal da língua portuguesa.',
    niveis: {
      200: 'Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.',
      160: 'Demonstra bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções da escrita.',
      120: 'Demonstra domínio mediano da modalidade escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.',
      80: 'Demonstra domínio insuficiente da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.',
      40: 'Demonstra domínio precário da modalidade escrita formal da língua portuguesa, de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.',
      0: 'Demonstra desconhecimento da modalidade escrita formal da língua portuguesa.',
    },
    olhar: ['Estrutura sintática: períodos completos, sem truncamento nem justaposição de frases.', 'Desvios: concordância, regência, crase, pontuação, acentuação, grafia, separação silábica.', 'Escolha de registro: sem gírias, abreviações e marcas de oralidade.'],
  },
  {
    n: 2, curto: 'Tema e repertório',
    titulo: 'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.',
    niveis: {
      200: 'Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo, e apresenta excelente domínio do texto dissertativo-argumentativo.',
      160: 'Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.',
      120: 'Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.',
      80: 'Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.',
      40: 'Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.',
      0: 'Fuga ao tema/não atendimento à estrutura dissertativo-argumentativa. Nestes casos a redação recebe nota zero e é anulada.',
    },
    olhar: ['Tema x assunto: o tema é o recorte exato da frase-tema; falar só do assunto geral é tangenciar.', 'Repertório sociocultural: informação, fato, citação ou experiência de fora dos textos motivadores, ligada ao tema e usada a favor do argumento.', 'Tipo textual: dissertativo-argumentativo em prosa, sem virar narração ou carta.'],
  },
  {
    n: 3, curto: 'Argumentação',
    titulo: 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.',
    niveis: {
      200: 'Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.',
      160: 'Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria, em defesa de um ponto de vista.',
      120: 'Apresenta informações, fatos e opiniões relacionados ao tema, limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.',
      80: 'Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores, em defesa de um ponto de vista.',
      40: 'Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.',
      0: 'Apresenta informações, fatos e opiniões não relacionados ao tema e sem defesa de um ponto de vista.',
    },
    olhar: ['Projeto de texto: dá para perceber um planejamento, com cada parágrafo cumprindo um papel.', 'Desenvolvimento: os argumentos são explicados, não só citados.', 'Autoria: ideias próprias que vão além dos textos motivadores.'],
  },
  {
    n: 4, curto: 'Coesão',
    titulo: 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
    niveis: {
      200: 'Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.',
      160: 'Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos.',
      120: 'Articula as partes do texto, de forma mediana, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.',
      80: 'Articula as partes do texto, de forma insuficiente, com muitas inadequações, e apresenta repertório limitado de recursos coesivos.',
      40: 'Articula as partes do texto de forma precária.',
      0: 'Não articula as informações.',
    },
    olhar: ['Entre parágrafos: cada parágrafo se liga ao anterior (conectivo ou retomada).', 'Dentro do parágrafo: frases encadeadas por conectivos, pronomes e sinônimos.', 'Variedade: não repetir o mesmo conectivo nem a mesma palavra o tempo todo.'],
  },
  {
    n: 5, curto: 'Proposta de intervenção',
    titulo: 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.',
    niveis: {
      200: 'Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.',
      160: 'Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.',
      120: 'Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.',
      80: 'Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.',
      40: 'Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao assunto.',
      0: 'Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou ao assunto.',
    },
    olhar: ['Os 5 elementos: agente, ação, modo/meio, efeito/finalidade e detalhamento.', 'A proposta resolve o problema discutido no texto, não um problema genérico.', 'Respeito aos direitos humanos: nada de propostas que violem a dignidade das pessoas.'],
  },
];

// Perguntas que a cartilha usa para orientar a proposta de intervenção.
export const ELEMENTOS = [
  { k: 'acao', rot: 'Ação', pergunta: 'O que é possível apresentar como solução para o problema?' },
  { k: 'agente', rot: 'Agente', pergunta: 'Quem deve executá-la?' },
  { k: 'meio', rot: 'Modo/meio', pergunta: 'Como viabilizar essa solução?' },
  { k: 'efeito', rot: 'Efeito/finalidade', pergunta: 'Qual efeito ela pode alcançar?' },
  { k: 'detalhe', rot: 'Detalhamento', pergunta: 'Que outra informação pode ser acrescentada para detalhar a proposta?' },
];

export const NOTA_ZERO = [
  'Fuga total ao tema.',
  'Não obediência ao tipo dissertativo-argumentativo.',
  'Folha em branco.',
  'Até 7 linhas manuscritas, qualquer que seja o conteúdo (texto insuficiente).',
  'Impropérios, desenhos e outras formas propositais de anulação.',
  'Parte deliberadamente desconectada do tema proposto.',
  'Nome, assinatura, rubrica ou outra forma de identificação no espaço do texto.',
  'Texto predominante ou integralmente em língua estrangeira.',
  'Texto ilegível para dois avaliadores independentes.',
];

export const CORRECAO = [
  'Cada redação é corrigida por dois avaliadores, de forma independente; um não vê a nota do outro.',
  'Cada um dá de 0 a 200 pontos por competência, em níveis de 40 em 40. A nota final é a média das duas correções.',
  'Se as notas tiverem diferença de mais de 100 pontos no total ou de mais de 80 pontos em alguma competência, há discrepância e um terceiro avaliador corrige.',
  'Linhas copiadas dos textos motivadores ou do caderno de questões são desconsideradas na contagem.',
];

// Regra de discrepância usada pelo INEP entre duas correções.
export function discrepancia(a, b) {
  if (!a || !b) return false;
  const ta = a.reduce((s, x) => s + x, 0), tb = b.reduce((s, x) => s + x, 0);
  return Math.abs(ta - tb) > 100 || a.some((x, i) => Math.abs(x - b[i]) > 80);
}
export const total = (n) => (n ? n.reduce((s, x) => s + x, 0) : null);
