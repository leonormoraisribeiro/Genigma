"""Smoke test: opens Genigma in a real browser, plays today's daily case to a win, and checks that
 - there are no JavaScript errors,
 - "Share result" hands the OS share sheet ONE text that contains the result AND the link
   (passing the link separately as `url` makes iOS and many apps drop the result),
 - the clipboard fallbacks still work when navigator.share / navigator.clipboard are missing.

Run from the project folder:   pip install playwright && playwright install chromium
                               python tests/smoke_test.py
"""
import functools, http.server, json, os, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
handler.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{srv.server_address[1]}/index.html"

errors = []
def check(ok, msg):
    print(("PASS  " if ok else "FAIL  ") + msg)
    if not ok: errors.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    ctx.add_init_script("""
      try{localStorage.setItem('gn3-welcome','1');localStorage.setItem('gn3-tut','1');
          localStorage.setItem('gn2-seen-help','1');localStorage.setItem('gn-lang','"en"')}catch(e){}
      window.__shares=[];window.__clip=[];window.__ec=[];
      navigator.share=async d=>{window.__shares.push(d)};
      Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>{window.__clip.push(t)}},configurable:true});""")
    pg = ctx.new_page()
    js_errors = []
    pg.on("pageerror", lambda e: js_errors.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(500)
    pg.click("#playDaily"); pg.wait_for_timeout(600)

    sol = pg.evaluate("""()=>{
      const d=new Date(),day=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
      const WEEK=['easy','easy','normal','normal','normal','hard','hard'],wd=(day+3)%7,tier=WEEK[wd];
      const pool=PUZZLES.map((p,i)=>[p,i]).filter(([p])=>p.d===tier).map(([,i])=>i);
      const per=WEEK.filter(x=>x===tier).length,bef=WEEK.slice(0,wd).filter(x=>x===tier).length;
      return PUZZLES[pool[(Math.floor((day+3)/7)*per+bef)%pool.length]].s}""")
    for i, c in enumerate(sol):
        for _ in range(2): pg.click(f'.chip[data-i="{i}"][data-c="{c}"]')
    pg.click("#check"); pg.wait_for_timeout(1000)
    check(pg.is_visible("#winDialog"), "correct answer opens the win dialog")

    pg.click("#winShare"); pg.wait_for_timeout(300)
    shares = pg.evaluate("window.__shares")
    check(len(shares) == 1 and set(shares[0]) == {"text"}, "navigator.share gets only {text} (no separate url): " + json.dumps(shares)[:90])
    check(shares and "Genigma #" in shares[0]["text"] and URL in shares[0]["text"], "the shared text has the result AND the link")

    pg.evaluate("navigator.share=undefined"); pg.click("#winShare"); pg.wait_for_timeout(300)
    check(len(pg.evaluate("window.__clip")) == 1, "no share sheet: result is copied with the clipboard API")

    pg.evaluate("""Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true});
      document.execCommand=c=>{const a=document.activeElement;window.__ec.push([c,a&&a.tagName]);return true}""")
    pg.click("#winShare"); pg.wait_for_timeout(300)
    check(["copy", "TEXTAREA"] in pg.evaluate("window.__ec"), "no clipboard API: falls back to execCommand on a focused textarea")
    check(not js_errors, "no JavaScript errors" + (": " + "; ".join(js_errors) if js_errors else ""))
    b.close()

print("\nAll good." if not errors else f"\n{len(errors)} problem(s).")
raise SystemExit(1 if errors else 0)
