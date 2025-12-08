#!/usr/bin/env python3
"""
Générateur d'icônes Android pour l'application KBV Lyon
Génère automatiquement toutes les tailles d'icônes nécessaires pour Android
"""

import os
from PIL import Image, ImageDraw
import math

def create_android_icon(svg_path, output_dir, sizes):
    """Crée des icônes Android à partir du SVG"""
    
    # Créer le dossier de sortie
    os.makedirs(output_dir, exist_ok=True)
    
    # Ouvrir le SVG avec PIL (PIL ne supporte pas directement SVG, on utilise un canvas)
    # Pour une solution simple, on crée un canvas avec les couleurs du thème
    
    for size in sizes:
        # Créer une nouvelle image avec fond dégradé
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Couleurs du dégradé (adaptées de l'SVG)
        start_color = (30, 64, 175)  # #1e40af
        end_color = (59, 130, 246)   # #3b82f6
        
        # Créer le dégradé
        for y in range(size):
            # Interpolation linéaire des couleurs
            ratio = y / size
            r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
            g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
            b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
            
            # Dessiner la ligne horizontale
            draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
        
        # Ajouter un border arrondi (masque)
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size, size], radius=size//8, fill=255)
        
        # Appliquer le masque
        img.putalpha(mask)
        
        # Ajouter le texte KBV (centré)
        text_size = max(12, size // 8)
        font_size = text_size
        
        # Position du texte
        text_x = size // 2
        text_y = size // 2 - font_size
        
        # Couleur du texte (blanc)
        text_color = (255, 255, 255, 255)
        
        # Pour le texte, on va utiliser des rectangles simples puisque PIL a des limitations
        # KBV - texte principal
        kbv_width = len("KBV") * font_size // 2
        kbv_x = (size - kbv_width) // 2
        kbv_y = size // 3
        
        draw.text((kbv_x, kbv_y), "KBV", fill=text_color)
        
        # LYON - sous-titre
        lyon_size = font_size // 2
        lyon_width = len("LYON") * lyon_size // 2
        lyon_x = (size - lyon_width) // 2
        lyon_y = size // 2
        
        draw.text((lyon_x, lyon_y), "LYON", fill=text_color)
        
        # PF - tagline
        pf_size = font_size // 3
        pf_width = len("PF") * pf_size // 2
        pf_x = (size - pf_width) // 2
        pf_y = size * 2 // 3
        
        draw.text((pf_x, pf_y), "PF", fill=text_color)
        
        # Sauvegarder
        output_path = os.path.join(output_dir, f"ic_launcher_{size}x{size}.png")
        img.save(output_path, "PNG", quality=95)
        print(f"✓ Icône créée: {output_path}")

def main():
    """Fonction principale"""
    
    # Chemins
    svg_path = "public/logo.svg"
    output_dir = "android/app/src/main/res"
    
    # Tailles d'icônes Android standard
    sizes = [
        48,   # mdpi
        72,   # hdpi
        96,   # xhdpi
        144,  # xxhdpi
        192   # xxxhdpi
    ]
    
    print("🎨 Génération des icônes Android pour KBV Lyon...")
    print(f"📁 Source: {svg_path}")
    print(f"📁 Destination: {output_dir}")
    print(f"📐 Tailles: {', '.join(map(str, sizes))}px")
    
    # Vérifier si le dossier Android existe
    if not os.path.exists("android"):
        print("⚠️  Dossier Android non trouvé. Création de la structure de base...")
        os.makedirs("android/app/src/main/res/mipmap-mdpi", exist_ok=True)
        os.makedirs("android/app/src/main/res/mipmap-hdpi", exist_ok=True)
        os.makedirs("android/app/src/main/res/mipmap-xhdpi", exist_ok=True)
        os.makedirs("android/app/src/main/res/mipmap-xxhdpi", exist_ok=True)
        os.makedirs("android/app/src/main/res/mipmap-xxxhdpi", exist_ok=True)
    
    # Organiser les icônes par densité
    density_mapping = {
        48: "mipmap-mdpi",
        72: "mipmap-hdpi", 
        96: "mipmap-xhdpi",
        144: "mipmap-xxhdpi",
        192: "mipmap-xxxhdpi"
    }
    
    for size in sizes:
        density_dir = os.path.join(output_dir, density_mapping[size])
        create_android_icon(svg_path, density_dir, [size])
    
    print("\n✅ Toutes les icônes Android ont été générées avec succès!")
    print("\n📋 Étapes suivantes:")
    print("1. Vérifier les icônes générées dans android/app/src/main/res/")
    print("2. Copier les icônes dans les dossiers mipmap appropriés")
    print("3. Tester l'application sur votre tablette Samsung S10 Ultra")

if __name__ == "__main__":
    main()
