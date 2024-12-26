import React, { useState, useCallback, useEffect } from 'react';
import ModelViewer from './components/ModelViewer/ModelViewer';
import ModelList from './components/ModelList/ModelList';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import { ModelHierarchy } from './components/ModelHierarchy/ModelHierarchy';
import { ModelInfo, LightPreset, EnvironmentPreset } from './types';
import { defaultLightPreset } from './components/SettingsPanel/LightSettings/lightPresets';
import './styles/variables.css';
import './App.css';

const App: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [modelHierarchy, setModelHierarchy] = useState<any>(null);
  const [environmentPreset, setEnvironmentPreset] = useState<EnvironmentPreset>('sunset' as EnvironmentPreset);
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

  const handleEnvironmentChange = (preset: EnvironmentPreset) => {
    setEnvironmentPreset(preset);
  };

  useEffect(() => {
    const handleHierarchyUpdate = (event: any) => {
      setModelHierarchy(event.detail);
    };

    window.addEventListener('modelHierarchyUpdate', handleHierarchyUpdate);
    return () => {
      window.removeEventListener('modelHierarchyUpdate', handleHierarchyUpdate);
    };
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Online GLB & 3D Model Viewer</h1>
        <p>Free browser-based 3D model viewer supporting GLB, GLTF, OBJ, FBX, STL, PLY, and DAE formats</p>
      </header>
      <div className="app-content">
        <div className="left-sidebar">
          <ModelList
            models={models}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
            onModelsAdd={handleModelsAdd}
            onModelDelete={handleModelDelete}
          />
          <ModelHierarchy hierarchy={modelHierarchy} />
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
            onEnvironmentChange={handleEnvironmentChange}
            selectedLightPreset={selectedLightPreset}
            onLightPresetChange={setSelectedLightPreset}
            showEnvironment={showEnvironment}
            onShowEnvironmentChange={setShowEnvironment}
          />
        </div>
      </div>
      <footer>
        <p>Powered by Three.js and React</p>
      </footer>
    </div>
  );
};

export default App;