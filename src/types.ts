import { Group } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { BufferGeometry } from 'three';
import { Collada } from 'three/examples/jsm/loaders/ColladaLoader';

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

export type EnvironmentPreset =
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'studio'
  | 'city'
  | 'park'
  | 'lobby';

export interface HierarchyNode {
  name: string;
  type: string;
  children: HierarchyNode[];
}

export interface ModelLoader {
  load: (
    url: string,
    onLoad: (result: GLTF | Group | Collada | BufferGeometry) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (event: ErrorEvent) => void
  ) => void;
}
