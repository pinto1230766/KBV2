#!/usr/bin/env python3
"""
Générateur d'icônes Android pour KBVFP
Convertit le logo SVG en icônes PNG dans différentes résolutions
"""

import os
from PIL import Image, ImageDraw
import io

# Tailles d'icônes Android nécessaires
ANDROID_ICON_SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
    'playstore': 512
}

def create_icon(size):
    """Crée une icône KBVFP de la taille spécifiée"""
    # Créer une image avec fond transparent
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Couleurs jw.org
    bg_color = (30, 58, 138, 255)  # #1e3a8a
    text_color = (255, 255, 255, 255)  # Blanc
    
    # Dessiner le fond arrondi
    margin = size // 10
    draw.rounded_rectangle(
        [margin, margin, size-margin, size-margin], 
        radius=size//6, 
        fill=bg_color
    )
    
    # Calculer les tailles de police proportionnelles
    if size >= 192:  # XXXHDPI et plus
        font_sizes = {
            'kbv': size // 5,
            'lyon': size // 8,
            'pf': size // 9
        }
    else:
        font_sizes = {
            'kbv': max(size // 6, 16),
            'lyon': max(size // 10, 12),
            'pf': max(size // 12, 10)
        }
    
    # Positionner le texte
    y_positions = {
        'kbv': size // 3,
        'lyon': size // 2,
        'pf': size * 2 // 3
    }
    
    # Dessiner KBV
    draw.text((size//2, y_positions['kbv']), "KBV", 
              fill=text_color, anchor="mm", font_size=font_sizes['kbv'])
    
    # Dessiner LYON
    draw.text((size//2, y_positions['lyon']), "LYON", 
              fill=text_color, anchor="mm", font_size=font_sizes['lyon'])
    
    # Dessiner PF
    draw.text((size//2, y_positions['pf']), "PF", 
              fill=text_color, anchor="mm", font_size=font_sizes['pf'])
    
    return img

def generate_icons():
    """Génère toutes les icônes Android nécessaires"""
    
    # Créer les dossiers s'ils n'existent pas
    base_dir = "android/app/src/main/res"
    for folder in ANDROID_ICON_SIZES.keys():
        folder_path = os.path.join(base_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
    
    print("🎨 Génération des icônes Android pour KBVFP...")
    
    for folder, size in ANDROID_ICON_SIZES.items():
        print(f"   Création de {folder} ({size}x{size})...")
        
        # Générer l'icône
        icon = create_icon(size)
        
        # Sauvegarder
        output_path = os.path.join(base_dir, folder, "ic_launcher.png")
        icon.save(output_path, "PNG")
        print(f"   ✅ Sauvegardé: {output_path}")
    
    # Copier pour ic_launcher_round.png aussi
    print("📱 Création des icônes rondes...")
    for folder, size in ANDROID_ICON_SIZES.items():
        if folder != 'playstore':  # Pas besoin d'icône ronde pour Play Store
            source_path = os.path.join(base_dir, folder, "ic_launcher.png")
            round_path = os.path.join(base_dir, folder, "ic_launcher_round.png")
            
            if os.path.exists(source_path):
                import shutil
                shutil.copy2(source_path, round_path)
                print(f"   ✅ Copié: {round_path}")
    
    print("🎉 Toutes les icônes Android ont été générées avec succès !")

if __name__ == "__main__":
    generate_icons()
