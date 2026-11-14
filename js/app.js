"use strict";
const byId = (id) => document.getElementById(id);
const canvas = byId("bench");
const ctx = canvas.getContext("2d");
const palette = {
  gold: "#ffe46c",
  cyan: "#71e4ed",
  green: "#bcf88a",
  cream: "#eef5ed",
  gray: "#c3cecb",
  purple: "#d9a5ff",
};

const components = [
  {
    name: "DNA molde",
    short: "DNA",
    color: palette.cyan,
    role: "O DNA extraído da amostra serve de molde para copiar a região-alvo.",
  },
  {
    name: "Primers (iniciadores)",
    short: "Primers",
    color: palette.gold,
    role: "Reconhecem regiões complementares da sequência-alvo e dão início à síntese.",
  },
  {
    name: "DNA polimerase",
    short: "Polimerase",
    color: "#ffaf82",
    role: "É a enzima que sintetiza as novas fitas de DNA.",
  },
  {
    name: "dNTPs",
    short: "dNTPs",
    color: palette.purple,
    role: "São os “tijolos” usados para construir as novas fitas de DNA.",
  },
  {
    name: "Tampão e cofatores",
    short: "Tampão",
    color: "#90aaff",
    role: "Mantêm as condições da reação. O magnésio é um exemplo de cofator que auxilia a polimerase.",
  },
  {
    name: "Marcador fluorescente",
    short: "Marcador",
    color: palette.green,
    role: "Gera o sinal que permite acompanhar a amplificação a cada leitura óptica.",
  },
];
const closedTube = components.length + 1;
const PCR = {
  plate: 1,
  loaded: 2,
  zoom: 3,
  denaturation: 4,
  annealing: 5,
  extension: 6,
  reading: 7,
  run: 8,
};
const phaseInfo = {
  [PCR.denaturation]: "Desnaturação · ~95 °C",
  [PCR.annealing]: "Anelamento · 55 a 65 °C",
  [PCR.extension]: "Extensão · ~72 °C",
};
const totalCycles = 40;

