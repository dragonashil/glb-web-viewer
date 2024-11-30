import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, SpotLight, Center } from '@react-three/drei';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faArrowDown, faSun, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import './App.css';

interface ModelInfo {
  url: string;
  type: string;
}

interface LightPreset {
  name: string;
  gradient: string[];
  intensity: number;
  directionalLight: {
    position: [number, number, number];
    color: string;
    intensity: number;
  };
  hemisphereLight: {
    skyColor: string;
    groundColor: string;
    intensity: number;
  };
  spotlights: {
    position: [number, number, number];
    color: string;
    intensity: number;
  }[];
  ambientLight: {
    intensity: number;
    color: string;
  };
}

const lightPresets: LightPreset[] = [
  {
    name: "Natural Day",
    gradient: ["#87CEEB", "#E0F7FA"],
    intensity: 1.0,
    directionalLight: {
      position: [5, 20, 2],
      color: "#FFFFFF",
      intensity: 3.0
    },
    hemisphereLight: {
      skyColor: "#87CEEB",
      groundColor: "#E0F7FA",
      intensity: 1.5
    },
    spotlights: [
      { position: [10, 10, 10], color: "#FFFFFF", intensity: 0.8 },
      { position: [-5, 8, -5], color: "#FFF8E1", intensity: 0.6 }
    ],
    ambientLight: { intensity: 0.6, color: "#FFFFFF" }
  },
  {
    name: "Neon Night",
    gradient: ["#20202A", "#2D3047"],
    intensity: 1.3,
    directionalLight: {
      position: [0, 15, 2],
      color: "#FF1493",
      intensity: 2.0
    },
    hemisphereLight: {
      skyColor: "#FF1493",
      groundColor: "#00FFFF",
      intensity: 1.2
    },
    spotlights: [
      { position: [5, 5, 0], color: "#FF00FF", intensity: 1.2 },
      { position: [-5, 5, 0], color: "#00FFFF", intensity: 1.2 },
      { position: [0, 5, 5], color: "#FF1493", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.4, color: "#2A2A3A" }
  },
  {
    name: "Cyberpunk",
    gradient: ["#0B0B2C", "#2E0B45"],
    intensity: 1.4,
    directionalLight: {
      position: [3, 15, 2],
      color: "#00FF9F",
      intensity: 2.5
    },
    hemisphereLight: {
      skyColor: "#00FF9F",
      groundColor: "#FF00FF",
      intensity: 1.3
    },
    spotlights: [
      { position: [5, 8, 5], color: "#00FF9F", intensity: 1.5 },
      { position: [-5, 5, -5], color: "#FF00FF", intensity: 1.2 },
      { position: [0, 3, -3], color: "#00FFFF", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.5, color: "#2A0B45" }
  },
  {
    name: "Sunset Warmth",
    gradient: ["#FF7F50", "#FFD700"],
    intensity: 1.2,
    directionalLight: {
      position: [-3, 10, -2],
      color: "#FFA07A",
      intensity: 2.2
    },
    hemisphereLight: {
      skyColor: "#FF7F50",
      groundColor: "#8B4513",
      intensity: 1.4
    },
    spotlights: [
      { position: [3, 6, 3], color: "#FFD700", intensity: 1.3 },
      { position: [-4, 4, -4], color: "#FFA07A", intensity: 1.1 }
    ],
    ambientLight: { intensity: 0.7, color: "#CD853F" }
  },
  {
    name: "Arctic Aurora",
    gradient: ["#000B3B", "#003366"],
    intensity: 1.1,
    directionalLight: {
      position: [0, 12, 0],
      color: "#80FFD4",
      intensity: 1.8
    },
    hemisphereLight: {
      skyColor: "#80FFD4",
      groundColor: "#4B0082",
      intensity: 1.6
    },
    spotlights: [
      { position: [4, 7, 4], color: "#7DF9FF", intensity: 1.4 },
      { position: [-4, 6, -4], color: "#E0FFFF", intensity: 1.2 },
      { position: [0, 8, 0], color: "#98FF98", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.3, color: "#191970" }
  },
  {
    name: "Studio Perfect",
    gradient: ["#2C3E50", "#34495E"],
    intensity: 1.5,
    directionalLight: {
      position: [2, 18, 4],
      color: "#F5F5F5",
      intensity: 3.5
    },
    hemisphereLight: {
      skyColor: "#E0E0E0",
      groundColor: "#A0A0A0",
      intensity: 1.8
    },
    spotlights: [
      { position: [6, 10, 6], color: "#FFFFFF", intensity: 1.6 },
      { position: [-6, 8, -6], color: "#F0F0F0", intensity: 1.4 },
      { position: [0, 12, -8], color: "#FAFAFA", intensity: 1.2 }
    ],
    ambientLight: { intensity: 0.8, color: "#D3D3D3" }
  },
  {
    name: "Mystic Forest",
    gradient: ["#1B4F3C", "#2E8B57"],
    intensity: 1.2,
    directionalLight: {
      position: [1, 16, 3],
      color: "#98FB98",
      intensity: 2.0
    },
    hemisphereLight: {
      skyColor: "#98FB98",
      groundColor: "#006400",
      intensity: 1.5
    },
    spotlights: [
      { position: [5, 9, 5], color: "#90EE90", intensity: 1.3 },
      { position: [-5, 7, -5], color: "#7CCD7C", intensity: 1.1 },
      { position: [0, 6, 0], color: "#00FF7F", intensity: 0.9 }
    ],
    ambientLight: { intensity: 0.5, color: "#2F4F4F" }
  }
];

const environmentPresets = [
  { value: 'sunset', label: 'Sunset' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'night', label: 'Night' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'forest', label: 'Forest' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'studio', label: 'Studio' },
  { value: 'city', label: 'City' },
  { value: 'park', label: 'Park' },
  { value: 'lobby', label: 'Lobby' }
];

interface Environment {
  value: string;
  blur: number;
  resolution: number;
  height: number;
  radius: number;
}

const defaultEnvironment: Environment = {
  value: 'sunset',
  blur: 0.5,
  resolution: 256,
  height: 15,
  radius: 60
};

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const typeMap: { [key: string]: string } = {
    'glb': 'glb',
    'gltf': 'gltf',
    'obj': 'obj',
    'fbx': 'fbx',
  };
  return typeMap[ext] || 'glb';
}

function Model({ url, type }: { url: string; type: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function GradientBackground({ colors }: { colors: string[] }) {
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide} color={colors[0]} />
    </mesh>
  );
}

function CustomLights({ preset }: { preset: LightPreset }) {
  return (
    <>
      <GradientBackground colors={preset.gradient} />
      <hemisphereLight
        color={preset.hemisphereLight.skyColor}
        groundColor={preset.hemisphereLight.groundColor}
        intensity={preset.hemisphereLight.intensity}
        position={[0, 80, 0]}
      />
      <directionalLight
        position={preset.directionalLight.position}
        intensity={preset.directionalLight.intensity}
        color={preset.directionalLight.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {preset.ambientLight && (
        <ambientLight
          intensity={preset.ambientLight.intensity}
          color={preset.ambientLight.color}
        />
      )}
      {preset.spotlights.map((light, index) => (
        <SpotLight
          key={index}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          distance={20}
          angle={0.6}
          penumbra={0.5}
          castShadow
        />
      ))}
    </>
  );
}

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function generateRandomPreset(): LightPreset {
  return {
    name: "Custom Preset",
    gradient: [generateRandomColor(), generateRandomColor()],
    intensity: Math.random() * 2 + 0.5,
    directionalLight: {
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 + 5,
        Math.random() * 20 - 10
      ],
      color: generateRandomColor(),
      intensity: Math.random() * 3 + 0.5
    },
    hemisphereLight: {
      skyColor: generateRandomColor(),
      groundColor: generateRandomColor(),
      intensity: Math.random() * 1.5 + 0.5
    },
    spotlights: Array(3).fill(null).map(() => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10 + 5,
        Math.random() * 20 - 10
      ],
      color: generateRandomColor(),
      intensity: Math.random() * 1.5 + 0.5
    })),
    ambientLight: {
      intensity: Math.random() * 0.5 + 0.2,
      color: generateRandomColor()
    }
  };
}

