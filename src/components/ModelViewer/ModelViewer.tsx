import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model';
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
  const [modelHierarchy, setModelHierarchy] = useState<HierarchyNode | null>(null);

  const handleHierarchyUpdate = (hierarchy: HierarchyNode) => {
    setModelHierarchy(hierarchy);
    const event = new CustomEvent('modelHierarchyUpdate', {
      detail: hierarchy
    });
    window.dispatchEvent(event);
  };

  const getBackgroundColor = () => {
    if (showEnvironment) return '#000';
    const gradient = lightPreset.gradient;
    return gradient[0];
  };

  return (
    <div className="model-viewer">
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 50 }}>
        <color attach="background" args={[getBackgroundColor()]} />
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
          <Model
            url={selectedModel.url}
            type={selectedModel.type}
            onHierarchyUpdate={handleHierarchyUpdate}
          />
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