const chapters = [
  {
    label: "Coleta",
    screens: [
      [
        "Coleta da amostra",
        "A reação começa com uma amostra que contém DNA. Identifique o tubo para acompanhar a amostra ao longo da análise.",
        "Registrar a amostra",
        "Um tubo de amostra virtual aguarda identificação.",
      ],
      [
        "Amostra registrada",
        "A amostra segue identificada para a etapa de extração.",
        "",
        "O tubo da amostra recebe a identificação.",
      ],
    ],
  },
  {
    label: "Extração",
    screens: [
      [
        "Extração do DNA",
        "A extração recupera o DNA da amostra e o separa de outros componentes.",
        "Simular a extração",
        "Os pontos representam componentes da amostra.",
      ],
      [
        "DNA extraído",
        "O DNA recuperado segue para o preparo da reação, onde servirá de molde.",
        "",
        "Os traços azuis representam o DNA extraído.",
      ],
    ],
  },
  {
    label: "Preparo",
    screens: [
      [
        "Preparo da reação",
        "Adicione os seis componentes a um tubo de PCR.",
        "Adicionar DNA molde",
        "O tubo de reação está aberto.",
      ],
      ...components.map(({ name, role }, index) => [
        name,
        role,
        index + 1 < components.length
          ? "Adicionar " + components[index + 1].name
          : "Fechar o tubo",
        "Preparo da reação · " +
          (index + 1) +
          " de " +
          components.length +
          " componentes",
      ]),
      [
        "Tubo fechado",
        "A tampa mantém a mistura contida enquanto o tubo vai para o suporte do equipamento.",
        "",
        "O tubo de PCR está pronto para ser colocado na placa.",
      ],
    ],
  },
  {
    label: "Amplificação",
    screens: [
      [
        "Levar ao termociclador",
        "A placa funciona como suporte para posicionar o tubo de PCR no equipamento.",
        "Colocar o tubo na placa",
        "O tubo está fechado e a placa tem uma posição destacada.",
      ],
      [
        "Tubo na placa",
        "O tubo fechado está encaixado na placa. Agora, leve o conjunto ao termociclador.",
        "Inserir a placa no termociclador",
        "A placa sustenta o tubo durante a corrida.",
      ],
      [
        "Termociclador de tempo real",
        "O equipamento alterna as temperaturas para copiar o DNA. Seu sistema óptico mede a fluorescência a cada ciclo.",
        "Aproximar a tela",
        "A placa entra no termociclador com o tubo encaixado.",
      ],
      [
        "Tela do termociclador",
        "A simulação representa 35 a 40 ciclos. Vamos observar o primeiro em detalhe e acelerar os restantes até o ciclo 40.",
        "Ver desnaturação",
        "Acompanhe as fases do ciclo e a leitura óptica na tela.",
      ],
      [
        "Desnaturação",
        "As pontes de hidrogênio entre as fitas se rompem e a fita dupla se separa em duas fitas simples.",
        "Ver anelamento",
        "As linhas pontilhadas representam as pontes de hidrogênio.",
      ],
      [
        "Anelamento",
        "Os primers se encaixam nas regiões complementares. Eles indicam onde começa a síntese de cada fita nova.",
        "Ver extensão",
        "Amarelo = primers. Azul e lilás = fitas molde.",
      ],
      [
        "Extensão",
        "A DNA polimerase avança a partir de cada primer e incorpora dNTPs à fita nova. Ao final desta fase, o marcador fluoresce e o sensor do aparelho capta o sinal.",
        "Ver o primeiro ponto",
        "Laranja = polimerase. Os pontos mostram os dNTPs sendo incorporados.",
      ],
      [
        "Leitura óptica · ciclo 1",
        "O detector lê a fluorescência do marcador. Essa primeira leitura aparece como um ponto no gráfico, próximo à linha de base.",
        "Acelerar ciclos 2 a 40",
        "O primeiro ciclo foi mostrado em detalhe.",
      ],
      [
        "Ciclos acelerados",
        "A reação ilustrada representa 35 a 40 ciclos. Neste exemplo, mostramos 40. Cada leitura acrescenta um ponto por amostra e por controle.",
        "",
        "Ao início, o sinal fica próximo à linha de base. Ele sobe à medida que o produto se acumula.",
      ],
    ],
  },
  {
    label: "Fluorescência",
    screens: [
      [
        "Como a curva foi construída",
        "Este é o mesmo gráfico montado durante a amplificação. Cada ponto representa uma leitura óptica em um ciclo. A linha pontilhada marca o limiar de fluorescência.",
        "Rever o ciclo 20",
        "Corrida completa · 40 ciclos.",
      ],
      [
        "Pausa no ciclo 20",
        "A cruzou o limiar no ciclo 18. Neste ponto da corrida, B ainda está abaixo da linha.",
        "Voltar à curva completa",
        "Recorte da mesma corrida até o ciclo 20.",
      ],
      [
        "Curva completa",
        "B cruzou o limiar no ciclo 26. O controle negativo permaneceu perto da linha de base.",
        "",
        "A cruza no ciclo 18 e B no ciclo 26.",
      ],
    ],
  },
  {
    label: "Resultados",
    screens: [
      [
        "Qual começou com mais alvo?",
        "Ct é o ciclo em que a curva cruza o limiar. As duas amostras fictícias foram comparadas para o mesmo alvo e nas mesmas condições. Qual começou com mais material-alvo?",
        "",
        "Ct de A = 18. Ct de B = 26. Controle negativo sem cruzamento.",
      ],
    ],
  },
];

let chapter = 0;
let step = 0;
let unlocked = 0;
let answer = "";
let prediction = "";
let frame = 0;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const animationTimes = [820, 1500, 1600, 1600, 2300];
const pcrTimes = {
  [PCR.plate]: 1800,
  [PCR.zoom]: 1700,
  [PCR.loaded]: 2200,
  [PCR.denaturation]: 2200,
  [PCR.annealing]: 2200,
  [PCR.extension]: 3300,
  [PCR.reading]: 2500,
  [PCR.run]: 7600,
};
const sceneModes = [
  "Bancada de coleta",
  "Bancada de extração",
  "Preparo da reação",
  "Termociclador",
  "Monitor de fluorescência",
  "Monitor de fluorescência",
];
const hotspots = [
  [[50, 45]],
  [[53, 49]],
  Array.from({ length: closedTube }, () => [57, 54]),
  [
    [60, 63],
    [72, 68],
    [78, 40],
    [78, 63],
    [82, 52],
    [79, 57],
    [88, 66],
    [82, 48],
  ],
  [
    [78, 52],
    [81, 49],
  ],
];
const mix = (from, to, progress) => from + (to - from) * progress;
const unit = (value) => Math.max(0, Math.min(1, value));
const nodes = {};
for (const id of [
  "kicker",
  "heading",
  "detail",
  "choices",
  "action",
  "feedback",
  "caption",
  "back",
  "next",
  "chapters",
  "replay",
  "hotspot",
  "scene-mode",
  "scene-status",
  "progress",
  "phase-note",
])
  nodes[id] = byId(id);

