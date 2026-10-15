import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DwirroExpression } from './characterState';

interface DwirroFaceProps {
  expression: DwirroExpression;
  eyeMaterial: THREE.Material;
}

export const DwirroFace: React.FC<DwirroFaceProps> = ({ expression, eyeMaterial }) => {
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  // Blink timing state
  const blinkStateRef = useRef({
    isBlinking: false,
    blinkProgress: 0,
    nextBlinkTime: 2.5,
  });

  // Soft beveled square eye geometry
  const eyeGeometry = useMemo(() => {
    // 0.11 width, 0.11 height, 0.02 depth
    const shape = new THREE.Shape();
    const w = 0.105;
    const h = 0.105;
    const r = 0.018; // soft rounded corners for the square eyes
    const x = -w / 2;
    const y = -h / 2;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
  }, []);

  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.1);

    // Blinking logic
    const blink = blinkStateRef.current;
    blink.nextBlinkTime -= dt;

    if (blink.nextBlinkTime <= 0 && !blink.isBlinking) {
      blink.isBlinking = true;
      blink.blinkProgress = 0;
      // Schedule next natural blink between 3.0 and 5.5 seconds
      blink.nextBlinkTime = 3.0 + Math.random() * 2.5;
    }

    let blinkScaleY = 1.0;
    if (blink.isBlinking) {
      blink.blinkProgress += dt * 14; // rapid blink (approx 140ms duration)
      if (blink.blinkProgress <= 1.0) {
        // Closing and reopening using a smooth sine curve
        blinkScaleY = Math.max(0.06, Math.abs(Math.cos(blink.blinkProgress * Math.PI)));
      } else {
        blink.isBlinking = false;
        blink.blinkProgress = 0;
      }
    }

    // Target scales and rotations based on expression & blinking
    const targetScaleX = expression.eyeScaleX;
    const targetScaleY = expression.eyeScaleY * blinkScaleY;
    const targetRotZ = expression.eyeRotation;
    const targetPosY = 0.63 + expression.eyeOffsetY;

    // Smoothly interpolate left eye
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.x = THREE.MathUtils.damp(
        leftEyeRef.current.scale.x,
        targetScaleX,
        14,
        dt
      );
      leftEyeRef.current.scale.y = THREE.MathUtils.damp(
        leftEyeRef.current.scale.y,
        targetScaleY,
        18,
        dt
      );
      leftEyeRef.current.rotation.z = THREE.MathUtils.damp(
        leftEyeRef.current.rotation.z,
        targetRotZ,
        12,
        dt
      );
      leftEyeRef.current.position.y = THREE.MathUtils.damp(
        leftEyeRef.current.position.y,
        targetPosY,
        12,
        dt
      );
    }

    // Smoothly interpolate right eye (mirror rotation for symmetric expressions)
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.x = THREE.MathUtils.damp(
        rightEyeRef.current.scale.x,
        targetScaleX,
        14,
        dt
      );
      rightEyeRef.current.scale.y = THREE.MathUtils.damp(
        rightEyeRef.current.scale.y,
        targetScaleY,
        18,
        dt
      );
      rightEyeRef.current.rotation.z = THREE.MathUtils.damp(
        rightEyeRef.current.rotation.z,
        -targetRotZ,
        12,
        dt
      );
      rightEyeRef.current.position.y = THREE.MathUtils.damp(
        rightEyeRef.current.position.y,
        targetPosY,
        12,
        dt
      );
    }
  });

  return (
    <group name="dwirro-face">
      {/* Left Eye (Viewer's left / Character's right) */}
      <group ref={leftEyeRef} position={[-0.175, 0.63, 0.285]}>
        <mesh geometry={eyeGeometry} material={eyeMaterial} castShadow={false} receiveShadow={false} />
      </group>

      {/* Right Eye (Viewer's right / Character's left) */}
      <group ref={rightEyeRef} position={[0.175, 0.63, 0.285]}>
        <mesh geometry={eyeGeometry} material={eyeMaterial} castShadow={false} receiveShadow={false} />
      </group>
    </group>
  );
};
