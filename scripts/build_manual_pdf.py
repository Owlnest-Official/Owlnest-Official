from __future__ import annotations

import io
import os
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A5
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "owlnest-lume-user-manual.pdf"

PAGE_W, PAGE_H = A5
MARGIN = 34

NAVY = HexColor("#172235")
INK = HexColor("#202A38")
MUTED = HexColor("#667083")
CREAM = HexColor("#F5F1E9")
CREAM_2 = HexColor("#ECE5D9")
AMBER = HexColor("#C8842B")
AMBER_DARK = HexColor("#95601F")
PALE_AMBER = HexColor("#F2E2C9")
LINE = HexColor("#D9D2C7")
SOFT_BLUE = HexColor("#E8EDF3")


def register_fonts() -> None:
    font_dir = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts"
    pdfmetrics.registerFont(TTFont("OwlnestSerif", str(font_dir / "georgia.ttf")))
    pdfmetrics.registerFont(TTFont("OwlnestSerifBold", str(font_dir / "georgiab.ttf")))
    pdfmetrics.registerFont(TTFont("OwlnestSans", str(font_dir / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("OwlnestSansBold", str(font_dir / "arialbd.ttf")))


def text_width(text: str, font: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font, size)


def wrap(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if text_width(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = "OwlnestSans",
    size: float = 9.4,
    leading: float = 13.6,
    color=INK,
) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def label(c: canvas.Canvas, text: str, x: float, y: float, color=AMBER) -> None:
    c.setFillColor(color)
    c.setFont("OwlnestSansBold", 7.4)
    c.drawString(x, y, text.upper())


def page_title(c: canvas.Canvas, kicker: str, title: str, subtitle: str | None = None) -> float:
    label(c, kicker, MARGIN, PAGE_H - 44)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 23)
    c.drawString(MARGIN, PAGE_H - 73, title)
    y = PAGE_H - 94
    if subtitle:
        y = paragraph(c, subtitle, MARGIN, y, PAGE_W - 2 * MARGIN, size=9.1, leading=13, color=MUTED)
    return y - 8


def footer(c: canvas.Canvas, page_number: int, *, dark: bool = False) -> None:
    color = HexColor("#AEB8C7") if dark else MUTED
    c.setStrokeColor(HexColor("#526075") if dark else LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN, 25, PAGE_W - MARGIN, 25)
    c.setFillColor(color)
    c.setFont("OwlnestSans", 6.6)
    c.drawString(MARGIN, 14, "OWLNEST LUME USER MANUAL")
    right = f"2026.07  |  {page_number}"
    c.drawRightString(PAGE_W - MARGIN, 14, right)


def draw_cropped_image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    with Image.open(path) as image:
        image = image.convert("RGB")
        target_ratio = w / h
        source_ratio = image.width / image.height
        if source_ratio > target_ratio:
            crop_w = int(image.height * target_ratio)
            left = (image.width - crop_w) // 2
            image = image.crop((left, 0, left + crop_w, image.height))
        else:
            crop_h = int(image.width / target_ratio)
            top = (image.height - crop_h) // 2
            image = image.crop((0, top, image.width, top + crop_h))
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=92)
        buffer.seek(0)
        c.drawImage(ImageReader(buffer), x, y, width=w, height=h, mask="auto")


def rounded_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, radius: float = 10) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=0)


def info_card(c: canvas.Canvas, x: float, y: float, w: float, h: float, value: str, caption: str) -> None:
    rounded_panel(c, x, y, w, h, white, 8)
    c.setFillColor(AMBER_DARK)
    c.setFont("OwlnestSerifBold", 14)
    c.drawString(x + 13, y + h - 22, value)
    paragraph(c, caption, x + 13, y + h - 39, w - 26, size=7.5, leading=10.2, color=MUTED)


def bullet(c: canvas.Canvas, text: str, x: float, y: float, width: float, *, color=INK) -> float:
    c.setFillColor(AMBER)
    c.circle(x + 3, y + 2.5, 2.1, fill=1, stroke=0)
    return paragraph(c, text, x + 13, y + 6, width - 13, size=8.7, leading=12.2, color=color) - 4


def numbered_step(c: canvas.Canvas, number: int, title: str, body: str, x: float, y: float, width: float) -> float:
    c.setFillColor(NAVY)
    c.circle(x + 13, y - 3, 13, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("OwlnestSansBold", 9)
    c.drawCentredString(x + 13, y - 6, str(number))
    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 9.5)
    c.drawString(x + 36, y + 1, title)
    y2 = paragraph(c, body, x + 36, y - 14, width - 36, size=8.4, leading=11.8, color=MUTED)
    return min(y - 46, y2 - 8)