function text(value, x, y, color = palette.cream, size = 21, align = "center") {
  ctx.fillStyle = color;
  ctx.font = "bold " + size + 'px "Courier New", monospace';
  ctx.textAlign = align;
  ctx.fillText(value, x, y);
}
function line(x, y, endX, endY, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function tube(x, y, color, label, capLift = 0) {
  ctx.fillStyle = "#587173";
  ctx.strokeStyle = "#aec8c8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 42, y);
  ctx.lineTo(x - 34, y + 119);
  ctx.quadraticCurveTo(x - 30, y + 151, x, y + 183);
  ctx.quadraticCurveTo(x + 30, y + 151, x + 34, y + 119);
  ctx.lineTo(x + 42, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 30, y + 108);
  ctx.lineTo(x + 30, y + 108);
  ctx.quadraticCurveTo(x + 31, y + 144, x, y + 173);
  ctx.quadraticCurveTo(x - 31, y + 144, x - 30, y + 108);
  ctx.fill();
  ctx.fillStyle = "#b7d4cd";
  ctx.fillRect(x - 48, y - 17 - capLift, 96, 22);
  for (let i = 1; i <= 3; i++)
    line(x + 13, y + i * 25, x + 33, y + i * 25, "#a5bfb7", 2);
  if (label) text(label, x, y + 226, palette.cream, 19);
}
function strand(y, color, start = 160, end = 560) {
  line(start, y, end, y, color, 5);
  for (let x = start + 10; x < end; x += 20) line(x, y - 7, x, y + 7, color, 3);
}
function bonds(top, bottom, start = 160, end = 560) {
  for (let x = 170; x < 560; x += 20) {
    if (x >= start && x <= end) line(x, top + 7, x, bottom - 7, "#c7e0dd", 2);
  }
}
function graph(end, cursor = null) {
  const left = 96,
    right = 648,
    top = 54,
    bottom = 306;
  const limit = 0.31;
  const px = (cycle) => left + ((right - left) * cycle) / totalCycles;
  const py = (signal) => bottom - (bottom - top) * signal;
  ctx.fillStyle = "#172627";
  ctx.fillRect(left, top, right - left, bottom - top);
  for (let i = 0; i <= 40; i += 5) {
    line(px(i), top, px(i), bottom, "#405859", 1);
    text(i, px(i), bottom + 25, palette.gray, 15);
  }
  for (let i = 0; i <= 4; i++)
    line(left, py(i / 4), right, py(i / 4), "#405859", 1);
  line(left, top, left, bottom, palette.gray);
  line(left, bottom, right, bottom, palette.gray);
  ctx.save();
  ctx.setLineDash([8, 6]);
  line(left, py(limit), right, py(limit), palette.gold);
  ctx.restore();
  text("Limiar", right - 8, py(limit) - 10, palette.gold, 17, "right");
  text("Fluorescência", left, 34, palette.cream, 18, "left");
  text("Ciclos", right, 355, palette.cream, 18, "right");
  text(
    "CICLO " + end + " / " + totalCycles,
    right,
    34,
    palette.cyan,
    18,
    "right",
  );
  line(left, py(0.043), right, py(0.043), "#abc4b088", 1);
  text("Linha de base", right - 8, py(0.043) - 10, palette.gray, 17, "right");
  if (cursor !== null) {
    ctx.save();
    ctx.globalAlpha = 0.38;
    line(px(cursor), top, px(cursor), bottom, palette.cyan, 1.5);
    ctx.restore();
  }

  const curves = [
    { cq: 18, color: palette.cyan, max: 0.88, dash: [] },
    { cq: 26, color: palette.green, max: 0.78, dash: [8, 4] },
    { cq: null, color: palette.gray, max: 0, dash: [2, 5] },
  ];
  for (const { cq, color, max, dash } of curves) {
    const background = 0.043;
    const shift =
      cq === null ? 0 : Math.log((max - background) / (limit - background) - 1);
    const signal = (cycle) =>
      cq === null
        ? background + 0.004 * Math.sin(cycle * 0.95)
        : background +
          (max - background) / (1 + Math.exp(shift - (cycle - cq) * 0.46));
    ctx.save();
    ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(px(1), py(signal(1)));
    for (let cycle = 2; cycle <= end; cycle++)
      ctx.lineTo(px(cycle), py(signal(cycle)));
    ctx.stroke();
    ctx.restore();
    for (let cycle = 1; cycle <= end; cycle++)
      circle(px(cycle), py(signal(cycle)), 2.3, color);
    if (cursor !== null) circle(px(cursor), py(signal(cursor)), 4.5, color);
    if (cq !== null && end >= cq) {
      circle(px(cq), py(limit), 5, color);
      text("Ct " + cq, px(cq), py(limit) + 25, color, 16);
    }
  }
  text("A ━", 145, 383, palette.cyan, 18);
  text("B ┄", 239, 383, palette.green, 18);
  text("Controle negativo ⋯", 430, 383, palette.gray, 18);
}
function benchSurface() {
  const surface = ctx.createLinearGradient(0, 252, 0, 405);
  surface.addColorStop(0, "#213833");
  surface.addColorStop(1, "#132725");
  ctx.fillStyle = surface;
  ctx.fillRect(0, 252, 720, 153);
  line(0, 252, 720, 252, "#739084", 2);
  for (let x = -360; x <= 1080; x += 120)
    line(mix(360, x, 0.32), 252, x, 405, "#426359", 1);
  for (const y of [272, 302, 353]) line(0, y, 720, y, "#426359", 1);
}

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function plate(x, y, scale, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  rect(-172, -63, 344, 140, "#152923");
  rect(-172, -69, 344, 132, "#8aa9a0");
  rect(-163, -62, 326, 116, "#57776f");
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 3; row++) {
      const cx = (col - 3.5) * 41;
      const cy = (row - 1) * 35;
      circle(cx, cy, 13, "#adc6b8");
      circle(cx, cy, 10, "#263d39");
    }
  }
  circle(20.5, 0, 16, palette.gold);
  circle(20.5, 0, 11, filled ? "#85c8ad" : "#263d39");
  ctx.restore();
}
function reactionTube(x, y, scale, capLift, contents) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  tube(0, 0, contents ? "#85c8ad" : "#587173", "", capLift);
  ctx.restore();
}
function prepScene(progress) {
  benchSurface();
  const component = components[step - 1];
  const transferred = Math.min(
    components.length,
    Math.max(0, step - 1) + Number(Boolean(component) && progress >= 0.8),
  );
  const capLift = step === closedTube ? 38 * (1 - progress) : 38;
  text("TUBO DE PCR", 360, 49, palette.gold, 25);
  reactionTube(360, 137, 1, capLift, transferred);
  components.forEach(({ short, color }, index) => {
    const x = 64 + index * 118;
    circle(x, 365, 5, index < transferred ? color : "#536d63");
    text(short, x, 391, index < transferred ? color : palette.gray, 15);
  });
  if (!component) return;
  const drop = unit((progress - 0.13) / 0.67);
  if (drop < 1) {
    ctx.save();
    ctx.translate(405, 77);
    ctx.rotate(0.52);
    rect(-14, 0, 28, 48, "#bdd1c8");
    rect(-3, 47, 6, 23, "#bdd1c8");
    ctx.restore();
    circle(mix(370, 360, drop), mix(142, 254, drop), 7, component.color);
  } else {
    circle(360, 254, 7, component.color);
  }
}
function mountScene(progress) {
  benchSurface();
  text("TUBO E PLACA DE SUPORTE", 360, 49, palette.gold, 24);
  plate(449, 260, 1.05, false);
  const mounted = step === PCR.plate ? progress : 0;
  const x = mix(205, 470, mounted);
  const y = mix(158, 172, mounted) - 43 * Math.sin(Math.PI * mounted);
  reactionTube(x, y, 0.48, 0, true);
  text(
    step === PCR.plate && progress === 1
      ? "Tubo encaixado na posição destacada"
      : "Tubo fechado",
    360,
    359,
    palette.cream,
    20,
  );
}
function displayFrame() {
  rect(10, 10, 700, 385, "#304b44");
  rect(16, 16, 688, 373, "#172923");
  text("TELA DO TERMOCICLADOR", 35, 39, palette.cyan, 18, "left");
}
function instrumentScene(progress) {
  benchSurface();
  text("TERMOCICLADOR DE TEMPO REAL", 360, 49, palette.gold, 23);
  rect(280, 83, 333, 242, "#93afa5");
  rect(293, 96, 307, 216, "#2d4945");
  rect(312, 180, 272, 120, "#182923");
  rect(351, 113, 193, 55, "#172923");
  text("SISTEMA ÓPTICO", 447, 146, palette.green, 18);
  const slide = step === PCR.loaded ? progress : 1;
  const x = mix(145, 446, slide);
  const y = mix(307, 258, slide);
  plate(x, y, 0.63, false);
  reactionTube(x + 13, y - 55, 0.3, 0, true);
  text("Placa e tubo sob o módulo óptico", 360, 362, palette.cream, 20);
  if (step === PCR.zoom) {
    const scale = mix(0.27, 1, progress);
    ctx.save();
    ctx.translate(mix(447, 360, progress), mix(140, 202, progress));
    ctx.scale(scale, scale);
    ctx.translate(-360, -202);
    displayFrame();
    text("CICLO 01 / 40", 360, 176, palette.green, 40);
    text("35 A 40 CICLOS · EXEMPLO COM 40", 360, 225, palette.gray, 22);
    text("Pronto para iniciar o ciclo", 360, 293, palette.gold, 21);
    ctx.restore();
  }
}
function cycleScene(ease, phase = step) {
  displayFrame();
  text("CICLO 01 / 40", 681, 39, palette.green, 18, "right");
  text(phaseInfo[phase], 360, 88, palette.gold, 26);
  if (phase === PCR.denaturation) {
    const top = mix(180, 135, ease);
    const bottom = mix(204, 251, ease);
    ctx.save();
    ctx.setLineDash([3, 4]);
    for (let x = 170; x < 560; x += 20) {
      const remaining = unit(1 - ease * 1.5 + Math.abs(x - 360) / 600);
      if (remaining > 0 && ease < 1) {
        ctx.globalAlpha = remaining;
        line(x, top + 7, x, bottom - 7, palette.gray, 2);
      }
    }
    ctx.restore();
    strand(top, palette.cyan);
    strand(bottom, palette.purple);
    text("PONTES DE HIDROGÊNIO", 360, 342, palette.gold, 21);
  } else if (phase === PCR.annealing) {
    strand(135, palette.cyan);
    strand(251, palette.purple);
    const offset = (1 - ease) * 40;
    line(448, 157 + offset, 550, 157 + offset, palette.gold, 8);
    line(170, 229 - offset, 272, 229 - offset, palette.gold, 8);
    text("PRIMERS", 360, 342, palette.gold, 21);
  } else {
    strand(135, palette.cyan);
    strand(251, palette.purple);
    const leftTip = mix(448, 160, ease);
    const rightTip = mix(272, 560, ease);
    strand(157, palette.purple, leftTip, 560);
    strand(229, palette.cyan, 160, rightTip);
    bonds(135, 157, leftTip, 560);
    bonds(229, 251, 160, rightTip);
    line(448, 157, 550, 157, palette.gold, 8);
    line(170, 229, 272, 229, palette.gold, 8);
    if (ease < 1) {
      circle(leftTip, 157, 14, "#ffaf82");
      circle(rightTip, 229, 14, "#ffaf82");
      const supply = (ease * 11) % 1;
      circle(leftTip, mix(111, 157, supply), 5, palette.purple);
      circle(rightTip, mix(274, 229, supply), 5, palette.cyan);
    }
    circle(169, 335, 8, "#ffaf82");
    text("Polimerase", 188, 341, palette.cream, 20, "left");
    circle(440, 335, 6, palette.purple);
    text("dNTPs", 456, 341, palette.cream, 20, "left");
    if (ease > 0.91) {
      const glow = unit((ease - 0.91) / 0.09);
      ctx.save();
      ctx.shadowBlur = 22 * glow;
      ctx.shadowColor = palette.green;
      circle(610, 192, 8 + 7 * glow, palette.green);
      line(610, 177, 610, 123, palette.green, 3);
      rect(590, 110, 40, 13, "#729a70");
      ctx.restore();
      text("Sensor", 650, 121, palette.green, 15);
      text("Sinal captado", 608, 281, palette.green, 16);
    }
  }
}

