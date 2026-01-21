/**
 * Script d'inventaire complet des fichiers et conversions
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

interface ConversionStatus {
    source: string;
    sourcePattern: string;
    count: number;
    converted: number;
    target: string;
    targetPattern: string;
    status: 'done' | 'partial' | 'pending' | 'not_needed';
    priority: 'critical' | 'important' | 'optional';
}

async function countFiles(pattern: string): Promise<number> {
    try {
        const files = await glob(pattern);
        return files.length;
    } catch {
        return 0;
    }
}

async function checkConversion(sourcePattern: string, targetPattern: string, source: string, target: string): Promise<ConversionStatus> {
    const sourceCount = await countFiles(sourcePattern);
    const targetCount = await countFiles(targetPattern);

    let status: ConversionStatus['status'];
    if (sourceCount === 0) {
        status = 'not_needed';
    } else if (targetCount === 0) {
        status = 'pending';
    } else if (targetCount >= sourceCount) {
        status = 'done';
    } else {
        status = 'partial';
    }

    return {
        source,
        sourcePattern,
        count: sourceCount,
        converted: targetCount,
        target,
        targetPattern,
        status,
        priority: source.includes('pk2_extracted/Map') ? 'critical' :
                  source.includes('pk2_extracted/Particles') ? 'important' :
                  source.includes('media_pk2') ? 'important' : 'optional'
    };
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Inventaire Complet des Conversions                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const conversions: Promise<ConversionStatus>[] = [
        // DDJ → WebP
        checkConversion(
            'assets/media_pk2/**/*.ddj',
            'assets/media_ddj_webp/**/*.webp',
            'Media.pk2 (DDJ)',
            'WebP'
        ),
        checkConversion(
            'assets/pk2_extracted/Particles/**/*.ddj',
            'assets/particles_ddj_webp/**/*.webp',
            'Particles.pk2 (DDJ)',
            'WebP'
        ),
        checkConversion(
            'assets/pk2_extracted/Map/**/*.ddj',
            'assets/maps_ddj_webp/**/*.webp',
            'Map.pk2 (DDJ)',
            'WebP'
        ),

        // BMS → GLB
        checkConversion(
            'assets/media_pk2/**/*.bms',
            'assets/glb_blender/**/*.glb',
            'Media.pk2 (BMS)',
            'GLB'
        ),
        checkConversion(
            'assets/pk2_extracted/Particles/**/*.bms',
            'assets/particles_glb/**/*.glb',
            'Particles.pk2 (BMS)',
            'GLB'
        ),

        // BAN → JSON
        checkConversion(
            'assets/data_extracted/**/*.ban',
            'assets/data_extracted/**/*.json',
            'Data (BAN)',
            'JSON'
        ),
        checkConversion(
            'assets/pk2_extracted/Particles/**/*.ban',
            'assets/pk2_extracted/Particles/**/*.json',
            'Particles.pk2 (BAN)',
            'JSON'
        ),

        // Heightmaps .t
        checkConversion(
            'assets/pk2_extracted/Map/**/*.t',
            'assets/maps_heightmap/**/*.json',
            'Map.pk2 (.t)',
            'JSON'
        ),

        // Objects .o/.o2
        checkConversion(
            'assets/pk2_extracted/Map/**/*.o',
            'assets/maps_objects/**/*.json',
            'Map.pk2 (.o)',
            'JSON'
        ),
        checkConversion(
            'assets/pk2_extracted/Map/**/*.o2',
            'assets/maps_objects/**/*.json',
            'Map.pk2 (.o2)',
            'JSON'
        ),
    ];

    const results = await Promise.all(conversions);

    // Afficher les résultats par priorité
    console.log('🔴 CRITIQUE (Bloqueur Gameplay)\n');
    const critical = results.filter(r => r.priority === 'critical' && r.status !== 'done');
    if (critical.length === 0) {
        console.log('   ✅ Tous les fichiers critiques sont convertis!\n');
    } else {
        critical.forEach(r => {
            const progress = r.count > 0 ? `${r.converted}/${r.count} (${((r.converted/r.count)*100).toFixed(1)}%)` : 'N/A';
            const statusIcon = r.status === 'done' ? '✅' : r.status === 'partial' ? '🔄' : '⏳';
            console.log(`   ${statusIcon} ${r.source}: ${progress}`);
        });
        console.log('');
    }

    console.log('🟡 IMPORTANT (Amélioration Gameplay)\n');
    const important = results.filter(r => r.priority === 'important' && r.status !== 'done');
    if (important.length === 0) {
        console.log('   ✅ Tous les fichiers importants sont convertis!\n');
    } else {
        important.forEach(r => {
            const progress = r.count > 0 ? `${r.converted}/${r.count} (${((r.converted/r.count)*100).toFixed(1)}%)` : 'N/A';
            const statusIcon = r.status === 'done' ? '✅' : r.status === 'partial' ? '🔄' : '⏳';
            console.log(`   ${statusIcon} ${r.source}: ${progress}`);
        });
        console.log('');
    }

    console.log('🟢 OPTIONNEL (Polish)\n');
    const optional = results.filter(r => r.priority === 'optional' && r.status !== 'done');
    if (optional.length === 0) {
        console.log('   ✅ Tous les fichiers optionnels sont convertis!\n');
    } else {
        optional.forEach(r => {
            const progress = r.count > 0 ? `${r.converted}/${r.count} (${((r.converted/r.count)*100).toFixed(1)}%)` : 'N/A';
            const statusIcon = r.status === 'done' ? '✅' : r.status === 'partial' ? '🔄' : '⏳';
            console.log(`   ${statusIcon} ${r.source}: ${progress}`);
        });
        console.log('');
    }

    // Résumé
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Résumé des Conversions                                 ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const done = results.filter(r => r.status === 'done').length;
    const partial = results.filter(r => r.status === 'partial').length;
    const pending = results.filter(r => r.status === 'pending').length;
    const total = results.length;

    console.log(`✅ Terminé : ${done}/${total} (${(done/total*100).toFixed(1)}%)`);
    console.log(`🔄 En cours : ${partial}/${total} (${(partial/total*100).toFixed(1)}%)`);
    console.log(`⏳ À faire : ${pending}/${total} (${(pending/total*100).toFixed(1)}%)`);

    // Fichiers totaux
    const totalSourceFiles = results.reduce((sum, r) => sum + r.count, 0);
    const totalConverted = results.reduce((sum, r) => sum + r.converted, 0);
    console.log(`\n📊 Fichiers convertis : ${totalConverted}/${totalSourceFiles} (${(totalConverted/totalSourceFiles*100).toFixed(1)}%)`);

    // Next steps
    console.log('\n⏭️  Next Steps:\n');

    const pendingConversions = results.filter(r => r.status === 'pending' || r.status === 'partial');
    if (pendingConversions.length > 0) {
        pendingConversions.forEach(r => {
            console.log(`   • ${r.source} → ${r.target}`);
        });
    } else {
        console.log('   ✅ Toutes les conversions sont terminées!');
    }

    console.log('');
}

main().catch(console.error);
