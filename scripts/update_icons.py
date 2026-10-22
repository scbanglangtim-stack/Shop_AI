import os
from PIL import Image, ImageDraw

source_image_path = r"C:\Users\Nguyen_Phat\.gemini\antigravity-ide\brain\22892a5f-1e6e-47f8-86ab-cf99a8932940\shopai_app_icon_1792634504658.jpg"
res_dir = r"e:\Test_App\ShopAI\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

im = Image.open(source_image_path).convert("RGBA")

# Ensure perfectly square
w, h = im.size
min_dim = min(w, h)
im = im.crop(((w - min_dim) // 2, (h - min_dim) // 2, (w + min_dim) // 2, (h + min_dim) // 2))

for folder, size in sizes.items():
    target_dir = os.path.join(res_dir, folder)
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. Square / Squircle ic_launcher.png
    resized = im.resize((size, size), Image.Resampling.LANCZOS)
    
    # Rounded corners with radius = size * 0.22 (Apple / Android modern standard)
    corner_radius = int(size * 0.22)
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=corner_radius, fill=255)
    
    square_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    square_icon.paste(resized, (0, 0), mask=mask)
    square_path = os.path.join(target_dir, "ic_launcher.png")
    square_icon.save(square_path, "PNG")
    print(f"Saved {square_path} ({size}x{size})")
    
    # 2. Round ic_launcher_round.png
    round_mask = Image.new('L', (size, size), 0)
    round_draw = ImageDraw.Draw(round_mask)
    round_draw.ellipse((0, 0, size, size), fill=255)
    
    round_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    round_icon.paste(resized, (0, 0), mask=round_mask)
    round_path = os.path.join(target_dir, "ic_launcher_round.png")
    round_icon.save(round_path, "PNG")
    print(f"Saved {round_path} ({size}x{size})")

print("All icons generated successfully!")
