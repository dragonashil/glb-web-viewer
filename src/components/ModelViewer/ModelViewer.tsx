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
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  selectedModel,
  environmentPreset,
  lightPreset
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

  return (
    <div className="model-viewer">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={['#000']} />
        {selectedModel ? (
          <>
            <Model url={selectedModel.url} type={selectedModel.type} />
            <OrbitControls makeDefault />
            <Environment preset={environmentPreset as any} background />
            <directionalLight 
              position={[
                lightPreset.directionalLight.position[0],
                lightPreset.directionalLight.position[1],
                lightPreset.directionalLight.position[2]
              ]} 
              intensity={lightPreset.directionalLight.intensity}
              color={lightPreset.directionalLight.color}
              castShadow
            />
            <hemisphereLight
              intensity={lightPreset.hemisphereLight.intensity}
              color={lightPreset.hemisphereLight.skyColor}
              groundColor={lightPreset.hemisphereLight.groundColor}
            />
            {lightPreset.spotlights.map((spotlight, index) => (
              <spotLight
                key={index}
                position={[
                  spotlight.position[0],
                  spotlight.position[1],
                  spotlight.position[2]
                ]}
                intensity={spotlight.intensity}
                color={spotlight.color}
                castShadow
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
