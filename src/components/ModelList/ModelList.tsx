import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { ModelInfo } from '../../types';
import './ModelList.css';

interface ModelListProps {
  models: ModelInfo[];
  selectedModel: ModelInfo | null;
  onModelSelect: (model: ModelInfo) => void;
  onModelsAdd: (newModels: ModelInfo[]) => void;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  selectedModel,
  onModelSelect,
  onModelsAdd
}) => {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newModels = acceptedFiles.map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      return {
        url: URL.createObjectURL(file),
        type: extension,
        name: file.name
      };
    });
    console.log('New models:', newModels);
    onModelsAdd(newModels);
  }, [onModelsAdd]);

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
    <div className="model-list">
      <h2>Models</h2>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
        <p>Drop 3D models here or click to select</p>
        <small>Supported: GLB, GLTF, OBJ, FBX</small>
      </div>
      <div className="model-items">
        {models.map((model, index) => (
          <div
            key={index}
            className={`model-item ${selectedModel === model ? 'selected' : ''}`}
            onClick={() => onModelSelect(model)}
          >
            <span>{model.name}</span>
            <small>{model.type.toUpperCase()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelList;
