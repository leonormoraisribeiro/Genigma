"""Genigma puzzle generator (incomplete dominance, 3 traits) — with difficulty tiers.

Model: 3 mushroom couples (A, B, C), 6 sprouts (2 per couple), 3 independent traits with INCOMPLETE
DOMINANCE: the heterozygote has its own look, so the look reveals the genotype.
Genotype of a trait = number of "2" alleles (0 = homozygous allele 1, 1 = heterozygous, 2 = homozygous allele 2).
Traits (the names/letters/looks live in index.html, in THEME):
  0 size    T/S  -> 0 tall,  1 cluster, 2 short
  1 colour  C/Y  -> 0 coral, 1 orange,  2 yellow
  2 pattern P/L  -> 0 plain, 1 dotted,  2 striped
Parents 0..5 (mother A, father A, mother B, father B, mother C, father C). Each parent passes one of
their two alleles; each sprout inherits one from each parent.
Visible: the sprouts' genotypes and the NON-hidden parents (hidden ones show as "?").
To deduce: which sprouts belong to which couple. Clues are facts about the hidden parents.

Clues are stored as CODES, not text — the game writes the sentence from THEME, so you can rename
traits/looks/letters (or translate the game) without regenerating:
  ["p", parent, trait, rel]          rel: het | hom | hom0 | hom2 | has0 | has2
  ["c", couple, trait, look, can]    can: 1 = "can have", 0 = "can never have"
  ["l", i, j, same]                  same: 1 = same couple, 0 = different couples

A puzzle is only accepted if:
1. clues + visible information give exactly ONE valid assignment;
2. all 6 sprouts have unique profiles;
3. no clue is redundant; at most 1-2 logic clues (same couple / different couples);
4. the human solver (human_solver.py) can solve it without guessing, and gets a tier:
   easy   -> at most 3 hidden parents and a short chain of deductions;
   normal -> 4-6 hidden parents, medium chain;
   hard   -> long chain, all 6 parents hidden, or one/two "what if?" hypotheses.

Output fields per puzzle: p (visible parents, null = hidden), u (sprouts), c (clue codes), s (solution),
d (tier: easy / normal / hard), g (all parents' real genotypes, revealed only at the end).

Usage: python generate_puzzles.py [puzzles_per_tier]   (default 60 -> 180 puzzles)
Then: python verify_puzzles.py
Needs human_solver.py in the same folder.
"""
import itertools, json, random, sys, time
from human_solver import human_solve, Contradiction

PER_TIER = int(sys.argv[1]) if len(sys.argv) > 1 else 60
NT = 3
ASGS = sorted(set(itertools.permutations([0, 0, 1, 1, 2, 2])))   # 90 atribuições
FULL = (1 << len(ASGS)) - 1
ones = lambda m: bin(m).count("1")
TRANS = {0: (0,), 1: (0, 1), 2: (1,)}            # alelos que um pai pode transmitir
poss = lambda m, f: {a + b for a in TRANS[m] for b in TRANS[f]}
PM = [[sum(1 << x for x in poss(m, f)) for f in range(3)] for m in range(3)]   # poss() em bitmask

# Parâmetros de cada nível: nº de pais ocultos, ambiguidade mínima só com a info visível, nº de pistas
TIERS = {
    "easy":   {"hidden": (2, 3), "min_base": 6,  "clues": (3, 6), "max_logic": 2},
    "normal": {"hidden": (4, 5), "min_base": 30, "clues": (4, 7), "max_logic": 1},
    "hard":   {"hidden": (5, 6), "min_base": 40, "clues": (5, 9), "max_logic": 1},
}

# Para cada casal c e cada par de rebentos S: máscara das atribuições em que S são os rebentos de c
PAIRS = list(itertools.combinations(range(6), 2))
BY_PAIR = [{S: sum(1 << k for k, a in enumerate(ASGS) if [i for i in range(6) if a[i] == c] == list(S))
            for S in PAIRS} for c in range(3)]


def classify(r, puzzle):
    """Traduz o resultado do solver humano num nível (ou None se não serve).
    hard   = precisa de uma hipótese 'e se?' (máx. 2), ou cadeia longa, ou 6 pais ocultos com cadeia média;
    easy   = no máximo 3 pais ocultos e cadeia curta, sem hipóteses;
    normal = o resto."""
    if not r["solved"] or r["hyps"] > 2: return None
    hidden = sum(x is None for x in puzzle["p"])
    if r["hyps"] or r["rounds"] >= 7 or (hidden == 6 and r["rounds"] >= 5): return "hard"
    if hidden <= 3 and r["rounds"] <= 5: return "easy"
    return "normal"


def sample_world(rng):
    g = [[rng.choice([0, 1, 2]) for _ in range(NT)] for _ in range(6)]
    asg = tuple(rng.choice(ASGS))
    pup = [[int(rng.random() < g[2*c][t] / 2) + int(rng.random() < g[2*c+1][t] / 2) for t in range(NT)] for c in asg]
    if len({tuple(p) for p in pup}) < 6:          # os seis rebentos têm de ser diferentes
        return None
    return g, asg, pup


