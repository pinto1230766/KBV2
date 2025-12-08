#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    for y in range(size):
        ratio = y / size
        r = int(30 + (59 - 30) * ratio)
        g = int(64 + (130 - 64) * ratio)
        b = int(175 + (246 - 175) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    try:
        font_size = int(size * 0.25)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "KBV"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.05)
    
    draw.text((x+2, y+2), text, font=font, fill=(0, 0, 0, 128))
    draw.text((x, y), text, font=font, fill=(255, 255, 255))
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG', quality=95)
    print(f"Cree: {output_path}")

def create_splash(width, height, output_path):
    img = Image.new('RGB', (width, height), color=(59, 130, 246))
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("arial.ttf", 120)
        font_small = ImageFont.truetype("arial.ttf", 60)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    text1 = "KBV"
    bbox1 = draw.textbbox((0, 0), text1, font=font_large)
    w1 = bbox1[2] - bbox1[0]
    x1 = (width - w1) // 2
    y1 = height // 2 - 100
    draw.text((x1, y1), text1, font=font_large, fill=(255, 255, 255))
    
    text2 = "LYON"
    bbox2 = draw.textbbox((0, 0), text2, font=font_small)
    w2 = bbox2[2] - bbox2[0]
    x2 = (width - w2) // 2
    y2 = y1 + 140
    draw.text((x2, y2), text2, font=font_small, fill=(255, 255, 255))
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG', quality=95)
    print(f"Cree: {output_path}")

base_path = "android/app/src/main/res"

icon_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

print("Generation des icones...")
for folder, size in icon_sizes.items():
    create_icon(size, f"{base_path}/{folder}/ic_launcher.png")
    create_icon(size, f"{base_path}/{folder}/ic_launcher_round.png")
    create_icon(size, f"{base_path}/{folder}/ic_launcher_foreground.png")

print("\nGeneration des splash screens...")
splash_configs = [
    ('drawable-port-mdpi', 320, 480),
    ('drawable-port-hdpi', 480, 800),
    ('drawable-port-xhdpi', 720, 1280),
    ('drawable-port-xxhdpi', 1080, 1920),
    ('drawable-port-xxxhdpi', 1440, 2560),
    ('drawable-land-mdpi', 480, 320),
    ('drawable-land-hdpi', 800, 480),
    ('drawable-land-xhdpi', 1280, 720),
    ('drawable-land-xxhdpi', 1920, 1080),
    ('drawable-land-xxxhdpi', 2560, 1440),
]

for folder, width, height in splash_configs:
    create_splash(width, height, f"{base_path}/{folder}/splash.png")

print("\nTermine! Prochaines etapes:")
print("1. cd android")
print("2. .\\gradlew clean")
print("3. cd ..")
print("4. npx cap sync android")
print("5. .\\gradlew assembleDebug")
