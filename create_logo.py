#!/usr/bin/env python3
"""
Générateur d'icônes Android simplifié pour KBV Lyon
"""

import os
from PIL import Image, ImageDraw

def create_android_icon(output_dir, size):
    """Crée une icône Android"""
    
    # Créer le dossier de sortie
    os.makedirs(output_dir, exist_ok=True)
    
    # Créer une nouvelle image avec fond dégradé
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Couleurs du dégradé
    start_color = (30, 64, 175)  # #1e40af
    end_color = (59, 130, 246)   # #3b82f6
    
    # Créer le dégradé
    for y in range(size):
        ratio = y / size
        r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
        g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
        b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
        
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Ajouter un border arrondi (masque)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size, size], radius=size//8, fill=255)
    
    # Appliquer le masque
    img.putalpha(mask)
    
    # Ajouter le texte KBV
    text_size = max(12, size // 8)
    text_color = (255, 255, 255, 255)
    
    # KBV - texte principal
    kbv_width = len("KBV") * text_size // 2
    kbv_x = (size - kbv_width) // 2
    kbv_y = size // 3
    
    draw.text((kbv_x, kbv_y), "KBV", fill=text_color)
    
    # LYON - sous-titre
    lyon_size = text_size // 2
    lyon_width = len("LYON") * lyon_size // 2
    lyon_x = (size - lyon_width) // 2
    lyon_y = size // 2
    
    draw.text((lyon_x, lyon_y), "LYON", fill=text_color)
    
    # PF - tagline
    pf_size = text_size // 3
    pf_width = len("PF") * pf_size // 2
    pf_x = (size - pf_width) // 2
    pf_y = size * 2 // 3
    
    draw.text((pf_x, pf_y), "PF", fill=text_color)
    
    # Sauvegarder
    output_path = os.path.join(output_dir, f"ic_launcher_{size}x{size}.png")
    img.save(output_path, "PNG", quality=95)
    print(f"Icone creee: {output_path}")

def main():
    """Fonction principale"""
    
    # Tailles d'icônes Android standard
    sizes = [48, 72, 96, 144, 192]
    
    # Créer la structure Android
    android_dirs = {
        48: "android/app/src/main/res/mipmap-mdpi",
        72: "android/app/src/main/res/mipmap-hdpi", 
        96: "android/app/src/main/res/mipmap-xhdpi",
        144: "android/app/src/main/res/mipmap-xxhdpi",
        192: "android/app/src/main/res/mipmap-xxxhdpi"
    }
    
    print("Generation des icones Android pour KBV Lyon...")
    
    # Créer les dossiers
    for dir_path in android_dirs.values():
        os.makedirs(dir_path, exist_ok=True)
    
    # Générer les icônes
    for size in sizes:
        create_android_icon(android_dirs[size], size)
    
    print("Toutes les icones Android ont été generées avec succès!")

if __name__ == "__main__":
    main()