interface PresetInfoProps {
  preset: LightPreset;
  setShowPresetInfo: (show: boolean) => void;
}

function PresetInfo({ preset, setShowPresetInfo }: PresetInfoProps) {
  return (
    <div className="preset-info">
      <button className="close-button" onClick={() => setShowPresetInfo(false)}>×</button>
      <h3>{preset.name}</h3>
      <div className="light-info">
        <h4>Directional Light</h4>
        <p>Color: {preset.directionalLight.color}</p>
        <p>Intensity: {preset.directionalLight.intensity}</p>
        <p>Position: [{preset.directionalLight.position.join(', ')}]</p>
      </div>
      <div className="light-info">
        <h4>Hemisphere Light</h4>
        <p>Sky Color: {preset.hemisphereLight.skyColor}</p>
        <p>Ground Color: {preset.hemisphereLight.groundColor}</p>
        <p>Intensity: {preset.hemisphereLight.intensity}</p>
      </div>
      <div className="light-info">
        <h4>Spotlights</h4>
        {preset.spotlights.map((light, index) => (
          <div key={index}>
            <p>Color: {light.color}</p>
            <p>Intensity: {light.intensity}</p>
            <p>Position: [{light.position.join(', ')}]</p>
          </div>
        ))}
      </div>
      <div className="light-info">
        <h4>Ambient Light</h4>
        <p>Color: {preset.ambientLight.color}</p>
        <p>Intensity: {preset.ambientLight.intensity}</p>
      </div>
    </div>
  );
}

