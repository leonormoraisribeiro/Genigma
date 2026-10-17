"""Solver 'humano': só usa deduções que uma pessoa faz de cabeça.
Nível 1 = eliminação direta + contagem; 2 = deduzir genótipos escondidos;
3 = cruzar dois rebentos no mesmo casal; 4 = uma hipótese 'e se?' que leva a contradição.

As pistas vêm em código (o texto é escrito pelo jogo, a partir do tema):
  ["p", pai, traço, rel]        rel: het | hom | hom0 | hom2 | has0 | has2
  ["c", casal, traço, aspeto, pode(1/0)]
  ["l", i, j, mesmo_casal(1/0)]
"""
import copy, itertools

TRANS = {0: (0,), 1: (0, 1), 2: (1,)}
def poss(m, f): return {a + b for a in TRANS[m] for b in TRANS[f]}
# genótipos (nº de alelos "2") compatíveis com cada tipo de pista sobre um pai escondido
REL = {"het": {1}, "hom": {0, 2}, "hom0": {0}, "hom2": {2}, "has0": {0, 1}, "has2": {1, 2}}


def parse(k):
    if k[0] == "l": return ("l", k[1], k[2], bool(k[3]))
    if k[0] == "c": return ("c", k[1], k[2], k[3], bool(k[4]))
    return ("p", k[1], k[2], REL[k[3]])


class Contradiction(Exception): pass


def _propagate(st, U, logic, max_level=3):
    """Aplica regras até estabilizar. Devolve (rondas, nível mais alto usado)."""
    C, PAIR = st
    fits = lambda i, pr, t: U[i][t] in poss(*pr)
    rounds = level = 0
    while True:
        rounds += 1
        snap = (repr(C), repr(PAIR))
        # nível 1 — eliminação direta, contagem e pistas lógicas
        for i in range(6):
            for c in list(C[i]):
                if any(not any(fits(i, pr, t) for pr in PAIR[c][t]) for t in range(3)):
                    C[i].discard(c)
        for c in range(3):
            cand = [i for i in range(6) if c in C[i]]
            fixed = [i for i in range(6) if C[i] == {c}]
            if len(cand) < 2 or len(fixed) > 2: raise Contradiction
            if len(cand) == 2:
                for i in cand: C[i] = {c}
            if len(fixed) == 2:
                for i in range(6):
                    if i not in fixed: C[i].discard(c)
        for _, i, j, same in logic:
            if same:
                C[i] &= C[j]; C[j] &= C[i]
            else:
                if len(C[i]) == 1: C[j] -= C[i]
                if len(C[j]) == 1: C[i] -= C[j]
        if any(not x for x in C): raise Contradiction
        if (repr(C), repr(PAIR)) != snap:
            level = max(level, 1); continue
        if max_level < 2: break
        # nível 2 — que genótipos escondidos são compatíveis com os rebentos possíveis?
        changed = False
        for c in range(3):
            cand = [i for i in range(6) if c in C[i]]
            for t in range(3):
                keep = {pr for pr in PAIR[c][t]
                        if all(fits(i, pr, t) for i in range(6) if C[i] == {c})
                        and sum(fits(i, pr, t) for i in cand) >= 2}
                if not keep: raise Contradiction
                if keep != PAIR[c][t]: PAIR[c][t] = keep; changed = True
        if changed:
            level = max(level, 2); continue
        if max_level < 3: break
        # nível 3 — um rebento só pode ficar num casal se houver um 'irmão' compatível
        for c in range(3):
            cand = [i for i in range(6) if c in C[i]]
            for i in cand:
                if not any(all(any(fits(i, pr, t) and fits(j, pr, t) for pr in PAIR[c][t]) for t in range(3))
                           for j in cand if j != i):
                    C[i].discard(c); changed = True
        for S in itertools.combinations(range(3), 2):
            inside = [i for i in range(6) if C[i] <= set(S)]
            if len(inside) > 4: raise Contradiction
            if len(inside) == 4:
                for i in range(6):
                    if i not in inside and C[i] & set(S): C[i] -= set(S); changed = True
        if changed:
            level = max(level, 3); continue
        break
    return rounds, level


def human_solve(P):
    """Devolve dict com: solved, level (1-4), rounds, hyps (nº de hipóteses usadas)."""
    cl = [parse(c) for c in P["c"]]
    U = P["u"]
    D = [[{P["p"][p][t]} if P["p"][p] is not None else {0, 1, 2} for t in range(3)] for p in range(6)]
    for k in cl:
        if k[0] == "p": D[k[1]][k[2]] &= k[3]
    PAIR = [[{(m, f) for m in D[2*c][t] for f in D[2*c+1][t]} for t in range(3)] for c in range(3)]
    for k in cl:
        if k[0] == "c":
            _, c, t, q, can = k
            PAIR[c][t] = {pr for pr in PAIR[c][t] if (q in poss(*pr)) == can}
    st = ([{0, 1, 2} for _ in range(6)], PAIR)
    logic = [k for k in cl if k[0] == "l"]
    solved = lambda s: all(len(x) == 1 for x in s[0])

    rounds, level = _propagate(st, U, logic)
    hyps = 0
    while not solved(st):
        # nível 4 — "e se o rebento i fosse do casal c?" Se dá contradição, risca-se.
        progress = False
        for i in range(6):
            for c in sorted(st[0][i]):
                if len(st[0][i]) < 2: break
                trial = copy.deepcopy(st); trial[0][i] = {c}
                try: _propagate(trial, U, logic)
                except Contradiction:
                    st[0][i].discard(c); hyps += 1; progress = True
                    r, _ = _propagate(st, U, logic); rounds += r
                    break
            if progress: break
        if not progress: break
        level = 4
    ok = solved(st)
    if ok:
        assert [next(iter(x)) for x in st[0]] == P["s"], "solver humano chegou a outra solução"
    return {"solved": ok, "level": level, "rounds": rounds, "hyps": hyps}