def draw_cover(c: canvas.Canvas) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(AMBER)
    c.circle(PAGE_W - 58, PAGE_H - 58, 33, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.circle(PAGE_W - 48, PAGE_H - 48, 30, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont("OwlnestSansBold", 9)
    c.drawString(MARGIN, PAGE_H - 45, "OWLNEST")
    c.setFillColor(HexColor("#B8C0CC"))
    c.setFont("OwlnestSans", 7)
    c.drawString(MARGIN, PAGE_H - 58, "NIGHTTIME LIGHT, DESIGNED WITH INTENTION")

    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 34)
    c.drawString(MARGIN, PAGE_H - 117, "Owlnest Lume")
    c.setFillColor(PALE_AMBER)
    c.setFont("OwlnestSerif", 18)
    c.drawString(MARGIN, PAGE_H - 145, "User Manual")
    paragraph(
        c,
        "Setup, charging, care, and safer nighttime use.",
        MARGIN,
        PAGE_H - 172,
        PAGE_W - 2 * MARGIN,
        size=9.3,
        leading=13,
        color=HexColor("#CBD2DC"),
    )

    image_x = MARGIN
    image_y = 62
    image_w = PAGE_W - 2 * MARGIN
    image_h = 316
    c.saveState()
    p = c.beginPath()
    p.roundRect(image_x, image_y, image_w, image_h, 15)
    c.clipPath(p, stroke=0, fill=0)
    draw_cropped_image(c, ROOT / "lume-real-photo-on.jpg", image_x, image_y, image_w, image_h)
    c.restoreState()
    c.setStrokeColor(HexColor("#455168"))
    c.setLineWidth(0.8)
    c.roundRect(image_x, image_y, image_w, image_h, 15, fill=0, stroke=1)

    c.setFillColor(HexColor("#B8C0CC"))
    c.setFont("OwlnestSans", 6.8)
    c.drawString(MARGIN, 40, "LOW-BLUE SLEEP-SPECTRUM LAMP")
    c.drawRightString(PAGE_W - MARGIN, 40, "VERSION 2026.07")


def draw_overview(c: canvas.Canvas) -> None:
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    page_title(
        c,
        "01 / PRODUCT AT A GLANCE",
        "Meet Owlnest Lume",
        "A low-blue sleep-spectrum lamp designed for the last part of your evening.",
    )
    rounded_panel(c, MARGIN, 395, PAGE_W - 2 * MARGIN, 70, NAVY, 12)
    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 14)
    c.drawString(MARGIN + 17, 441, "Nighttime light, without daytime brightness.")
    paragraph(
        c,
        "Lume provides a dim deep-amber glow that helps create a calmer setting and supports the body's natural evening wind-down.",
        MARGIN + 17,
        421,
        PAGE_W - 2 * MARGIN - 34,
        size=8.4,
        leading=11.5,
        color=HexColor("#CBD2DC"),
    )

    gap = 10
    card_w = (PAGE_W - 2 * MARGIN - gap) / 2
    info_card(c, MARGIN, 318, card_w, 62, "1500K-1800K", "Deep-amber, low-blue light range")
    info_card(c, MARGIN + card_w + gap, 318, card_w, 62, "1-2 hours", "Suggested use before bedtime")
    info_card(c, MARGIN, 246, card_w, 62, "11 x 11 x 12 cm", "Compact bedside dimensions")
    info_card(c, MARGIN + card_w + gap, 246, card_w, 62, "USB-C", "Rechargeable for cable-free use")

    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 9.5)
    c.drawString(MARGIN, 218, "What Lume is")
    y = 199
    y = bullet(c, "A gentle source of light for winding down, reading briefly, or moving through low-light moments at night.", MARGIN, y, PAGE_W - 2 * MARGIN)
    y = bullet(c, "A simple lamp with one bottom button - no app, Bluetooth, clock, speaker, projector, alarm, or color-changing modes.", MARGIN, y, PAGE_W - 2 * MARGIN)

    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 9.5)
    c.drawString(MARGIN, 112, "What Lume is not")
    paragraph(
        c,
        "Lume is not a medical device or treatment, and it does not promise instant sleep. It is also not intended as bright task lighting or the sole light for safe navigation.",
        MARGIN,
        94,
        PAGE_W - 2 * MARGIN,
        size=8.7,
        leading=12.2,
        color=MUTED,
    )
    footer(c, 2)


