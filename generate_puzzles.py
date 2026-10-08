"""Gerador de puzzles do Paternity Court (versão: dominância incompleta, 3 traços).

Modelo: 3 casais (A, B, C), 6 crias (2 por casal), 3 traços independentes com DOMINÂNCIA
INCOMPLETA: o heterozigótico tem um fenótipo próprio, por isso o fenótipo revela o genótipo.
Genótipo de um traço = nº de alelos "2" (0 = homozigótico 1, 1 = heterozigótico, 2 = homozigótico 2).
Progenitores 0..5 (mãe A, pai A, mãe B, pai B, mãe C, pai C). Cada progenitor passa um dos seus
dois alelos; a cria recebe um de cada progenitor.

Visível: genótipos das crias e dos progenitores NÃO escondidos (aparecem como "?" os escondidos).
A deduzir: que crias são de que casal. As pistas são factos sobre os progenitores escondidos.

Um puzzle só é aceite se:
  1. as pistas + o que é visível dão exatamente UMA atribuição possível;
  2. as 6 crias têm perfis todos diferentes;
  3. há 4 a 6 progenitores escondidos e, só com o que é visível, sobram 30+ atribuições possíveis;
  4. nenhuma pista é redundante;
  5. as pistas são factos de genética; no máximo MAX_LOGIC pistas lógicas (mesmo casal / diferentes).

Os traços são independentes, por isso a genética de cada um é calculada à parte e só se
combina no fim ao nível das atribuições (90 possíveis).
"""
import itertools, json, random, sys

N_PUZZLES = int(sys.argv[1]) if len(sys.argv) > 1 else 90
MIN_CLUES, MAX_CLUES, MAX_LOGIC = 5, 9, 1
NT = 3
TN = ["coat", "ears", "pattern"]
PHEN = [["a black coat", "a gray coat", "a white coat"], ["pointed ears", "folded ears", "round ears"],
        ["a smooth pattern", "a dappled pattern", "a spotted pattern"]]
AL = [("B", "W"), ("P", "R"), ("S", "D")]       # alelo 1 / alelo 2 de cada traço
ASGS = sorted(set(itertools.permutations([0, 0, 1, 1, 2, 2])))   # 90 atribuições
FULL = (1 << len(ASGS)) - 1
COUPLE = "ABC"
ones = lambda m: bin(m).count("1")
TRANS = {0: (0,), 1: (0, 1), 2: (1,)}            # valores que um progenitor pode transmitir
poss = lambda m, f: {a + b for a in TRANS[m] for b in TRANS[f]}


def sample_world(rng):
    g = [[rng.choice([0, 1, 2]) for _ in range(NT)] for _ in range(6)]
    asg = tuple(rng.choice(ASGS))
    pup = [[int(rng.random() < g[2*c][t] / 2) + int(rng.random() < g[2*c+1][t] / 2) for t in range(NT)] for c in asg]
    if len({tuple(p) for p in pup}) < 6:          # as 6 crias têm de ser todas diferentes
        return None
    return g, asg, pup


def trait_model(hidden, g_t, pup_t):
    """Vetores de genótipos possíveis dos 6 progenitores (num traço) e, para cada um,
    a máscara das atribuições compatíveis com as crias."""
    vecs = list(itertools.product(*[[0, 1, 2] if p in hidden else [g_t[p]] for p in range(6)]))
    def comp(v, a):
        return all(pup_t[i] in poss(v[2*a[i]], v[2*a[i]+1]) for i in range(6))
    cm = [sum(1 << k for k, a in enumerate(ASGS) if comp(v, a)) for v in vecs]
    return vecs, cm