function draw(progress = 1) {
  ctx.clearRect(0, 0, 720, 405);
  const ease = progress * progress * (3 - 2 * progress);
  if (chapter < 2) benchSurface();
  if (chapter === 0) {
    text("AMOSTRA PARA ANÁLISE", 360, 60, palette.gold, 23);
    const registered = step > 0 && progress > 0.65;
    tube(
      360,
      112,
      registered ? palette.cyan : "#a5b8b4",
      registered ? "AMOSTRA REGISTRADA" : "AMOSTRA VIRTUAL",
      step ? 26 * (1 - ease) : 26,
    );
    if (registered) {
      ctx.fillStyle = palette.cream;
      ctx.fillRect(333, 159, 54, 32);
      text("01", 360, 180, "#294344", 14);
    }
  } else if (chapter === 1) {
    tube(222, 102, "#a9a783", "AMOSTRA");
    for (const [x, y, r] of [
      [207, 155, 7],
      [238, 166, 5],
      [219, 183, 5],
      [230, 194, 4],
      [212, 205, 3],
    ]) {
      circle(x, y, r, palette.gold);
    }
    line(306, 201, 404, 201, step ? palette.gold : palette.gray, 3);
    text("›", 403, 211, step ? palette.gold : palette.gray, 36);
    tube(
      500,
      102,
      step && progress > 0.7 ? palette.cyan : "#617d7c",
      step && progress > 0.7 ? "EXTRATO COM DNA" : "EXTRATO",
    );
    if (step) {
      for (const [index, [x, y]] of [
        [494, 159],
        [510, 181],
        [493, 203],
      ].entries()) {
        const travel = unit(ease * 1.26 - index * 0.13);
        const currentX = mix(235, x, travel);
        const currentY = mix(178, y, travel) - 42 * Math.sin(travel * Math.PI);
        line(currentX - 9, currentY, currentX + 9, currentY, palette.cyan, 4);
      }
    }
  } else if (chapter === 2) {
    prepScene(progress);
  } else if (chapter === 3) {
    if (step <= PCR.plate) mountScene(ease);
    else if (step <= PCR.zoom) instrumentScene(ease);
    else if (step <= PCR.extension) cycleScene(ease);
    else if (step === PCR.reading && progress < 0.35)
      cycleScene(1, PCR.extension);
    else {
      const end =
        step === PCR.reading ? 1 : 1 + Math.floor(progress * (totalCycles - 1));
      graph(end, progress < 1 ? end : null);
    }
  } else {
    const end = chapter === 4 && step === 1 ? 20 : totalCycles;
    const from = step === 2 ? 20 : 1;
    graph(
      end,
      chapter === 4 && progress < 1
        ? Math.floor(mix(from, end, progress))
        : null,
    );
  }
}
function playScene() {
  if (reducedMotion.matches) return;
  const duration =
    chapter === 3
      ? (pcrTimes[step] ?? animationTimes[chapter])
      : animationTimes[chapter];
  const started = performance.now();
  nodes.replay.disabled = true;
  nodes.hotspot.hidden = true;
  if (chapter === 3 && step === PCR.reading) byId("plot-labels").hidden = true;
  byId("prediction").hidden = true;
  nodes["scene-status"].textContent = "Em andamento";
  nodes.action.disabled = true;
  nodes.next.disabled = true;
  const [, detail, , caption] = chapters[chapter].screens[step];
  if (chapter === 3 && step === PCR.run) {
    nodes.caption.textContent =
      "Cada novo ponto corresponde à leitura de mais um ciclo.";
  }
  draw(0);
  function tick(now) {
    const progress = unit((now - started) / duration);
    if (chapter === 3 && step === PCR.reading && progress >= 0.35)
      byId("plot-labels").hidden = false;
    draw(progress);
    if (progress < 1) {
      frame = requestAnimationFrame(tick);
      return;
    }
    frame = 0;
    nodes.replay.disabled = false;
    nodes.action.disabled = false;
    nodes.next.disabled = !nodes.action.hidden;
    nodes.detail.textContent = detail;
    nodes.caption.textContent = caption;
    updateStage(chapters[chapter].screens[step][2]);
  }
  frame = requestAnimationFrame(tick);
}
function updateStage(action) {
  byId("plot-labels").hidden =
    chapter < 4 && !(chapter === 3 && step >= PCR.reading);
  nodes["scene-mode"].textContent = sceneModes[chapter];
  nodes["scene-status"].textContent = action
    ? "Aguardando ação"
    : chapter === 5
      ? "Interpretação"
      : "Etapa concluída";
  nodes.hotspot.hidden = !action;
  byId("prediction").hidden = chapter !== 4 || step !== 1;
  if (!action) return;
  const [x, y] = hotspots[chapter][step];
  nodes.hotspot.style.setProperty("--x", x + "%");
  nodes.hotspot.style.setProperty("--y", y + "%");
  nodes.hotspot.setAttribute("aria-label", action);
  nodes.hotspot.title = action;
}
function render(moveFocus = false, animate = false) {
  cancelAnimationFrame(frame);
  frame = 0;
  const current = chapters[chapter].screens;
  const [heading, detail, action, caption] = current[step];
  nodes.kicker.textContent =
    "CAPÍTULO " + (chapter + 1) + " / " + chapters.length;
  nodes.heading.textContent = heading;
  nodes.detail.textContent = detail;
  const phase = chapter === 3 ? phaseInfo[step] : "";
  nodes["phase-note"].hidden = !phase;
  nodes["phase-note"].textContent = phase ? phase + " · valor ilustrativo" : "";
  nodes.caption.textContent = caption;
  canvas.setAttribute("aria-label", heading);
  nodes.action.textContent = action;
  nodes.action.hidden = !action;
  nodes.action.disabled = false;
  nodes.progress.value = chapter + 1;
  updateStage(action);
  nodes.replay.hidden = step === 0 || chapter === 5 || reducedMotion.matches;
  nodes.replay.disabled = false;
  nodes.choices.hidden = chapter !== 5;
  nodes.back.disabled = chapter === 0 && step === 0;
  nodes.next.disabled = Boolean(action);
  nodes.next.hidden = chapter === 5;
  nodes.next.textContent =
    chapter === 4 && step === 2
      ? "Interpretar resultados ▶"
      : chapter === 3 && step === PCR.run
        ? "Ler fluorescência ▶"
        : "Avançar ▶";
  nodes.feedback.textContent = "";
  if (chapter === 5 && answer) showAnswer();
  for (const [index, button] of [...nodes.chapters.children].entries()) {
    button.disabled = index > unlocked;
    button.classList.toggle("visited", index < unlocked);
    if (index === chapter) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  }
  if (animate && !reducedMotion.matches) playScene();
  else draw();
  if (moveFocus) nodes.heading.focus();
}
function showAnswer() {
  for (const button of nodes.choices.children) {
    button.setAttribute("aria-pressed", String(button.value === answer));
    button.classList.toggle("incorrect", button.value !== "A");
  }
  const why =
    "A amostra A cruzou primeiro (Ct 18) e começou com mais material-alvo neste cenário.";
  nodes.feedback.textContent =
    answer === "A"
      ? "Correto. " +
        why +
        " O alvo foi detectado nas duas amostras fictícias. O controle negativo ficou abaixo do limiar, como esperado."
      : answer === "B"
        ? "Compare a ordem dos cruzamentos. " + why
        : "As condições são iguais na simulação. " + why;
}