function App() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [selectedLight, setSelectedLight] = useState<LightPreset>(lightPresets[0]);
  const [showPresetInfo, setShowPresetInfo] = useState(false);
  const [showEnvironments, setShowEnvironments] = useState(true);
  const [environment, setEnvironment] = useState<Environment>(defaultEnvironment);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newModels = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: getFileType(file.name)
    }));
    setModels(prevModels => [...prevModels, ...newModels]);
    if (!selectedModel) {
      setSelectedModel(newModels[0]);
    }
  }, [selectedModel]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/obj': ['.obj'],
      'model/fbx': ['.fbx']
    }
  });

  return (
    <div className="app">
      <div className="model-list">
        <h2>Models</h2>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
          <p>Drop 3D models here or click to select</p>
        </div>
        <div className="model-items">
          {models.map((model, index) => (
            <div
              key={index}
              className={`model-item ${selectedModel === model ? 'selected' : ''}`}
              onClick={() => setSelectedModel(model)}
            >
              Model {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="viewer">
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
          <Suspense fallback={null}>
            {selectedModel && (
              <>
                {showEnvironments ? (
                  <>
                    <Environment
                      preset={environment.value as any}
                      background
                      blur={environment.blur}
                      resolution={environment.resolution}
                      ground={{
                        height: environment.height,
                        radius: environment.radius
                      }}
                    />
                    <Model url={selectedModel.url} type={selectedModel.type} />
                  </>
                ) : (
                  <>
                    <CustomLights preset={selectedLight} />
                    <Model url={selectedModel.url} type={selectedModel.type} />
                  </>
                )}
                <OrbitControls makeDefault />
              </>
            )}
          </Suspense>
        </Canvas>
        {showPresetInfo && <PresetInfo preset={selectedLight} setShowPresetInfo={setShowPresetInfo} />}
      </div>

      <div className="settings-panel">
        <div className="settings-tabs">
          <button
            className={`tab-button ${showEnvironments ? 'active' : ''}`}
            onClick={() => setShowEnvironments(true)}
          >
            <FontAwesomeIcon icon={faSun} />
            Environment
          </button>
          <button
            className={`tab-button ${!showEnvironments ? 'active' : ''}`}
            onClick={() => setShowEnvironments(false)}
          >
            <FontAwesomeIcon icon={faLightbulb} />
            Light
          </button>
        </div>

        {showEnvironments ? (
          <div className="environment-settings">
            <h3>Environment Settings</h3>
            <div className="resolution-control">
              <label>Resolution:</label>
              <input
                type="range"
                min="256"
                max="2048"
                step="256"
                value={environment.resolution}
                onChange={(e) => {
                  const newResolution = Number(e.target.value);
                  setEnvironment(prev => ({
                    ...prev,
                    resolution: newResolution
                  }));
                }}
              />
              <span>{environment.resolution}px</span>
            </div>
            <div className="size-control">
              <label>Ground Height:</label>
              <input
                type="range"
                min="20"
                max="50"
                step="5"
                value={environment.height}
                onChange={(e) => {
                  const newHeight = Number(e.target.value);
                  setEnvironment(prev => ({
                    ...prev,
                    height: newHeight
                  }));
                }}
              />
              <span>{environment.height}</span>
            </div>
            <div className="radius-control">
              <label>Ground Radius:</label>
              <input
                type="range"
                min="100"
                max="200"
                step="10"
                value={environment.radius}
                onChange={(e) => {
                  const newRadius = Number(e.target.value);
                  setEnvironment(prev => ({
                    ...prev,
                    radius: newRadius
                  }));
                }}
              />
              <span>{environment.radius}</span>
            </div>
            <div className="environment-items">
              {environmentPresets.map((env, index) => (
                <div
                  key={index}
                  className={`environment-item ${environment.value === env.value ? 'selected' : ''}`}
                  onClick={() => setEnvironment({ ...environment, value: env.value })}
                >
                  {env.label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="light-settings">
            <div className="section-header">
              <h3>Light Presets</h3>
              <button
                onClick={() => setShowPresetInfo(!showPresetInfo)}
                className="info-button"
              >
                {!showPresetInfo ? 'ℹ️ Show Info' : 'ℹ️ Hide Info'}
              </button>
            </div>
            <div className="light-items">
              {lightPresets.map((preset, index) => (
                <div
                  key={index}
                  className={`light-item ${selectedLight === preset ? 'selected' : ''}`}
                  onClick={() => setSelectedLight(preset)}
                  style={{
                    background: `linear-gradient(to right, ${preset.gradient[0]}, ${preset.gradient[1]})`
                  }}
                  data-preset={preset.name.toLowerCase().replace(' ', '-')}
                >
                  <span>{preset.name}</span>
                </div>
              ))}
              <div
                className={`light-item ${selectedLight.name === 'Random Mix' ? 'selected' : ''}`}
                onClick={() => {
                  const newPreset = generateRandomPreset();
                  setSelectedLight(newPreset);
                  setShowPresetInfo(true);
                }}
                data-preset="random"
              >
                <span>Random Mix</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
