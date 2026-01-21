#!/usr/bin/env python3
"""
Explore PK2 structure to find Character and Mob folders
"""

import subprocess
import sys
from pathlib import Path

def main():
    pk2_path = r"C:\Program Files (x86)\Silkroad\Media.pk2"
    pk2_tool = Path(r"C:\Users\duan7\Desktop\SRObro\tools\pk2.py-tool\pk2.py")

    print("Exploring PK2 structure to find Character and Mob folders...")

    # Commands to explore
    commands = """ls
cd 'acobject'
ls
exit
"""

    try:
        process = subprocess.Popen(
            [sys.executable, str(pk2_tool), pk2_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        stdout, _ = process.communicate(input=commands, timeout=60)

        print("\n=== PK2 ROOT DIRECTORY ===")
        print(stdout)
        print("=== END ===")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
