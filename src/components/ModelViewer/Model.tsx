import React, { useEffect, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Group, Mesh, BufferGeometry, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelProps {
  url: string;
  type: string;
}

export const Model: React.FC<ModelProps> = ({ url, type }) => {
  const { scene } = useThree();
  const modelRef = useRef<Group>();

  // Initialize all loaders
  const gltfLoader = useLoader(GLTFLoader, url);
  const objLoader = useLoader(OBJLoader, url);
  const fbxLoader = useLoader(FBXLoader, url);
  const colladaLoader = useLoader(ColladaLoader, url);
  const stlLoader = useLoader(STLLoader, url);
  const plyLoader = useLoader(PLYLoader, url);

  // Select the appropriate loaded model
  const loadedModel = (() => {
    switch (type.toLowerCase()) {
      case 'glb':
      case 'gltf':
        return (gltfLoader as GLTF).scene;
      case 'obj':
        return objLoader;
      case 'fbx':
        return fbxLoader;
      case 'dae':
        return colladaLoader.scene;
      case 'stl': {
        const geometry = stlLoader;
        const material = new MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new Mesh(geometry, material);
        const group = new Group();
        group.add(mesh);
        return group;
      }
      case 'ply': {
        const geometry = plyLoader;
        const material = new MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new Mesh(geometry, material);
        const group = new Group();
        group.add(mesh);
        return group;
      }
      default:
        console.error('Unsupported file type:', type);
        return null;
    }
  })();

  useEffect(() => {
    if (loadedModel) {
      const extractHierarchy = (object: any) => {
        const node = {
          name: object.name || 'Unnamed',
          type: object.type,
          children: [] as any[]
        };

        if (object.children && object.children.length > 0) {
          node.children = object.children.map((child: any) => extractHierarchy(child));
        }

        return node;
      };

      const hierarchy = extractHierarchy(loadedModel);
      const event = new CustomEvent('modelHierarchyUpdate', { detail: hierarchy });
      window.dispatchEvent(event);
    }
  }, [loadedModel]);

  if (!loadedModel) return null;

  return <primitive ref={modelRef} object={loadedModel} />;
};