def draw_setup(c: canvas.Canvas) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    page_title(c, "02 / GETTING STARTED", "Setup and nighttime use", "A short routine is all you need.")

    y = 431
    y = numbered_step(c, 1, "Unpack and inspect", "Confirm that the lamp and USB-C cable are present. Do not use the lamp or cable if either appears damaged.", MARGIN, y, 226)
    y = numbered_step(c, 2, "Charge before first use", "Connect the supplied USB-C cable to the port on the base and a suitable USB power source.", MARGIN, y, 226)
    y = numbered_step(c, 3, "Choose a stable location", "Place Lume upright on a dry, level surface away from water, open flame, heaters, and fabric that could cover the lamp.", MARGIN, y, 226)
    y = numbered_step(c, 4, "Turn on from the base", "Press the bottom button to control the lamp. Keep the port and button clean and dry.", MARGIN, y, 226)
    y = numbered_step(c, 5, "Let brighter lights step back", "Use Lume during the last 1-2 hours before bed while reducing brighter overhead and cool-white lighting.", MARGIN, y, 226)

    panel_x = 282
    rounded_panel(c, panel_x, 184, PAGE_W - panel_x - MARGIN, 272, CREAM, 12)
    label(c, "A SIMPLE EVENING ROUTINE", panel_x + 14, 432)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(panel_x + 14, 407, "Ease the room")
    paragraph(c, "Dim or switch off brighter lights, then use Lume as the room settles.", panel_x + 14, 385, 88, size=8.2, leading=11.3, color=MUTED)
    c.setStrokeColor(LINE)
    c.line(panel_x + 14, 336, PAGE_W - MARGIN - 14, 336)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 8.4)
    c.drawString(panel_x + 14, 318, "At bedtime")
    paragraph(c, "Switch Lume off when you are ready to sleep, unless a small amount of light is still needed.", panel_x + 14, 302, 88, size=7.9, leading=10.8, color=MUTED)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 8.4)
    c.drawString(panel_x + 14, 248, "During the night")
    paragraph(c, "For brief wakeups, use the lowest amount of light that lets you move safely.", panel_x + 14, 232, 88, size=7.9, leading=10.8, color=MUTED)
    rounded_panel(c, MARGIN, 59, PAGE_W - 2 * MARGIN, 70, SOFT_BLUE, 9)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSansBold", 9)
    c.drawString(MARGIN + 14, 106, "Important")
    paragraph(c, "Light is one part of an evening routine. Sleep can also be affected by timing, stress, noise, temperature, caffeine, and individual health factors.", MARGIN + 14, 89, PAGE_W - 2 * MARGIN - 28, size=8.2, leading=11.4, color=MUTED)
    footer(c, 3)


def draw_controls(c: canvas.Canvas) -> None:
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    page_title(c, "03 / CONTROLS AND CHARGING", "Simple by design", "One bottom button and one USB-C charging port.")

    image_x = MARGIN
    image_y = 173
    image_w = 174
    image_h = 278
    c.saveState()
    p = c.beginPath()
    p.roundRect(image_x, image_y, image_w, image_h, 12)
    c.clipPath(p, stroke=0, fill=0)
    draw_cropped_image(c, ROOT / "lume-bottom-button.jpg", image_x, image_y, image_w, image_h)
    c.restoreState()

    right_x = 228
    right_w = PAGE_W - MARGIN - right_x
    label(c, "BOTTOM BUTTON", right_x, 437)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(right_x, 414, "Press to control")
    paragraph(c, "The control is located on the underside of the wooden base. Lift the lamp carefully with dry hands when reaching it.", right_x, 394, right_w, size=8.4, leading=11.6, color=MUTED)

    c.setStrokeColor(LINE)
    c.line(right_x, 335, PAGE_W - MARGIN, 335)
    label(c, "USB-C PORT", right_x, 315)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(right_x, 292, "Recharge safely")
    y = paragraph(c, "Use the supplied cable with a suitable USB power source. Insert and remove the connector gently without twisting it.", right_x, 272, right_w, size=8.4, leading=11.6, color=MUTED)
    y -= 17
    y = bullet(c, "Charge on a dry, ventilated surface.", right_x, y, right_w)
    y = bullet(c, "Keep the port free of dust and moisture.", right_x, y, right_w)
    bullet(c, "Disconnect if the lamp, cable, or connector becomes unusually hot or damaged.", right_x, y, right_w)

    rounded_panel(c, MARGIN, 62, PAGE_W - 2 * MARGIN, 84, NAVY, 10)
    c.setFillColor(white)
    c.setFont("OwlnestSansBold", 9)
    c.drawString(MARGIN + 15, 122, "Battery care")
    paragraph(c, "Do not disassemble, puncture, crush, burn, or expose the lamp to extreme heat. If the body swells, leaks, smells unusual, or is physically damaged, stop using it and contact Owlnest.", MARGIN + 15, 104, PAGE_W - 2 * MARGIN - 30, size=8.1, leading=11.2, color=HexColor("#CBD2DC"))
    footer(c, 4)


