import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DwirroExpression } from './characterState';
import { createDwirroMaterials } from './DwirroMaterials';
import { DwirroFace } from './DwirroFace';

interface DwirroAvatarProps {
  expression: DwirroExpression;
}

export const DwirroAvatar: React.FC<DwirroAvatarProps> = ({ expression }) => {
  const avatarRootRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const cyanGlowMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const cyanLightLeftRef = useRef<THREE.PointLight>(null);
  const cyanLightRightRef = useRef<THREE.PointLight>(null);
  const visorLightRef = useRef<THREE.PointLight>(null);

  // Reusable materials
  const materials = useMemo(() => createDwirroMaterials(), []);

  // 1. Continuous Central Body + Legs Shape (Extruded with smooth bevels)
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Front silhouette coordinates inspired by turnaround sheet
    // Start at bottom of left foot
    shape.moveTo(-0.35, 0.02);
    // Left outside leg and torso curving gently up
    shape.lineTo(-0.36, 0.40);
    shape.quadraticCurveTo(-0.37, 0.65, -0.34, 0.86);
    // Top of head under visor
    shape.quadraticCurveTo(0.0, 0.93, 0.34, 0.86);
    // Right outside torso and leg
    shape.quadraticCurveTo(0.37, 0.65, 0.36, 0.40);
    shape.lineTo(0.35, 0.02);
    // Right foot bottom
    shape.lineTo(0.12, 0.02);
    // Arch between legs (U-shaped arch)
    shape.quadraticCurveTo(0.11, 0.28, 0.0, 0.28);
    shape.quadraticCurveTo(-0.11, 0.28, -0.12, 0.02);
    // Back to left foot
    shape.lineTo(-0.35, 0.02);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, []);

  // 2. Signature Asymmetric Slanted Visor (Top Shell)
  const { visorTopGeometry, visorUndercutGeometry, visorCyanRimGeometry } = useMemo(() => {
    // We construct a custom sculpted visor surface:
    // Left side (u = 0, character's right) starts high (y ~ 1.30)
    // Right side (u = 1, character's left) sweeps diagonally down (y ~ 1.00)
    const uSegments = 24;
    const vSegments = 16;

    // Helper to evaluate height at normalized (u, v)
    // u: 0 (left / high) to 1 (right / low)
    // v: 0 (back) to 1 (front)
    const evalVisorSurface = (u: number, v: number, isUnderside = false) => {
      // Coordinate space:
      // X spans from -0.44 on left to +0.46 on right
      const x = -0.44 + u * 0.90;
      // Z spans from -0.30 at back to +0.34 at front
      const z = -0.30 + v * 0.64;

      // Base diagonal slant from left to right
      // High on left (u=0 -> 1.28), sloping down to right (u=1 -> 0.98)
      const slantY = 1.28 - u * 0.30;

      // Parabolic crown curvature (highest towards center-left)
      const uCrown = Math.sin(u * Math.PI) * 0.10;
      const vCrown = Math.sin(v * Math.PI) * 0.09;

      // Front brim downward curve
      const frontBrimDrop = v > 0.6 ? Math.pow((v - 0.6) / 0.4, 2) * 0.08 : 0;
      // Back brim curve
      const backBrimDrop = v < 0.4 ? Math.pow((0.4 - v) / 0.4, 2) * 0.05 : 0;

      const thickness = isUnderside ? -0.045 : 0.0;
      const y = slantY + uCrown + vCrown - frontBrimDrop - backBrimDrop + thickness;

      return new THREE.Vector3(x, y, z);
    };

    // Construct Parametric Visor Shell
    const topGeo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    // Top surface grid
    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments;
        const pt = evalVisorSurface(u, v, false);
        positions.push(pt.x, pt.y, pt.z);
      }
    }

    // Indices for grid
    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = a + 1;
        const c = a + (uSegments + 1);
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    topGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    topGeo.setIndex(indices);
    topGeo.computeVertexNormals();

    // Visor Undercut Geometry (inner dark ceiling)
    const underGeo = new THREE.BufferGeometry();
    const underPositions: number[] = [];
    const underIndices: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments;
        const pt = evalVisorSurface(u, v, true);
        underPositions.push(pt.x, pt.y, pt.z);
      }
    }

    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = a + 1;
        const c = a + (uSegments + 1);
        const d = c + 1;
        // Inverted winding for underside
        underIndices.push(a, b, c);
        underIndices.push(b, d, c);
      }
    }

    underGeo.setAttribute('position', new THREE.Float32BufferAttribute(underPositions, 3));
    underGeo.setIndex(underIndices);
    underGeo.computeVertexNormals();

    // Visor Glowing Cyan Rim Under-strip (traces the underside seam)
    const curvePoints: THREE.Vector3[] = [];
    // Trace front brim seam
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      const pt = evalVisorSurface(u, 0.92, true);
      curvePoints.push(new THREE.Vector3(pt.x, pt.y - 0.012, pt.z - 0.015));
    }
    const cyanCurve = new THREE.CatmullRomCurve3(curvePoints);
    const cyanRimGeo = new THREE.TubeGeometry(cyanCurve, 24, 0.014, 8, false);

    return {
      visorTopGeometry: topGeo,
      visorUndercutGeometry: underGeo,
      visorCyanRimGeometry: cyanRimGeo,
    };
  }, []);

  // 3. Signature Side Pods (Flattened rounded capsules)
  const sidePodGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.19, 32, 24);
    // Flatten along X (pod thickness), slightly elongated in Y (pod height)
    geo.scale(0.55, 1.15, 0.95);
    return geo;
  }, []);

  // 4. Electric Cyan Illuminated Rings (encircling the base of each pod)
  const cyanRingGeometry = useMemo(() => {
    // Torus encircling the pod base where it joins the head
    return new THREE.TorusGeometry(0.165, 0.022, 16, 40);
  }, []);

  // 5. Subtle Geometric "D" Accent (debossed on right flank)
  const debossDGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Geometric D profile: vertical spine with rounded half-ring
    const h = 0.09;
    const w = 0.065;
    const r = 0.038;

    shape.moveTo(0, 0);
    shape.lineTo(0, h);
    shape.lineTo(w - r, h);
    shape.quadraticCurveTo(w, h, w, h - r);
    shape.lineTo(w, r);
    shape.quadraticCurveTo(w, 0, w - r, 0);
    shape.closePath();

    // Inner cutout of the D
    const hole = new THREE.Path();
    const t = 0.018; // thickness
    hole.moveTo(t, t);
    hole.lineTo(t, h - t);
    hole.lineTo(w - r, h - t);
    hole.quadraticCurveTo(w - t, h - t, w - t, h - r);
    hole.lineTo(w - t, r);
    hole.quadraticCurveTo(w - t, t, w - r, t);
    hole.closePath();
    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    });
  }, []);

  // 6. Rectangular Foot Pads (as seen in turnaround BOTTOM view)
  const footPadGeometry = useMemo(() => {
    return new THREE.BoxGeometry(0.20, 0.025, 0.40);
  }, []);

  // Procedural Animation Loop
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    // Breathing & procedural bobbing
    const bobSpeed = expression.bodyBobSpeed;
    const bobAmp = expression.bodyBobAmp;
    const breathingOffset = Math.sin(time * bobSpeed) * bobAmp;
    const basePosY = -0.45;

    if (avatarRootRef.current) {
      // Smooth body position bobbing
      const targetPosY = basePosY + breathingOffset;
      avatarRootRef.current.position.y = THREE.MathUtils.damp(
        avatarRootRef.current.position.y,
        targetPosY,
        10,
        dt
      );

      // Subtle breathing scale squash & stretch
      const targetScaleY = 1.0 + breathingOffset * 0.4;
      const targetScaleXZ = 1.0 - breathingOffset * 0.2;
      avatarRootRef.current.scale.y = THREE.MathUtils.damp(
        avatarRootRef.current.scale.y,
        targetScaleY,
        8,
        dt
      );
      avatarRootRef.current.scale.x = THREE.MathUtils.damp(
        avatarRootRef.current.scale.x,
        targetScaleXZ,
        8,
        dt
      );
      avatarRootRef.current.scale.z = THREE.MathUtils.damp(
        avatarRootRef.current.scale.z,
        targetScaleXZ,
        8,
        dt
      );
    }

    // Head / visor tilting based on state
    if (headGroupRef.current) {
      headGroupRef.current.rotation.x = THREE.MathUtils.damp(
        headGroupRef.current.rotation.x,
        expression.headTiltX,
        10,
        dt
      );
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(
        headGroupRef.current.rotation.y,
        expression.headTiltY,
        10,
        dt
      );
      headGroupRef.current.rotation.z = THREE.MathUtils.damp(
        headGroupRef.current.rotation.z,
        expression.headTiltZ,
        10,
        dt
      );
    }

    // Glow pulse animation on cyan accents
    const glowPulse =
      expression.glowIntensity +
      (expression.state === 'thinking' || expression.state === 'speaking'
        ? Math.sin(time * 6) * 0.6
        : Math.sin(time * 2.5) * 0.25);

    if (cyanGlowMatRef.current) {
      cyanGlowMatRef.current.emissiveIntensity = glowPulse;
    }

    // Update cyan point lights matching pulse
    if (cyanLightLeftRef.current) {
      cyanLightLeftRef.current.intensity = glowPulse * 0.6;
    }
    if (cyanLightRightRef.current) {
      cyanLightRightRef.current.intensity = glowPulse * 0.6;
    }
    if (visorLightRef.current) {
      visorLightRef.current.intensity = glowPulse * 0.5;
    }
  });

  return (
    <group ref={avatarRootRef} position={[0, -0.60, 0]}>
      {/* 1. Foot Pads */}
      <mesh
        geometry={footPadGeometry}
        material={materials.bodyMaterial}
        position={[-0.23, 0.012, 0]}
        castShadow={false}
      />
      <mesh
        geometry={footPadGeometry}
        material={materials.bodyMaterial}
        position={[0.23, 0.012, 0]}
        castShadow={false}
      />

      {/* 2. Continuous Central Body & Legs */}
      {/* Centered along Z by offsetting extruded depth (-0.23) */}
      <mesh
        geometry={bodyGeometry}
        material={materials.bodyMaterial}
        position={[0, 0, -0.23]}
        castShadow={false}
      />

      {/* Head & Face Group (Receives rotation & tilt) */}
      <group ref={headGroupRef}>
        {/* 3. Expressive Face & Luminous Square Eyes */}
        <DwirroFace expression={expression} eyeMaterial={materials.eyeMaterial} />

        {/* 4. Signature Asymmetric Slanted Visor Top Shell */}
        <mesh
          geometry={visorTopGeometry}
          material={materials.visorMaterial}
          castShadow={false}
        />
        {/* Visor Undercut */}
        <mesh
          geometry={visorUndercutGeometry}
          material={materials.visorUndercutMaterial}
          castShadow={false}
        />
        {/* Visor Glowing Electric Cyan Rim Strip */}
        <mesh
          geometry={visorCyanRimGeometry}
          material={materials.cyanGlowMaterial}
          castShadow={false}
        />
        {/* Visor Undercut Glow Point Light */}
        <pointLight
          ref={visorLightRef}
          color={materials.cyanGlowMaterial.color}
          intensity={1.5}
          distance={0.8}
          position={[0.0, 1.05, 0.15]}
        />

        {/* 5. Signature Side Pods & Cyan Light Rings */}
        {/* Left Side Pod (Viewer's left / Character's right) */}
        <group position={[-0.43, 0.70, 0.02]}>
          {/* Outer Pod Dome */}
          <mesh
            geometry={sidePodGeometry}
            material={materials.sidePodMaterial}
            position={[-0.04, 0, 0]}
            castShadow={false}
          />
          {/* Cyan Light Ring */}
          <mesh
            geometry={cyanRingGeometry}
            material={materials.cyanGlowMaterial}
            rotation={[0, Math.PI / 2, 0]}
            position={[0.02, 0, 0]}
          />
          {/* Side Pod Point Light for subtle cyan glow onto head */}
          <pointLight
            ref={cyanLightLeftRef}
            color={materials.cyanGlowMaterial.color}
            intensity={1.6}
            distance={0.9}
            position={[-0.08, 0, 0]}
          />
        </group>

        {/* Right Side Pod (Viewer's right / Character's left) */}
        <group position={[0.43, 0.70, 0.02]}>
          {/* Outer Pod Dome */}
          <mesh
            geometry={sidePodGeometry}
            material={materials.sidePodMaterial}
            position={[0.04, 0, 0]}
            castShadow={false}
          />
          {/* Cyan Light Ring */}
          <mesh
            geometry={cyanRingGeometry}
            material={materials.cyanGlowMaterial}
            rotation={[0, Math.PI / 2, 0]}
            position={[-0.02, 0, 0]}
          />
          {/* Side Pod Point Light */}
          <pointLight
            ref={cyanLightRightRef}
            color={materials.cyanGlowMaterial.color}
            intensity={1.6}
            distance={0.9}
            position={[0.08, 0, 0]}
          />
        </group>
      </group>

      {/* 6. Subtle Geometric "D" Accent (debossed on right flank) */}
      <mesh
        geometry={debossDGeometry}
        material={materials.debossMaterial}
        position={[0.395, 0.44, 0.04]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
};
