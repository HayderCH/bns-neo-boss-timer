import csv
from datetime import datetime
from collections import defaultdict

latest = r"Data/Latest/BNS_NEO_fb_times_EU.csv"
patch = r"Data/Patch 12-17-25/BNS NEO fb times EU - patch 12_17_25-2.csv"


# Read CSV rows as tuples (boss, time, day)
def read_rows(path):
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader, None)
        for r in reader:
            # Expect rows like: Boss, time, day, ... (we'll take first 3 columns)
            if len(r) < 3:
                continue
            boss = r[0].strip()
            time = r[1].strip()
            day = r[2].strip()
            if boss and time and day:
                rows.append((boss, time, day))
    return rows


latest_rows = read_rows(latest)
patch_rows = read_rows(patch)

latest_set = set(latest_rows)

missing = [r for r in patch_rows if r not in latest_set]

# Build per boss+day mapping to times in minutes


def to_minutes(t):
    try:
        dt = datetime.strptime(t, "%H:%M")
        return dt.hour * 60 + dt.minute
    except Exception:
        return None


by_boss_day = defaultdict(list)
for boss, time, day in latest_rows + patch_rows:
    mins = to_minutes(time)
    if mins is not None:
        by_boss_day[(boss, day)].append((mins, time))

# find conflicts <70 minutes (any pair less than 70 mins) and list unique pairs
conflicts = []
for key, times in by_boss_day.items():
    times_sorted = sorted(times)
    for i in range(len(times_sorted)):
        for j in range(i + 1, len(times_sorted)):
            t1 = times_sorted[i][0]
            t2 = times_sorted[j][0]
            diff = abs(t2 - t1)
            if diff < 70:
                conflicts.append(
                    (key[0], key[1], times_sorted[i][1], times_sorted[j][1], diff)
                )

# Print results
print("Missing rows to add (%d):" % len(missing))
for r in missing:
    print(",".join(r))

print("\nConflicts (<70 minutes) per boss/day:")
if not conflicts:
    print("None")
else:
    for c in conflicts:
        print(f"Boss: {c[0]} | Day: {c[1]} | Times: {c[2]} & {c[3]} | Diff: {c[4]} min")

# Also prepare lines to append into latest CSV (keep same header format)
if missing:
    with open(latest, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for boss, time, day in missing:
            writer.writerow([boss, time, day, "", "", "", ""])
    print("\nAppended missing rows to", latest)
else:
    print("\nNo rows needed appending.")
