import React, { useEffect, useRef, useState } from 'react';
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
  const [fbxModel, setFbxModel] = useState<Group | null>(null);
  const modelType = type.toLowerCase();

  // 모든 로더를 초기화
  const gltfResult = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    (loader as GLTFLoader).setDRACOLoader(dracoLoader);
  });

  const objResult = useLoader(OBJLoader, url);
  const colladaResult = useLoader(ColladaLoader, url);
  const stlResult = useLoader(STLLoader, url);
  const plyResult = useLoader(PLYLoader, url);

  // FBX 로더 직접 초기화
  useEffect(() => {
    if (modelType === 'fbx' && url) {
      const loader = new FBXLoader();
      loader.load(
        url,
        (object) => {
          setFbxModel(object);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('FBX 로딩 에러:', error);
        }
      );
    }

    // cleanup
    return () => {
      if (fbxModel) {
        fbxModel.traverse((child) => {
          if ((child as any).geometry) {
            (child as any).geometry.dispose();
          }
          if ((child as any).material) {
            (child as any).material.dispose();
          }
        });
      }
    };
  }, [url, modelType]);

  // Select the appropriate loaded model
  const loadedModel = (() => {
    try {
      switch (modelType) {
        case 'glb':
        case 'gltf':
          return gltfResult?.scene;
        case 'obj':
          return objResult;
        case 'fbx':
          return fbxModel;
        case 'dae':
          return colladaResult?.scene;
        case 'stl': {
          if (!stlResult) return null;
          const material = new MeshStandardMaterial({ color: 0xcccccc });
          const mesh = new Mesh(stlResult, material);
          const group = new Group();
          group.add(mesh);
          return group;
        }
        case 'ply': {
          if (!plyResult) return null;
          const material = new MeshStandardMaterial({ color: 0xcccccc });
          const mesh = new Mesh(plyResult, material);
          const group = new Group();
          group.add(mesh);
          return group;
        }
        default:
          console.error('Unsupported file type:', type);
          return null;
      }
    } catch (error) {
      console.error('모델 로딩 중 오류 발생:', error);
      return null;
    }
  })();

  useEffect(() => {
    if (loadedModel) {
      loadedModel.position.set(0, 0, 0); // 모델의 위치를 (0, 0, 0)으로 설정

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
