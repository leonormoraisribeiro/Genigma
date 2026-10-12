"""Independent verifier: reads puzzles.js and, using ONLY the clue codes, brute-forces every puzzle to
confirm it has exactly one solution (and that it is the stored one). Usage: python verify_puzzles.py

Clue codes:  ["p", parent, trait, rel]  (rel: het | hom | hom0 | hom2 | has0 | has2)
             ["c", couple, trait, look, can]   ["l", i, j, same]"""
import itertools, json
t = open("puzzles.js", encoding="utf-8").read()
PUZ = json.loads(t[t.index("=") + 1:].rstrip().rstrip(";"))
ALL = sorted(set(itertools.permutations([0, 0, 1, 1, 2, 2])))
passes = lambda m: {0: {0}, 1: {0, 1}, 2: {1}}[m]   # which allele-count a parent can pass on
def poss(m, f): return {a + b for a in passes(m) for b in passes(f)}
REL = {"het": lambda g: g == 1, "hom": lambda g: g != 1, "hom0": lambda g: g == 0,
       "hom2": lambda g: g == 2, "has0": lambda g: g < 2, "has2": lambda g: g > 0}

def parse(k):
    if k[0] == "l": return ("l", k[1], k[2], bool(k[3]))
    if k[0] == "c": return ("c", k[1], k[2], k[3], bool(k[4]))
    return ("p", k[1], k[2], REL[k[3]])

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
    G = P.get("g")                                   # revealed parents must match the visible ones and the sprouts
    if G and (any(P["p"][i] is not None and P["p"][i] != G[i] for i in range(6)) or not all(
            P["u"][i][t] in poss(G[2*P["s"][i]][t], G[2*P["s"][i]+1][t]) for i in range(6) for t in range(3))):
        bad += 1; print("PROBLEM in puzzle", n + 1, "- revealed parents don't match")
tiers = {}
for P in PUZ: tiers[P.get("d", "?")] = tiers.get(P.get("d", "?"), 0) + 1
print(f"{len(PUZ)} puzzles checked; {bad} with problems. Tiers: {tiers}")
