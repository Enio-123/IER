# IER — Instituto de Ensino de Redação

App de redação do ENEM, irmão do [IEM](https://enio-123.github.io/IEM/). Funciona no navegador e pode ser instalado no celular (PWA), com tudo salvo no próprio aparelho.

## O que tem

- **Redação completa**: temas oficiais do ENEM (2009 a 2025) ou tema próprio, folha de 30 linhas com contagem estimada de linhas, cronômetro com o tempo escolhido.
- **Pistas automáticas**: linhas (alerta de nota zero até 7 linhas e de passar das 30), parágrafos, conectivos no início de cada parágrafo, conectivos e palavras repetidos, marcas de informalidade, frases longas, retomada do tema na introdução e sinais dos elementos da proposta na conclusão.
- **Checklist nota 1000**: itens por parte do texto, cada um ligado à competência que protege.
- **Espelho**: autoavaliação, correção da IA e nota de professor nos níveis oficiais (0 a 200, de 40 em 40), nota final pela média e aviso de discrepância pela regra do INEP.
- **Correção por IA**: o app monta o pedido com a Matriz de Referência e abre no Claude ou no ChatGPT; a resposta colada de volta preenche a nota da IA (linha `NOTAS: C1=...`).
- **Treino de parágrafo**: introdução, desenvolvimento ou conclusão, com checklist da parte.
- **Montar proposta**: os 5 elementos da Competência 5 (ação, agente, modo/meio, efeito/finalidade, detalhamento), prévia e avaliação pela IA.
- **As 5 competências**: níveis oficiais, estrutura, situações de nota zero e como a correção funciona.
- **Progresso**, backup/restauração e tema papel ou grafite.

Visual em duas cores: papel `#F4F1EA` e grafite `#1C1C1C`.

## Fontes

- INEP, *A redação no Enem — Cartilha do Participante* (competências, níveis, nota zero, elementos da proposta, regras de correção).
- Frases-tema oficiais das provas do ENEM.

## Rodar localmente

Qualquer servidor estático na raiz, por exemplo `python3 -m http.server`, e abrir `http://localhost:8000`.

## Publicação

`.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main` (Settings > Pages > Source: GitHub Actions).