def safety_card(c: canvas.Canvas, x: float, y: float, w: float, h: float, title: str, items: list[str]) -> None:
    rounded_panel(c, x, y, w, h, CREAM, 10)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 13)
    c.drawString(x + 14, y + h - 24, title)
    yy = y + h - 45
    for item in items:
        yy = bullet(c, item, x + 14, yy, w - 28)


def draw_safety(c: canvas.Canvas) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    page_title(c, "04 / SAFETY AND CARE", "Keep Lume in good shape", "Use common sense around electricity, heat, water, and nighttime movement.")

    gap = 12
    col_w = (PAGE_W - 2 * MARGIN - gap) / 2
    safety_card(c, MARGIN, 274, col_w, 178, "Placement", [
        "Use indoors on a stable, level, dry surface.",
        "Keep away from sinks, bathtubs, open flame, heaters, and direct heat.",
        "Do not cover the lamp while it is on or charging.",
        "Keep cords out of walkways and away from children and pets.",
    ])
    safety_card(c, MARGIN + col_w + gap, 274, col_w, 178, "Everyday use", [
        "Use with dry hands and do not immerse the lamp in water.",
        "Do not stare closely into the light for extended periods.",
        "Do not open, modify, or attempt internal repairs.",
        "Stop use after a hard impact or if any part appears damaged.",
    ])
    safety_card(c, MARGIN, 92, col_w, 166, "Cleaning", [
        "Switch off and disconnect the charging cable.",
        "Wipe with a soft, dry cloth.",
        "Do not use solvents, abrasive cleaners, or sprays.",
        "Let the lamp remain fully dry before reconnecting power.",
    ])
    safety_card(c, MARGIN + col_w + gap, 92, col_w, 166, "Nighttime safety", [
        "Lume is not bright task lighting.",
        "Use additional lighting where steps, obstacles, or hazards require clear visibility.",
        "This product is not a toy. Adult supervision is recommended around children.",
    ])
    footer(c, 5)


def draw_contents(c: canvas.Canvas) -> None:
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    page_title(c, "05 / BOX CONTENTS AND FACTS", "What comes with Lume", "Keep your proof of purchase and product key card in a safe place.")

    contents = [
        ("01", "Owlnest Lume", "Soft silicone lamp body with a wooden base."),
        ("02", "USB-C charging cable", "For recharging from a suitable USB power source."),
        ("03", "Product key card", "Keep this card together with your order information."),
    ]
    y = 425
    for number, title, body in contents:
        c.setFillColor(PALE_AMBER)
        c.circle(MARGIN + 18, y - 2, 17, fill=1, stroke=0)
        c.setFillColor(AMBER_DARK)
        c.setFont("OwlnestSansBold", 8.5)
        c.drawCentredString(MARGIN + 18, y - 5, number)
        c.setFillColor(NAVY)
        c.setFont("OwlnestSansBold", 10)
        c.drawString(MARGIN + 48, y + 4, title)
        paragraph(c, body, MARGIN + 48, y - 13, PAGE_W - MARGIN - (MARGIN + 48), size=8.2, leading=11, color=MUTED)
        y -= 66

    c.setStrokeColor(LINE)
    c.line(MARGIN, 230, PAGE_W - MARGIN, 230)
    c.setFillColor(NAVY)
    c.setFont("OwlnestSerifBold", 16)
    c.drawString(MARGIN, 203, "Current product facts")

    facts = [
        ("Light", "Deep amber, low-blue sleep-spectrum light"),
        ("Range", "1500K-1800K"),
        ("Size", "11 x 11 x 12 cm"),
        ("Materials", "Soft silicone body and wooden base"),
        ("Charging", "USB-C rechargeable"),
        ("Controls", "Single bottom button"),
    ]
    row_y = 178
    for left, right in facts:
        c.setFillColor(MUTED)
        c.setFont("OwlnestSansBold", 7.8)
        c.drawString(MARGIN, row_y, left.upper())
        c.setFillColor(INK)
        c.setFont("OwlnestSans", 8.5)
        c.drawString(122, row_y, right)
        c.setStrokeColor(LINE)
        c.line(MARGIN, row_y - 9, PAGE_W - MARGIN, row_y - 9)
        row_y -= 23

    c.setFillColor(MUTED)
    c.setFont("OwlnestSans", 6.9)
    c.drawString(MARGIN, 38, "Specifications may be refined before final production. Confirm current details on the official product page.")
    footer(c, 6)


