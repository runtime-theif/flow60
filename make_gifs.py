import os, glob
from PIL import Image

mapping = {
    'glute-bridge': 'Barbell_Glute_Bridge',
    'dead-bug': 'Dead_Bug',
    'squats': 'Bodyweight_Squat',
    'incline-pushups': 'Incline_Push-Up',
    'plank': 'Plank',
    'pushups': 'Push-Up_Wide',
    'bulgarian-split': 'Barbell_Side_Split_Squat',
    'calf-raises': 'Standing_Calf_Raises',
    'decline-pushups': 'Decline_Push-Up',
    'lunges': 'Dumbbell_Lunges',
    'side-plank': 'Push_Up_to_Side_Plank',
    'jump-squats': 'Freehand_Jump_Squat',
    'mountain-climbers': 'Mountain_Climbers'
}

base = 'tmp-db/exercises'
out_dir = 'public/exercises'
os.makedirs(out_dir, exist_ok=True)

seed_file = 'lib/seed.js'
with open(seed_file, 'r') as f:
    seed_data = f.read()

for out_name, in_dir in mapping.items():
    p = os.path.join(base, in_dir)
    imgs = sorted(glob.glob(os.path.join(p, '*.jpg')))
    if len(imgs) >= 2:
        frames = [Image.open(i) for i in imgs]
        out_path = os.path.join(out_dir, f"{out_name}.gif")
        frames[0].save(out_path, format='GIF', append_images=frames[1:], save_all=True, duration=600, loop=0)
        print(f"Created {out_name}.gif")
        seed_data = seed_data.replace(f"'{out_name}.webp'", f"'{out_name}.gif'")
        seed_data = seed_data.replace(f"/exercises/{out_name}.webp", f"/exercises/{out_name}.gif")

with open(seed_file, 'w') as f:
    f.write(seed_data)
print("Finished!")