for (const [index, item] of chapters.entries()) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chapter";
  button.textContent = index + 1 + ". " + item.label;
  button.addEventListener("click", () => {
    chapter = index;
    step = 0;
    render(true);
  });
  nodes.chapters.append(button);
}
for (const [value, label] of [
  ["A", "Amostra A"],
  ["B", "Amostra B"],
  ["incerto", "Não dá para comparar"],
]) {
  const button = document.createElement("button");
  button.type = "button";
  button.value = value;
  button.textContent = label;
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    answer = value;
    showAnswer();
  });
  nodes.choices.append(button);
}
nodes.action.addEventListener("click", () => {
  step++;
  render(true, true);
});
function updatePrediction() {
  byId("guess-yes").setAttribute("aria-pressed", String(prediction === "yes"));
  byId("guess-no").setAttribute("aria-pressed", String(prediction === "no"));
  byId("guess-yes").classList.toggle("incorrect", true);
  byId("prediction-feedback").textContent = {
    yes: "Até aqui, B ainda está abaixo do limiar. Avance para ver o restante da corrida.",
    no: "Isso. Ainda há ciclos pela frente. Avance para ver a curva de B.",
    "": "",
  }[prediction];
}
for (const choice of ["yes", "no"]) {
  byId("guess-" + choice).addEventListener("click", () => {
    prediction = choice;
    updatePrediction();
  });
}
nodes.hotspot.addEventListener("click", () => nodes.action.click());
nodes.replay.addEventListener("click", () => {
  nodes.heading.focus();
  playScene();
});
reducedMotion.addEventListener("change", () => render());
nodes.next.addEventListener("click", () => {
  chapter++;
  step = 0;
  unlocked = Math.max(unlocked, chapter);
  render(true);
});
nodes.back.addEventListener("click", () => {
  if (step > 0) step--;
  else {
    chapter--;
    step = chapters[chapter].screens.length - 1;
  }
  render(true);
});
byId("start").addEventListener("click", () => {
  byId("intro").hidden = true;
  byId("game").hidden = false;
  render(true);
});
const fullscreen = byId("fullscreen");
const lab = document.querySelector(".lab");
fullscreen.hidden =
  !document.fullscreenEnabled || typeof lab.requestFullscreen !== "function";
