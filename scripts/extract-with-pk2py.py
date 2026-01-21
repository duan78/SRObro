#!/usr/bin/env python3
"""
Automated PK2 Extraction using pk2.py
Extracts Character and Mob folders from Media.pk2
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    print("Starting PK2 extraction with pk2.py...")

    pk2_path = r"C:\Program Files (x86)\Silkroad\Media.pk2"
    output_dir = Path(r"C:\Users\duan7\Desktop\SRObro\assets\pk2_extracted")
    pk2_tool = Path(r"C:\Users\duan7\Desktop\SRObro\tools\pk2.py-tool\pk2.py")

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Check if files exist
    if not os.path.exists(pk2_path):
        print(f"ERROR: PK2 file not found: {pk2_path}")
        return 1

    if not pk2_tool.exists():
        print(f"ERROR: pk2.py tool not found: {pk2_tool}")
        return 1

    print(f"PK2 Archive: {pk2_path}")
    print(f"Output Directory: {output_dir}")
    print(f"Tool: {pk2_tool}")

    # Create extraction commands script
    # We'll extract Character and Mob folders
    commands = f"""cd '{output_dir}'
ls
extract 'Character/CH_Man'
extract 'Character/CH_Woman'
extract 'Mob/CH_Mob'
extract 'Mob/EU_Mob'
ls
exit
"""

    print("\nCommands to execute:")
    print(commands)
    print("\nStarting extraction (this may take 10-15 minutes)...")

    # Run pk2.py with the commands
    try:
        process = subprocess.Popen(
            [sys.executable, str(pk2_tool), pk2_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1  # Line buffered
        )

        # Send commands
        stdout, _ = process.communicate(input=commands, timeout=1800)  # 30 min timeout

        print("\n=== OUTPUT ===")
        print(stdout)
        print("=== END ===")

        if process.returncode == 0:
            print("\nExtraction completed successfully!")
            return 0
        else:
            print(f"\nExtraction finished with code: {process.returncode}")
            return process.returncode

    except subprocess.TimeoutExpired:
        print("\nERROR: Extraction timed out after 30 minutes")
        process.kill()
        return 1
    except Exception as e:
        print(f"\nERROR: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
