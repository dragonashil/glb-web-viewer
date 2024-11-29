import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, AccumulativeShadows, RandomizedLight, Center, Stage } from '@react-three/drei';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import './App.css';

interface ModelInfo {
  name: string;
  url: string;
}

type EnvironmentPresetName = 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';

interface EnvironmentPreset {
  name: string;
  value: EnvironmentPresetName;
  intensity: number;
  height?: number;
  radius?: number;
  blur?: number;
}

const environments: EnvironmentPreset[] = [
  { name: 'Sunset', value: 'sunset', intensity: 1, height: 10, radius: 40, blur: 0.2 },
  { name: 'Dawn', value: 'dawn', intensity: 0.8, height: 15, radius: 50, blur: 0.3 },
  { name: 'Night', value: 'night', intensity: 0.5, height: 8, radius: 30, blur: 0.4 },
  { name: 'Warehouse', value: 'warehouse', intensity: 1.2, height: 12, radius: 35, blur: 0.1 },
  { name: 'Forest', value: 'forest', intensity: 0.7, height: 20, radius: 60, blur: 0.2 },
  { name: 'Apartment', value: 'apartment', intensity: 1, height: 10, radius: 40, blur: 0.2 },
  { name: 'Studio', value: 'studio', intensity: 1.3, height: 8, radius: 30, blur: 0.1 },
  { name: 'City', value: 'city', intensity: 1.1, height: 15, radius: 50, blur: 0.3 },
  { name: 'Park', value: 'park', intensity: 0.9, height: 18, radius: 55, blur: 0.2 },
  { name: 'Lobby', value: 'lobby', intensity: 1.2, height: 10, radius: 40, blur: 0.15 }
];

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function Shadows() {
  return (
    <AccumulativeShadows
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      position={[0, -0.5, 0]}
    >
      <RandomizedLight
        amount={8}
        radius={5}
        intensity={0.5}
        ambient={0.5}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.5}
        ambient={0.5}
        position={[-5, 5, -10]}
      />
    </AccumulativeShadows>
  );
}

function App() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentPreset>(environments[0]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setModels(prev => [...prev, { name: file.name, url }]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
    },
  });

  return (
    <div className="App">
      <div className="model-list">
        <h2>Models</h2>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faFileUpload} size="2x" />
          <p>Drop GLB files here or click to select</p>
        </div>
        <div className="model-items">
          {models.map((model, index) => (
            <div
              key={index}
              className={`model-item ${selectedModel?.url === model.url ? 'selected' : ''}`}
              onClick={() => setSelectedModel(model)}
            >
              {model.name}
            </div>
          ))}
        </div>
      </div>

      <div className="viewer">
        {selectedModel ? (
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
            <color attach="background" args={['#1a1a1a']} />
            <Suspense fallback={null}>
              <Stage
                intensity={environment.intensity}
                shadows={{ type: 'contact', opacity: 0.2, blur: 3 }}
                environment={environment.value as EnvironmentPresetName}
              >
                <Model url={selectedModel.url} />
              </Stage>
              <Environment
                preset={environment.value}
                background
                blur={environment.blur}
              />
            </Suspense>
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
          </Canvas>
        ) : (
          <div className="drop-overlay">
            <FontAwesomeIcon icon={faFileUpload} className="upload-icon-large" />
            <p>Select a model to view</p>
            <FontAwesomeIcon icon={faArrowDown} className="arrow-icon" />
          </div>
        )}
      </div>

      <div className="environment-list">
        <h2>Environment</h2>
        <div className="environment-items">
          {environments.map((env) => (
            <div
              key={env.value}
              className={`environment-item ${environment.value === env.value ? 'selected' : ''}`}
              onClick={() => setEnvironment(env)}
            >
              {env.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
