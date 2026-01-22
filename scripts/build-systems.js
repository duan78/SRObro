import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

async function build() {
    console.log('🔨 Construction des systèmes SRObro...\n');

    // Systems à compiler
    const systems = [
        'src/systems/HeightmapLoader.ts',
        'src/systems/ObjectLoader.ts',
        'src/systems/GLModelLoader.ts',
        'src/systems/MapLoader.ts',
        'src/systems/AnimationManager.ts'
    ];

    for (const system of systems) {
        const basename = system.split('/').pop().replace('.ts', '.js');

        try {
            await esbuild.build({
                entryPoints: [system],
                bundle: true,
                format: 'esm',
                target: 'ES2020',
                outdir: '../public/dist',
                outbase: 'src',
                external: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/materials'],
                sourcemap: true,
                minify: false,
                treeShaking: true,
                metafile: true
            });

            console.log(`✅ ${basename} compilé`);
        } catch (error) {
            console.error(`❌ Erreur compilation ${basename}:`, error);
        }
    }

    console.log('\n✅ Tous les systèmes compilés dans client/public/dist/');
}

build().catch(console.error);
