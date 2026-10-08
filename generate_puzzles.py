"""Paternity Court puzzle generator (version: incomplete dominance, 3 traits).
Model: 3 pairs (A, B, C), 6 offspring (2 per pair), 3 independent traits with INCOMPLETE
DOMINANCE: the heterozygote has its own phenotype, meaning the phenotype reveals the genotype.
Genotype of a trait = number of "2" alleles (0 = homozygous 1, 1 = heterozygous, 2 = homozygous 2).
Parents 0..5 (mother A, father A, mother B, father B, mother C, father C). Each parent passes one of their
two alleles; the offspring inherits one from each parent.
Visible: genotypes of offspring and of NON-hidden parents (hidden ones appear as "?").
To deduce: which offspring belong to which pair. Clues are facts about the hidden parents.

A puzzle is only accepted if:
1. the clues + visible information yield exactly ONE valid assignment;
2. all 6 offspring have unique profiles;
3. there are 4 to 6 hidden parents, and using only visible information leaves 30+ possible assignments;
4. no clue is redundant;
5. clues are genetic facts; at most MAX_LOGIC logical clues (same pair / different pairs).

The traits are independent, so the genetics for each trait are calculated separately and only
combined at the end at the assignment level (90 possibilities).
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
TRANS = {0: (0,), 1: (0, 1), 2: (1,)}            # values that a parent can transmit
poss = lambda m, f: {a + b for a in TRANS[m] for b in TRANS[f]}


def sample_world(rng):
    g = [[rng.choice([0, 1, 2]) for _ in range(NT)] for _ in range(6)]
    asg = tuple(rng.choice(ASGS))
    pup = [[int(rng.random() < g[2*c][t] / 2) + int(rng.random() < g[2*c+1][t] / 2) for t in range(NT)] for c in asg]
    if len({tuple(p) for p in pup}) < 6:          # the six children have to be different
        return None
    return g, asg, pup


def trait_model(hidden, g_t, pup_t):
    """Genome vector for all 6 parents"""
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
    if ones(base) < 30: return None              
    already = {i for i in range(6) if len(couples_of(base, i)) < 2}
    pinned = lambda m: False   

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
        if cands:                                # gradual decline until solution
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
    for c in list(chosen):                       # redudant clues
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
