/**
 * Script pour créer un manifest des animations BAN
 * Génère une liste structurée de toutes les animations disponibles
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

interface AnimationEntry {
    name: string;
    path: string;
    boneCount: number;
    frameCount: number;
    duration: number;
}

interface AnimationManifest {
    version: string;
    generatedAt: string;
    totalAnimations: number;
    animations: AnimationEntry[];
}

async function createAnimationManifest() {
    console.log('🎬 Création du manifest des animations BAN...\n');

    const animations: AnimationEntry[] = [];

    // Chercher tous les fichiers .json générés dans les dossiers d'animations
    const jsonFiles = await glob('assets/{pk2_data,data_extracted}/**/*.json', {
        ignore: ['**/node_modules/**']
    });
    console.log(`✅ ${jsonFiles.length} fichiers JSON trouvés`);

    for (const jsonPath of jsonFiles) {
        try {
            const content = await fs.readFile(jsonPath, 'utf-8');
            const data = JSON.parse(content);

            if (data.header && data.frames) {
                const entry: AnimationEntry = {
                    name: path.basename(jsonPath, '.json'),
                    path: jsonPath.replace('assets/', ''),
                    boneCount: data.header.boneCount || 0,
                    frameCount: data.header.frameCount || 0,
                    duration: data.header.duration || 0
                };

                animations.push(entry);
            }
        } catch (e) {
            console.warn(`⚠️  Erreur lecture ${jsonPath}:`, e);
        }
    }

    const manifest: AnimationManifest = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalAnimations: animations.length,
        animations
    };

    // Sauvegarder
    const outputPath = 'assets/animations/manifest.json';
    await fs.mkdir('assets/animations', { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));

    console.log(`\n✅ Manifest créé: ${outputPath}`);
    console.log(`   ${animations.length} animations répertoriées`);

    // Statistiques
    const totalFrames = animations.reduce((sum, anim) => sum + anim.frameCount, 0);
    const avgDuration = animations.reduce((sum, anim) => sum + anim.duration, 0) / animations.length;

    console.log(`\n📊 Statistiques:`);
    console.log(`   Frames totaux: ${totalFrames}`);
    console.log(`   Durée moyenne: ${avgDuration.toFixed(2)}ms`);
    console.log(`   Bones par animation: ${(animations.reduce((sum, anim) => sum + anim.boneCount, 0) / animations.length).toFixed(1)}`);
}

createAnimationManifest().catch(console.error);