def trait_model(hidden, g_t, pup_t):
    """Todos os vetores de genótipo possíveis dos 6 pais (para um traço) e, para cada um,
    a máscara das atribuições compatíveis. Versão rápida: calcula por casal quais rebentos encaixam."""
    vecs = list(itertools.product(*[[0, 1, 2] if p in hidden else [g_t[p]] for p in range(6)]))
    cache, cm = {}, []
    for v in vecs:
        okc = tuple(sum(1 << i for i in range(6) if PM[v[2*c]][v[2*c+1]] >> pup_t[i] & 1) for c in range(3))
        if okc not in cache:
            m = FULL
            for c in range(3):
                mc = 0
                for S in PAIRS:
                    if okc[c] >> S[0] & 1 and okc[c] >> S[1] & 1: mc |= BY_PAIR[c][S]
                m &= mc
            cache[okc] = m
        cm.append(cache[okc])
    return vecs, cm


def make_puzzle(rng, tier):
    P = TIERS[tier]
    sw = sample_world(rng)
    if not sw: return None
    g, asg, pup = sw
    hidden = set(rng.sample(range(6), rng.randint(*P["hidden"])))
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
    if ones(alive(start)) < P["min_base"]: return None

    pool = []
    def add(t, test, code):
        mk = sum(1 << k for k, v in enumerate(vecs[t]) if test(v))
        pool.append({"t": t, "gen": True, "mask": mk, "code": code})
    for p in sorted(hidden):
        for t in range(NT):
            x = g[p][t]
            tests = [(lambda v, p=p, x=x: v[p] == x, ["p", p, t, "het" if x == 1 else f"hom{x}"])]
            if x != 1: tests.append((lambda v, p=p: v[p] != 1, ["p", p, t, "hom"]))
            if x > 0:  tests.append((lambda v, p=p: v[p] > 0, ["p", p, t, "has2"]))
            if x < 2:  tests.append((lambda v, p=p: v[p] < 2, ["p", p, t, "has0"]))
            for fn, code in tests: add(t, fn, code)
    for c in range(3):
        if 2*c not in hidden and 2*c+1 not in hidden: continue
        for t in range(NT):
            for q in range(3):
                k = q in poss(g[2*c][t], g[2*c+1][t])
                add(t, lambda v, c=c, q=q, k=k: (q in poss(v[2*c], v[2*c+1])) == k, ["c", c, t, q, int(k)])
    for i in range(6):
        for j in range(i+1, 6):
            same = asg[i] == asg[j]
            mk = sum(1 << k for k, a in enumerate(ASGS) if (a[i] == a[j]) == same)
            pool.append({"t": None, "gen": False, "mask": mk, "code": ["l", i, j, int(same)]})
    rng.shuffle(pool)
    gen_pool = [c for c in pool if c["gen"]]; log_pool = [c for c in pool if not c["gen"]]

    lo, hi = P["clues"]
    state, chosen, n_log = start, [], 0
    steps = rng.randint(lo, hi - 1)
    def useful(group, st):
        na = ones(alive(st)); out = []
        for c in group:
            if c in chosen: continue
            k = ones(alive(apply(st, c)))
            if k < na: out.append((k, c))
        return out
    while ones(alive(state)) > 1 and len(chosen) < hi:
        cands = useful(gen_pool, state)
        if cands:                                # descida gradual até à solução
            na = ones(alive(state)); left = max(1, steps - len(chosen))
            target = max(1, round(na ** ((left - 1) / left)))
            best = min(abs(k - target) for k, _ in cands)
            k, c = rng.choice([x for x in cands if abs(x[0] - target) == best])
        else:
            if n_log >= P["max_logic"]: return None
            cands = useful(log_pool, state)
            if not cands: return None
            k, c = min(cands, key=lambda x: x[0]); n_log += 1
        chosen.append(c); state = apply(state, c)
    if ones(alive(state)) != 1: return None
    for c in list(chosen):                       # tirar pistas redundantes
        rest = [x for x in chosen if x is not c]; st = start
        for x in rest: st = apply(st, x)
        if ones(alive(st)) == 1: chosen = rest
    if len(chosen) < lo: return None
    st = start
    for x in chosen: st = apply(st, x)
    assert alive(st) == 1 << ASGS.index(asg)
    codes = [c["code"] for c in chosen]; rng.shuffle(codes)
    puzzle = {"p": [None if p in hidden else g[p] for p in range(6)], "u": pup, "c": codes, "s": list(asg)}
    try: r = human_solve(puzzle)
    except Contradiction: return None
    d = classify(r, puzzle)
    if d is None: return None
    puzzle["d"] = d
    puzzle["g"] = g          # genótipos reais de todos os pais: o jogo só os revela no fim
    return puzzle


def main():
    rng = random.Random(2026)
    pools = {t: [] for t in TIERS}
    seen, tries, t0 = set(), 0, time.time()
    while any(len(v) < PER_TIER for v in pools.values()):
        tier = min((t for t in TIERS if len(pools[t]) < PER_TIER), key=lambda t: len(pools[t]))
        tries += 1
        p = make_puzzle(rng, tier)
        if not p or len(pools[p["d"]]) >= PER_TIER: continue
        key = json.dumps([p["p"], p["u"]])
        if key in seen: continue
        seen.add(key); pools[p["d"]].append(p)
        done = " · ".join(f"{t} {len(v)}/{PER_TIER}" for t, v in pools.items())
        print(f"{done}   ({tries} tentativas, {time.time() - t0:.0f}s)", flush=True)
    out = [p for t in TIERS for p in pools[t]]
    with open("puzzles.js", "w", encoding="utf-8") as f:
        f.write("const PUZZLES = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"puzzles.js escrito: {len(out)} puzzles.")


if __name__ == "__main__":
    main()
