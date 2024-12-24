import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Model } from './Model';
import { ModelInfo, LightPreset } from '../../types';
import './ModelViewer.css';

interface ModelViewerProps {
  selectedModel: ModelInfo | null;
  environmentPreset: string;
  lightPreset: LightPreset;
  showEnvironment: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  selectedModel,
  environmentPreset,
  lightPreset,
  showEnvironment
}) => {
  useEffect(() => {
    if (selectedModel) {
      console.log('Selected Model:', {
        url: selectedModel.url,
        type: selectedModel.type,
        name: selectedModel.name
      });
    }
  }, [selectedModel]);

  const getBackgroundColor = () => {
    if (showEnvironment) return '#000';
    const gradient = lightPreset.gradient;
    return gradient[0];
  };

  return (
    <div className="model-viewer">
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 50 }}>
        <color attach="background" args={[getBackgroundColor()]} />
        {selectedModel ? (
          <>
            <Model url={selectedModel.url} type={selectedModel.type} />
            <OrbitControls makeDefault />
            {showEnvironment && (
              <Environment
                preset={environmentPreset as any}
                background
                blur={0}
                resolution={2048}
              />
            )}
            <directionalLight
              position={lightPreset.directionalLight.position}
              intensity={lightPreset.directionalLight.intensity}
              color={lightPreset.directionalLight.color}
            />
            <hemisphereLight
              color={lightPreset.hemisphereLight.skyColor}
              groundColor={lightPreset.hemisphereLight.groundColor}
              intensity={lightPreset.hemisphereLight.intensity}
            />
            {lightPreset.spotlights.map((spotlight, index) => (
              <spotLight
                key={index}
                position={spotlight.position}
                intensity={spotlight.intensity}
                color={spotlight.color}
              />
            ))}
            <ambientLight
              intensity={lightPreset.ambientLight.intensity}
              color={lightPreset.ambientLight.color}
            />
          </>
        ) : (
          <Html center>
            <div className="no-model-message">
              No model selected
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
