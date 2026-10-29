// Checklist nota 1000 do IER: itens conferíveis, cada um ligado à competência que ele protege.
// Baseado nos descritores da Matriz e nas orientações da Cartilha do Participante (INEP).
export const CHECKLIST = {
  introducao: {
    rot: 'Introdução',
    itens: [
      { id: 'i_tema', c: 2, txt: 'Apresenta o tema com as palavras-chave da frase-tema, não só o assunto geral.' },
      { id: 'i_rep', c: 2, txt: 'Traz um repertório (lei, dado, fato histórico, obra, pensador) e mostra a ligação com o tema.' },
      { id: 'i_tese', c: 3, txt: 'Deixa claro o ponto de vista que vai defender (tese).' },
      { id: 'i_plano', c: 3, txt: 'Indica os caminhos da argumentação que virão nos desenvolvimentos.' },
    ],
  },
  desenvolvimento: {
    rot: 'Desenvolvimentos',
    itens: [
      { id: 'd_liga', c: 4, txt: 'Cada parágrafo começa ligado ao anterior (conectivo ou retomada).' },
      { id: 'd_topico', c: 3, txt: 'A primeira frase de cada parágrafo diz a ideia central dele.' },
      { id: 'd_fund', c: 2, txt: 'Os argumentos têm fundamento (repertório, dado, exemplo) que vem de fora dos textos motivadores.' },
      { id: 'd_explica', c: 3, txt: 'Explico o argumento e ligo ao tema: não fico só citando.' },
      { id: 'd_fecha', c: 3, txt: 'Cada parágrafo termina amarrando o argumento à tese.' },
    ],
  },
  conclusao: {
    rot: 'Conclusão',
    itens: [
      { id: 'c_retoma', c: 3, txt: 'Retoma o problema ou a tese antes de propor.' },
      { id: 'c_acao', c: 5, txt: 'Ação: o que deve ser feito.' },
      { id: 'c_agente', c: 5, txt: 'Agente: quem faz (específico, não "alguém" ou "todos").' },
      { id: 'c_meio', c: 5, txt: 'Modo/meio: como será feito.' },
      { id: 'c_efeito', c: 5, txt: 'Efeito/finalidade: para quê.' },
      { id: 'c_detalhe', c: 5, txt: 'Detalhamento: uma informação a mais sobre um dos elementos.' },
      { id: 'c_ligada', c: 5, txt: 'A proposta resolve os problemas que discuti nos desenvolvimentos.' },
      { id: 'c_dh', c: 5, txt: 'A proposta respeita os direitos humanos.' },
    ],
  },
  geral: {
    rot: 'Texto inteiro',
    itens: [
      { id: 'g_registro', c: 1, txt: 'Registro formal: sem gíria, abreviação ou marca de oralidade.' },
      { id: 'g_revisao', c: 1, txt: 'Revisei concordância, regência, crase, vírgulas e acentuação.' },
      { id: 'g_frases', c: 1, txt: 'Nenhuma frase ficou truncada ou longa demais.' },
      { id: 'g_copia', c: 2, txt: 'Não copiei trechos dos textos motivadores.' },
      { id: 'g_conect', c: 4, txt: 'Variei os conectivos e evitei repetir palavras.' },
      { id: 'g_id', c: 0, txt: 'Não coloquei nome, assinatura ou qualquer identificação no texto.' },
    ],
  },
};

// Partes para o treino de parágrafo.
export const PARTES = {
  introducao: { rot: 'Introdução', blocos: ['introducao'] },
  desenvolvimento: { rot: 'Desenvolvimento', blocos: ['desenvolvimento'] },
  conclusao: { rot: 'Conclusão', blocos: ['conclusao'] },
};
