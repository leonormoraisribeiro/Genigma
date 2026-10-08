"""Independent verifier: reads puzzles.js and, using ONLY the clue TEXT, brute-forces every puzzle to
confirm it has exactly one solution (and that it is the stored one). Usage: python verify_puzzles.py"""
import itertools, json, re
t = open("puzzles.js", encoding="utf-8").read()
PUZ = json.loads(t[t.index("=") + 1:].rstrip().rstrip(";"))
TN = ["coat", "ears", "pattern"]
PHRASE = [["a black coat", "a gray coat", "a white coat"], ["pointed ears", "folded ears", "round ears"],
          ["a smooth pattern", "a dappled pattern", "a spotted pattern"]]
FIRST = set("BPS")                                   # allele 1 of each trait (genotype 0 = homozygous for it)
ALL = sorted(set(itertools.permutations([0, 0, 1, 1, 2, 2])))
passes = lambda m: {0: {0}, 1: {0, 1}, 2: {1}}[m]   # which allele-count a parent can pass on
def poss(m, f): return {a + b for a in passes(m) for b in passes(f)}

def parse(txt):
    m = re.fullmatch(r"Pups #(\d) and #(\d) are from (the same couple|different couples)\.", txt)
    if m: return ("l", int(m[1]) - 1, int(m[2]) - 1, m[3] == "the same couple")
    m = re.fullmatch(r"Couple ([ABC]) (can|can never) have pups with (.*)\.", txt)
    if m:
        t, q = next((t, q) for t in range(3) for q in range(3) if PHRASE[t][q] == m[3])
        return ("c", "ABC".index(m[1]), t, q, m[2] == "can")
    m = re.fullmatch(r"The (mother|father) of Couple ([ABC]) (.*) for (coat|ears|pattern)\.", txt)
    p = 2 * "ABC".index(m[2]) + (0 if m[1] == "mother" else 1); t = TN.index(m[4]); r = m[3]
    if r.startswith("is heterozygous"): fn = lambda g: g == 1
    elif r == "is homozygous": fn = lambda g: g != 1
    elif r.startswith("is homozygous "): fn = (lambda g: g == 0) if r[-1] in FIRST else (lambda g: g == 2)
    else: fn = (lambda g: g < 2) if re.search(r"one (\w) allele", r)[1] in FIRST else (lambda g: g > 0)
    return ("p", p, t, fn)

bad = 0
for n, P in enumerate(PUZ):
    cl = [parse(c) for c in P["c"]]
    hid = [i for i in range(6) if P["p"][i] is None]
    alive = []
    for a in ALL:
        if any(k[0] == "l" and (a[k[1]] == a[k[2]]) != k[3] for k in cl): continue
        ok = True
        for t in range(3):
            found = False
            for gs in itertools.product([0, 1, 2], repeat=len(hid)):
                g = [P["p"][i][t] if P["p"][i] is not None else None for i in range(6)]
                for i, x in zip(hid, gs): g[i] = x
                if not all(P["u"][i][t] in poss(g[2*a[i]], g[2*a[i]+1]) for i in range(6)): continue
                if any(k[0] == "p" and k[2] == t and not k[3](g[k[1]]) for k in cl): continue
                if any(k[0] == "c" and k[2] == t and ((k[3] in poss(g[2*k[1]], g[2*k[1]+1])) != k[4]) for k in cl): continue
                found = True; break
            if not found: ok = False; break
        if ok: alive.append(list(a))
    if alive != [P["s"]]:
        bad += 1; print("PROBLEM in puzzle", n + 1, "- solutions found:", len(alive))
print(f"{len(PUZ)} puzzles checked; {bad} with problems.")