def linked_text(c: canvas.Canvas, label_text: str, url: str, x: float, y: float, size: float = 8.6) -> None:
    c.setFillColor(PALE_AMBER)
    c.setFont("OwlnestSansBold", size)
    c.drawString(x, y, label_text)
    width = text_width(label_text, "OwlnestSansBold", size)
    c.linkURL(url, (x, y - 2, x + width, y + size + 2), relative=0)


def draw_support(c: canvas.Canvas) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    label(c, "06 / WARRANTY AND SUPPORT", MARGIN, PAGE_H - 44, PALE_AMBER)
    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 26)
    c.drawString(MARGIN, PAGE_H - 78, "We are here to help")
    paragraph(c, "Contact Owlnest if your lamp arrives damaged, develops a defect, or you need help with setup and care.", MARGIN, PAGE_H - 103, PAGE_W - 2 * MARGIN, size=9.1, leading=13, color=HexColor("#CBD2DC"))

    rounded_panel(c, MARGIN, 337, PAGE_W - 2 * MARGIN, 111, HexColor("#253249"), 12)
    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(MARGIN + 16, 422, "Limited defect warranty")
    paragraph(c, "Campaign-backed units are expected to include a one-year limited defect warranty after delivery. Coverage applies to eligible manufacturing defects and requires proof of purchase.", MARGIN + 16, 399, PAGE_W - 2 * MARGIN - 32, size=8.3, leading=11.5, color=HexColor("#CBD2DC"))
    paragraph(c, "Accidental damage, misuse, unauthorized modification, normal wear, and damage from improper charging or storage are not covered. Campaign and fulfillment terms remain controlling.", MARGIN + 16, 364, PAGE_W - 2 * MARGIN - 32, size=7.6, leading=10.4, color=HexColor("#AEB8C7"))

    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(MARGIN, 306, "Contact")
    linked_text(c, "team@owlnestofficial.com", "mailto:team@owlnestofficial.com", MARGIN, 282, 9.2)

    c.setStrokeColor(HexColor("#526075"))
    c.line(MARGIN, 260, PAGE_W - MARGIN, 260)
    c.setFillColor(white)
    c.setFont("OwlnestSerifBold", 15)
    c.drawString(MARGIN, 234, "Current information")
    linked_text(c, "Product page", "https://owlnestofficial.com/products.html", MARGIN, 209)
    linked_text(c, "Online manual", "https://owlnestofficial.com/manual.html", MARGIN, 187)
    linked_text(c, "Science and references", "https://owlnestofficial.com/science.html", MARGIN, 165)
    linked_text(c, "Campaign terms", "https://owlnestofficial.com/preorder-policy.html", MARGIN, 143)

    rounded_panel(c, MARGIN, 57, PAGE_W - 2 * MARGIN, 63, HexColor("#202D43"), 9)
    c.setFillColor(white)
    c.setFont("OwlnestSansBold", 8.6)
    c.drawString(MARGIN + 14, 97, "General-wellness product")
    paragraph(c, "Owlnest Lume is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or sleep disorder.", MARGIN + 14, 81, PAGE_W - 2 * MARGIN - 28, size=7.8, leading=10.5, color=HexColor("#CBD2DC"))
    footer(c, 7, dark=True)


def build() -> Path:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A5, pageCompression=1)
    c.setTitle("Owlnest Lume User Manual")
    c.setAuthor("Owlnest Official")
    c.setSubject("Setup, charging, care, safety, warranty, and support for Owlnest Lume")
    c.setKeywords("Owlnest Lume, user manual, sleep-spectrum lamp, low-blue light, USB-C")
    c.setCreator("Owlnest Official")

    pages = [draw_cover, draw_overview, draw_setup, draw_controls, draw_safety, draw_contents, draw_support]
    for index, draw_page in enumerate(pages):
        draw_page(c)
        if index != len(pages) - 1:
            c.showPage()
    c.save()
    return OUTPUT


if __name__ == "__main__":
    print(build())
