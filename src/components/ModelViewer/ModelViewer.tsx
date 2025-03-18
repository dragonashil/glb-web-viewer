import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model';
import { STLModel } from './STLModel';
import { ModelInfo, HierarchyNode, LightPreset, EnvironmentPreset } from '../../types';
import { Lights } from './Lights';
import './ModelViewer.css';

interface ModelViewerProps {
  selectedModel: ModelInfo | null;
  environmentPreset: EnvironmentPreset;
  lightPreset: LightPreset;
  showEnvironment: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  selectedModel,
  environmentPreset,
  lightPreset,
  showEnvironment
}) => {
  const [, setModelHierarchy] = useState<HierarchyNode | null>(null);

  const handleHierarchyUpdate = (hierarchy: HierarchyNode) => {
    setModelHierarchy(hierarchy);
    const event = new CustomEvent('modelHierarchyUpdate', {
      detail: hierarchy
    });
    window.dispatchEvent(event);
  };

  // 선택된 모델이 없을 때 하이라키 정보 초기화
  useEffect(() => {
    if (!selectedModel) {
      setModelHierarchy(null);
      // 하이라키 초기화 이벤트 발송
      const event = new CustomEvent('modelHierarchyUpdate', {
        detail: null
      });
      window.dispatchEvent(event);
    }
  }, [selectedModel]);

  const getBackgroundColor = () => {
    if (showEnvironment) return '#000';
    const [color1, color2] = lightPreset.gradient;
    const direction = lightPreset.gradientDirection;

    if (direction === 'circle') {
      return `radial-gradient(circle, ${color1}, ${color2})`;
    }

    if (direction === 'custom') {
      return `linear-gradient(${lightPreset.gradientAngle}deg, ${color1}, ${color2})`;
    }

    // 기본 방향 (to right, to bottom, to bottom right 등)
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  };

  return (
    <div
      className="model-viewer"
      style={{
        background: getBackgroundColor(),
        position: 'relative'  // Canvas가 배경 위에 올바르게 표시되도록
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 3, 10], fov: 50 }}
        style={{ background: 'transparent' }}  // Canvas 배경을 투명하게
      >
        <OrbitControls />
        {showEnvironment && (
          <Environment
            preset={environmentPreset}
            background
            blur={0}
            resolution={2048}
          />
        )}
        <Lights preset={lightPreset} />
        {selectedModel && (
          selectedModel.type.toLowerCase() === 'stl' ? (
            <STLModel
              key={`stl-${selectedModel.url}`}
              url={selectedModel.url}
              onHierarchyUpdate={handleHierarchyUpdate}
            />
          ) : (
            <Model
              key={`model-${selectedModel.url}-${selectedModel.type}`}
              url={selectedModel.url}
              type={selectedModel.type}
              onHierarchyUpdate={handleHierarchyUpdate}
            />
          )
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
