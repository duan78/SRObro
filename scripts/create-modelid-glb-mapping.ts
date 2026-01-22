/**
 * Script pour créer un mapping entre modelIds et fichiers GLB
 * Analyse les fichiers de conversion et crée un manifest
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

interface ModelMapping {
    modelId: number;
    glbPath: string;
    resourceType: 'building' | 'object' | 'npc' | 'decoration' | 'unknown';
}

interface MappingManifest {
    version: string;
    generatedAt: string;
    totalMappings: number;
    mappings: Record<number, ModelMapping>;
}

async function createMapping() {
    console.log('🔍 Création du mapping modelId → GLB...\n');

    const mappings: Record<number, ModelMapping> = {};
    let glbCount = 0;

    // 1. Scanner tous les fichiers GLB convertis
    const glbPaths = await glob('assets/glb Converted/**/*.glb');
    console.log(`✅ ${glbPaths.length} fichiers GLB trouvés\n`);

    // 2. Scanner tous les fichiers d'objets pour extraire les modelIds
    const objectFiles = await glob('assets/maps_objects/**/*.json');
    console.log(`✅ ${objectFiles.length} fichiers d'objets trouvés\n`);

    const modelIds = new Set<number>();

    for (const objFile of objectFiles) {
        try {
            const content = await fs.readFile(objFile, 'utf-8');
            const data = JSON.parse(content);

            if (data.objects && Array.isArray(data.objects)) {
                for (const obj of data.objects) {
                    if (obj.modelId) {
                        modelIds.add(obj.modelId);
                    }
                }
            }
        } catch (e) {
            console.warn(`⚠️  Erreur lecture ${objFile}:`, e);
        }
    }

    console.log(`✅ ${modelIds.size} modelIds uniques trouvés\n`);

    // 3. Créer des mappings basés sur des patterns
    // Pour l'instant, on va faire une approche heuristique
    // Les modelIds correspondent généralement à des noms de fichiers BSR

    // Chercher des correspondances potentielles
    for (const modelId of Array.from(modelIds).slice(0, 100)) { // Limiter pour le moment
        // Chercher un GLB qui pourrait correspondre
        // Stratégie: utiliser le modelId comme indice dans un tableau ou hash

        // Pour l'instant, marquer comme non trouvé
        mappings[modelId] = {
            modelId,
            glbPath: '', // À remplir plus tard
            resourceType: 'unknown'
        };
    }

    // 4. Essayer de faire correspondre avec des GLB existants
    // Basé sur des patterns observés dans les noms de fichiers
    for (const glbPath of glbPaths) {
        // Extraire le nom de base sans extension
        const basename = path.basename(glbPath, '.glb');

        // Chercher des IDs numériques dans le nom
        const idMatch = basename.match(/(\d{4,6})/);
        if (idMatch) {
            const potentialId = parseInt(idMatch[1]);
            if (mappings[potentialId]) {
                mappings[potentialId].glbPath = glbPath.replace('assets/', '');
                mappings[potentialId].resourceType = detectResourceType(glbPath);
            }
        }
    }

    // 5. Créer le manifest final
    const manifest: MappingManifest = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalMappings: Object.keys(mappings).length,
        mappings
    };

    // 6. Sauvegarder le manifest
    const outputPath = 'assets/modelid-glb-mapping.json';
    await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));

    console.log(`\n✅ Mapping créé: ${outputPath}`);
    console.log(`   ${Object.keys(mappings).length} modelIds mappés`);

    // 7. Statistiques
    const mapped = Object.values(mappings).filter(m => m.glbPath).length;
    console.log(`   ${mapped} correspondent à un fichier GLB`);
    console.log(`   ${Object.keys(mappings).length - mapped} sans correspondance`);
}

function detectResourceType(path: string): ModelMapping['resourceType'] {
    const lower = path.toLowerCase();

    if (lower.includes('bldg') || lower.includes('building') || lower.includes('house')) {
        return 'building';
    }
    if (lower.includes('npc') || lower.includes('char')) {
        return 'npc';
    }
    if (lower.includes('tree') || lower.includes('rock') || lower.includes('grass')) {
        return 'decoration';
    }
    if (lower.includes('obj') || lower.includes('item')) {
        return 'object';
    }

    return 'unknown';
}

// Exécuter
createMapping().catch(console.error);
