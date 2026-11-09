#!/usr/bin/env python3
"""Merge cover + body into the final roadmap PDF (normalized to A4)."""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89

def normalize(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    if abs(w - A4_W) > 0.2 or abs(h - A4_H) > 0.2:
        page.scale_to(A4_W, A4_H)
    return page

writer = PdfWriter()
writer.add_page(normalize(PdfReader("/home/z/my-project/download/roadmap_cover.pdf").pages[0]))
for p in PdfReader("/home/z/my-project/download/roadmap_body.pdf").pages:
    writer.add_page(normalize(p))
writer.add_metadata({
    "/Title": "LACUNA-AMR Market-Readiness Roadmap",
    "/Author": "Z.ai",
    "/Creator": "Z.ai",
    "/Subject": "Steps from the v0.4.0 audit platform to a market-ready AMR trust layer",
})
out = "/home/z/my-project/download/LACUNA-Market-Readiness-Roadmap.pdf"
with open(out, "wb") as f:
    writer.write(f)
print("merged:", out, "| pages:", len(writer.pages))