fullscreen.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement === lab) await document.exitFullscreen();
    else await lab.requestFullscreen();
  } catch {
    fullscreen.hidden = true;
  }
});
document.addEventListener("fullscreenchange", () => {
  const active = document.fullscreenElement === lab;
  fullscreen.textContent = active ? "Sair da tela cheia" : "Tela cheia";
  fullscreen.setAttribute("aria-pressed", String(active));
});
byId("reset").addEventListener("click", () => {
  chapter = 0;
  step = 0;
  unlocked = 0;
  answer = "";
  prediction = "";
  updatePrediction();
  for (const button of nodes.choices.children)
    button.setAttribute("aria-pressed", "false");
  render(true);
});
function drawTitle() {
  const title = byId("title").getContext("2d");
  title.font = 'bold 63px "Courier New", monospace';
  title.textBaseline = "top";
  title.fillText("PCR EM TEMPO REAL", 0, -5);
  const mask = title.getImageData(0, 0, 720, 65).data;
  title.clearRect(0, 0, 720, 65);
  const colors = ["#ffe46c", "#ffd23b", "#ed9937", "#b4e677"];
  for (let y = 0; y < 65; y += 3) {
    for (let x = 0; x < 720; x += 3) {
      if (mask[(y * 720 + x) * 4 + 3] < 100) continue;
      title.fillStyle = colors[(x / 3 + (y / 3) * 3) % colors.length];
      title.fillRect(x, y, 2, 2);
    }
  }
}
function drawIntro() {
  const art = byId("intro-art").getContext("2d");
  art.clearRect(0, 0, 460, 460);
  art.save();
  art.translate(230, 230);
  art.rotate(0.32);
  for (let y = -144; y <= 144; y += 12) {
    const angle = y / 35;
    const distance = 69 * Math.sin(angle);
    const cyanDepth = Math.cos(angle);
    art.beginPath();
    art.moveTo(-distance, y);
    art.lineTo(distance, y);
    art.strokeStyle = "#9bc7a86b";
    art.lineWidth = 2;
    art.stroke();
    for (const [x, depth, color] of [
      [distance, cyanDepth, "#71e4ed"],
      [-distance, -cyanDepth, "#ffe46c"],
    ]) {
      art.beginPath();
      art.arc(x, y, 5 + 2 * depth, 0, Math.PI * 2);
      art.fillStyle = color;
      art.globalAlpha = 0.76 + 0.24 * depth;
      art.fill();
    }
    art.globalAlpha = 1;
  }
  art.restore();
}
drawTitle();
drawIntro();
render();
