import json
import csv
from datetime import datetime
from collections import defaultdict

import os

HERE = os.path.dirname(__file__)
BOSSES_JSON = os.path.abspath(os.path.join(HERE, "..", "bosses.json"))
PATCH_CSV = os.path.abspath(
    os.path.join(
        HERE,
        "..",
        "Data",
        "Patch 12-17-25",
        "BNS NEO fb times EU - patch 12_17_25-2.csv",
    )
)

# Load bosses.json and build mapping: (boss_name, day) -> [times]
with open(BOSSES_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

boss_times = defaultdict(list)
for region, days in data.items():
    for day, entries in days.items():
        for e in entries:
            time = e.get("time")
            loc = e.get("location")
            if time and loc:
                boss_times[(loc.strip(), day.strip())].append(time.strip())

# Read patch rows (boss, time, day)
patch_rows = []
with open(PATCH_CSV, newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    headers = next(reader, None)
    for r in reader:
        if len(r) >= 3:
            boss = r[0].strip()
            time = r[1].strip()
            day = r[2].strip()
            if boss and time and day:
                patch_rows.append((boss, time, day))


def to_minutes(t):
    try:
        dt = datetime.strptime(t, "%H:%M")
        return dt.hour * 60 + dt.minute
    except Exception:
        return None


conflicts = []
for boss, time, day in patch_rows:
    patch_min = to_minutes(time)
    if patch_min is None:
        continue
    existing = boss_times.get((boss, day), [])
    for ex_time in existing:
        ex_min = to_minutes(ex_time)
        if ex_min is None:
            continue
        diff = abs(patch_min - ex_min)
        if diff < 70:
            conflicts.append(
                {
                    "boss": boss,
                    "day": day,
                    "patch_time": time,
                    "bosses_time": ex_time,
                    "diff_minutes": diff,
                }
            )

if not conflicts:
    print("No conflicts <70 minutes were found between bosses.json and the patch file.")
else:
    print(f"Found {len(conflicts)} conflict(s) <70 minutes:\n")
    for c in conflicts:
        print(
            f"Boss: {c['boss']} | Day: {c['day']} | Patch: {c['patch_time']} | bosses.json: {c['bosses_time']} | Diff: {c['diff_minutes']} min"
        )
