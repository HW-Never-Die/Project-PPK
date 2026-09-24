import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

src_dir = r"C:\Users\Dewangga Ramadhan H\AppData\Roaming\Hermes\composer-images"
os.makedirs("public/images/facilities", exist_ok=True)
os.makedirs("public/uploads", exist_ok=True)

# Helper for 16:9 crop
def crop_to_aspect(img, target_ratio=16/9, align_y=0.5, align_x=0.5):
    w, h = img.size
    curr_ratio = w / h
    if curr_ratio > target_ratio:
        # Too wide, crop width
        new_w = int(h * target_ratio)
        offset_x = int((w - new_w) * align_x)
        return img.crop((offset_x, 0, offset_x + new_w, h))
    else:
        # Too tall, crop height
        new_h = int(w / target_ratio)
        offset_y = int((h - new_h) * align_y)
        return img.crop((0, offset_y, w, offset_y + new_h))

print("Processing images...")

# 1. Ruang Kelas
img_rk = Image.open(os.path.join(src_dir, "image_1cb83d.png")).convert("RGB")
# Crop bottom 30% to remove instructor table & remote
w, h = img_rk.size
img_rk_cropped = img_rk.crop((0, 0, w, int(h * 0.72)))
img_rk_final = crop_to_aspect(img_rk_cropped, 16/9, align_y=0.5, align_x=0.5)
img_rk_final.save("public/images/facilities/ruang-kelas.webp", "WEBP", quality=90)
print("1. Ruang Kelas saved:", img_rk_final.size)

# 2. Aula
img_aula = Image.open(os.path.join(src_dir, "image_0947ea.png")).convert("RGB")
# Crop black borders (top/left/right) and fog bottom
# Inspection: left ~10px, top ~15px, right ~10px, bottom ~80px fog
w, h = img_aula.size
img_aula_cropped = img_aula.crop((15, 20, w - 15, int(h * 0.78)))
img_aula_final = crop_to_aspect(img_aula_cropped, 16/9, align_y=0.4, align_x=0.5)
# Sharpen
img_aula_final = img_aula_final.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=3))
img_aula_final.save("public/images/facilities/aula.webp", "WEBP", quality=90)
print("2. Aula saved:", img_aula_final.size)

# 3. Lab Komputer
img_lab = Image.open(os.path.join(src_dir, "image_ebab5e.png")).convert("RGB")
# Rotate ~ -1.5 deg to straighten desk
img_lab_rot = img_lab.rotate(-1.5, resample=Image.BICUBIC, expand=False)
# Crop monitor borders and bottom 20%
w, h = img_lab_rot.size
img_lab_cropped = img_lab_rot.crop((20, 10, w - 20, int(h * 0.82)))
img_lab_final = crop_to_aspect(img_lab_cropped, 16/9, align_y=0.3, align_x=0.5)
img_lab_final.save("public/images/facilities/lab-komputer.webp", "WEBP", quality=90)
print("3. Lab Komputer saved:", img_lab_final.size)

# 4. Lab Sains
img_sains = Image.open(os.path.join(src_dir, "image_fdee2e.png")).convert("RGB")
w, h = img_sains.size
# Crop 12% bottom tiles & right side junk
img_sains_cropped = img_sains.crop((0, 0, w - 15, int(h * 0.85)))
img_sains_final = crop_to_aspect(img_sains_cropped, 16/9, align_y=0.4, align_x=0.5)
img_sains_final.save("public/images/facilities/lab-sains.webp", "WEBP", quality=90)
print("4. Lab Sains saved:", img_sains_final.size)

# 5. Lapangan Basket
img_basket = Image.open(os.path.join(src_dir, "image_2fcdbc.png")).convert("RGB")
w, h = img_basket.size
# Crop glare bottom & left margin
img_basket_cropped = img_basket.crop((30, 0, w, int(h * 0.78)))
img_basket_final = crop_to_aspect(img_basket_cropped, 16/9, align_y=0.5, align_x=0.5)
img_basket_final.save("public/images/facilities/lapangan-basket.webp", "WEBP", quality=90)
print("5. Lapangan Basket saved:", img_basket_final.size)

# 6. No Image Placeholder
img_no = Image.open(os.path.join(src_dir, "image_d3dacb.png")).convert("RGBA")
# Crop margin to square
w, h = img_no.size
# Let's crop 15px border
img_no_cropped = img_no.crop((15, 15, w - 15, h - 15))
img_no_cropped.save("public/images/facilities/no-image.webp", "WEBP", quality=95)
print("6. No Image saved:", img_no_cropped.size)

# 7. Logo FSM Undip (Remove navy background)
img_logo = Image.open(os.path.join(src_dir, "image_65b348.png")).convert("RGBA")
# Navy background color is around (12, 35, 64)
# Let's inspect background color from top-left corners
arr = np.array(img_logo)
r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
# Navy blue background: r < 40, g < 60, b < 95
# Let's find background mask
bg_mask = (r < 40) & (g < 60) & (b < 95)
# Set alpha to 0 for background
arr[bg_mask, 3] = 0
img_logo_clean = Image.fromarray(arr)
# Crop bounding box of non-zero alpha
bbox = img_logo_clean.getbbox()
if bbox:
    img_logo_clean = img_logo_clean.crop(bbox)
# Add a small padding 8px
pad = 10
padded_logo = Image.new("RGBA", (img_logo_clean.width + pad * 2, img_logo_clean.height + pad * 2), (0, 0, 0, 0))
padded_logo.paste(img_logo_clean, (pad, pad))
padded_logo.save("public/images/logo-fsm-undip.png", "PNG")
print("7. Logo saved:", padded_logo.size)

# 8. Hero FSM Undip
img_hero = Image.open(os.path.join(src_dir, "image_528028.png")).convert("RGB")
w, h = img_hero.size
# Crop moss pavement bottom 15%
img_hero_cropped = img_hero.crop((0, 0, w, int(h * 0.85)))
img_hero_final = crop_to_aspect(img_hero_cropped, 16/9, align_y=0.5, align_x=0.5)
img_hero_final.save("public/images/hero-fsm.webp", "WEBP", quality=92)
print("8. Hero saved:", img_hero_final.size)

# 9. AC Bocor
img_ac = Image.open(os.path.join(src_dir, "image_0b6024.png")).convert("RGB")
w, h = img_ac.size
# Crop right curtain ~ 15%
img_ac_cropped = img_ac.crop((0, 0, int(w * 0.85), h))
img_ac_final = crop_to_aspect(img_ac_cropped, 3/2, align_y=0.5, align_x=0.5)
img_ac_final.save("public/uploads/ac-bocor.webp", "WEBP", quality=90)
print("9. AC Bocor saved:", img_ac_final.size)

print("All images processed successfully.")
