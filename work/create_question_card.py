from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import Paragraph
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "better-question-card.pdf"
PUBLIC = ROOT / "public" / "gifts" / "better-question-card.pdf"

DEEP = HexColor("#082F49")
MIDNIGHT = HexColor("#071E2D")
WINE = HexColor("#681D3C")
BERRY = HexColor("#9A5570")
PEARL = HexColor("#F4F0E8")
CREAM = HexColor("#E7D8C8")
SAND = HexColor("#D7C4A3")
FOAM = HexColor("#BFD8D2")


def draw_wrapped(canvas, text, x, y, width, style):
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 200 * mm)
    paragraph.drawOn(canvas, x, y - height)
    return y - height


def create_pdf(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    width, height = A4
    c = Canvas(str(path), pagesize=A4)

    c.setFillColor(MIDNIGHT)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Soft current lines.
    c.setStrokeColor(HexColor("#17475A"))
    c.setLineWidth(0.7)
    for offset in range(-80, 320, 28):
        c.bezier(-20 * mm, (offset + 30) * mm, 55 * mm, (offset - 10) * mm,
                 150 * mm, (offset + 40) * mm, 230 * mm, offset * mm)

    margin = 20 * mm
    card_x = margin
    card_y = 18 * mm
    card_w = width - 2 * margin
    card_h = height - 36 * mm
    c.setFillColor(PEARL)
    c.roundRect(card_x, card_y, card_w, card_h, 7 * mm, fill=1, stroke=0)
    c.setStrokeColor(WINE)
    c.setLineWidth(1.4)
    c.roundRect(card_x + 3 * mm, card_y + 3 * mm, card_w - 6 * mm, card_h - 6 * mm, 5 * mm, fill=0, stroke=1)

    title_style = ParagraphStyle(
        "title", fontName="Times-Italic", fontSize=28, leading=28,
        textColor=DEEP, alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        "subtitle", fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=WINE, alignment=TA_CENTER, spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "body", fontName="Times-Roman", fontSize=10.5, leading=14,
        textColor=DEEP,
    )
    prompt_style = ParagraphStyle(
        "prompt", fontName="Times-Italic", fontSize=11.5, leading=14,
        textColor=DEEP,
    )
    small_style = ParagraphStyle(
        "small", fontName="Helvetica", fontSize=7.5, leading=10,
        textColor=WINE, alignment=TA_CENTER,
    )

    top = height - 31 * mm
    top = draw_wrapped(c, "The Better Question Card", card_x + 15 * mm, top, card_w - 30 * mm, title_style)
    top -= 2 * mm
    top = draw_wrapped(c, "A SMALL GIFT FROM PEARL'S COVE", card_x + 15 * mm, top, card_w - 30 * mm, subtitle_style)
    top -= 4 * mm

    c.setStrokeColor(BERRY)
    c.setLineWidth(0.8)
    c.line(card_x + 24 * mm, top, card_x + card_w - 24 * mm, top)
    top -= 8 * mm
    top = draw_wrapped(
        c,
        "When a question feels stuck, do not rush toward an answer. Let it pass through these five movements instead.",
        card_x + 18 * mm, top, card_w - 36 * mm, body_style,
    )
    top -= 6 * mm

    prompts = [
        ("1  NAME THE CURRENT", "What is the strongest, most generous version of what I currently believe?"),
        ("2  FIND ITS OPPOSITE", "What would have to be true for the reverse to deserve equal respect?"),
        ("3  LOCATE THE MEETING LINE", "Where do both truths become real in one specific situation?"),
        ("4  NOTICE WHAT HOLDS", "What insight exists only while I refuse to flatten either side?"),
        ("5  CARRY ONE SENTENCE", "What can I write that keeps the question alive without making it vague?"),
    ]

    for label, question in prompts:
        c.setFillColor(WINE)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(card_x + 18 * mm, top, label)
        top -= 4.5 * mm
        top = draw_wrapped(c, question, card_x + 18 * mm, top, card_w - 36 * mm, prompt_style)
        top -= 3 * mm
        c.setStrokeColor(SAND)
        c.setLineWidth(0.55)
        c.line(card_x + 18 * mm, top, card_x + card_w - 18 * mm, top)
        top -= 5.5 * mm

    writing_y = card_y + 101 * mm
    c.setFillColor(WINE)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(card_x + 18 * mm, writing_y, "YOUR CARRY SENTENCE")
    c.setStrokeColor(SAND)
    c.setLineWidth(0.7)
    for line in range(4):
        y = writing_y - (9 + line * 10) * mm
        c.line(card_x + 18 * mm, y, card_x + card_w - 18 * mm, y)

    c.setFillColor(DEEP)
    c.roundRect(card_x + 16 * mm, card_y + 20 * mm, card_w - 32 * mm, 27 * mm, 3 * mm, fill=1, stroke=0)
    carry_style = ParagraphStyle(
        "carry", fontName="Times-Italic", fontSize=12, leading=16,
        textColor=PEARL, alignment=TA_CENTER,
    )
    draw_wrapped(c, "A better question does not merely produce a better answer.<br/>It changes the person who is asking.", card_x + 24 * mm, card_y + 38 * mm, card_w - 48 * mm, carry_style)

    draw_wrapped(c, "PEARLING LIM  ·  THE THINKER  ·  PEARL'S COVE", card_x + 18 * mm, card_y + 12 * mm, card_w - 36 * mm, small_style)
    c.showPage()
    c.save()


if __name__ == "__main__":
    create_pdf(OUT)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.write_bytes(OUT.read_bytes())
    print(OUT)
    print(PUBLIC)
