import React, { useState, useCallback } from 'react';
import ModelViewer from './components/ModelViewer/ModelViewer';
import ModelList from './components/ModelList/ModelList';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import { ModelInfo, LightPreset } from './types';
import { defaultLightPreset } from './components/SettingsPanel/LightSettings/lightPresets';
import './styles/variables.css';
import './App.css';

const App: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [environmentPreset, setEnvironmentPreset] = useState('sunset');
  const [selectedLightPreset, setSelectedLightPreset] = useState<LightPreset>(defaultLightPreset);
  const [showEnvironment, setShowEnvironment] = useState(true);

  const handleModelSelect = useCallback((model: ModelInfo) => {
    setSelectedModel(model);
  }, []);

  const handleModelsAdd = useCallback((newModels: ModelInfo[]) => {
    const modelsWithNames = newModels.map((model, index) => ({
      ...model,
      name: model.name || `Model ${models.length + index + 1}`
    }));
    setModels(prevModels => [...prevModels, ...modelsWithNames]);
    if (!selectedModel && modelsWithNames.length > 0) {
      setSelectedModel(modelsWithNames[0]);
    }
  }, [models, selectedModel]);

  const handleModelDelete = useCallback((modelToDelete: ModelInfo) => {
    if (selectedModel?.url === modelToDelete.url) {
      setSelectedModel(null);
    }
    setModels(prevModels => prevModels.filter(model => model.url !== modelToDelete.url));
    URL.revokeObjectURL(modelToDelete.url);
  }, [selectedModel]);

  return (
    <div className="app">
      <div className="left-sidebar">
        <ModelList
          models={models}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
          onModelsAdd={handleModelsAdd}
          onModelDelete={handleModelDelete}
        />
      </div>
      <ModelViewer
        selectedModel={selectedModel}
        environmentPreset={environmentPreset}
        lightPreset={selectedLightPreset}
        showEnvironment={showEnvironment}
      />
      <div className="right-sidebar">
        <SettingsPanel
          environmentPreset={environmentPreset}
          onEnvironmentChange={setEnvironmentPreset}
          selectedLightPreset={selectedLightPreset}
          onLightPresetChange={setSelectedLightPreset}
          showEnvironment={showEnvironment}
          onShowEnvironmentChange={setShowEnvironment}
        />
      </div>
    </div>
  );
};

export default App;