def make_puzzle(rng):
    sw = sample_world(rng)
    if not sw: return None
    g, asg, pup = sw
    hidden = set(rng.sample(range(6), rng.randint(4, 6)))
    models = [trait_model(hidden, [g[p][t] for p in range(6)], [pup[i][t] for i in range(6)]) for t in range(NT)]
    vecs = [m[0] for m in models]; cm = [m[1] for m in models]
    start = ([(1 << len(vecs[t])) - 1 for t in range(NT)], FULL)

    def alive(state):
        av, logic = state
        m = logic
        for t in range(NT):
            o = 0
            for k in range(len(vecs[t])):
                if av[t] >> k & 1: o |= cm[t][k]
            m &= o
        return m
    def apply(state, clue):
        av, logic = list(state[0]), state[1]
        if clue["gen"]: av[clue["t"]] &= clue["mask"]
        else: logic &= clue["mask"]
        return av, logic
    couples_of = lambda m, i: {ASGS[k][i] for k in range(len(ASGS)) if m >> k & 1}
    base = alive(start)
    if ones(base) < 30: return None              # sem pistas já estaria quase resolvido
    already = {i for i in range(6) if len(couples_of(base, i)) < 2}
    pinned = lambda m: False   # com dominância incompleta quase toda a pista fixa alguma cria; não se exige

    pool = []
    def add(t, test, text):
        mk = sum(1 << k for k, v in enumerate(vecs[t]) if test(v))
        pool.append({"t": t, "gen": True, "mask": mk, "text": text})
    for p in sorted(hidden):
        who = f"The {'mother' if p % 2 == 0 else 'father'} of Couple {COUPLE[p//2]}"
        for t in range(NT):
            x = g[p][t]; A, B = AL[t]
            tests = [(lambda v, p=p, x=x: v[p] == x,
                      f"{who} is heterozygous ({A}{B}) for {TN[t]}." if x == 1 else f"{who} is homozygous {(A if x == 0 else B)*2} for {TN[t]}.")]
            if x != 1: tests.append((lambda v, p=p: v[p] != 1, f"{who} is homozygous for {TN[t]}."))
            if x > 0:  tests.append((lambda v, p=p: v[p] > 0, f"{who} has at least one {B} allele for {TN[t]}."))
            if x < 2:  tests.append((lambda v, p=p: v[p] < 2, f"{who} has at least one {A} allele for {TN[t]}."))
            for fn, txt in tests: add(t, fn, txt)
    for c in range(3):
        if 2*c not in hidden and 2*c+1 not in hidden: continue
        for t in range(NT):
            for q in range(3):
                k = q in poss(g[2*c][t], g[2*c+1][t])
                add(t, lambda v, c=c, q=q, k=k: (q in poss(v[2*c], v[2*c+1])) == k,
                    f"Couple {COUPLE[c]} {'can' if k else 'can never'} have pups with {PHEN[t][q]}.")
    for i in range(6):
        for j in range(i+1, 6):
            same = asg[i] == asg[j]
            mk = sum(1 << k for k, a in enumerate(ASGS) if (a[i] == a[j]) == same)
            pool.append({"t": None, "gen": False, "mask": mk,
                         "text": f"Pups #{i+1} and #{j+1} are from {'the same couple' if same else 'different couples'}."})
    rng.shuffle(pool)
    gen_pool = [c for c in pool if c["gen"]]; log_pool = [c for c in pool if not c["gen"]]

    state, chosen, n_log = start, [], 0
    steps = rng.randint(MIN_CLUES, MAX_CLUES - 1)
    def useful(group, st):
        na = ones(alive(st)); out = []
        for c in group:
            if c in chosen: continue
            m = alive(apply(st, c)); k = ones(m)
            if k < na and not pinned(m): out.append((k, c))
        return out
    while ones(alive(state)) > 1 and len(chosen) < MAX_CLUES:
        cands = useful(gen_pool, state)
        if cands:                                # descida gradual até 1 solução
            na = ones(alive(state)); left = max(1, steps - len(chosen))
            target = max(1, round(na ** ((left - 1) / left)))
            best = min(abs(k - target) for k, _ in cands)
            k, c = rng.choice([x for x in cands if abs(x[0] - target) == best])
        else:
            if n_log >= MAX_LOGIC: return None
            cands = useful(log_pool, state)
            if not cands: return None
            k, c = min(cands, key=lambda x: x[0]); n_log += 1
        chosen.append(c); state = apply(state, c)
    if ones(alive(state)) != 1: return None
    for c in list(chosen):                       # poda de pistas redundantes
        rest = [x for x in chosen if x is not c]; st = start
        for x in rest: st = apply(st, x)
        if ones(alive(st)) == 1: chosen = rest
    st = start
    for x in chosen: st = apply(st, x)
    if len(chosen) < MIN_CLUES or sum(c["gen"] for c in chosen) < 3: return None
    assert alive(st) == 1 << ASGS.index(asg)
    texts = [c["text"] for c in chosen]; rng.shuffle(texts)
    return {"p": [None if p in hidden else g[p] for p in range(6)], "u": pup, "c": texts, "s": list(asg)}


def main():
    rng = random.Random(2026)
    out, tries = [], 0
    while len(out) < N_PUZZLES:
        tries += 1
        p = make_puzzle(rng)
        if p:
            out.append(p)
            print(f"puzzle {len(out)}/{N_PUZZLES} ({len(p['c'])} pistas, {tries} tentativas)", flush=True)
    with open("puzzles.js", "w", encoding="utf-8") as f:
        f.write("const PUZZLES = " + json.dumps(out, ensure_ascii=False) + ";\n")
    print("puzzles.js escrito.")


if __name__ == "__main__":
    main()
