#!/usr/bin/env python3
"""
Fixed PK2 extraction script that properly changes to output directory
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    pk2_path = r"C:\Program Files (x86)\Silkroad\Media.pk2"
    output_base = Path(r"C:\Users\duan7\Desktop\SRObro\assets\pk2_extracted")
    pk2_tool = Path(r"C:\Users\duan7\Desktop\SRObro\tools\pk2.py-tool\pk2.py")

    # Create output directory
    output_base.mkdir(parents=True, exist_ok=True)

    print(f"Extracting from: {pk2_path}")
    print(f"Output directory: {output_base}")
    print("\nThis will take several minutes...\n")

    # Change to output directory first
    original_dir = os.getcwd()
    os.chdir(output_base)

    try:
        # Commands to navigate and extract
        # We'll extract from prim/mesh which contains Character and Mob
        commands = """cd 'prim'
cd 'mesh'
ls
exit
"""

        process = subprocess.Popen(
            [sys.executable, str(pk2_tool), pk2_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        stdout, _ = process.communicate(input=commands, timeout=60)

        print("\n=== PRIM/MESH CONTENTS ===")
        print(stdout)
        print("=== END ===")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        os.chdir(original_dir)

if __name__ == "__main__":
    main()
