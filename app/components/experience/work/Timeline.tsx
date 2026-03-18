import { Box, Edges, Line, Text, TextProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { WORK_TIMELINE } from "@constants";
import { WorkTimelinePoint } from "@types";

const reusableLeft = new THREE.Vector3(-0.3, 0, -0.1);
const reusableRight = new THREE.Vector3(0.3, 0, -0.1);

const TimelinePoint = ({
	point,
	diff,
}: {
	point: WorkTimelinePoint;
	diff: number;
}) => {
	const getPoint = useMemo(() => {
		switch (point.position) {
			case "left":
				return reusableLeft;
			case "right":
				return reusableRight;
			default:
				return new THREE.Vector3();
		}
	}, [point.position]);

	const textAlign = point.position === "left" ? "right" : "left";

	const textProps: Partial<TextProps> = useMemo(
		() => ({
			font: "./Vercetti-Regular.woff",
		  color: "#38bdf8",
			anchorX: textAlign,
			fillOpacity: 2 - 2 * diff,
		}),
		[textAlign, diff],
	);

	const titleProps = useMemo(
		() => ({
			...textProps,
			font: "./soria-font.ttf",
			fontSize: isMobile ? 0.4 : 0.5,
			maxWidth: 3,
		}),
		[textProps],
	);

	// New refs and state for animation
	const boxRef = useRef<THREE.Mesh>(null);
	const textGroupRef = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		if (boxRef.current) {
			gsap.to(boxRef.current.scale, {
				x: hovered ? 1.2 : 1,
				y: hovered ? 1.2 : 1,
				z: hovered ? 1.2 : 1,
				duration: 0.3,
			});
		}
	}, [hovered]);

	useEffect(() => {
		if (textGroupRef.current) {
			gsap.fromTo(
				textGroupRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 1 },
			);
		}
	}, []);

	useFrame((state, delta) => {
		if (boxRef.current) {
			boxRef.current.scale.x = THREE.MathUtils.damp(
				boxRef.current.scale.x,
				hovered ? 1.2 : 1,
				6,
				delta,
			);
			boxRef.current.scale.y = THREE.MathUtils.damp(
				boxRef.current.scale.y,
				hovered ? 1.2 : 1,
				6,
				delta,
			);
			boxRef.current.scale.z = THREE.MathUtils.damp(
				boxRef.current.scale.z,
				hovered ? 1.2 : 1,
				6,
				delta,
			);
		}
	});

	return (
		<group position={point.point} scale={isMobile ? 0.35 : 0.6}>
			<ambientLight intensity={0.5} />
			<pointLight position={[5, 5, 5]} intensity={2} />
			<Box
				args={[0.2, 0.2, 0.2]}
				position={[0, 0, -0.2]}
				ref={boxRef}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				scale={hovered ? 1.3 : 1 - diff}
			>
				<meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.2} />
			</Box>
			<group ref={textGroupRef}>
				<group position={getPoint}>
					<Text {...textProps} fontSize={0.3} position={[-diff / 2, 0, 0]}>
						{point.year}
					</Text>
					<group position={[0, -0.8, 0]}>
						<Text
							{...titleProps}
							fontSize={isMobile ? 0.4 : 0.5}
							maxWidth={5}
							lineHeight={1.2}
							position={[0, -diff / 2, 0]}
						>
							{point.title}
						</Text>
						<Text {...textProps} fontSize={0.18} position={[0, -0.6 - diff, 0]}>
							{point.subtitle}
						</Text>
					</group>
				</group>
			</group>
		</group>
	);
};

const Timeline = ({ progress }: { progress: number }) => {
	const { camera } = useThree();
	const isActive = usePortalStore((state) => state.activePortalId === "work");
	const timeline = useMemo(() => WORK_TIMELINE, []);

	const curve = useMemo(
		() =>
			new THREE.CatmullRomCurve3(
				timeline.map((p) => p.point),
				false,
			),
		[timeline],
	);
	const curvePoints = useMemo(() => curve.getPoints(500), [curve]);
	const visibleCurvePoints = useMemo(
		() =>
			curvePoints.slice(
				0,
				Math.max(1, Math.ceil(progress * curvePoints.length)),
			),
		[curvePoints, progress],
	);
	const visibleTimelinePoints = useMemo(
		() =>
			timeline.slice(
				0,
				Math.max(1, Math.round(progress * (timeline.length - 1) + 1)),
			),
		[timeline, progress],
	);

	const [visibleDashedCurvePoints, setVisibleDashedCurvePoints] = useState<
		THREE.Vector3[]
	>([]);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useFrame((_, delta) => {
		if (isActive) {
			const position = curve.getPoint(progress);
			camera.position.x = THREE.MathUtils.damp(
				camera.position.x,
				(isMobile ? -1 : -2) + position.x,
				4,
				delta,
			);
			camera.position.y = THREE.MathUtils.damp(
				camera.position.y,
				-39 + position.z,
				4,
				delta,
			);
			camera.position.z = THREE.MathUtils.damp(
				camera.position.z,
				13 - position.y,
				4,
				delta,
			);
		}
	});

	const groupRef = useRef<THREE.Group>(null);

	useEffect(() => {
		const tl = gsap.timeline();
		if (groupRef.current) {
			tl.to(groupRef.current.scale, {
				x: isActive ? 1 : 0,
				y: isActive ? 1 : 0,
				z: isActive ? 1 : 0,
				duration: 1,
				delay: isActive ? 0.4 : 0,
			});
			tl.to(
				groupRef.current.position,
				{
					y: isActive ? 0 : -2,
					duration: 1,
					delay: isActive ? 0.4 : 0,
				},
				0,
			);
		}

		if (isActive) {
			let i = 0;
			clearInterval(intervalRef.current!);
			setTimeout(() => {
				intervalRef.current = setInterval(() => {
					const p = i++ / 100;
					setVisibleDashedCurvePoints(
						curvePoints.slice(
							0,
							Math.max(1, Math.ceil(p * curvePoints.length)),
						),
					);
					if (i > 100 && intervalRef.current)
						clearInterval(intervalRef.current);
				}, 10);
			}, 1000);
		} else {
			setVisibleDashedCurvePoints([]);
			clearInterval(intervalRef.current!);
		}

		return () => clearInterval(intervalRef.current!);
	}, [isActive]);

	return (
		<group position={[0, -0.1, -0.1]}>
			<Line points={visibleCurvePoints} color="white" lineWidth={3} />
			<Line points={visibleCurvePoints} color="#38bdf8" lineWidth={2} />
			<Line points={visibleCurvePoints} color="#22d3ee" lineWidth={0.5} />
			{visibleDashedCurvePoints.length > 0 && (
				<Line
					points={visibleDashedCurvePoints}
					color="white"
					lineWidth={0.5}
					dashed
					dashSize={0.25}
					gapSize={0.25}
				/>
			)}
			<group ref={groupRef}>
				{visibleTimelinePoints.map((point, i) => {
					const diff = Math.min(
						2 * Math.max(i - progress * (timeline.length - 1), 0),
						1,
					);
					return <TimelinePoint point={point} key={i} diff={diff} />;
				})}
			</group>
		</group>
	);
};

export default Timeline;
