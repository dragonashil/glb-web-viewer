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
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
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
            {environmentPreset === 'sunset' && (
              <>
                <directionalLight position={[-3, 3, -3]} intensity={1.5} color="#ff7e33" />
                <ambientLight intensity={0.2} color="#ffd4b8" />
                <fog attach="fog" args={['#ff7e33', 0, 100]} />
              </>
            )}
            {environmentPreset === 'dawn' && (
              <>
                <directionalLight position={[3, 3, 3]} intensity={1.2} color="#ffecd3" />
                <ambientLight intensity={0.4} color="#b4d4ff" />
                <fog attach="fog" args={['#b4d4ff', 0, 100]} />
              </>
            )}
            {environmentPreset === 'warehouse' && (
              <>
                <pointLight position={[0, 5, 0]} intensity={0.8} />
                <pointLight position={[-5, 5, -5]} intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={0.5} />
                <ambientLight intensity={0.2} />
              </>
            )}
            {environmentPreset === 'forest' && (
              <>
                <directionalLight position={[2, 5, -2]} intensity={0.8} color="#91f291" />
                <ambientLight intensity={0.3} color="#385438" />
                <fog attach="fog" args={['#385438', 5, 30]} />
              </>
            )}
            {environmentPreset === 'apartment' && (
              <>
                <pointLight position={[3, 3, 3]} intensity={0.7} />
                <pointLight position={[-3, 3, -3]} intensity={0.7} />
                <ambientLight intensity={0.4} />
              </>
            )}
            {environmentPreset === 'studio' && (
              <>
                <spotLight position={[5, 5, 5]} intensity={0.8} angle={Math.PI / 4} />
                <spotLight position={[-5, 5, -5]} intensity={0.8} angle={Math.PI / 4} />
                <ambientLight intensity={0.3} />
              </>
            )}
            {environmentPreset === 'city' && (
              <>
                <directionalLight position={[0, 5, -5]} intensity={1.2} />
                <pointLight position={[5, 3, 5]} intensity={0.6} color="#ffd700" />
                <pointLight position={[-5, 3, -5]} intensity={0.6} color="#00ffff" />
                <ambientLight intensity={0.2} />
                <fog attach="fog" args={['#232323', 10, 50]} />
              </>
            )}
            {environmentPreset === 'park' && (
              <>
                <directionalLight position={[3, 5, 3]} intensity={1.2} color="#fff5e6" />
                <ambientLight intensity={0.4} color="#a8e6cf" />
                <fog attach="fog" args={['#a8e6cf', 1, 100]} />
              </>
            )}
            {environmentPreset === 'lobby' && (
              <>
                <spotLight position={[0, 10, 0]} intensity={1} angle={Math.PI / 3} />
                <pointLight position={[5, 3, 5]} intensity={0.5} />
                <pointLight position={[-5, 3, -5]} intensity={0.5} />
                <ambientLight intensity={0.3} />
              </>
            )}
            {environmentPreset === 'night' && (
              <>
                <directionalLight position={[0, 5, 0]} intensity={0.1} color="#4169e1" />
                <pointLight position={[3, 3, 3]} intensity={0.2} color="#f0f8ff" />
                <pointLight position={[-3, 3, -3]} intensity={0.2} color="#f0f8ff" />
                <ambientLight intensity={0.1} color="#191970" />
                <fog attach="fog" args={['#191970', 1, 30]} />
              </>
            )}
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
