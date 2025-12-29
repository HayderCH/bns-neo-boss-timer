import json
import csv
import os
from datetime import datetime
from collections import defaultdict

HERE = os.path.dirname(__file__)
BOSSES_PATH = os.path.abspath(os.path.join(HERE, "..", "bosses.json"))
PATCH_CSV = os.path.abspath(
    os.path.join(
        HERE,
        "..",
        "Data",
        "Patch 12-17-25",
        "BNS NEO fb times EU - patch 12_17_25-2.csv",
    )
)

# Backup bosses.json
bak_path = BOSSES_PATH + ".bak"
if not os.path.exists(bak_path):
    with open(BOSSES_PATH, "r", encoding="utf-8") as f:
        with open(bak_path, "w", encoding="utf-8") as b:
            b.write(f.read())

# Load bosses.json
with open(BOSSES_PATH, "r", encoding="utf-8") as f:
    bosses = json.load(f)

# Helper


def to_minutes(t):
    try:
        dt = datetime.strptime(t, "%H:%M")
        return dt.hour * 60 + dt.minute
    except Exception:
        return None


# Build mapping: (location, day) -> set of times (minutes)
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

# Read patch rows
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

added = []
skipped = []

for boss, time, day in patch_rows:
    m = to_minutes(time)
    if m is None:
        skipped.append((boss, time, day, "bad-time"))
        continue
    key = (boss, day)
    existing = exist_times.get(key, set())
    # compute min diff
    min_diff = None
    for ex in existing:
        diff = abs(ex - m)
        if min_diff is None or diff < min_diff:
            min_diff = diff
    if min_diff is None:
        # no existing entries for that boss/day -> safe
        safe = True
    else:
        safe = min_diff >= 70
    if not safe:
        skipped.append((boss, time, day, f"conflict (min diff {min_diff} min)"))
        continue
    # Add to bosses.json: find region that has the day and append
    appended = False
    for region, days in bosses.items():
        if day in days:
            # append to that day's list
            days[day].append({"time": time, "location": boss})
            appended = True
            break
    if not appended:
        # Day not present in any region - create under first region (shouldn't happen)
        first_region = next(iter(bosses))
        bosses[first_region].setdefault(day, []).append(
            {"time": time, "location": boss}
        )
    exist_times[key].add(m)
    added.append((boss, time, day))

# Sort times within each day by time
for region, days in bosses.items():
    for day, entries in days.items():
        try:
            entries.sort(
                key=lambda e: to_minutes(e.get("time")) if e.get("time") else 1_000_000
            )
        except Exception:
            pass

# Save updated bosses.json
with open(BOSSES_PATH, "w", encoding="utf-8") as f:
    json.dump(bosses, f, indent=2, ensure_ascii=False)

# Print summary
print(f"Added {len(added)} entries:")
for a in added:
    print(f"  {a[0]} | {a[2]} | {a[1]}")

print()
print(f"Skipped {len(skipped)} entries (conflicts or issues):")
for s in skipped:
    print(f"  {s[0]} | {s[2]} | {s[1]} -> {s[3]}")

print()
print(f"Backup of original saved to: {bak_path}")
