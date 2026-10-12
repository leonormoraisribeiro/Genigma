/* =====================================================================
   GENIGMA — textos em português (PT-PT), inglês e dinamarquês.
   Cada idioma tem a mesma estrutura. Para corrigir um texto, muda-o aqui.
   As letras dos alelos estão em "ltr" de cada característica (ex.: ltr: ["L", "M"]).
   Evita A, B e C nas letras: são os nomes dos casais.
   As funções recebem "h" (ajudantes do jogo):
     h.cp(c, cap)  → nome do casal com cor ("casal A" / "Casal A")
     h.gt(t, x)    → par de letras (t = 0 cor, 1 cabeça, 2 corpo; x = 0/1/2)
     h.al(t, a)    → uma letra (a = 0 ou 1)
     h.fig(f, txt) → monstrinho pequeno com legenda por baixo (página 3 da ajuda)
     h.T(chave, palavra) → palavra com sublinhado e "i" (abre o glossário)
     h.icoU(i) / h.icoP(k) → monstrinho pequeno (filho i / progenitor k) dentro do texto
     h.key()       → tabela pequena com os 9 aspetos
   ===================================================================== */
const I18N = {

/* ------------------------------------------------------------------ PORTUGUÊS (PT-PT, "tu") */
pt: {
  name: "Português", short: "PT", locale: "pt-PT",
  days: ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"],
  tier: {easy: "Fácil", normal: "Normal", hard: "Difícil"},
  traits: [
    {name: "cor", looks: ["Azul", "Verde", "Amarelo"], al: ["azul", "amarelo"], ltr: ["L", "M"],
     phr: ["filhos azuis", "filhos verdes", "filhos amarelos"]},
    {name: "cabeça", looks: ["Cornos", "Unicórnio", "Antenas"], al: ["corno", "antena"], ltr: ["R", "N"],
     phr: ["filhos com cornos", "filhos com corno de unicórnio", "filhos com antenas"]},
    {name: "forma do corpo", looks: ["Quadrado", "Redondo", "Triângulo"], al: ["quadrado", "triângulo"], ltr: ["Q", "T"],
     phr: ["filhos quadrados", "filhos redondos", "filhos triangulares"]}
  ],
  cp: (c, cap) => (cap ? "Casal " : "casal ") + c,
  termWord: {allele: "alelo", homozygous: "homozigótico", heterozygous: "heterozigótico", dominance: "dominância incompleta",
             genotype: "genótipo", trait: "característica", inherit: "herdar"},
  ui: {
    heroLead: "Usa a genética. Segue as pistas. Devolve cada filho aos pais certos.",
    daily: "Caso do dia", dailyIdle: "Um novo puzzle de hereditariedade por dia.",
    play: "Jogar →", view: "Ver →", cont: "Continuar →",
    solvedIn: (n, max, time) => `Resolvido em ${n}/${max} · ${time}`,
    notSolved: "Desta vez não deu. Amanhã há um caso novo!",
    inProgress: "Em curso",
    nextIn: t => `Próximo caso em ${t}`,
    schedule: "Fácil seg–ter · Normal qua–sex · Difícil ao fim de semana",
    practice: "Treino", practiceSub: "Casos ilimitados, ao teu ritmo.",
    modeDesc: {easy: "Poucos pais escondidos, raciocínios curtos.", normal: "O desafio clássico do Genigma.", hard: "Raciocínios longos e do tipo “e se?”."},
    modeCont: "Continuar", modeCases: n => `${n} casos`,
    tutNew: "Primeira vez? Faz o tutorial →", tutReplay: "Repetir o tutorial →", tutSmall: "Um caso guiado, passo a passo. Cerca de 2 minutos.",
    homeFoot: "Um puzzle diário de lógica e genética.",
    backAria: "Voltar", helpAria: "Como jogar e guia de genética", close: "Fechar", time: "Tempo",
    gameSub: "Os filhos de três casais de monstros ficaram todos trocados. Cada casal tem exatamente 2 filhos.",
    couples: "Os casais", clues: "As pistas", tapCross: "Toca para riscar", babies: "Os filhos perdidos",
    hint: "Toca no A, B ou C uma vez para excluir (✕), duas vezes para escolher (✓) e uma terceira vez para limpar.",
    tutorial: "Tutorial", guided: "Caso guiado", practiceTitle: "Treino", practiceCase: "Caso de treino", dayCase: d => `Caso de ${d}`,
    mother: "Mãe", father: "Pai", mum: "Mãe", dad: "Pai",
    hidden: fem => fem ? "Escondida: vê as pistas" : "Escondido: vê as pistas", hiddenShort: fem => fem ? "escondida" : "escondido", was: fem => fem ? "estava escondida" : "estava escondido",
    couple: c => `Casal ${c}`, baby: n => `Filho #${n}`, babyAria: n => `Filho ${n}`,
    clueAria: n => `Pista ${n}: riscar`,
    states: ["por decidir", "excluído", "escolhido"], chipAria: (n, c, s) => `Filho ${n}, casal ${c}: ${s}`,
    check: n => `Verificar · ${n === 1 ? "resta 1" : "restam " + n}`, placed: n => `${n}/6 filhos colocados`, over: (c, n) => `O casal ${c} tem ${n} filhos (máx. 2)`,
    nextCase: "Próximo caso →", share: "Partilhar", shareResult: "Partilhar resultado", reset: "Recomeçar", home: "Início", playToday: "Jogar o caso de hoje →",
    endWin: "Caso resolvido!", endLose: "Caso encerrado", endTut: "Aqui está quem era quem, incluindo o pai escondido:",
    endLoseSub: "As famílias certas estão marcadas acima. Aqui está quem era quem:", endWinSub: (n, max, time) => `${n} de ${max} tentativas · ${time}`,
    errPick: "Escolhe um casal ✓ para cada filho.", errCount: "Cada casal tem de ter exatamente 2 filhos.",
    outOf: "Acabaram as tentativas. Aqui está a solução.", notQuite: n => n === 1 ? "Ainda não. Resta 1 tentativa." : `Ainda não. Restam ${n} tentativas.`,
    confirmRestart: "Recomeçar este caso do zero? O resultado e as tentativas vão ser apagados.",
    nothing: "Ainda não há nada para limpar.", cleared: "Marcas apagadas.", undo: "Desfazer", restored: "Marcas repostas.",
    shareHead: (daily, num, tier) => daily ? `Genigma #${num} · ${tier}` : `Genigma · treino · ${tier}`,
    shareWin: (n, max, time) => `Resolvido em ${n}/${max} · ⏱ ${time}`, shareLose: max => `Não resolvido (${max}/${max})`,
    copied: "Resultado copiado.", copyFail: "Não foi possível copiar o resultado neste dispositivo.",
    winTitle: "Caso resolvido!", winStats: (n, tier, daily) => `${n} ${n === 1 ? "tentativa" : "tentativas"} · ${tier} · ${daily ? "caso do dia" : "treino"}`,
    families: "As famílias", done: "Fechar",
    wTitle: "Boas-vindas ao Genigma", wLead: "Um puzzle de lógica diário com uma pitada de genética.",
    w1: "Todos os dias, os filhos de três casais de monstros ficam trocados.", w2: "Lê o aspeto deles e as pistas para devolver cada filho aos pais.",
    w3: h => `Não precisas de saber biologia: toca em palavras como ${h.T("allele")} ou ${h.T("homozygous")} para veres o que querem dizer.`,
    wTut: "Mostra-me como se joga", wSkip: "Saltar, eu desenrasco-me", wNote: "O tutorial é um caso guiado e demora cerca de 2 minutos.",
    helpTitles: ["Como jogar", "Guia de genética", "Como se herda o aspeto", "Ler as pistas"],
    help1: "Os filhos de três casais de monstros ficaram trocados. Usa o aspeto dos monstros e as pistas para descobrir quais são os <b>dois filhos</b> de cada casal.",
    legend: ["Por decidir", "Um toque: excluído", "Dois toques: é filho deles"],
    help1small: "Usa o ✕ para tomar notas. Quando cada filho tiver um ✓ e cada casal tiver 2 filhos, verifica a resposta. Tens 3 tentativas. Toca numa pista para a riscar depois de a usares.",
    replay: "Repetir o tutorial →", back: "← Voltar", next: "Seguinte →", gotIt: "Percebi",
    guideIntro: h => `Cada característica tem dois ${h.T("allele", "alelos")}, escritos como letras, e mostra ${h.T("dominance")}: um monstro com uma letra de cada tem um terceiro aspeto, intermédio. Por isso, basta olhares para um monstro para saberes as suas duas letras (o seu ${h.T("genotype")}). As caras são só para dar graça: não se herdam. Um progenitor com <b>?</b> está escondido; as pistas falam sobre ele.`,
    rules: h => `<p class="small">Cada progenitor dá <b>uma</b> das suas duas letras a cada filho.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([2, 0, 1], h.gt(0, 2))}<span class="op">→</span>${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">${h.gt(0, 0)} só pode dar ${h.al(0, 0)} e ${h.gt(0, 2)} só pode dar ${h.al(0, 1)}. Por isso, todos os filhos são ${h.gt(0, 1)}: verdes.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">O azul só dá ${h.al(0, 0)}; o verde dá ${h.al(0, 0)} ou ${h.al(0, 1)}. Os filhos podem ser azuis ou verdes, mas nunca amarelos.</p>
      <div class="eq">${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}${h.fig([2, 0, 1], h.gt(0, 2))}</div>
      <p class="small">Dois verdes podem dar qualquer uma das letras, por isso os filhos podem ter qualquer cor.</p>
      <p class="small">A cabeça e a forma do corpo funcionam exatamente da mesma maneira.</p>`,
    decode: h => `<p class="small">As pistas dizem-te coisas que não consegues ver nos desenhos. Eis o que quer dizer cada tipo de pista:</p>
      <dl class="decode">
        <dt>“…é ${h.T("homozygous")} para a cor”</dt><dd>As suas duas letras para a cor são iguais: ${h.gt(0, 0)} ou ${h.gt(0, 2)}. Por isso é azul ou amarelo, nunca verde.</dd>
        <dt>“…é ${h.T("homozygous")} ${h.gt(0, 0)} para a cor”</dt><dd>As suas duas letras para a cor são ${h.al(0, 0)}. Dá ${h.al(0, 0)} a todos os filhos.</dd>
        <dt>“…é ${h.T("heterozygous")} (${h.gt(0, 1)}) para a cor”</dt><dd>Tem uma letra de cada, por isso pode dar qualquer uma.</dd>
        <dt>“…tem pelo menos um ${h.T("allele")} ${h.al(0, 1)} para a cor”</dt><dd>É ${h.gt(0, 1)} ou ${h.gt(0, 2)}. Nunca é ${h.gt(0, 0)}.</dd>
        <dt>“O casal A nunca pode ter filhos amarelos ${h.gt(0, 2)}”</dt><dd>Pelo menos um dos pais não tem ${h.al(0, 1)} para dar, por isso esse progenitor é ${h.gt(0, 0)}.</dd>
        <dt>“O casal A pode ter filhos verdes ${h.gt(0, 1)}”</dt><dd>Um dos pais consegue dar ${h.al(0, 0)} e o outro consegue dar ${h.al(0, 1)}.</dd>
        <dt>“Os filhos #2 e #5 são do mesmo casal”</dt><dd>Têm os mesmos pais. “De casais diferentes” quer dizer o contrário.</dd>
      </dl>
      <p class="small">As pistas sobre a cabeça e a forma do corpo leem-se da mesma maneira.</p>`,
    sLang: "Idioma", sTheme: "Tema", sAuto: "Automático", sAutoSub: "Segue o teu dispositivo", sLight: "Claro", sDark: "Escuro",
    archive: "Arquivo", archiveLink: "Arquivo de casos", archiveSub: (n, s) => `${n} ${n === 1 ? "caso anterior" : "casos anteriores"} · ${s} ${s === 1 ? "resolvido" : "resolvidos"}`,
    archCount: (s, n) => `${s} de ${n} ${n === 1 ? "resolvido" : "resolvidos"}`, archAll: "Todos", archTodo: "Por jogar", archDone: "Resolvidos",
    archEmpty: "Ainda não há casos anteriores. Volta amanhã!", archNone: "Não há casos com este filtro.",
    stSolved: (n, max, time) => `Resolvido · ${n}/${max} · ${time}`, stLost: "Não resolvido", stProg: "Em curso", stNew: "Por jogar",
    coachCount: (n, N) => `${n} de ${N}`, skip: "Saltar tutorial", tutAria: "Tutorial"
  },
  gloss: h => ({
    allele:       {t: "Alelo", d: "Uma versão de um gene. Cada monstro tem dois alelos para cada característica: um da mãe e outro do pai.", ex: `A cor tem dois alelos: ${h.al(0, 0)} azul e ${h.al(0, 1)} amarelo.`},
    homozygous:   {t: "Homozigótico", d: `Os dois alelos de uma característica são iguais, como ${h.gt(0, 0)} ou ${h.gt(0, 2)}. Um progenitor homozigótico só consegue passar esse alelo.`, ex: `Um progenitor amarelo ${h.gt(0, 2)} passa sempre ${h.al(0, 1)}.`},
    heterozygous: {t: "Heterozigótico", d: `Os dois alelos de uma característica são diferentes, como ${h.gt(0, 1)}. Um progenitor heterozigótico pode passar qualquer um deles: é como atirar uma moeda ao ar para cada filho.`, ex: `Um progenitor verde ${h.gt(0, 1)} pode passar ${h.al(0, 0)} ou ${h.al(0, 1)}.`},
    dominance:    {t: "Dominância incompleta", d: "Nenhum alelo ganha: um de cada dá um terceiro aspeto, intermédio. É por isso que consegues sempre saber os alelos de um monstro pelo aspeto.", ex: `${h.gt(0, 1)} = verde · ${h.gt(1, 1)} = unicórnio · ${h.gt(2, 1)} = redondo`},
    genotype:     {t: "Genótipo", d: "O par de alelos que um monstro tem para uma característica, escrito com duas letras.", ex: `O genótipo de cor de um monstro verde é ${h.gt(0, 1)}.`},
    trait:        {t: "Característica", d: "Algo que os pais passam aos filhos. Aqui há três: cor, cabeça e forma do corpo. As caras não contam: são só para dar graça."},
    inherit:      {t: "Herdar", d: "Receber de um progenitor. Cada filho herda, para cada característica, um alelo da mãe e outro do pai."}
  }),
  clue: (k, h) => {
    if (k[0] === "l") return `Os filhos <b>#${k[1] + 1}</b> e <b>#${k[2] + 1}</b> são ${k[3] ? "do mesmo casal" : "de casais diferentes"}.`;
    const TN = ["a cor", "a cabeça", "a forma do corpo"];
    if (k[0] === "c") { const [, c, t, q, can] = k; return `O ${h.cp(c)} ${can ? "pode" : "nunca pode"} ter <b>${I18N.pt.traits[t].phr[q]}</b> ${h.gt(t, q)}.`; }
    const [, p, t, rel] = k, fem = p % 2 === 0, who = `${fem ? "A mãe" : "O pai"} do ${h.cp(p >> 1)}`, o = fem ? "a" : "o";
    if (rel === "het") return `${who} é ${h.T("heterozygous", "heterozigótic" + o)} (${h.gt(t, 1)}) para ${TN[t]}.`;
    if (rel === "hom") return `${who} é ${h.T("homozygous", "homozigótic" + o)} para ${TN[t]}.`;
    if (rel === "hom0" || rel === "hom2") return `${who} é ${h.T("homozygous", "homozigótic" + o)} ${h.gt(t, rel === "hom0" ? 0 : 2)} para ${TN[t]}.`;
    return `${who} tem pelo menos um ${h.T("allele")} ${h.al(t, rel === "has0" ? 0 : 1)} para ${TN[t]}.`;
  },
  tut: [
    {title: "O teu primeiro caso", next: "Vamos lá →",
     text: h => `<p>Três casais de monstros (o ${h.cp(0)}, o ${h.cp(1)} e o ${h.cp(2)}) tiveram exatamente <b>2 filhos</b> cada um. Os filhos ficaram todos trocados.</p><p>A tua missão: devolver cada filho aos pais certos. Eu ajudo-te neste primeiro.</p>`},
    {text: h => `<p>Estes são os pais. Cada monstro tem três ${h.T("trait", "características")}: <b>cor</b>, <b>cabeça</b> e <b>forma do corpo</b>.</p><p>As caras são só para dar graça. Não se herdam, por isso podes ignorá-las.</p>`},
    {title: "Cada aspeto vem de duas letras",
     text: h => `<p>Cada aspeto vem de um par de ${h.T("allele", "alelos")} (duas letras) que se ${h.T("inherit", "herdam")}: um da mãe e outro do pai.</p>${h.key()}<p class="small">O aspeto do meio tem sempre <b>uma letra de cada</b>.</p>`},
    {title: "A regra de ouro",
     text: h => `<p>Um filho recebe <b>uma</b> letra da mãe e <b>uma</b> do pai, para cada característica.</p><p>Por isso, um filho só pode ter letras que os pais lhe consigam dar.</p>`},
    {text: h => `<p>Olha para o ${h.cp(0)}: tanto a mãe como o pai têm <b>cornos</b> ${h.gt(1, 0)}. Só têm ${h.al(1, 0)} para dar…</p><p>…por isso todos os filhos deles também têm de ter cornos.</p>`},
    {doing: "Toca duas vezes no A do #2 e do #5",
     text: h => `<p>Só os filhos <b>#2</b> e <b>#5</b> têm cornos, por isso são do ${h.cp(0)}!</p><p>Toca <b>duas vezes</b> no <b>A</b> de cada um. Um toque quer dizer ✕ (excluído); dois toques querem dizer ✓ (é filho deles).</p>`},
    {text: h => `<p>O ${h.cp(0)} já tem os seus 2 filhos: o contador fica preenchido quando um casal está completo. Mais nenhum filho pode ser deles.</p>`},
    {doing: "Toca uma vez no B do #3",
     text: h => `<p>O filho <b>#3</b> ${h.icoU(2)} é <b>amarelo</b> ${h.gt(0, 2)}, por isso precisa de um ${h.al(0, 1)} de cada progenitor.</p><p>A mãe do ${h.cp(1)} ${h.icoP(2)} é <b>azul</b> ${h.gt(0, 0)}: não tem nenhum ${h.al(0, 1)} para dar. Toca <b>uma vez</b> no <b>B</b> do #3 para excluir o ${h.cp(1)}.</p>`},
    {doing: "Toca duas vezes no C do #3",
     text: h => `<p>O #3 não pode ser do A (já está completo) nem do B. Só sobra o ${h.cp(2)}!</p>`},
    {doing: "Toca duas vezes no B do #1",
     text: h => `<p>O filho <b>#1</b> ${h.icoU(0)} é um <b>triângulo</b> ${h.gt(2, 2)}, por isso precisa de um ${h.al(2, 1)} de cada progenitor.</p><p>A mãe do ${h.cp(2)} ${h.icoP(4)} é um <b>quadrado</b> ${h.gt(2, 0)}: não tem ${h.al(2, 1)}. E o A está completo… por isso o #1 tem de ser do ${h.cp(1)}.</p>`},
    {text: h => `<p>Faltam dois filhos: o <b>#4</b> e o <b>#6</b>. Um é do B e o outro é do C, e só pelo aspeto qualquer um deles podia encaixar…</p><p>…a não ser que descubramos mais sobre o pai do ${h.cp(2)}.</p>`},
    {text: h => `<p>O pai do ${h.cp(2)} tem um <b>?</b>: está escondido, por isso não consegues ver o aspeto dele. É para isso que servem as pistas.</p>`},
    {doing: "Toca na palavra “homozigótico”",
     text: h => `<p>Esta é a pista sobre ele. Toca numa palavra com um pequeno <span class="iDot">i</span> para veres o que quer dizer.</p>`},
    {doing: "Toca duas vezes no B do #4",
     text: h => `<p>Então o pai do C é ${h.gt(1, 0)}: só pode passar ${h.al(1, 0)}.</p><p>O filho <b>#4</b> ${h.icoU(3)} tem <b>antenas</b> ${h.gt(1, 2)} e precisa de um ${h.al(1, 1)} de cada progenitor. O pai do ${h.cp(2)} não tem ${h.al(1, 1)} para lhe dar, por isso o #4 é do ${h.cp(1)}!</p>`},
    {doing: "Toca duas vezes no C do #6",
     text: h => `<p>E o último, o <b>#6</b>, vai para casa do ${h.cp(2)}.</p>`},
    {doing: "Toca na pista",
     text: h => `<p>Já usaste a pista, por isso toca nela para a riscar. Quando há muitas pistas, isto ajuda-te a não te perderes.</p>`},
    {doing: "Toca em “Verificar”",
     text: h => `<p>Cada filho tem um ✓ e cada casal tem 2. Hora de verificar!</p><p class="small">Nos casos a sério tens 3 tentativas.</p>`},
    {title: "Caso resolvido!", next: "Jogar o caso de hoje →", alt: "Voltar ao início",
     text: h => `<p>O jogo é isto. Os casos a sério escondem mais pais e dão mais pistas, mas as regras são sempre estas três:</p><ul><li>Um filho recebe uma letra de <b>cada</b> progenitor.</li><li>Um progenitor com duas letras iguais (como ${h.gt(1, 0)}) só pode dar essa letra.</li><li>Cada casal tem exatamente 2 filhos, por isso vai contando.</li></ul><p class="small">Toca no <b>?</b> durante qualquer caso para veres o guia completo.</p>`}
  ]
},

/* ------------------------------------------------------------------ ENGLISH (British) */
en: {
  name: "English", short: "EN", locale: "en-GB",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  tier: {easy: "Easy", normal: "Normal", hard: "Hard"},
  traits: [
    {name: "colour", looks: ["Blue", "Green", "Yellow"], al: ["blue", "yellow"], ltr: ["L", "Y"],
     phr: ["blue babies", "green babies", "yellow babies"]},
    {name: "head", looks: ["Horns", "Unicorn", "Antennae"], al: ["horn", "antenna"], ltr: ["H", "N"],
     phr: ["babies with horns", "babies with a unicorn horn", "babies with antennae"]},
    {name: "body shape", looks: ["Square", "Round", "Triangle"], al: ["square", "triangle"], ltr: ["S", "T"],
     phr: ["square babies", "round babies", "triangular babies"]}
  ],
  cp: c => "Couple " + c,
  termWord: {allele: "allele", homozygous: "homozygous", heterozygous: "heterozygous", dominance: "incomplete dominance",
             genotype: "genotype", trait: "trait", inherit: "inherit"},
  ui: {
    heroLead: "Use genetics. Follow the clues. Send every baby monster home to its parents.",
    daily: "Daily case", dailyIdle: "A new inheritance puzzle every day.",
    play: "Play →", view: "View →", cont: "Continue →",
    solvedIn: (n, max, time) => `Solved in ${n}/${max} · ${time}`,
    notSolved: "Not solved this time. New case tomorrow!",
    inProgress: "In progress",
    nextIn: t => `Next case in ${t}`,
    schedule: "Easy Mon–Tue · Normal Wed–Fri · Hard at weekends",
    practice: "Practice", practiceSub: "Unlimited cases, at your own pace.",
    modeDesc: {easy: "Few hidden parents, short chains of logic.", normal: "The classic Genigma challenge.", hard: "Long chains of logic and “what if?” thinking."},
    modeCont: "Continue", modeCases: n => `${n} cases`,
    tutNew: "New here? Play the tutorial →", tutReplay: "Replay the tutorial →", tutSmall: "A guided case, step by step. About 2 minutes.",
    homeFoot: "A daily genetics logic puzzle.",
    backAria: "Back", helpAria: "How to play and genetics guide", close: "Close", time: "Time",
    gameSub: "Three monster couples got their babies mixed up. Each couple has exactly 2 babies.",
    couples: "The couples", clues: "The clues", tapCross: "Tap to cross off", babies: "The lost babies",
    hint: "Tap A, B or C once to rule it out (✕), twice to choose it (✓), a third time to clear.",
    tutorial: "Tutorial", guided: "Guided case", practiceTitle: "Practice", practiceCase: "Practice case", dayCase: d => `${d}'s case`,
    mother: "Mother", father: "Father", mum: "Mum", dad: "Dad",
    hidden: () => "Hidden: see clues", hiddenShort: () => "hidden", was: () => "was hidden",
    couple: c => `Couple ${c}`, baby: n => `Baby #${n}`, babyAria: n => `Baby ${n}`,
    clueAria: n => `Clue ${n}: cross off`,
    states: ["undecided", "ruled out", "chosen"], chipAria: (n, c, s) => `Baby ${n}, couple ${c}: ${s}`,
    check: n => `Check answer · ${n} left`, placed: n => `${n}/6 babies placed`, over: (c, n) => `Couple ${c} has ${n} babies (max 2)`,
    nextCase: "Next case →", share: "Share", shareResult: "Share result", reset: "Reset", home: "Home", playToday: "Play today's case →",
    endWin: "Case solved!", endLose: "Case closed", endTut: "Here's who was who, including the hidden dad:",
    endLoseSub: "The right families are marked above. Here's who was who:", endWinSub: (n, max, time) => `${n} of ${max} attempts · ${time}`,
    errPick: "Choose a couple ✓ for every baby.", errCount: "Each couple must have exactly 2 babies.",
    outOf: "Out of attempts. Here's the solution.", notQuite: n => `Not quite. ${n} ${n === 1 ? "attempt" : "attempts"} left.`,
    confirmRestart: "Restart this case from scratch? Your result and attempts will be reset.",
    nothing: "Nothing to clear yet.", cleared: "Marks cleared.", undo: "Undo", restored: "Marks restored.",
    shareHead: (daily, num, tier) => daily ? `Genigma #${num} · ${tier}` : `Genigma · practice · ${tier}`,
    shareWin: (n, max, time) => `Solved in ${n}/${max} · ⏱ ${time}`, shareLose: max => `Not solved (${max}/${max})`,
    copied: "Result copied.", copyFail: "Couldn't copy the result on this device.",
    winTitle: "Case solved!", winStats: (n, tier, daily) => `${n} ${n === 1 ? "attempt" : "attempts"} · ${tier} · ${daily ? "daily case" : "practice"}`,
    families: "The families", done: "Done",
    wTitle: "Welcome to Genigma", wLead: "A daily logic puzzle with a pinch of genetics.",
    w1: "Every day, three monster couples get their babies mixed up.", w2: "Read their looks and the clues to send every baby home.",
    w3: h => `No biology needed: tap words like ${h.T("allele")} or ${h.T("homozygous")} to see what they mean.`,
    wTut: "Show me how to play", wSkip: "Skip, I'll work it out", wNote: "The tutorial is a guided case and takes about 2 minutes.",
    helpTitles: ["How to play", "Genetics guide", "How looks are inherited", "Reading the clues"],
    help1: "Three monster couples got their babies mixed up. Use the monsters' looks and the clues to work out which <b>two babies</b> belong to each couple.",
    legend: ["Not decided", "Tap once: ruled out", "Tap twice: their baby"],
    help1small: "Use ✕ as working notes. When every baby has one ✓ and each couple has 2 babies, check your answer. You have 3 attempts. Tap a clue to cross it off once you've used it.",
    replay: "Replay the tutorial →", back: "← Back", next: "Next →", gotIt: "Got it",
    guideIntro: h => `Each trait has two ${h.T("allele", "alleles")}, written as letters, and shows ${h.T("dominance")}: a monster with one of each letter gets a third, in-between look. So just by looking at a monster, you know its two letters (its ${h.T("genotype")}). Faces are just for fun: they aren't inherited. A <b>?</b> parent is hidden; the clues tell you about it.`,
    rules: h => `<p class="small">Each parent gives <b>one</b> of its two letters to each baby.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([2, 0, 1], h.gt(0, 2))}<span class="op">→</span>${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">${h.gt(0, 0)} can only give ${h.al(0, 0)} and ${h.gt(0, 2)} can only give ${h.al(0, 1)}. So every baby is ${h.gt(0, 1)}: green.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">Blue only gives ${h.al(0, 0)}; green gives ${h.al(0, 0)} or ${h.al(0, 1)}. The babies can be blue or green, but never yellow.</p>
      <div class="eq">${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}${h.fig([2, 0, 1], h.gt(0, 2))}</div>
      <p class="small">Two greens can give either letter, so their babies can be any colour.</p>
      <p class="small">The head and the body shape work exactly the same way.</p>`,
    decode: h => `<p class="small">The clues tell you things you can't see in the pictures. Here's what each kind of clue means:</p>
      <dl class="decode">
        <dt>“…is ${h.T("homozygous")} for colour”</dt><dd>Its two colour letters match: ${h.gt(0, 0)} or ${h.gt(0, 2)}. So it's blue or yellow, never green.</dd>
        <dt>“…is ${h.T("homozygous")} ${h.gt(0, 0)} for colour”</dt><dd>Both of its colour letters are ${h.al(0, 0)}. It gives ${h.al(0, 0)} to every baby.</dd>
        <dt>“…is ${h.T("heterozygous")} (${h.gt(0, 1)}) for colour”</dt><dd>It has one of each letter, so it can give either one.</dd>
        <dt>“…has at least one ${h.al(0, 1)} ${h.T("allele")} for colour”</dt><dd>It is ${h.gt(0, 1)} or ${h.gt(0, 2)}. Never ${h.gt(0, 0)}.</dd>
        <dt>“Couple A can never have yellow babies ${h.gt(0, 2)}”</dt><dd>At least one parent has no ${h.al(0, 1)} to give, so that parent is ${h.gt(0, 0)}.</dd>
        <dt>“Couple A can have green babies ${h.gt(0, 1)}”</dt><dd>One parent can give ${h.al(0, 0)} and the other can give ${h.al(0, 1)}.</dd>
        <dt>“Babies #2 and #5 are from the same couple”</dt><dd>They have the same parents. “Different couples” means the opposite.</dd>
      </dl>
      <p class="small">Clues about the head and the body shape read the same way.</p>`,
    sLang: "Language", sTheme: "Theme", sAuto: "Automatic", sAutoSub: "Follows your device", sLight: "Light", sDark: "Dark",
    archive: "Archive", archiveLink: "Case archive", archiveSub: (n, s) => `${n} past ${n === 1 ? "case" : "cases"} · ${s} solved`,
    archCount: (s, n) => `${s} of ${n} solved`, archAll: "All", archTodo: "To play", archDone: "Solved",
    archEmpty: "No past cases yet. Come back tomorrow!", archNone: "No cases match this filter.",
    stSolved: (n, max, time) => `Solved · ${n}/${max} · ${time}`, stLost: "Not solved", stProg: "In progress", stNew: "Not played yet",
    coachCount: (n, N) => `${n} of ${N}`, skip: "Skip tutorial", tutAria: "Tutorial"
  },
  gloss: h => ({
    allele:       {t: "Allele", d: "One version of a gene. Every monster carries two alleles for each trait: one from its mother and one from its father.", ex: `Colour has two alleles: ${h.al(0, 0)} blue and ${h.al(0, 1)} yellow.`},
    homozygous:   {t: "Homozygous", d: `Both alleles for a trait are the same, like ${h.gt(0, 0)} or ${h.gt(0, 2)}. A homozygous parent can only ever pass on that one allele.`, ex: `A yellow ${h.gt(0, 2)} parent always passes on ${h.al(0, 1)}.`},
    heterozygous: {t: "Heterozygous", d: `The two alleles for a trait are different, like ${h.gt(0, 1)}. A heterozygous parent can pass on either one: it's a coin toss for each baby.`, ex: `A green ${h.gt(0, 1)} parent can pass on ${h.al(0, 0)} or ${h.al(0, 1)}.`},
    dominance:    {t: "Incomplete dominance", d: "Neither allele wins: one of each gives a third, in-between look. That's why you can always tell a monster's alleles from its looks.", ex: `${h.gt(0, 1)} = green · ${h.gt(1, 1)} = unicorn · ${h.gt(2, 1)} = round`},
    genotype:     {t: "Genotype", d: "The pair of alleles a monster carries for a trait, written as two letters.", ex: `A green monster's colour genotype is ${h.gt(0, 1)}.`},
    trait:        {t: "Trait", d: "A feature that parents pass on to their babies. Here there are three: colour, head and body shape. Faces don't count: they're just for fun."},
    inherit:      {t: "Inherit", d: "To receive from a parent. For each trait, every baby inherits one allele from its mother and one from its father."}
  }),
  clue: (k, h) => {
    if (k[0] === "l") return `Babies <b>#${k[1] + 1}</b> and <b>#${k[2] + 1}</b> are from ${k[3] ? "the same couple" : "different couples"}.`;
    const TN = ["colour", "head type", "body shape"];
    if (k[0] === "c") { const [, c, t, q, can] = k; return `${h.cp(c)} ${can ? "can" : "can never"} have <b>${I18N.en.traits[t].phr[q]}</b> ${h.gt(t, q)}.`; }
    const [, p, t, rel] = k, who = `The ${p % 2 ? "father" : "mother"} of ${h.cp(p >> 1)}`;
    if (rel === "het") return `${who} is ${h.T("heterozygous")} (${h.gt(t, 1)}) for ${TN[t]}.`;
    if (rel === "hom") return `${who} is ${h.T("homozygous")} for ${TN[t]}.`;
    if (rel === "hom0" || rel === "hom2") return `${who} is ${h.T("homozygous")} ${h.gt(t, rel === "hom0" ? 0 : 2)} for ${TN[t]}.`;
    return `${who} has at least one ${h.al(t, rel === "has0" ? 0 : 1)} ${h.T("allele")} for ${TN[t]}.`;
  },
  tut: [
    {title: "Your first case", next: "Let's go →",
     text: h => `<p>Three monster couples (${h.cp(0)}, ${h.cp(1)} and ${h.cp(2)}) each had exactly <b>2 babies</b>. The babies got mixed up.</p><p>Your job: send every baby back to its parents. I'll walk you through this one.</p>`},
    {text: h => `<p>These are the parents. Every monster has three ${h.T("trait", "traits")}: <b>colour</b>, <b>head</b> and <b>body shape</b>.</p><p>Faces are just for fun. They aren't inherited, so you can ignore them.</p>`},
    {title: "Every look comes from two letters",
     text: h => `<p>Each look comes from a pair of ${h.T("allele", "alleles")} (two letters) that a monster ${h.T("inherit", "inherits")}: one from its mum and one from its dad.</p>${h.key()}<p class="small">The middle look always has <b>one of each letter</b>.</p>`},
    {title: "The golden rule",
     text: h => `<p>A baby gets <b>one</b> letter from its mother and <b>one</b> from its father, for every trait.</p><p>So a baby can only have letters that its parents are able to give.</p>`},
    {text: h => `<p>Look at ${h.cp(0)}: mum and dad both have <b>horns</b> ${h.gt(1, 0)}. They only have ${h.al(1, 0)} to give…</p><p>…so every baby of theirs must have horns too.</p>`},
    {doing: "Tap A twice on #2 and on #5",
     text: h => `<p>Only babies <b>#2</b> and <b>#5</b> have horns, so they belong to ${h.cp(0)}!</p><p>Tap <b>A</b> on each one <b>twice</b>. Once means ✕ (ruled out); twice means ✓ (their baby).</p>`},
    {text: h => `<p>${h.cp(0)} now has its 2 babies: the counter fills in when a couple is complete. No other baby can belong to A.</p>`},
    {doing: "Tap B once on #3",
     text: h => `<p>Baby <b>#3</b> ${h.icoU(2)} is <b>yellow</b> ${h.gt(0, 2)}, so it needs one ${h.al(0, 1)} from each parent.</p><p>${h.cp(1)}'s mother ${h.icoP(2)} is <b>blue</b> ${h.gt(0, 0)}: she has no ${h.al(0, 1)} to give. Tap <b>B</b> on #3 <b>once</b> to rule out ${h.cp(1)}.</p>`},
    {doing: "Tap C twice on #3",
     text: h => `<p>#3 can't belong to A (they're complete) and it can't belong to B. That leaves ${h.cp(2)}!</p>`},
    {doing: "Tap B twice on #1",
     text: h => `<p>Baby <b>#1</b> ${h.icoU(0)} is a <b>triangle</b> ${h.gt(2, 2)}, so it needs one ${h.al(2, 1)} from each parent.</p><p>${h.cp(2)}'s mother ${h.icoP(4)} is a <b>square</b> ${h.gt(2, 0)}: she has no ${h.al(2, 1)}. And A is complete… so #1 must belong to ${h.cp(1)}.</p>`},
    {text: h => `<p>Two babies left: <b>#4</b> and <b>#6</b>. One belongs to B and the other to C, and on looks alone either of them could fit…</p><p>…unless we find out more about ${h.cp(2)}'s father.</p>`},
    {text: h => `<p>${h.cp(2)}'s father has a <b>?</b>: he's hidden, so you can't see what he looks like. That's what the clues are for.</p>`},
    {doing: "Tap the word “homozygous”",
     text: h => `<p>Here's the clue about him. Tap any word with a little <span class="iDot">i</span> to see what it means.</p>`},
    {doing: "Tap B twice on #4",
     text: h => `<p>So C's father is ${h.gt(1, 0)}: he can only pass on ${h.al(1, 0)}.</p><p>Baby <b>#4</b> ${h.icoU(3)} has <b>antennae</b> ${h.gt(1, 2)} and needs one ${h.al(1, 1)} from each parent. ${h.cp(2)}'s father has no ${h.al(1, 1)} to give, so #4 belongs to ${h.cp(1)}!</p>`},
    {doing: "Tap C twice on #6",
     text: h => `<p>And the last one, <b>#6</b>, goes home to ${h.cp(2)}.</p>`},
    {doing: "Tap the clue",
     text: h => `<p>You've used the clue, so tap it to cross it off. When there are lots of clues, this helps you keep track.</p>`},
    {doing: "Tap “Check answer”",
     text: h => `<p>Every baby has a ✓ and each couple has 2. Time to check!</p><p class="small">In real cases you get 3 attempts.</p>`},
    {title: "Case solved!", next: "Play today's case →", alt: "Back home",
     text: h => `<p>That's the whole game. Real cases hide more parents and give more clues, but the same three rules always apply:</p><ul><li>A baby gets one letter from <b>each</b> parent.</li><li>A parent with two matching letters (like ${h.gt(1, 0)}) can only give that letter.</li><li>Each couple has exactly 2 babies, so keep count.</li></ul><p class="small">Tap <b>?</b> during any case for the full guide.</p>`}
  ]
},

/* ------------------------------------------------------------------ DANSK ("du") */
da: {
  name: "Dansk", short: "DA", locale: "da-DK",
  days: ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"],
  tier: {easy: "Let", normal: "Normal", hard: "Svær"},
  traits: [
    {name: "farve", looks: ["Blå", "Grøn", "Gul"], al: ["blå", "gul"], ltr: ["L", "G"],
     phr: ["blå unger", "grønne unger", "gule unger"]},
    {name: "hoved", looks: ["Horn", "Enhjørning", "Antenner"], al: ["horn", "antenne"], ltr: ["H", "N"],
     phr: ["unger med horn", "unger med enhjørningehorn", "unger med antenner"]},
    {name: "kropsform", looks: ["Firkant", "Rund", "Trekant"], al: ["firkant", "trekant"], ltr: ["F", "T"],
     phr: ["firkantede unger", "runde unger", "trekantede unger"]}
  ],
  cp: (c, cap) => (cap ? "Par " : "par ") + c,
  termWord: {allele: "allel", homozygous: "homozygot", heterozygous: "heterozygot", dominance: "ufuldstændig dominans",
             genotype: "genotype", trait: "egenskab", inherit: "arve"},
  ui: {
    heroLead: "Brug genetik. Følg sporene. Send hver monsterunge hjem til sine forældre.",
    daily: "Dagens sag", dailyIdle: "En ny arvelighedsgåde hver dag.",
    play: "Spil →", view: "Se →", cont: "Fortsæt →",
    solvedIn: (n, max, time) => `Løst på ${n}/${max} · ${time}`,
    notSolved: "Ikke løst denne gang. Ny sag i morgen!",
    inProgress: "I gang",
    nextIn: t => `Næste sag om ${t}`,
    schedule: "Let man–tir · Normal ons–fre · Svær i weekenden",
    practice: "Træning", practiceSub: "Ubegrænset antal sager i dit eget tempo.",
    modeDesc: {easy: "Få skjulte forældre, korte logiske kæder.", normal: "Den klassiske Genigma-udfordring.", hard: "Lange logiske kæder og “hvad nu hvis?”-tænkning."},
    modeCont: "Fortsæt", modeCases: n => `${n} sager`,
    tutNew: "Ny her? Prøv introduktionen →", tutReplay: "Se introduktionen igen →", tutSmall: "En guidet sag, trin for trin. Cirka 2 minutter.",
    homeFoot: "En daglig logikgåde med genetik.",
    backAria: "Tilbage", helpAria: "Sådan spiller du og genetikguide", close: "Luk", time: "Tid",
    gameSub: "Tre monsterpar har fået deres unger blandet sammen. Hvert par har præcis 2 unger.",
    couples: "Parrene", clues: "Sporene", tapCross: "Tryk for at strege ud", babies: "De bortkomne unger",
    hint: "Tryk på A, B eller C én gang for at udelukke (✕), to gange for at vælge (✓) og en tredje gang for at rydde.",
    tutorial: "Introduktion", guided: "Guidet sag", practiceTitle: "Træning", practiceCase: "Træningssag", dayCase: d => `${d[0].toUpperCase() + d.slice(1)}ens sag`,
    mother: "Mor", father: "Far", mum: "Mor", dad: "Far",
    hidden: () => "Skjult: se sporene", hiddenShort: () => "skjult", was: () => "var skjult",
    couple: c => `Par ${c}`, baby: n => `Unge #${n}`, babyAria: n => `Unge ${n}`,
    clueAria: n => `Spor ${n}: streg ud`,
    states: ["ikke valgt", "udelukket", "valgt"], chipAria: (n, c, s) => `Unge ${n}, par ${c}: ${s}`,
    check: n => `Tjek svar · ${n} tilbage`, placed: n => `${n}/6 unger placeret`, over: (c, n) => `Par ${c} har ${n} unger (maks. 2)`,
    nextCase: "Næste sag →", share: "Del", shareResult: "Del resultat", reset: "Nulstil", home: "Forside", playToday: "Spil dagens sag →",
    endWin: "Sagen er løst!", endLose: "Sagen er lukket", endTut: "Her kan du se, hvem der var hvem, også den skjulte far:",
    endLoseSub: "De rigtige familier er markeret ovenfor. Her kan du se, hvem der var hvem:", endWinSub: (n, max, time) => `${n} af ${max} forsøg · ${time}`,
    errPick: "Sæt ✓ ved ét par for hver unge.", errCount: "Hvert par skal have præcis 2 unger.",
    outOf: "Ikke flere forsøg. Her er løsningen.", notQuite: n => `Ikke helt. ${n} forsøg tilbage.`,
    confirmRestart: "Start sagen forfra? Dit resultat og dine forsøg bliver nulstillet.",
    nothing: "Der er intet at rydde endnu.", cleared: "Markeringerne er ryddet.", undo: "Fortryd", restored: "Markeringerne er gendannet.",
    shareHead: (daily, num, tier) => daily ? `Genigma #${num} · ${tier}` : `Genigma · træning · ${tier}`,
    shareWin: (n, max, time) => `Løst på ${n}/${max} · ⏱ ${time}`, shareLose: max => `Ikke løst (${max}/${max})`,
    copied: "Resultatet er kopieret.", copyFail: "Resultatet kunne ikke kopieres på denne enhed.",
    winTitle: "Sagen er løst!", winStats: (n, tier, daily) => `${n} forsøg · ${tier} · ${daily ? "dagens sag" : "træning"}`,
    families: "Familierne", done: "Færdig",
    wTitle: "Velkommen til Genigma", wLead: "En daglig logikgåde med et strejf af genetik.",
    w1: "Hver dag får tre monsterpar deres unger blandet sammen.", w2: "Brug deres udseende og sporene til at sende hver unge hjem.",
    w3: h => `Du behøver ikke at kunne biologi: ord som ${h.T("allele")} og ${h.T("homozygous")} bliver forklaret, når du trykker på dem.`,
    wTut: "Vis mig, hvordan man spiller", wSkip: "Spring over, jeg finder selv ud af det", wNote: "Introduktionen er en guidet sag og tager cirka 2 minutter.",
    helpTitles: ["Sådan spiller du", "Genetikguide", "Sådan nedarves udseendet", "Sådan læser du sporene"],
    help1: "Tre monsterpar har fået deres unger blandet sammen. Brug monstrenes udseende og sporene til at finde ud af, hvilke <b>to unger</b> der hører til hvert par.",
    legend: ["Ikke valgt", "Tryk én gang: udelukket", "Tryk to gange: deres unge"],
    help1small: "Brug ✕ som noter. Når hver unge har ét ✓, og hvert par har 2 unger, tjekker du dit svar. Du har 3 forsøg. Tryk på et spor for at strege det ud, når du har brugt det.",
    replay: "Se introduktionen igen →", back: "← Tilbage", next: "Næste →", gotIt: "Forstået",
    guideIntro: h => `Hver egenskab har to ${h.T("allele", "alleler")}, skrevet som bogstaver, og viser ${h.T("dominance")}: et monster med ét af hvert bogstav får et tredje udseende midt imellem. Så bare ved at kigge på et monster kan du se dets to bogstaver (dets ${h.T("genotype")}). Ansigterne er bare for sjov: de nedarves ikke. En forælder med <b>?</b> er skjult; sporene fortæller om den.`,
    rules: h => `<p class="small">Hver forælder giver <b>ét</b> af sine to bogstaver til hver unge.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([2, 0, 1], h.gt(0, 2))}<span class="op">→</span>${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">${h.gt(0, 0)} kan kun give ${h.al(0, 0)}, og ${h.gt(0, 2)} kan kun give ${h.al(0, 1)}. Så alle ungerne bliver ${h.gt(0, 1)}: grønne.</p>
      <div class="eq">${h.fig([0, 0, 1], h.gt(0, 0))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}</div>
      <p class="small">Den blå giver kun ${h.al(0, 0)}; den grønne giver ${h.al(0, 0)} eller ${h.al(0, 1)}. Ungerne kan blive blå eller grønne, men aldrig gule.</p>
      <div class="eq">${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">+</span>${h.fig([1, 0, 1], h.gt(0, 1))}<span class="op">→</span>${h.fig([0, 0, 1], h.gt(0, 0))}${h.fig([1, 0, 1], h.gt(0, 1))}${h.fig([2, 0, 1], h.gt(0, 2))}</div>
      <p class="small">To grønne kan begge give det ene eller det andet bogstav, så deres unger kan blive blå, grønne eller gule.</p>
      <p class="small">Hovedet og kropsformen fungerer på præcis samme måde.</p>`,
    decode: h => `<p class="small">Sporene fortæller dig ting, du ikke kan se på billederne. Sådan skal du forstå hver slags spor:</p>
      <dl class="decode">
        <dt>“…er ${h.T("homozygous")} for farven”</dt><dd>Dens to farvebogstaver er ens: ${h.gt(0, 0)} eller ${h.gt(0, 2)}. Så den er blå eller gul, aldrig grøn.</dd>
        <dt>“…er ${h.T("homozygous")} ${h.gt(0, 0)} for farven”</dt><dd>Begge farvebogstaver er ${h.al(0, 0)}. Den giver ${h.al(0, 0)} til alle sine unger.</dd>
        <dt>“…er ${h.T("heterozygous")} (${h.gt(0, 1)}) for farven”</dt><dd>Den har ét af hvert bogstav, så den kan give det ene eller det andet.</dd>
        <dt>“…har mindst én ${h.T("allele")} ${h.al(0, 1)} for farven”</dt><dd>Den er ${h.gt(0, 1)} eller ${h.gt(0, 2)}. Aldrig ${h.gt(0, 0)}.</dd>
        <dt>“Par A kan aldrig få gule unger ${h.gt(0, 2)}”</dt><dd>Mindst én af forældrene har intet ${h.al(0, 1)} at give, så den forælder er ${h.gt(0, 0)}.</dd>
        <dt>“Par A kan få grønne unger ${h.gt(0, 1)}”</dt><dd>Den ene forælder kan give ${h.al(0, 0)}, og den anden kan give ${h.al(0, 1)}.</dd>
        <dt>“Unge #2 og #5 er fra samme par”</dt><dd>De har de samme forældre. “Forskellige par” betyder det modsatte.</dd>
      </dl>
      <p class="small">Spor om hovedet og kropsformen læses på samme måde.</p>`,
    sLang: "Sprog", sTheme: "Tema", sAuto: "Automatisk", sAutoSub: "Følger din enhed", sLight: "Lyst", sDark: "Mørkt",
    archive: "Arkiv", archiveLink: "Sagsarkiv", archiveSub: (n, s) => `${n} tidligere ${n === 1 ? "sag" : "sager"} · ${s} løst`,
    archCount: (s, n) => `${s} af ${n} løst`, archAll: "Alle", archTodo: "Ikke spillet", archDone: "Løst",
    archEmpty: "Der er ingen tidligere sager endnu. Kom tilbage i morgen!", archNone: "Ingen sager passer til dette filter.",
    stSolved: (n, max, time) => `Løst · ${n}/${max} · ${time}`, stLost: "Ikke løst", stProg: "I gang", stNew: "Ikke spillet endnu",
    coachCount: (n, N) => `${n} af ${N}`, skip: "Spring introduktionen over", tutAria: "Introduktion"
  },
  gloss: h => ({
    allele:       {t: "Allel", d: "En udgave af et gen. Hvert monster har to alleler for hver egenskab: én fra mor og én fra far.", ex: `Farve har to alleler: ${h.al(0, 0)} blå og ${h.al(0, 1)} gul.`},
    homozygous:   {t: "Homozygot", d: `Begge alleler for en egenskab er ens, fx ${h.gt(0, 0)} eller ${h.gt(0, 2)}. En homozygot forælder kan kun give én slags allel videre.`, ex: `En gul ${h.gt(0, 2)}-forælder giver altid ${h.al(0, 1)} videre.`},
    heterozygous: {t: "Heterozygot", d: `De to alleler for en egenskab er forskellige, fx ${h.gt(0, 1)}. En heterozygot forælder kan give den ene eller den anden videre: det er plat eller krone for hver unge.`, ex: `En grøn ${h.gt(0, 1)}-forælder kan give ${h.al(0, 0)} eller ${h.al(0, 1)} videre.`},
    dominance:    {t: "Ufuldstændig dominans", d: "Ingen allel vinder: én af hver giver et tredje udseende midt imellem. Derfor kan du altid se et monsters alleler på dets udseende.", ex: `${h.gt(0, 1)} = grøn · ${h.gt(1, 1)} = enhjørning · ${h.gt(2, 1)} = rund`},
    genotype:     {t: "Genotype", d: "Det par alleler, et monster har for en egenskab, skrevet med to bogstaver.", ex: `Et grønt monsters farvegenotype er ${h.gt(0, 1)}.`},
    trait:        {t: "Egenskab", d: "Noget, forældrene giver videre til deres unger. Her er der tre: farve, hoved og kropsform. Ansigterne tæller ikke: de er bare for sjov."},
    inherit:      {t: "Arve", d: "At få noget fra en forælder. For hver egenskab arver hver unge én allel fra sin mor og én fra sin far."}
  }),
  clue: (k, h) => {
    if (k[0] === "l") return `Unge <b>#${k[1] + 1}</b> og <b>#${k[2] + 1}</b> er fra ${k[3] ? "samme par" : "forskellige par"}.`;
    const TN = ["farven", "hovedet", "kropsformen"];
    if (k[0] === "c") { const [, c, t, q, can] = k; return `${h.cp(c, true)} ${can ? "kan" : "kan aldrig"} få <b>${I18N.da.traits[t].phr[q]}</b> ${h.gt(t, q)}.`; }
    const [, p, t, rel] = k, who = `${p % 2 ? "Faren" : "Moren"} til ${h.cp(p >> 1)}`;
    if (rel === "het") return `${who} er ${h.T("heterozygous")} (${h.gt(t, 1)}) for ${TN[t]}.`;
    if (rel === "hom") return `${who} er ${h.T("homozygous")} for ${TN[t]}.`;
    if (rel === "hom0" || rel === "hom2") return `${who} er ${h.T("homozygous")} ${h.gt(t, rel === "hom0" ? 0 : 2)} for ${TN[t]}.`;
    return `${who} har mindst én ${h.T("allele")} ${h.al(t, rel === "has0" ? 0 : 1)} for ${TN[t]}.`;
  },
  tut: [
    {title: "Din første sag", next: "Kom i gang →",
     text: h => `<p>Tre monsterpar (${h.cp(0)}, ${h.cp(1)} og ${h.cp(2)}) har hver fået præcis <b>2 unger</b>. Ungerne er blevet blandet sammen.</p><p>Din opgave: send hver unge hjem til sine forældre. Jeg guider dig igennem den her.</p>`},
    {text: h => `<p>Det her er forældrene. Hvert monster har tre ${h.T("trait", "egenskaber")}: <b>farve</b>, <b>hoved</b> og <b>kropsform</b>.</p><p>Ansigterne er bare for sjov. De nedarves ikke, så dem kan du se bort fra.</p>`},
    {title: "Hvert udseende kommer fra to bogstaver",
     text: h => `<p>Hvert udseende kommer fra et par ${h.T("allele", "alleler")} (to bogstaver), som et monster ${h.T("inherit", "arver")}: én fra sin mor og én fra sin far.</p>${h.key()}<p class="small">Det midterste udseende har altid <b>ét af hvert bogstav</b>.</p>`},
    {title: "Den gyldne regel",
     text: h => `<p>En unge får <b>ét</b> bogstav fra sin mor og <b>ét</b> fra sin far for hver egenskab.</p><p>Så en unge kan kun have bogstaver, som forældrene kan give den.</p>`},
    {text: h => `<p>Se på ${h.cp(0)}: både mor og far har <b>horn</b> ${h.gt(1, 0)}. De har kun ${h.al(1, 0)} at give…</p><p>…så alle deres unger skal også have horn.</p>`},
    {doing: "Tryk to gange på A ved #2 og #5",
     text: h => `<p>Kun unge <b>#2</b> og <b>#5</b> har horn, så de hører til ${h.cp(0)}!</p><p>Tryk <b>to gange</b> på <b>A</b> ved hver af dem. Én gang betyder ✕ (udelukket); to gange betyder ✓ (deres unge).</p>`},
    {text: h => `<p>${h.cp(0, true)} har nu sine 2 unger: tælleren bliver fyldt ud, når et par er fuldt. Ingen andre unger kan være deres.</p>`},
    {doing: "Tryk én gang på B ved #3",
     text: h => `<p>Unge <b>#3</b> ${h.icoU(2)} er <b>gul</b> ${h.gt(0, 2)}, så den skal have ét ${h.al(0, 1)} fra hver forælder.</p><p>Moren til ${h.cp(1)} ${h.icoP(2)} er <b>blå</b> ${h.gt(0, 0)}: hun har intet ${h.al(0, 1)} at give. Tryk <b>én gang</b> på <b>B</b> ved #3 for at udelukke ${h.cp(1)}.</p>`},
    {doing: "Tryk to gange på C ved #3",
     text: h => `<p>#3 kan ikke høre til A (A er fuldt), og den kan heller ikke høre til B. Så er der kun ${h.cp(2)} tilbage!</p>`},
    {doing: "Tryk to gange på B ved #1",
     text: h => `<p>Unge <b>#1</b> ${h.icoU(0)} er en <b>trekant</b> ${h.gt(2, 2)}, så den skal have ét ${h.al(2, 1)} fra hver forælder.</p><p>Moren til ${h.cp(2)} ${h.icoP(4)} er en <b>firkant</b> ${h.gt(2, 0)}: hun har intet ${h.al(2, 1)}. Og A er fuldt… så #1 må høre til ${h.cp(1)}.</p>`},
    {text: h => `<p>Der er to unger tilbage: <b>#4</b> og <b>#6</b>. Den ene hører til B, og den anden til C. Ud fra udseendet kunne de begge passe…</p><p>…medmindre vi finder ud af mere om faren til ${h.cp(2)}.</p>`},
    {text: h => `<p>Faren til ${h.cp(2)} har et <b>?</b>: han er skjult, så du kan ikke se, hvordan han ser ud. Det er det, sporene er til.</p>`},
    {doing: "Tryk på ordet “homozygot”",
     text: h => `<p>Her er sporet om ham. Tryk på et ord med et lille <span class="iDot">i</span>, så får du det forklaret.</p>`},
    {doing: "Tryk to gange på B ved #4",
     text: h => `<p>C's far er altså ${h.gt(1, 0)}: han kan kun give ${h.al(1, 0)} videre.</p><p>Unge <b>#4</b> ${h.icoU(3)} har <b>antenner</b> ${h.gt(1, 2)} og skal have ét ${h.al(1, 1)} fra hver forælder. Faren til ${h.cp(2)} har intet ${h.al(1, 1)} at give, så #4 hører til ${h.cp(1)}!</p>`},
    {doing: "Tryk to gange på C ved #6",
     text: h => `<p>Og den sidste, <b>#6</b>, skal hjem til ${h.cp(2)}.</p>`},
    {doing: "Tryk på sporet",
     text: h => `<p>Du har brugt sporet, så tryk på det for at strege det ud. Når der er mange spor, hjælper det dig med at holde styr på dem.</p>`},
    {doing: "Tryk på “Tjek svar”",
     text: h => `<p>Hver unge har et ✓, og hvert par har 2. Tid til at tjekke!</p><p class="small">I rigtige sager har du 3 forsøg.</p>`},
    {title: "Sagen er løst!", next: "Spil dagens sag →", alt: "Til forsiden",
     text: h => `<p>Det var hele spillet. Rigtige sager skjuler flere forældre og giver flere spor, men de samme tre regler gælder altid:</p><ul><li>En unge får ét bogstav fra <b>hver</b> forælder.</li><li>En forælder med to ens bogstaver (fx ${h.gt(1, 0)}) kan kun give det bogstav videre.</li><li>Hvert par har præcis 2 unger, så hold tal på dem.</li></ul><p class="small">Tryk på <b>?</b> i en sag for at se hele guiden.</p>`}
  ]
}
};
