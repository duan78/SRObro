/**
 * SRObro Asset Viewer - Standalone JavaScript Version
 *
 * Interactive viewer for converted game assets
 */

// Global state
let canvas, engine, scene, camera, assetRoot;
let highlightLayer;
let wireframeMode = false;
let autoRotate = false;
let allAssets = [];

/**
 * Initialize the viewer
 */
async function init() {
    canvas = document.getElementById('renderCanvas');

    // Create Babylon.js engine
    engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true
    });

    // Create scene
    createScene();

    // Load manifest
    await loadManifest();

    // Populate asset list
    populateAssetList();

    // Setup search filter
    setupFilters();

    // Start render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Handle resize
    window.addEventListener('resize', () => {
        engine.resize();
    });

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);

    // Load a random asset to start
    loadRandomAsset();
}

/**
 * Create the 3D scene
 */
function createScene() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.15);

    // Create camera
    camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 3,
        5,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;
    camera.wheelPrecision = 50;

    // Create lights
    const hemiLight = new BABYLON.HemisphericLight(
        'hemi',
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    hemiLight.intensity = 0.6;

    const dirLight = new BABYLON.DirectionalLight(
        'dir',
        new BABYLON.Vector3(-1, -2, -1),
        scene
    );
    dirLight.position = new BABYLON.Vector3(10, 20, 10);
    dirLight.intensity = 0.8;

    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;

    // Ground plane
    const ground = BABYLON.MeshBuilder.CreateGround(
        'ground',
        { width: 20, height: 20 },
        scene
    );
    ground.position.y = -1;
    ground.receiveShadows = true;

    const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
    ground.material = groundMat;

    // Highlight layer
    highlightLayer = new BABYLON.HighlightLayer('hl1', scene);

    // Root node for loaded assets
    assetRoot = new BABYLON.TransformNode('assetRoot', scene);
}

/**
 * Load asset manifest
 */
async function loadManifest() {
    try {
        const response = await fetch('./assets/manifest.json');
        const manifest = await response.json();

        console.log('Manifest loaded:', manifest.statistics);

        // Update stats
        const statsEl = document.getElementById('stats');
        statsEl.textContent = `${manifest.statistics.total_textures} textures | ` +
                             `${manifest.statistics.total_animations} animations`;

        // Get models from the converted assets directory
        const modelsResponse = await fetch('./assets/models.json');
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            allAssets = modelsData.files || [];
            console.log(`Found ${allAssets.length} models`);
        } else {
            // Fallback: list some known models
            allAssets = [
                'avatar_m_amalun.glb',
                'chair_wood01.glb',
                'rock_mt01.glb',
                'tree_pine01.glb'
            ];
        }

    } catch (error) {
        console.error('Failed to load manifest:', error);

        // Use fallback list
        allAssets = [
            'avatar_m_amalun.glb',
            'chair_wood01.glb',
            'rock_mt01.glb',
            'tree_pine01.glb'
        ];

        document.getElementById('stats').textContent = 'Using fallback asset list';
    }
}

/**
 * Populate asset list sidebar
 */
function populateAssetList() {
    const listEl = document.getElementById('asset-list');
    listEl.innerHTML = '';

    // Display first 100 assets to avoid lag
    const displayAssets = allAssets.slice(0, 100);

    displayAssets.forEach(asset => {
        const li = document.createElement('li');
        li.textContent = asset;
        li.onclick = () => loadAsset(asset);
        listEl.appendChild(li);
    });

    if (allAssets.length > 100) {
        const moreLi = document.createElement('li');
        moreLi.textContent = `... and ${allAssets.length - 100} more (use search)`;
        moreLi.style.color = '#ffd700';
        moreLi.style.fontStyle = 'italic';
        listEl.appendChild(moreLi);
    }
}

/**
 * Setup search and category filters
 */
function setupFilters() {
    const searchBox = document.getElementById('search-box');
    const categoryFilter = document.getElementById('category-filter');

    // Search filter
    searchBox.addEventListener('input', (e) => {
        filterAssets(e.target.value, categoryFilter.value);
    });

    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        filterAssets(searchBox.value, e.target.value);
    });
}

/**
 * Filter assets by search term and category
 */
function filterAssets(searchTerm, category) {
    const listEl = document.getElementById('asset-list');
    listEl.innerHTML = '';

    const term = searchTerm.toLowerCase();
    const filtered = allAssets.filter(asset => {
        const matchesSearch = asset.toLowerCase().includes(term);
        const matchesCategory = category === 'all' || matchesCategoryFilter(asset, category);
        return matchesSearch && matchesCategory;
    });

    // Limit display
    const displayAssets = filtered.slice(0, 100);

    displayAssets.forEach(asset => {
        const li = document.createElement('li');
        li.textContent = asset;
        li.onclick = () => loadAsset(asset);
        listEl.appendChild(li);
    });

    if (filtered.length > 100) {
        const moreLi = document.createElement('li');
        moreLi.textContent = `... and ${filtered.length - 100} more`;
        moreLi.style.color = '#ffd700';
        listEl.appendChild(moreLi);
    }
}

