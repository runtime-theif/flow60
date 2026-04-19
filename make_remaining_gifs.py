import os
from PIL import Image

brain_dir = '/Users/apple/.gemini/antigravity/brain/859746ab-7c5a-49f3-89a6-7ae1e64238d3/'
out_dir = 'public/exercises/'

mappings = {
    'bird-dog': [
        'bird_dog_frame_1_1776398646277.png',
        'bird_dog_frame_2_1776398660711.png'
    ],
    'backpack-rows': [
        'backpack_row_1_1776398780441.png',
        'backpack_row_2_1776398713332.png'
    ],
    'pike-pushups': [
        'pike_pushups_1_1776398730473.png',
        'pike_pushups_2_1776398798755.png'
    ],
    'wall-posture': [
        'wall_posture_1_1776398812952.png',
        'wall_posture_2_1776398827052.png'
    ]
}

seed_file = 'lib/seed.js'
with open(seed_file, 'r') as f:
    seed_data = f.read()

for name, files in mappings.items():
    frames = [Image.open(os.path.join(brain_dir, p)) for p in files]
    out_path = os.path.join(out_dir, f"{name}.gif")
    frames[0].save(out_path, format='GIF', append_images=frames[1:], save_all=True, duration=800, loop=0)
    print(f"Created {name}.gif")
    seed_data = seed_data.replace(f"'{name}.webp'", f"'{name}.gif'")
    seed_data = seed_data.replace(f"/{name}.webp", f"/{name}.gif")

with open(seed_file, 'w') as f:
    f.write(seed_data)
print("Updated seed.js")
