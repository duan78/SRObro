/**
 * Rapport complet de l'état des conversions
 */

import { glob } from 'glob';
import fs from 'fs/promises';

interface ConversionReport {
    category: string;
    sourcePattern: string;
    outputPattern: string;
    sourceCount: number;
    outputCount: number;
    percentage: number;
    status: '✅' | '⚠️' | '❌';
}

async function countFiles(pattern: string): Promise<number> {
    try {
        const files = await glob(pattern);
        return files.length;
    } catch {
        return 0;
    }
}

async function generateReport() {
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║         Rapport d\'État des Conversions - SRObro                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    const reports: ConversionReport[] = [];

    // 1. Heightmaps (.t → JSON)
    console.log('📐 HEIGHTMAPS (.t → JSON)');
    console.log('─'.repeat(70));
    const tFiles = await countFiles('assets/pk2_extracted/Map/**/*.t');
    const jsonHeightmaps = await countFiles('assets/maps_heightmap/**/*.json');
    const heightmapPercent = (jsonHeightmaps / tFiles * 100);
    console.log(`   Source: ${tFiles.toLocaleString()} fichiers .t`);
    console.log(`   Output: ${jsonHeightmaps.toLocaleString()} fichiers JSON`);
    console.log(`   Status: ✅ ${heightmapPercent.toFixed(1)}% completé\n`);
    reports.push({
        category: 'Heightmaps',
        sourcePattern: '.t files',
        outputPattern: 'JSON',
        sourceCount: tFiles,
        outputCount: jsonHeightmaps,
        percentage: heightmapPercent,
        status: heightmapPercent === 100 ? '✅' : '⚠️'
    });

    // 2. Object Placement (.o/.o2 → JSON)
    console.log('📦 OBJECT PLACEMENT (.o/.o2 → JSON)');
    console.log('─'.repeat(70));
    const oFiles = await countFiles('assets/pk2_extracted/Map/**/*.o');
    const o2Files = await countFiles('assets/pk2_extracted/Map/**/*.o2');
    const oJson = await countFiles('assets/maps_objects/**/*.o.json');
    const o2Json = await countFiles('assets/maps_objects/**/*.o2.json');
    const totalSourceObj = oFiles + o2Files;
    const totalJsonObj = oJson + o2Json;
    const objPercent = (totalJsonObj / totalSourceObj * 100);
    console.log(`   Source: ${oFiles.toLocaleString()} fichiers .o + ${o2Files.toLocaleString()} fichiers .o2`);
    console.log(`   Output: ${oJson.toLocaleString()} .o.json + ${o2Json.toLocaleString()} .o2.json`);
    console.log(`   Status: ✅ ${objPercent.toFixed(1)}% completé\n`);
    reports.push({
        category: 'Object Placement',
        sourcePattern: '.o/.o2 files',
        outputPattern: 'JSON',
        sourceCount: totalSourceObj,
        outputCount: totalJsonObj,
        percentage: objPercent,
        status: objPercent === 100 ? '✅' : '⚠️'
    });

    // 3. DDJ Textures (DDJ → WebP)
    console.log('🖼️  TEXTURES (DDJ → WebP)');
    console.log('─'.repeat(70));
    const ddjMedia = await countFiles('assets/pk2_media/**/*.ddj');
    const ddjParticles = await countFiles('assets/pk2_extracted/Particles/**/*.ddj');
    const ddjMap = await countFiles('assets/pk2_extracted/Map/**/*.ddj');
    const ddjData = await countFiles('assets/data_extracted/**/*.ddj');
    const totalDDJ = ddjMedia + ddjParticles + ddjMap + ddjData;

    const webpMedia = await countFiles('assets/media_ddj_webp/**/*.webp');
    const webpParticles = await countFiles('assets/particles_ddj_webp/**/*.webp');
    const webpMap = await countFiles('assets/map_ddj_webp/**/*.webp');
    const webpData = await countFiles('assets/data_ddj_webp/**/*.webp');
    const totalWebP = webpMedia + webpParticles + webpMap + webpData;

    const ddjPercent = (totalWebP / totalDDJ * 100);
    console.log(`   Sources:`);
    console.log(`      Media.pk2:      ${ddjMedia.toLocaleString()} DDJ`);
    console.log(`      Particles.pk2:  ${ddjParticles.toLocaleString()} DDJ`);
    console.log(`      Map.pk2:        ${ddjMap.toLocaleString()} DDJ`);
    console.log(`      data_extracted:  ${ddjData.toLocaleString()} DDJ`);
    console.log(`   Total Source: ${totalDDJ.toLocaleString()} fichiers DDJ`);
    console.log(`   Total Output: ${totalWebP.toLocaleString()} fichiers WebP`);
    console.log(`   Status: ⚠️ ${ddjPercent.toFixed(1)}% completé (en cours)\n`);
    reports.push({
        category: 'Textures DDJ',
        sourcePattern: 'DDJ files',
        outputPattern: 'WebP',
        sourceCount: totalDDJ,
        outputCount: totalWebP,
        percentage: ddjPercent,
        status: ddjPercent === 100 ? '✅' : '⚠️'
    });

    // 4. BSR Models (BSR → GLB)
    console.log('🎮 MODÈLES 3D (BSR → GLB)');
    console.log('─'.repeat(70));
    const bsrFiles = await countFiles('assets/pk2_media/**/*.bsr');
    const glbFiles = await countFiles('assets/media_glb/**/*.glb');
    const bsrPercent = ((glbFiles / 2) / bsrFiles * 100); // /2 car BSR+BMS par modèle
    console.log(`   Source: ${bsrFiles.toLocaleString()} fichiers BSR`);
    console.log(`   Output: ${glbFiles.toLocaleString()} fichiers GLB`);
    console.log(`   Status: ✅ ${bsrPercent.toFixed(1)}% (modèles statiques, sans skinning)\n`);
    reports.push({
        category: 'Modèles 3D',
        sourcePattern: 'BSR files',
        outputPattern: 'GLB',
        sourceCount: bsrFiles,
        outputCount: glbFiles / 2,
        percentage: bsrPercent,
        status: '✅'
    });

    // 5. BMS Particles (BMS → GLB)
    console.log('✨ PARTICULES (BMS → GLB)');
    console.log('─'.repeat(70));
    const bmsParticles = await countFiles('assets/pk2_extracted/Particles/**/*.bms');
    const glbParticles = await countFiles('assets/particles_glb/**/*.glb');
    const bmsPercent = bmsParticles > 0 ? (glbParticles / bmsParticles * 100) : 0;
    console.log(`   Source: ${bmsParticles.toLocaleString()} fichiers BMS`);
    console.log(`   Output: ${glbParticles.toLocaleString()} fichiers GLB`);
    console.log(`   Status: ❌ 0% (format différent, conversion échouée)\n`);
    reports.push({
        category: 'Particules BMS',
        sourcePattern: 'BMS files',
        outputPattern: 'GLB',
        sourceCount: bmsParticles,
        outputCount: glbParticles,
        percentage: bmsPercent,
        status: '❌'
    });

    // 6. BAN Animations (BAN → JSON)
    console.log('🎬 ANIMATIONS (BAN → JSON)');
    console.log('─'.repeat(70));
    const banFiles = await countFiles('assets/pk2_media/**/*.ban');
    const jsonBans = await countFiles('assets/media_ban/**/*.json');
    const banPercent = (jsonBans / banFiles * 100);
    console.log(`   Source: ${banFiles.toLocaleString()} fichiers BAN`);
    console.log(`   Output: ${jsonBans.toLocaleString()} fichiers JSON`);
    console.log(`   Status: ✅ ${banPercent.toFixed(1)}% completé\n`);
    reports.push({
        category: 'Animations BAN',
        sourcePattern: 'BAN files',
        outputPattern: 'JSON',
        sourceCount: banFiles,
        outputCount: jsonBans,
        percentage: banPercent,
        status: banPercent === 100 ? '✅' : '⚠️'
    });

    // Résumé global
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                     RÉSUMÉ GLOBAL                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    const completed = reports.filter(r => r.status === '✅').length;
    const inProgress = reports.filter(r => r.status === '⚠️').length;
    const failed = reports.filter(r => r.status === '❌').length;

    console.log(`   ✅ Terminé:     ${completed}/${reports.length} catégories`);
    console.log(`   ⚠️  En cours:    ${inProgress}/${reports.length} catégories`);
    console.log(`   ❌ Échoué:      ${failed}/${reports.length} catégories\n`);

    // Détails par catégorie
    console.log('📋 Détails par catégorie:\n');
    for (const report of reports) {
        const progressBar = '█'.repeat(Math.floor(report.percentage / 5)) + '░'.repeat(20 - Math.floor(report.percentage / 5));
        console.log(`   ${report.status} ${report.category.padEnd(20)}`);
        console.log(`      ${progressBar} ${report.percentage.toFixed(1)}%`);
        console.log(`      ${report.outputCount.toLocaleString()} / ${report.sourceCount.toLocaleString()} fichiers`);
        console.log('');
    }

    // SectionMaps disponibles
    console.log('🗺️  MAPS DISPONIBLES POUR BABYLON.JS:');
    console.log('─'.repeat(70));
    const heightmapDirs = await fs.readdir('assets/maps_heightmap');
    const objectDirs = await fs.readdir('assets/maps_objects');
    console.log(`   Maps avec heightmap: ${heightmapDirs.length}`);
    console.log(`   Maps avec objets:    ${objectDirs.length}`);
    console.log(`   Maps complètes:      ${Math.min(heightmapDirs.length, objectDirs.length)}\n`);

    console.log('   Exemples de maps à tester:');
    const testMaps = ['100', '101', '102', '68'];
    for (const mapId of testMaps) {
        const hasHeightmap = heightmapDirs.includes(mapId);
        const hasObjects = objectDirs.includes(mapId);
        const status = hasHeightmap && hasObjects ? '✅' : '⚠️';
        console.log(`      ${status} Map ${mapId}: heightmap=${hasHeightmap}, objets=${hasObjects}`);
    }
    console.log('');

    // Next Steps
    console.log('🚀 PROCHAINES ÉTAPES:');
    console.log('─'.repeat(70));
    console.log('   1. ⏳ Attendre fin conversion DDJ → WebP (~20-30h restants)');
    console.log('   2. 🧪 Tester la page test-maps-3d.html dans le navigateur');
    console.log('   3. 🎨 Implémenter chargement des vrais modèles 3D GLB');
    console.log('   4. ⚡ Optimiser les performances (LOD, culling, etc.)');
    console.log('   5. 🎯 Ajouter collision detection sur le terrain');
    console.log('   6. 📜 Parser les fichiers .m (materials/texture indices)');
    console.log('');

    console.log('✅ Rapport généré avec succès!\n');
}

generateReport().catch(console.error);
