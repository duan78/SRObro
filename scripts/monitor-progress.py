#!/usr/bin/env python3
"""
Run check-progress.py every 10 minutes
"""

import subprocess
import time
from pathlib import Path

PROJECT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro")
CHECK_SCRIPT = PROJECT_DIR / "scripts" / "check-progress.py"

def main():
    print("Starting progress monitor (running every 10 minutes)")
    print("Press Ctrl+C to stop\n")

    while True:
        try:
            subprocess.run([sys.executable, str(CHECK_SCRIPT)], check=True)
            print("\n" + "="*70)
            print("Next check in 10 minutes...")
            print("="*70 + "\n")
            time.sleep(600)  # 10 minutes = 600 seconds
        except KeyboardInterrupt:
            print("\nMonitoring stopped.")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(60)

if __name__ == "__main__":
    import sys
    main()
