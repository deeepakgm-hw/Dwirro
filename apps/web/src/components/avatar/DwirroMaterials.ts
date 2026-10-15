import * as THREE from 'three';

export const DWIRRO_COLORS = {
  primaryNavy: '#10254B',
  secondaryRoyal: '#1C3F78',
  darkChassis: '#0B172E',
  accentCyan: '#19BFFF',
  accentCyanGlow: '#00D0FF',
  eyeWhite: '#FFFFFF',
  eyeWhiteGlow: '#E0F7FF',
  debossD: '#0E1E3D',
};

/**
 * Creates reusable Three.js materials matching Dwirro's premium matte aesthetic.
 */
export function createDwirroMaterials() {
  // Primary midnight navy shell (smooth, premium matte)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.primaryNavy),
    roughness: 0.42,
    metalness: 0.08,
  });

  // Visor top shell (slightly richer royal blue specular sheen)
  const visorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.primaryNavy),
    roughness: 0.38,
    metalness: 0.12,
  });

  // Visor inner undercut rim
  const visorUndercutMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.secondaryRoyal),
    roughness: 0.5,
    metalness: 0.05,
  });

  // Side pod outer dome
  const sidePodMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.primaryNavy),
    roughness: 0.40,
    metalness: 0.10,
  });

  // Electric cyan illuminated rings
  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.accentCyan),
    emissive: new THREE.Color(DWIRRO_COLORS.accentCyanGlow),
    emissiveIntensity: 2.8,
    roughness: 0.2,
    metalness: 0.1,
  });

  // Luminous white eyes
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.eyeWhite),
    emissive: new THREE.Color(DWIRRO_COLORS.eyeWhiteGlow),
    emissiveIntensity: 3.0,
    roughness: 0.1,
    metalness: 0.0,
  });

  // Subtle geometric D deboss accent
  const debossMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(DWIRRO_COLORS.debossD),
    roughness: 0.6,
    metalness: 0.2,
  });

  return {
    bodyMaterial,
    visorMaterial,
    visorUndercutMaterial,
    sidePodMaterial,
    cyanGlowMaterial,
    eyeMaterial,
    debossMaterial,
  };
}
