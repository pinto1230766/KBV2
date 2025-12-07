#!/usr/bin/env python3
"""
Script pour créer un logo et une icône pour l'application KBV
avec les couleurs de jw.org
"""

from PIL import Image, ImageDraw, ImageFont
import os

def hex_to_rgb(hex_color):
    """Convertit une couleur hex en tuple RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_logo_svg():
    """Crée un logo SVG avec le texte demandé"""
    svg_content = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <!-- Arrière-plan avec dégradé bleu jw.org -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Rectangle de fond arrondi -->
  <rect width="300" height="200" rx="20" fill="url(#bgGradient)"/>
  
  <!-- KBV - ligne 1 -->
  <text x="150" y="70" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
        fill="white" text-anchor="middle">KBV</text>
  
  <!-- LYON - ligne 2 -->
  <text x="150" y="110" font-family="Arial, sans-serif" font-size="24" font-weight="normal" 
        fill="white" text-anchor="middle">LYON</text>
  
  <!-- PF - ligne 3 -->
  <text x="150" y="145" font-family="Arial, sans-serif" font-size="20" font-weight="normal" 
        fill="white" text-anchor="middle">PF</text>
</svg>"""
    
    with open('public/logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("✅ Logo SVG créé : public/logo.svg")

def create_app_icon_png():
    """Crée une icône PNG pour l'application Android"""
    # Taille standard pour icônes Android
    icon_size = (512, 512)
    
    # Couleurs jw.org
    jw_blue = hex_to_rgb('#1e3a8a')  # Bleu foncé
    jw_light_blue = hex_to_rgb('#3b82f6')  # Bleu clair
    
    # Créer une image avec fond dégradé
    img = Image.new('RGBA', icon_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dessiner le fond arrondi
    margin = 40
    draw.rounded_rectangle(
        [margin, margin, icon_size[0] - margin, icon_size[1] - margin],
        radius=80,
        fill=jw_blue
    )
    
    # Essayer de charger une police, sinon utiliser la police par défaut
    try:
        font_large = ImageFont.truetype("arial.ttf", 120)
        font_medium = ImageFont.truetype("arial.ttf", 80)
        font_small = ImageFont.truetype("arial.ttf", 60)
    except:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
            font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 80)
            font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 60)
        except:
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
            font_small = ImageFont.load_default()
    
    # Centrer le texte
    def draw_centered_text(text, y, font, color='white'):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (icon_size[0] - text_width) // 2
        draw.text((x, y), text, font=font, fill=color)
    
    # KBV - ligne 1
    draw_centered_text("KBV", 140, font_large)
    
    # LYON - ligne 2  
    draw_centered_text("LYON", 240, font_medium)
    
    # PF - ligne 3
    draw_centered_text("PF", 320, font_small)
    
    # Sauvegarder l'icône en plusieurs tailles
    sizes = [192, 144, 96, 72, 48, 36]
    for size in sizes:
        resized_icon = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Créer le dossier android/app/src/main/res s'il n'existe pas
        android_dir = "android/app/src/main/res"
        os.makedirs(android_dir, exist_ok=True)
        
        # Icônes pour les différentes densités
        if size == 192:
            resized_icon.save(f"{android_dir}/mipmap-xxxhdpi/ic_launcher.png")
        elif size == 144:
            resized_icon.save(f"{android_dir}/mipmap-xxhdpi/ic_launcher.png")
        elif size == 96:
            resized_icon.save(f"{android_dir}/mipmap-xhdpi/ic_launcher.png")
        elif size == 72:
            resized_icon.save(f"{android_dir}/mipmap-hdpi/ic_launcher.png")
        elif size == 48:
            resized_icon.save(f"{android_dir}/mipmap-mdpi/ic_launcher.png")
        elif size == 36:
            resized_icon.save(f"{android_dir}/mipmap-ldpi/ic_launcher.png")
    
    # Icône principale
    img.save("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png")
    print("✅ Icônes PNG créées dans android/app/src/main/res/mipmap-*/")

def main():
    """Fonction principale"""
    print("🎨 Création du logo et de l'icône pour KBV...")
    print("📏 Utilisation des couleurs de jw.org")
    
    # Créer le logo SVG
    create_logo_svg()
    
    # Créer les icônes PNG
    create_app_icon_png()
    
    print("\n✨ Fichiers créés avec succès :")
    print("   📄 public/logo.svg - Logo pour l'application web")
    print("   📱 android/app/src/main/res/mipmap-*/ic_launcher.png - Icônes Android")

if __name__ == "__main__":
    main()
