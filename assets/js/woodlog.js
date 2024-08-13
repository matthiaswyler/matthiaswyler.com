document.addEventListener("DOMContentLoaded", () => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	const renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;

	// Enable color management
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;

	document.getElementById("canvas-container").appendChild(renderer.domElement);

	const setupLights = () => {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 8, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;
		scene.add(directionalLight);

		const pointLight = new THREE.PointLight(0xffffff, 1, 100);
		pointLight.position.set(5, 5, 5);
		scene.add(pointLight);

		const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
		scene.add(ambientLight);
	};
	setupLights();

	let model, priceTag;
	let additionalRotation = 0;

	const textureLoader = new THREE.TextureLoader();
	const priceTagTexture = textureLoader.load("assets/files/price-tag.png");

	const loader = new THREE.GLTFLoader();
	loader.load("assets/files/woodlog.glb", (gltf) => {
		model = gltf.scene;
		model.traverse((child) => {
			if (child.isMesh) {
				child.material.metalness = 0.2;
				child.material.roughness = 1;
				// child.material.color.set(0x808000);

				// Ensure textures are correctly handled
				child.material.map &&
					(child.material.map.encoding = THREE.sRGBEncoding);
				child.material.needsUpdate = true;
			}
		});
		scene.add(model);

		const box = new THREE.Box3().setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const fov = camera.fov * (Math.PI / 180);
		const cameraZ = Math.abs((maxDim / 2) * Math.tan(fov / 2));
		const distanceFactor = 2.5;
		camera.position.set(center.x, center.y, cameraZ * distanceFactor);

		const minZ = box.min.z;
		const cameraToFarEdge =
			minZ < 0
				? -minZ + cameraZ * distanceFactor
				: cameraZ * distanceFactor - minZ;
		camera.far = cameraToFarEdge * 3;
		camera.lookAt(center);
		camera.updateProjectionMatrix();

		model.position.y += 0.08;

		const planeGeometry = new THREE.PlaneGeometry(0.05, 0.05);
		const planeMaterial = new THREE.MeshBasicMaterial({
			map: priceTagTexture,
			transparent: true,
		});
		priceTag = new THREE.Mesh(planeGeometry, planeMaterial);

		priceTag.position.set(
			center.x,
			center.y + size.y / 5,
			center.z + size.z / 2 + 0.2
		);
		scene.add(priceTag);
	});

	const animate = () => {
		requestAnimationFrame(animate);

		if (model) {
			model.rotation.y += 0.01 + additionalRotation;
			additionalRotation = 0;
		}

		renderer.render(scene, camera);
	};
	animate();

	window.addEventListener("resize", () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});
});
