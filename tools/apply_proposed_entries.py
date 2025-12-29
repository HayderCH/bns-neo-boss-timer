import json
import os
from datetime import datetime
from collections import defaultdict

HERE = os.path.dirname(__file__)
BOSSES_PATH = os.path.abspath(os.path.join(HERE, "..", "bosses.json"))

# Proposed entries from user
raw_proposed = [
    ("07:03", "Tuesday", "Plain"),
    ("08:33", "Tuesday", "Forest"),
    ("18:59", "Tuesday", "Plain"),
]


# Normalize location name
def normalize(loc):
    l = loc.lower()
    if "plain" in l:
        return "Skypetal Plains"
    if "forest" in l:
        return "Primeval Forest"
    return loc


# Helper to minutes


def to_minutes(t):
    try:
        dt = datetime.strptime(t, "%H:%M")
        return dt.hour * 60 + dt.minute
    except Exception:
        return None


# Backup
bak_path = BOSSES_PATH + ".bak2"
with open(BOSSES_PATH, "r", encoding="utf-8") as f:
    orig = f.read()
with open(bak_path, "w", encoding="utf-8") as b:
    b.write(orig)

# Load bosses
with open(BOSSES_PATH, "r", encoding="utf-8") as f:
    bosses = json.load(f)

# Build mapping of existing times
exist_times = defaultdict(set)
for region, days in bosses.items():
    for day, entries in days.items():
        for e in entries:
            time = e.get("time")
            loc = e.get("location")
            if time and loc:
                m = to_minutes(time)
                if m is not None:
                    exist_times[(loc.strip(), day.strip())].add(m)

proposed = []
for time, day, loc in raw_proposed:
    proposed.append((normalize(loc), time, day))

added = []
skipped = []
for loc, time, day in proposed:
    m = to_minutes(time)
    if m is None:
        skipped.append((loc, time, day, "bad time"))
        continue
    key = (loc, day)
    existing = exist_times.get(key, set())
    min_diff = None
    for ex in existing:
        diff = abs(ex - m)
        if min_diff is None or diff < min_diff:
            min_diff = diff
    if min_diff is None or min_diff >= 70:
        # safe to add
        appended = False
        for region, days in bosses.items():
            if day in days:
                days[day].append({"time": time, "location": loc})
                appended = True
                break
        if not appended:
            first_region = next(iter(bosses))
            bosses[first_region].setdefault(day, []).append(
                {"time": time, "location": loc}
            )
        exist_times[key].add(m)
        added.append((loc, time, day))
    else:
        skipped.append((loc, time, day, f"conflict (min diff {min_diff} min)"))

# Sort times
for region, days in bosses.items():
    for day, entries in days.items():
        entries.sort(
            key=lambda e: to_minutes(e.get("time")) if e.get("time") else 1_000_000
        )

# Save
with open(BOSSES_PATH, "w", encoding="utf-8") as f:
    json.dump(bosses, f, indent=2, ensure_ascii=False)

# Print summary
print(f"Added {len(added)} entries:")
for a in added:
    print(f"  {a[0]} | {a[2]} | {a[1]}")

print()
print(f"Skipped {len(skipped)} entries:")
for s in skipped:
    print(f"  {s[0]} | {s[2]} | {s[1]} -> {s[3]}")

print()
print("Backup written to", bak_path)
