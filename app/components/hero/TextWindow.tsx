"use client";

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

const TextWindow = () => {
	const data = useScroll();
	const windowRef = useRef<THREE.Group>(null);
	const textGroupRef = useRef<THREE.Group>(null);

	useFrame(() => {
		const c = data.range(0.65, 0.15);

		if (windowRef.current) {
			windowRef.current.setRotationFromAxisAngle(
				new THREE.Vector3(0, -1, 0),
				0.5 * Math.PI * c,
			);
			windowRef.current.position.x = -0.6 * c;
			windowRef.current.position.z = -0.6 * c;
		}
	});

	useEffect(() => {
		if (textGroupRef.current) {
			gsap.fromTo(
				textGroupRef.current.position,
				{ y: -1.2 },
				{ y: -0.8, duration: 1, ease: "power3.out" },
			);

			gsap.fromTo(
				textGroupRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 1 },
			);
		}
	}, []);

	useFrame((state) => {
		if (textGroupRef.current) {
			textGroupRef.current.position.y +=
				Math.sin(state.clock.elapsedTime) * 0.0005;
		}
	});

	const fontProps = {
		font: "./soria-font.ttf",
	};

	return (
		<group position={[0, -0.8, 0]} ref={textGroupRef}>
			<group position={[0, -0.3, 0]} ref={windowRef}>
				<Text
					color="white"
					anchorX="left"
					anchorY="middle"
					fontSize={1.3}
					position={[0.12, 0, 0]}
					{...fontProps}
					scale={[1, -1, 1]}
					rotation={[0, 0, -Math.PI / 2]}
				>
					FULL STACK DEV
				</Text>

				<Text
					color="white"
					anchorX="right"
					anchorY="middle"
					{...fontProps}
					scale={[-1, -1, 1]}
					fontSize={1.3}
					position={[0.12, 0, -1.4]}
					rotation={[0, 0, -Math.PI / 2]}
				>
					IOT SYSTEMS
				</Text>

				<group position={[-0.45, 0, -0.3]}>
					<Text
						color="white"
						anchorX="left"
						anchorY="middle"
						{...fontProps}
						scale={[1, -1, 1]}
						fontSize={0.8}
						rotation={[0, -Math.PI / 2, -Math.PI / 2]}
					>
						MERN STACK. ESP32.
					</Text>

					<Text
						color="white"
						anchorX="left"
						anchorY="middle"
						{...fontProps}
						scale={[1, -1, 1]}
						fontSize={0.8}
						position={[0, 0, -0.6]}
						rotation={[0, -Math.PI / 2, -Math.PI / 2]}
					>
						MACHINE LEARNING.
					</Text>
				</group>

				<group position={[0.45, 0, -0.3]}>
					<Text
						color="white"
						anchorX="right"
						anchorY="middle"
						{...fontProps}
						scale={[-1, -1, 1]}
						fontSize={0.8}
						rotation={[0, -Math.PI / 2, -Math.PI / 2]}
					>
						REACT. NODEJS.
					</Text>
					<Text
						color="white"
						anchorX="right"
						anchorY="middle"
						{...fontProps}
						scale={[-1, -1, 1]}
						fontSize={0.8}
						position={[0, 0, -0.6]}
						rotation={[0, -Math.PI / 2, -Math.PI / 2]}
					>
						INTELLIGENT SYSTEMS
					</Text>
				</group>
			</group>
		</group>
	);
};

export default TextWindow;
