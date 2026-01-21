#!/usr/bin/env python3
"""
Télécharger et tester pk2.py pour l'extraction PK2
"""

import urllib.request
import subprocess
import sys
import os
from pathlib import Path

# Télécharger pk2.py depuis GitHub
def download_pk2_py():
    print("📥 Téléchargement de pk2.py depuis GitHub...")

    url = "https://raw.githubusercontent.com/theonly112/pk2.py/master/pk2.py"
    target = Path("tools/pk2.py")

    try:
        urllib.request.urlretrieve(url, target)
        print(f"✅ Téléchargé: {target.absolute()}")

        # Rendre exécutable
        os.chmod(target, 0o755)

        # Créer un wrapper script
        wrapper = """#!/usr/bin/env python3
import sys
import subprocess

# Run pk2.py with arguments
result = subprocess.run([sys.executable, "tools/pk2.py"] + sys.argv[1:])
sys.exit(result.returncode)
"""
        wrapper_path = Path("tools/pk2.py")
        wrapper_path.write_text(wrapper)

        return True
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

# Tester pk2.py
def test_pk2_py():
    print("\n🧪 Test de pk2.py...")

    pk2_path = "C:/Program Files (x86)/Silkroad/Media.pk2"
    output_dir = "assets/pk2_extracted_python"

    # Créer le dossier de sortie
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Créer un script d'extraction
    script = f"""
cd '{output_dir}'
extract '{pk2_path}'
exit
"""

    script_path = Path("test_extract.txt")
    script_path.write_text(script)

    try:
        result = subprocess.run(
            [sys.executable, "tools/pk2.py"],
            input=script,
            capture_output=True,
            text=True,
            timeout=120,
            cwd="."
        )

        print("STDOUT:")
        print(result.stdout[:2000])  # Premier 2000 caractères

        if result.stderr:
            print("\nSTDERR:")
            print(result.stderr[:1000])

        print(f"\nCode de sortie: {result.returncode}")

        if result.returncode == 0:
            print("✅ Extraction réussie !")
        else:
            print("⚠️  Extraction terminée avec erreurs")

    except subprocess.TimeoutExpired:
        print("❌ Timeout - l'extraction prend trop de temps")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "download":
        download_pk2_py()
    else:
        download_pk2_py()
        test_pk2_py()
