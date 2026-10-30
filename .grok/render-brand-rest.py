#!/usr/bin/env python3
from pathlib import Path

ROOT = Path("/workspace/.grok")

DRAGON = r"""
<g id="dragon">
  <path fill="#3e5134" d="M18 -6
    C 78 -102, 196 -108, 262 -28
    C 214 -42, 168 -8, 132 -2
    C 186 24, 214 78, 146 102
    C 92 46, 48 34, 8 16 Z"/>
  <path fill="#6e8654" d="M28 28
    C 86 8, 148 36, 198 28
    C 236 22, 258 46, 236 62
    C 188 54, 142 66, 96 54
    C 58 66, 22 52, 4 44 Z"/>
  <path fill="#7d945c" d="M-132 6
    C -74 -32, 18 -18, 52 22
    C 68 46, 36 78, -8 78
    C -56 84, -104 62, -146 46
    C -174 36, -168 16, -132 6 Z"/>
  <path fill="#c6a56c" d="M-96 30
    C -40 12, 16 26, 36 48
    C 8 58, -48 58, -98 46
    C -114 40, -116 34, -96 30 Z"/>
  <path fill="#7d945c" d="M-128 4
    C -168 -28, -206 -42, -242 -22
    C -278 -4, -286 22, -256 34
    C -232 44, -204 34, -180 24
    C -164 44, -128 36, -116 16 Z"/>
  <path fill="#8ea56a" d="M-246 2
    C -276 -2, -296 12, -290 24
    C -278 32, -256 28, -240 18 Z"/>
  <path fill="#d4b483" d="M-214 -20 L-204 -56 L-188 -12 Z"/>
  <path fill="#f0e2c4" d="M-196 -16 L-188 -46 L-180 -14 Z"/>
  <path d="M-268 20 C-244 30 -214 24 -190 16" fill="none" stroke="#2a2118" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
  <ellipse cx="-236" cy="2" rx="6.2" ry="4.8" fill="#f4e7cb"/>
  <ellipse cx="-235" cy="2.6" rx="2.5" ry="2.7" fill="#140e0a"/>
  <circle cx="-234.2" cy="1.4" r="0.9" fill="#f4e7cb"/>
  <path fill="#5c7344" stroke="#d4b483" stroke-width="1.4" d="M-28 -2
    C 28 -86, 148 -78, 196 -6
    C 132 -24, 84 8, 42 6
    C 102 32, 124 86, 46 100
    C 2 52, -16 28, -42 12 Z"/>
  <path d="M-16 8 C 40 -22, 104 -8, 178 0" fill="none" stroke="#e6d2a4" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M-6 20 C 28 10, 62 36, 52 88" fill="none" stroke="#d4b483" stroke-width="1.25" stroke-linecap="round"/>
  <path d="M-16 74 L-30 92 M-2 80 L2 98 M14 76 L26 92" fill="none" stroke="#d4b483" stroke-width="1.8" stroke-linecap="round"/>
</g>
"""

FLOURISH = r"""
<symbol id="flourish" viewBox="0 0 90 90">
  <path d="M10 48 C28 48 34 22 52 12" fill="none" stroke="#d4b483" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M10 48 C22 36 30 34 36 40 C28 46 18 48 10 48" fill="#d4b483"/>
  <path d="M52 12 C46 26 36 30 30 24" fill="none" stroke="#d4b483" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M18 62 C30 50 46 52 58 40" fill="none" stroke="#d4b483" stroke-width="1.4" stroke-linecap="round"/>
  <circle cx="52" cy="12" r="2.6" fill="#f0e2c4"/>
  <circle cx="58" cy="40" r="1.8" fill="#8f3d32"/>
</symbol>
"""

DEFS = r"""
<defs>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#23160f"/>
    <stop offset="55%" stop-color="#140e0a"/>
    <stop offset="100%" stop-color="#0c0907"/>
  </linearGradient>
  <radialGradient id="dusk" cx="50%" cy="42%" r="58%">
    <stop offset="0%" stop-color="#8f3d32" stop-opacity="0.78"/>
    <stop offset="40%" stop-color="#5a2a22" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="#140e0a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f4e7cb"/>
    <stop offset="42%" stop-color="#d4b483"/>
    <stop offset="100%" stop-color="#8a6840"/>
  </linearGradient>
  <pattern id="grain" width="7" height="28" patternUnits="userSpaceOnUse">
    <rect width="7" height="28" fill="none"/>
    <path d="M1 0 V28" stroke="#d4b483" stroke-opacity="0.045" stroke-width="1"/>
  </pattern>
  """ + FLOURISH + r"""
</defs>
"""

