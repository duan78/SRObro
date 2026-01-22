import struct
from collections import Counter

path = 'assets/pk2_extracted/Map/100/100.m'
with open(path, 'rb') as f:
    data = f.read()
    print(f'Taille: {len(data)} bytes')
    print('Header (premiers 64 bytes):')
    for i in range(0, min(64, len(data)), 16):
        chunk = data[i:i+16]
        hex = ' '.join(f'{b:02x}' for b in chunk)
        ascii = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
        print(f'{i:04x}: {hex:<48} {ascii}')

    # Analyser comme uint16 array
    if len(data) >= 4:
        num_values = len(data) // 2
        values = list(struct.unpack('<' + 'H' * num_values, data[:num_values * 2]))
        print(f'\nValeurs uint16 (premières 20): {values[:20]}')
        print(f'Total valeurs: {num_values}')

        # Fréquences
        freq = Counter(values)
        print(f'\nTop 10 valeurs:')
        for val, count in freq.most_common(10):
            print(f'  {val}: {count} fois ({count/num_values*100:.1f}%)')
