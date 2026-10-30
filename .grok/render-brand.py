def castle(ox, oy, s=1.15):
    """Wide isometric dusk-castle miniature. Base center lands on (ox, oy)."""
    pts = []

    def iso(x, y, z):
        p = (x - y) * 0.866 * s, (x + y) * 0.5 * s - z * s
        pts.append(p)
        return p

    def P(*poly):
        return " ".join(f"{px:.1f},{py:.1f}" for px, py in poly)

    def add_box(x, y, z, w, d, h, cols, with_top=True):
        A, B = iso(x, y, z + h), iso(x + w, y, z + h)
        C, D = iso(x + w, y + d, z + h), iso(x, y + d, z + h)
        b, c, dp = iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)
        front, side, top = cols
        parts = [
            f'<polygon points="{P(dp, c, C, D)}" fill="{front}" stroke="#2a2118" stroke-width="1.4" stroke-linejoin="round"/>',
            f'<polygon points="{P(b, c, C, B)}" fill="{side}" stroke="#2a2118" stroke-width="1.4" stroke-linejoin="round"/>',
        ]
        if with_top:
            parts.append(f'<polygon points="{P(A, B, C, D)}" fill="{top}"/>')
        return parts

    def add_roof(x, y, w, d, z, zh):
        A, B = iso(x, y, z), iso(x + w, y, z)
        C, D = iso(x + w, y + d, z), iso(x, y + d, z)
        apex = iso(x + w / 2, y + d / 2, z + zh)
        cols = ("#a85a42", "#c47858", "#8f3d32", "#6e342c")
        faces = (
            (P(A, D, apex), cols[0]),
            (P(A, B, apex), cols[1]),
            (P(D, C, apex), cols[2]),
            (P(B, C, apex), cols[3]),
        )
        return [f'<polygon points="{p}" fill="{c}" stroke="#2a2118" stroke-width="1.3" stroke-linejoin="round"/>' for p, c in faces]

    stone = ("#7d7266", "#564e46", "#c2b6a8")
    stone2 = ("#6e645a", "#4a433c", "#a89c90")
    stone3 = ("#85786c", "#5a524a", "#d4c8ba")
    buildings = [
        (-118, -16, 0, 70, 40, 36, stone2, 20),
        (50, -10, 0, 66, 36, 38, stone2, 20),
        (-34, -34, 0, 68, 68, 78, stone, 36),
        (-122, -42, 0, 30, 30, 92, stone3, 30),
        (88, -38, 0, 28, 28, 84, stone3, 28),
        (-16, 34, 0, 34, 28, 36, stone2, 0),
    ]
    buildings.sort(key=lambda b: b[0] + b[1])
    chunks = []
    for x, y, z, w, d, h, cols, rh in buildings:
        chunks.extend(add_box(x, y, z, w, d, h, cols, with_top=(rh == 0)))
        if rh:
            chunks.extend(add_roof(x, y, w, d, h, rh))

    def slit(face, x, y, z, w, h):
        if face == "front":
            poly = [iso(x, y, z), iso(x + w, y, z), iso(x + w, y, z + h), iso(x, y, z + h)]
        else:
            poly = [iso(x, y, z), iso(x, y + w, z), iso(x, y + w, z + h), iso(x, y, z + h)]
        return f'<polygon points="{P(*poly)}" fill="#e7b15a"/>'

    # keep front y = -34+68 = 34; keep side x = -34+68 = 34
    chunks.append(slit("front", -12, 34, 28, 9, 16))
    chunks.append(slit("front", 8, 34, 48, 8, 14))
    chunks.append(slit("side", 34, -10, 32, 8, 16))
    chunks.append(slit("side", 34, 14, 52, 7, 12))
    # gate door, front y = 34+28 = 62
    chunks.append(
        f'<polygon points="{P(iso(-6, 62, 0), iso(10, 62, 0), iso(10, 62, 20), iso(-6, 62, 20))}" fill="#140e0a"/>'
    )
    # wing windows
    chunks.append(slit("front", -86, 24, 14, 9, 11))
    chunks.append(slit("front", 72, 26, 16, 9, 11))
    # turret lights
    chunks.append(slit("side", -92, -30, 50, 6, 12))
    chunks.append(slit("front", 98, -10, 44, 6, 12))

    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    cx = (min(xs) + max(xs)) / 2
    base = max(ys)
    body = "\n".join(chunks)
    return (
        f'<g transform="translate({ox - cx:.1f} {oy - base:.1f})">{body}</g>'
    )
