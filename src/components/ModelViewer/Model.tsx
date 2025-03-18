import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Group, Mesh, MeshStandardMaterial, Scene, Object3D } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { HierarchyNode } from '../../types';

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
  const objResult = useLoader(
    OBJLoader,
    url,
    undefined,
    (err) => {
      setError('OBJ 파일을 로드하는 중 오류가 발생했습니다.');
      console.error('OBJ 로딩 에러:', err);
    }
  );
  
  const colladaResult = useLoader(
    ColladaLoader,
    url,
    undefined,
    (err) => {
      setError('DAE 파일을 로드하는 중 오류가 발생했습니다.');
      console.error('DAE 로딩 에러:', err);
    }
  );
  
  const plyResult = useLoader(
    PLYLoader,
    url,
    undefined,
    (err) => {
      setError('PLY 파일을 로드하는 중 오류가 발생했습니다.');
      console.error('PLY 로딩 에러:', err);
    }
  );

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

  // 로드된 모델 선택
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

  // 모델 적용 및 계층 구조 업데이트
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
      
      // 계층 구조 업데이트
      const hierarchy = analyzeModelHierarchy(loadedModel);
      if (onHierarchyUpdate) {
        onHierarchyUpdate(hierarchy);
      }
    }
  }, [loadedModel, onHierarchyUpdate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!loadedModel) return null;

  return <group ref={modelRef} />;
};

function analyzeModelHierarchy(model: GLTF | Group | Scene): HierarchyNode {
  const processNode = (object: Object3D): HierarchyNode => {
    const node: HierarchyNode = {
      name: object.name || 'Unnamed',
      type: getNodeType(object),
      children: []
    };

    if (object.children && object.children.length > 0) {
      node.children = object.children.map((child) => processNode(child));
    }

    return node;
  };

  // GLTF의 경우 scene 속성을 사용
  const rootObject = 'scene' in model ? model.scene : model;
  return processNode(rootObject);
}

function getNodeType(object: Object3D): string {
  if ('isMesh' in object && object.isMesh) return 'Mesh';
  if ('isGroup' in object && object.isGroup) return 'Group';
  if ('isLight' in object && object.isLight) return 'Light';
  if ('isCamera' in object && object.isCamera) return 'Camera';
  return 'Object';
}