/**
 * Check if asset matches category filter
 */
function matchesCategoryFilter(asset, category) {
    const name = asset.toLowerCase();

    switch (category) {
        case 'characters':
            return name.startsWith('avatar_');
        case 'weapons':
            return name.includes('sword') || name.includes('spear') ||
                   name.includes('bow') || name.includes('blade');
        case 'objects':
            return name.includes('chair') || name.includes('table') ||
                   name.includes('box') || name.includes('chest');
        case 'environment':
            return name.includes('rock') || name.includes('tree') ||
                   name.includes('grass') || name.includes('water');
        default:
            return true;
    }
}

/**
 * Load a specific asset
 */
async function loadAsset(assetName) {
    if (!assetName) return;

    console.log(`Loading asset: ${assetName}`);

    // Update info panel
    document.getElementById('asset-name').textContent = 'Loading...';
    document.getElementById('asset-info').textContent = assetName;

    // Remove previous asset
    if (assetRoot) {
        assetRoot.dispose();
        assetRoot = new BABYLON.TransformNode('assetRoot', scene);
    }

    try {
        // Load GLB model
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            null,
            './assets/models/',
            assetName,
            scene
        );

        // Parent all meshes to root
        for (const mesh of result.meshes) {
            mesh.parent = assetRoot;
        }

        // Center and scale
        centerAsset(assetRoot);

        // Add highlight
        for (const mesh of result.meshes) {
            if (mesh instanceof BABYLON.Mesh) {
                highlightLayer.addMesh(mesh, BABYLON.Color3.Yellow());
            }
        }

        // Update info
        const meshCount = result.meshes.length;
        document.getElementById('asset-name').textContent = assetName;
        document.getElementById('asset-info').textContent =
            `Meshes: ${meshCount}\nVertices: ${countVertices(result.meshes)}\n\n` +
            `Use mouse to rotate camera\nScroll to zoom in/out`;

        // Highlight in list
        document.querySelectorAll('#asset-list li').forEach(li => {
            li.classList.remove('active');
            if (li.textContent === assetName) {
                li.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Failed to load asset:', error);
        document.getElementById('asset-name').textContent = 'Error';
        document.getElementById('asset-info').textContent =
            `Failed to load: ${assetName}\n\nError: ${error.message}`;
    }
}

/**
 * Load a random asset
 */
function loadRandomAsset() {
    if (allAssets.length === 0) {
        console.error('No assets available');
        return;
    }

    const randomIndex = Math.floor(Math.random() * allAssets.length);
    loadAsset(allAssets[randomIndex]);
}

/**
 * Center asset and adjust scale
 */
function centerAsset(root) {
    const boundingInfo = root.getHierarchyBoundingVectors();

    const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);
    const size = boundingInfo.max.subtract(boundingInfo.min);

    root.position = center.negate();

    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetSize = 3;
    const scale = targetSize / maxDimension;
    root.scaling = new BABYLON.Vector3(scale, scale, scale);
}

/**
 * Count vertices in meshes
 */
function countVertices(meshes) {
    let count = 0;
    for (const mesh of meshes) {
        if (mesh instanceof BABYLON.Mesh && mesh.getTotalVertices) {
            count += mesh.getTotalVertices();
        }
    }
    return count;
}

/**
 * Toggle wireframe mode
 */
function toggleWireframe() {
    wireframeMode = !wireframeMode;

    if (!assetRoot) return;

    const meshes = assetRoot.getChildren();
    for (const child of meshes) {
        if (child instanceof BABYLON.Mesh && child.material) {
            child.material.wireframe = wireframeMode;
        }
    }
}

/**
 * Reset camera to default position
 */
function resetCamera() {
    if (camera) {
        camera.alpha = -Math.PI / 2;
        camera.beta = Math.PI / 3;
        camera.radius = 5;
        camera.target = BABYLON.Vector3.Zero();
    }
}

/**
 * Toggle auto-rotate
 */
function toggleAutoRotate() {
    autoRotate = !autoRotate;
}

// Animation loop for auto-rotate
scene && scene.registerBeforeRender(() => {
    if (autoRotate && assetRoot) {
        assetRoot.rotation.y += 0.01;
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for HTML buttons
window.loadRandomAsset = loadRandomAsset;
window.toggleWireframe = toggleWireframe;
window.resetCamera = resetCamera;
window.toggleAutoRotate = toggleAutoRotate;
