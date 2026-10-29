"""Gera as imagens otimizadas do site a partir de ../ARTISTAS e ../CHAMADA.

Uso (de dentro de site/):  python scripts/build_assets.py
"""
import os, subprocess
from PIL import Image, ImageOps, ImageDraw

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.dirname(SITE)
ART = os.path.join(BASE, "ARTISTAS")
CHAM = os.path.join(BASE, "CHAMADA")
OUT = os.path.join(SITE, "img")

# slug -> (pasta em ARTISTAS, card da chamada, [arquivos das obras])
ARTISTAS = {
    "adico": ("ADico", "ADICO.jpeg", [
        "obra-1-Lambe-lambe de divulgao da Marcha da Maconha Guarulhos 2026.png",
        "obra-2-Arte digital de divulgao da Marcha da Maconha Guarulhos 2026.png",
        "obra-3-Artistas em Marcha com o Bandeiro da Marcha da Maconha Guarulhos 2026 - Foto Petty.JPG"]),
    "amanda-pankill": ("Amanda Pankill", "AMANDA DANKILL.jpeg", [
        "obra-1-Corpo Fortaleza.jpg", "obra-2-Kianumaka Man.jpg", "obra-3-Enlao.jpg"]),
    "tikka": ("ana carolinatikka Tikka", "ANA CAROLINA TIKKA.jpeg", [
        "obra-1-Liberdade.jpg", "obra-2-Mata atlntica.jpg", "obra-3-Cria mundo.jpg"]),
    "babilonia": ("Barbara Mesquita", "Barbara Mesquita.jpeg", ["IMG_2420.PNG", "IMG_2421.PNG"]),
    "carol-lubalu": ("Carol Lubalu", "Carol Lubalu.jpeg", []),
    "didi-assis": ("Didi Assis", "DIDI ASSIS.jpeg", [
        "FUTURO VERDE ROSA.png", "LAROYE MARIA PADILHA.png", "SALVE ELA - CAROLINA MARIA DE JESUS.png"]),
    "flor-de-cacto": ("Flor de Cacto Cia Feminina", "FLOR DE CACT CIA FEMININA.jpeg", [
        "obra-1-Chegue na Manha.jpeg", "obra-2-Mulher protegendo Mulher.png", "obra-3-Quem somos.png"]),
    "marta-henriksen": ("MARTA HENRIKSEN", "MARTA HENRIKSEN.jpeg", [
        "obra-1-Portal.png", "obra-2-Multidimensional.png", "obra-3-Alegria.jpeg"]),
    "naiana-nati": ("Naiana Nati", "NAIANA NATI.jpeg", [
        "obra-1-1Onde Floreso Arte digital.jpg", "obra-2-2Natureza em Mim  Arte digital.jpg",
        "obra-3-3Ns Florescemos  Arte digital.jpg"]),
    "noturnas-crew": ("Noturnas Crew", "NOTURNAS CREW.jpeg", [
        "obra-1-Mural de 2006.jpeg", "obra-2-Mulheres na cena.jpeg", "obra-3-NTS 2005.jpeg"]),
    "numa-godoy": ("Numa Godoy", "NUMA GODOY.jpeg", [
        "obra-1-Veneno.jpg", "obra-2-Kata.jpg", "obra-3-Solflower.jpg"]),
    "wira-tini": ("Wra Tini", "WIRA TINI.jpeg", [
        "obra-1-Karuaras o povo do Rio.jpeg", "obra-2-IPIRAWIRA.jpeg", "obra-3-Mashakara kukama.png"]),
    "yara-amaral": ("Yara Amaral", "YARA AMARAL.jpeg", [
        "obra-1-Casal Saras 7 Cores.jpeg", "obra-2-YaraAnram os Rios na Casa Sol.jpeg", "obra-3-Casal de Tis.jpeg"]),
}

# posição do retrato circular no template da chamada (1236x1600)
CIRCLE = (102, 748, 556, 1202)


def save(im, path, max_side, q=82):
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.mode or "transparency" in im.info else "RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)


def main():
    for slug, (pasta, card, obras) in ARTISTAS.items():
        src = os.path.join(ART, pasta)
        cardim = Image.open(os.path.join(CHAM, card)).convert("RGB")
        save(cardim, f"{OUT}/chamadas/{slug}.webp", 1100)
        retrato = cardim.crop(CIRCLE)
        save(retrato, f"{OUT}/retratos/{slug}.webp", 480)
        for i, f in enumerate(obras, 1):
            im = Image.open(os.path.join(src, f))
            save(im, f"{OUT}/obras/{slug}/{i}.webp", 1800)
            save(im, f"{OUT}/obras/{slug}/{i}-thumb.webp", 720, 76)

    poster = Image.open(os.path.join(CHAM, "01.jpeg")).convert("RGB")
    w, h = poster.size
    save(poster, f"{OUT}/cartaz.webp", 1400)
    # só a figura (lado direito), sem o título embutido nem a faixa de parceiros
    save(poster.crop((int(w * 0.46), 0, w, int(h * 0.905))), f"{OUT}/hero.webp", 1400)
    save(poster.crop((0, int(h * 0.905), w, h)), f"{OUT}/parceiros.webp", 1236, 88)
    # ícones do app (rosto da figura do cartaz)
    rosto = poster.crop((560, 250, 1236, 926))
    for n in (512, 192, 180):
        rosto.resize((n, n), Image.LANCZOS).save(f"{OUT}/icone-{n}.png")
    mask = Image.new("RGB", (512, 512), (28, 10, 31))
    mask.paste(rosto.resize((410, 410), Image.LANCZOS), (51, 51))
    mask.save(f"{OUT}/icone-maskable.png")
    save(Image.open(os.path.join(CHAM, "FIM.jpeg")).convert("RGB"), f"{OUT}/cartaz-qr.webp", 1100)

    # vídeos da Carol Lubalu (no lugar dos GIFs de ~7 MB)
    vid = os.path.join(SITE, "video")
    os.makedirs(vid, exist_ok=True)
    comp = os.path.join(ART, "Carol Lubalu", "comprimidos")
    for i, f in enumerate(["obra-1-Quais Corpos Merecem Respeito.mp4", "obra-2-Fugir de Si.mp4"], 1):
        dst = os.path.join(vid, f"carol-lubalu-{i}.mp4")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(comp, f), "-an",
                        "-vf", "scale=540:-2", "-c:v", "libx264", "-crf", "27", "-preset", "slow",
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], check=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "1", "-i", dst, "-frames:v", "1",
                        os.path.join(vid, f"carol-lubalu-{i}.jpg")], check=True)
        save(Image.open(os.path.join(vid, f"carol-lubalu-{i}.jpg")), f"{OUT}/obras/carol-lubalu/{i}-thumb.webp", 720, 76)
        os.remove(os.path.join(vid, f"carol-lubalu-{i}.jpg"))


if __name__ == "__main__":
    main()
