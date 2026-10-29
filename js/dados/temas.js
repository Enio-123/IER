// Frases-tema oficiais da redação do ENEM (aplicações regulares e reaplicações/PPL).
// Os textos motivadores estão nas provas oficiais publicadas pelo INEP.
export const TEMAS = [
  { ano: 2025, ap: 'Regular', tema: 'Perspectivas acerca do envelhecimento na sociedade brasileira' },
  { ano: 2024, ap: 'Regular', tema: 'Desafios para a valorização da herança africana no Brasil' },
  { ano: 2024, ap: 'Reaplicação/PPL', tema: 'Desafios para a valorização da arte de periferia no cenário cultural brasileiro' },
  { ano: 2023, ap: 'Regular', tema: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil' },
  { ano: 2023, ap: 'Reaplicação/PPL', tema: 'Desafios para a (re)inserção socioeconômica da população em situação de rua no Brasil' },
  { ano: 2022, ap: 'Regular', tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil' },
  { ano: 2022, ap: 'Reaplicação/PPL', tema: 'Medidas para o enfrentamento da recorrência da insegurança alimentar no Brasil' },
  { ano: 2021, ap: 'Regular', tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil' },
  { ano: 2020, ap: 'Impresso', tema: 'O estigma associado às doenças mentais na sociedade brasileira' },
  { ano: 2020, ap: 'Digital', tema: 'O desafio de reduzir as desigualdades entre as regiões do Brasil' },
  { ano: 2019, ap: 'Regular', tema: 'Democratização do acesso ao cinema no Brasil' },
  { ano: 2018, ap: 'Regular', tema: 'Manipulação do comportamento do usuário pelo controle de dados na internet' },
  { ano: 2017, ap: 'Regular', tema: 'Desafios para a formação educacional de surdos no Brasil' },
  { ano: 2016, ap: '1ª aplicação', tema: 'Caminhos para combater a intolerância religiosa no Brasil' },
  { ano: 2016, ap: '2ª aplicação', tema: 'Caminhos para combater o racismo no Brasil' },
  { ano: 2015, ap: 'Regular', tema: 'A persistência da violência contra a mulher na sociedade brasileira' },
  { ano: 2014, ap: 'Regular', tema: 'Publicidade infantil em questão no Brasil' },
  { ano: 2013, ap: 'Regular', tema: 'Efeitos da implantação da Lei Seca no Brasil' },
  { ano: 2012, ap: 'Regular', tema: 'Movimento imigratório para o Brasil no século XXI' },
  { ano: 2011, ap: 'Regular', tema: 'Viver em rede no século XXI: os limites entre o público e o privado' },
  { ano: 2010, ap: 'Regular', tema: 'O trabalho na construção da dignidade humana' },
  { ano: 2009, ap: 'Regular', tema: 'O indivíduo frente à ética nacional' },
];
export const rotTema = (t) => `ENEM ${t.ano}${t.ap !== 'Regular' ? ' · ' + t.ap : ''}`;
