import React, { useState } from 'react';
import ModelList from './components/ModelList/ModelList';
import ModelViewer from './components/ModelViewer/ModelViewer';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import { ModelInfo, LightPreset } from './types';
import './styles/variables.css';
import './App.css';

const DEFAULT_LIGHT_PRESET: LightPreset = {
  name: "Natural Day",
  description: "Soft, natural daylight illumination",
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
  ambientLight: { 
    intensity: 0.6, 
    color: "#FFFFFF" 
  }
};

function App() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [environmentPreset, setEnvironmentPreset] = useState('sunset');
  const [lightPreset, setLightPreset] = useState<LightPreset>(DEFAULT_LIGHT_PRESET);

  const handleModelsAdd = (newModels: ModelInfo[]) => {
    const modelsWithNames = newModels.map((model, index) => ({
      ...model,
      name: model.name || `Model ${models.length + index + 1}`
    }));
    setModels([...models, ...modelsWithNames]);
    if (!selectedModel && modelsWithNames.length > 0) {
      setSelectedModel(modelsWithNames[0]);
    }
  };

  const handleModelSelect = (model: ModelInfo) => {
    setSelectedModel(model);
  };

  return (
    <div className="app">
      <ModelList
        models={models}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        onModelsAdd={handleModelsAdd}
      />
      <ModelViewer
        selectedModel={selectedModel}
        environmentPreset={environmentPreset}
        lightPreset={lightPreset}
      />
      <SettingsPanel
        environmentPreset={environmentPreset}
        onEnvironmentChange={setEnvironmentPreset}
        selectedLightPreset={lightPreset}
        onLightPresetChange={setLightPreset}
      />
    </div>
  );
}

export default App;