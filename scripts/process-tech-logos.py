#!/usr/bin/env python3
"""Rename and square-crop technology stack logos."""

from __future__ import annotations

import subprocess
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "assets/technology/logolist"
OUT_SIZE = 512
PADDING_RATIO = 0.06

RENAMES = {
    "APP_ICON_3D_DARK.png": "cursor.png",
    "Amazon_Web_Services-Logo.wine.svg": "aws.png",
    "Dart_logo.png": "dart.png",
    "JavaScript-logo.png": "javascript.png",
    "Laravel-Logo.wine.svg": "laravel.png",
    "Octicons-mark-github.svg.png": "github.png",
    "PHP-logo.svg.png": "php.png",
    "React_(web_framework)-Logo.wine.svg": "react.png",
    "Vue.js_Logo_2.svg.png": "vue.png",
    "docker-mark-ocean-blue.png": "docker.png",
    "image.png": "vscode.png",
    "logo-logomark.png": "lightning.png",
    "python-logo-only.png": "python.png",
}


def render_svg(svg_path: Path, tmp_dir: Path) -> Image.Image:
    tmp_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["qlmanage", "-t", "-s", "1200", "-o", str(tmp_dir), str(svg_path)],
        check=True,
        capture_output=True,
    )
    rendered = tmp_dir / f"{svg_path.name}.png"
    if not rendered.exists():
        raise FileNotFoundError(f"Failed to render SVG: {svg_path}")
    return Image.open(rendered).convert("RGBA")


def corner_background(img: Image.Image) -> tuple[int, int, int, int]:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    corners = [
        rgba.getpixel((0, 0)),
        rgba.getpixel((w - 1, 0)),
        rgba.getpixel((0, h - 1)),
        rgba.getpixel((w - 1, h - 1)),
    ]
    counts: dict[tuple[int, int, int, int], int] = {}
    for px in corners:
        counts[px] = counts.get(px, 0) + 1
    return max(counts, key=counts.get)


def color_distance(a: tuple[int, ...], b: tuple[int, ...]) -> int:
    return sum(abs(int(a[i]) - int(b[i])) for i in range(3))


def content_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    alpha = rgba.split()[3]
    alpha_bbox = alpha.getbbox()
    if alpha_bbox and alpha_bbox != (0, 0, w, h):
        return alpha_bbox

    bg = corner_background(rgba)
    threshold = 36
    min_x, min_y, max_x, max_y = w, h, -1, -1
    pixels = rgba.load()
    for y in range(h):
        for x in range(w):
            px = pixels[x, y]
            if px[3] < 20:
                continue
            if color_distance(px, bg) > threshold:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)

    if max_x < 0:
        return (0, 0, w, h)
    return (min_x, min_y, max_x + 1, max_y + 1)


def crop_logo_square(img: Image.Image) -> Image.Image:
    min_x, min_y, max_x, max_y = content_bbox(img)
    content_w = max_x - min_x
    content_h = max_y - min_y
    side = max(content_w, content_h)
    pad = max(1, int(side * PADDING_RATIO))
    side += pad * 2
    cx = (min_x + max_x) / 2
    cy = (min_y + max_y) / 2
    left = int(round(cx - side / 2))
    top = int(round(cy - side / 2))
    right = left + side
    bottom = top + side

    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    src = img.convert("RGBA")
    paste_x = max(0, -left)
    paste_y = max(0, -top)
    crop_left = max(0, left)
    crop_top = max(0, top)
    crop_right = min(src.width, right)
    crop_bottom = min(src.height, bottom)
    region = src.crop((crop_left, crop_top, crop_right, crop_bottom))
    canvas.paste(region, (paste_x, paste_y), region)
    return canvas.resize((OUT_SIZE, OUT_SIZE), Image.Resampling.LANCZOS)


def load_source(path: Path, tmp_dir: Path) -> Image.Image:
    if path.suffix.lower() == ".svg":
        return render_svg(path, tmp_dir)
    return Image.open(path).convert("RGBA")


def main() -> int:
    tmp_dir = ROOT / ".tmp-tech-logos"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    staged: list[Path] = []

    for old_name, new_name in RENAMES.items():
        src = SRC_DIR / old_name
        if not src.exists():
            print(f"Missing source file: {src}", file=sys.stderr)
            return 1

        img = load_source(src, tmp_dir)
        cropped = crop_logo_square(img)
        out_path = SRC_DIR / new_name
        staged.append(out_path)
        cropped.save(out_path, format="PNG", optimize=True)
        print(f"{old_name} -> {new_name} ({OUT_SIZE}x{OUT_SIZE})")

    for old_name in RENAMES:
        old_path = SRC_DIR / old_name
        if old_path.exists() and old_path.name not in {p.name for p in staged}:
            old_path.unlink()

    for path in tmp_dir.iterdir():
        path.unlink()
    tmp_dir.rmdir()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
