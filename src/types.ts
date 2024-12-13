export interface ModelInfo {
  url: string;
  type: string;
  name?: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpotLight {
  position: [number, number, number];
  color: string;
  intensity: number;
}

export interface DirectionalLight {
  position: [number, number, number];
  color: string;
  intensity: number;
}

export interface HemisphereLight {
  skyColor: string;
  groundColor: string;
  intensity: number;
}

export interface AmbientLight {
  intensity: number;
  color: string;
}

export interface LightPreset {
  name: string;
  description: string;
  gradient: string[];
  intensity: number;
  directionalLight: DirectionalLight;
  hemisphereLight: HemisphereLight;
  spotlights: SpotLight[];
  ambientLight: AmbientLight;
}

export interface EnvironmentPreset {
  name: string;
  value: string;
  description?: string;
}