STYLE = """
@font-face {
  font-family: "Cinzel";
  src: url("fonts/Cinzel-Variable.ttf") format("truetype");
  font-weight: 400 900;
  font-style: normal;
}
html, body { margin: 0; padding: 0; background: #140e0a; }
svg text { font-family: Cinzel, "Liberation Serif", serif; }
"""

def page(w, h, body):
    return f"""<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
{STYLE}
body {{ width: {w}px; height: {h}px; overflow: hidden; }}
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
{DEFS}
{body}
</svg>
</body>
</html>
"""

OG = f"""
<rect width="1200" height="630" fill="url(#wood)"/>
<rect width="1200" height="630" fill="url(#dusk)"/>
<rect width="1200" height="630" fill="url(#grain)"/>
<rect x="176" y="78" width="864" height="478" fill="#0a0705" opacity="0.45"/>
<rect x="168" y="68" width="864" height="478" fill="#f4e7cb"/>
<rect x="184" y="84" width="832" height="446" fill="none" stroke="#d4b483" stroke-width="1.25" opacity="0.85"/>
<rect x="184" y="84" width="832" height="168" fill="#2a1812"/>
<ellipse cx="600" cy="168" rx="300" ry="78" fill="#8f3d32" opacity="0.42"/>
<ellipse cx="600" cy="512" rx="340" ry="52" fill="#24382c"/>
<ellipse cx="600" cy="512" rx="340" ry="52" fill="none" stroke="#d4b483" stroke-width="1.7"/>
<ellipse cx="600" cy="512" rx="312" ry="38" fill="none" stroke="#f4e7cb" stroke-width="0.7" stroke-dasharray="2.5 4" opacity="0.5"/>
{castle(600, 548, 1.05)}
<g transform="translate(600 132) scale(0.92)">{DRAGON}</g>
<rect x="236" y="214" width="728" height="128" fill="#140e0a"/>
<rect x="236" y="214" width="728" height="128" fill="none" stroke="url(#gold)" stroke-width="3"/>
<rect x="248" y="226" width="704" height="104" fill="none" stroke="#d4b483" stroke-width="1" opacity="0.8"/>
<text id="title" x="600" y="300" text-anchor="middle" font-size="78" font-weight="700"
  letter-spacing="11" fill="#d4b483">THORNWAKE</text>
<line x1="330" y1="318" x2="548" y2="318" stroke="#d4b483" stroke-width="1.3"/>
<polygon points="600,310 608,318 600,326 592,318" fill="#8f3d32" stroke="#d4b483" stroke-width="1.2"/>
<line x1="652" y1="318" x2="870" y2="318" stroke="#d4b483" stroke-width="1.3"/>
<rect x="32" y="32" width="1136" height="566" rx="6" fill="none" stroke="url(#gold)" stroke-width="3.5"/>
<rect x="46" y="46" width="1108" height="538" rx="3" fill="none" stroke="#d4b483" stroke-width="1.15"/>
<g transform="translate(40 40)"><use href="#flourish" width="84" height="84"/></g>
<g transform="translate(1160 40) scale(-1 1)"><use href="#flourish" width="84" height="84"/></g>
<g transform="translate(40 590) scale(1 -1)"><use href="#flourish" width="84" height="84"/></g>
<g transform="translate(1160 590) scale(-1 -1)"><use href="#flourish" width="84" height="84"/></g>
"""

BANNER = f"""
<rect width="1200" height="264" fill="url(#wood)"/>
<rect width="1200" height="264" fill="url(#grain)"/>
<ellipse cx="900" cy="118" rx="360" ry="110" fill="#8f3d32" opacity="0.5"/>
<ellipse cx="980" cy="214" rx="240" ry="34" fill="#24382c"/>
<ellipse cx="980" cy="214" rx="240" ry="34" fill="none" stroke="#d4b483" stroke-width="1.4"/>
{castle(990, 236, 0.62)}
<g transform="translate(860 112) scale(0.7)">{DRAGON}</g>
<rect x="44" y="32" width="508" height="128" fill="#140e0a"/>
<rect x="44" y="32" width="508" height="128" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
<rect x="54" y="42" width="488" height="108" fill="none" stroke="#d4b483" stroke-width="1" opacity="0.75"/>
<text id="title" x="68" y="112" text-anchor="start" font-size="52" font-weight="700"
  letter-spacing="3.5" fill="#d4b483">THORNWAKE</text>
<rect x="16" y="16" width="1168" height="232" rx="4" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
<rect x="26" y="26" width="1148" height="212" rx="2" fill="none" stroke="#d4b483" stroke-width="1"/>
"""

(ROOT / "og-card.html").write_text(page(1200, 630, OG), encoding="utf-8")
(ROOT / "x-banner.html").write_text(page(1200, 264, BANNER), encoding="utf-8")
print("wrote html")
