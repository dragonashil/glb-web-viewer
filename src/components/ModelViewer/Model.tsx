import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ColladaLoader, Collada } from 'three/examples/jsm/loaders/ColladaLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Group, Mesh, MeshStandardMaterial, Scene, BufferGeometry } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { HierarchyNode, ModelLoader } from '../../types';

interface ModelProps {
  url: string;
  type: string;
  onHierarchyUpdate?: (hierarchy: HierarchyNode) => void;
}

export const Model: React.FC<ModelProps> = ({ url, type, onHierarchyUpdate }) => {
  const modelRef = useRef<Group>(null);
  const [fbxModel, setFbxModel] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const modelType = type.toLowerCase();

  // GLTF 로더 초기화
  const gltfResult = useGLTF(url);

  // 다른 로더들 초기화
  const objResult = useLoader(OBJLoader, url, undefined, (err) => {
    setError('OBJ 파일을 로드하는 중 오류가 발생했습니다.');
    console.error('OBJ 로딩 에러:', err);
  });
  const colladaResult = useLoader(ColladaLoader, url, undefined, (err) => {
    setError('DAE 파일을 로드하는 중 오류가 발생했습니다.');
    console.error('DAE 로딩 에러:', err);
  });
  const stlResult = useLoader(STLLoader, url, undefined, (err) => {
    setError('STL 파일을 로드하는 중 오류가 발생했습니다.');
    console.error('STL 로딩 에러:', err);
  });
  const plyResult = useLoader(PLYLoader, url, undefined, (err) => {
    setError('PLY 파일을 로드하는 중 오류가 발생했습니다.');
    console.error('PLY 로딩 에러:', err);
  });

  // FBX 로더 직접 초기화
  useEffect(() => {
    if (modelType === 'fbx' && url) {
      const loader = new FBXLoader();
      loader.load(
        url,
        (object: Group) => {
          setFbxModel(object);
        },
        undefined,
        (err) => {
          setError('FBX 파일을 로드하는 중 오류가 발생했습니다.');
          console.error('FBX 로딩 에러:', err);
        }
      );
    }
  }, [url, modelType]);

  // Select the appropriate loaded model
  const loadedModel = (() => {
    switch (modelType) {
      case 'glb':
      case 'gltf':
        return gltfResult.scene;
      case 'obj':
        return objResult;
      case 'fbx':
        return fbxModel;
      case 'dae':
        return colladaResult.scene;
      case 'stl': {
        const material = new MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new Mesh(stlResult, material);
        const group = new Group();
        group.add(mesh);
        return group;
      }
      case 'ply': {
        const material = new MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new Mesh(plyResult, material);
        const group = new Group();
        group.add(mesh);
        return group;
      }
      default:
        console.error('지원되지 않는 파일 형식:', type);
        return null;
    }
  })();

  useEffect(() => {
    if (loadedModel && modelRef.current) {
      // 기존 자식 요소들을 제거
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      // 새로운 모델 추가
      if (loadedModel instanceof Scene) {
        loadedModel.children.forEach((child) => {
          modelRef.current?.add(child.clone());
        });
      } else {
        modelRef.current.add(loadedModel);
      }
    }
  }, [loadedModel]);

  useEffect(() => {
    const loader = getLoaderByType(type);
    loader.load(
      url,
      (result: GLTF | Group | Collada | BufferGeometry) => {
        let processedResult: Group | GLTF;

        if (result instanceof BufferGeometry) {
          // STL, PLY 파일의 경우
          const material = new MeshStandardMaterial({ color: 0xcccccc });
          const mesh = new Mesh(result, material);
          const group = new Group();
          group.add(mesh);
          processedResult = group;
        } else if ('animations' in result && 'scenes' in result) {
          // GLTF 파일의 경우
          processedResult = result as GLTF;
        } else if ('scene' in result && result instanceof Object) {
          // Collada 파일의 경우
          const colladaResult = result as Collada;
          if (colladaResult.scene instanceof Group) {
            processedResult = colladaResult.scene;
          } else {
            const group = new Group();
            group.add(colladaResult.scene);
            processedResult = group;
          }
        } else if (result instanceof Group) {
          // Group인 경우 (OBJ, FBX)
          processedResult = result;
        } else {
          console.error('지원되지 않는 모델 형식:', result);
          return;
        }

        const hierarchy = analyzeModelHierarchy(processedResult);
        onHierarchyUpdate?.(hierarchy);
      },
      undefined,
      (error) => {
        console.error('모델 로딩 에러:', error);
      }
    );
  }, [url, type, onHierarchyUpdate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!loadedModel) return null;

  return <group ref={modelRef} />;
};

function analyzeModelHierarchy(model: GLTF | Group): HierarchyNode {
  const processNode = (object: any): HierarchyNode => {
    const node: HierarchyNode = {
      name: object.name || 'Unnamed',
      type: getNodeType(object),
      children: []
    };

    if (object.children && object.children.length > 0) {
      node.children = object.children.map((child: any) => processNode(child));
    }

    return node;
  };

  // GLTF의 경우 scene 속을 사용
  const rootObject = 'scene' in model ? model.scene : model;
  return processNode(rootObject);
}

function getNodeType(object: any): string {
  if (object.isMesh) return 'Mesh';
  if (object.isGroup) return 'Group';
  if (object.isLight) return 'Light';
  if (object.isCamera) return 'Camera';
  return 'Object';
}

function getLoaderByType(type: string): ModelLoader {
  switch (type.toLowerCase()) {
    case 'glb':
    case 'gltf':
      return new GLTFLoader();
    case 'obj':
      return new OBJLoader();
    case 'fbx':
      return new FBXLoader();
    case 'dae':
      return new ColladaLoader();
    case 'stl':
      return new STLLoader();
    case 'ply':
      return new PLYLoader();
    default:
      throw new Error(`지원되지 않는 파일 형식: ${type}`);
  }
}
