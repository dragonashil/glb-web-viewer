import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { loadSTLFile } from '../../utils/CustomSTLLoader';
import { HierarchyNode } from '../../types';

interface STLModelProps {
  url: string;
  onHierarchyUpdate?: (hierarchy: HierarchyNode) => void;
}

export const STLModel: React.FC<STLModelProps> = ({ url, onHierarchyUpdate }) => {
  const groupRef = useRef<Group>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadedUrlRef = useRef<string | null>(null);
  const isComponentMounted = useRef(true);

  // 계층 구조 업데이트 함수 메모이제이션
  const updateHierarchy = useCallback((group: Group) => {
    const hierarchy = analyzeModelHierarchy(group);
    if (onHierarchyUpdate) {
      onHierarchyUpdate(hierarchy);
    }
  }, [onHierarchyUpdate]);

  useEffect(() => {
    // 컴포넌트 마운트 상태 설정
    isComponentMounted.current = true;
    
    return () => {
      // 컴포넌트 언마운트 시 상태 변경
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!url || loadedUrlRef.current === url) return;
    
    setIsLoading(true);
    setError(null);
    
    // 현재 로드 중인 URL 기록
    loadedUrlRef.current = url;
    
    // AbortController 생성
    const controller = new AbortController();
    
    loadSTLFile(url, controller.signal)
      .then((geometry) => {
        // 컴포넌트가 언마운트되었거나 groupRef가 없으면 중단
        if (!isComponentMounted.current || !groupRef.current) return;
        
        // 기존 자식 요소들을 제거
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
        
        const material = new MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.5,
          metalness: 0.1,
          flatShading: true
        });
        
        const mesh = new Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // 모델 크기 자동 조정
        if (geometry.boundingSphere) {
          const scale = 5 / geometry.boundingSphere.radius;
          mesh.scale.set(scale, scale, scale);
        }
        
        // 모델 위치 설정
        mesh.position.set(0, 0, 0);
        
        // 그룹에 메시 추가
        const group = new Group();
        group.name = 'STL Model';
        group.add(mesh);
        
        // 메인 그룹에 추가
        groupRef.current.add(group);
        
        // 디버깅 정보 출력 (한 번만)
        console.log('STL 모델 로드 완료:', {
          url,
          name: group.name,
          position: group.position.toArray(),
          children: group.children.length,
          boundingSphere: geometry.boundingSphere
        });
        
        // 계층 구조 업데이트
        updateHierarchy(group);
        
        if (isComponentMounted.current) {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // 컴포넌트가 언마운트되었으면 중단
        if (!isComponentMounted.current) return;
        
        if (error.name !== 'AbortError') {
          setError('STL 파일을 로드하는 중 오류가 발생했습니다.');
          console.error('STL 로딩 에러:', error);
        }
        setIsLoading(false);
      });
    
    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      controller.abort();
    };
  }, [url, updateHierarchy]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // 로딩 중에도 빈 그룹을 렌더링
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 로딩 표시기 추가 가능 */}
      {isLoading && (
        <mesh visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

function analyzeModelHierarchy(model: Group): HierarchyNode {
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

  return processNode(model);
}

function getNodeType(object: any): string {
  if (object.isMesh) return 'Mesh';
  if (object.isGroup) return 'Group';
  if (object.isLight) return 'Light';
  if (object.isCamera) return 'Camera';
  return 'Object';
} 