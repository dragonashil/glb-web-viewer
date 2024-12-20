import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { LightPreset } from '../../../types';
import { lightPresets, generateRandomPreset } from './lightPresets';
import './LightSettings.css';

interface LightSettingsProps {
  selectedPreset: LightPreset;
  onPresetChange: (preset: LightPreset) => void;
  showEnvironment: boolean;
  onShowEnvironmentChange: (show: boolean) => void;
  environmentPreset: string;
}

const LightSettings: React.FC<LightSettingsProps> = ({
  selectedPreset,
  onPresetChange,
  showEnvironment,
  onShowEnvironmentChange,
  environmentPreset
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="light-settings">
      <div className="light-header">
        <h3>Light Presets</h3>
        <button className="info-button" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      <div className="environment-toggle">
        <label className="toggle-label">
          Environment Map ({environmentPreset})
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={showEnvironment}
              onChange={(e) => onShowEnvironmentChange(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </label>
      </div>

      <div className="light-items">
        {lightPresets.map((preset) => (
          <div
            key={preset.name}
            className={`light-item ${selectedPreset.name === preset.name ? 'selected' : ''}`}
            onClick={() => onPresetChange(preset)}
            style={{
              background: `linear-gradient(to right, ${preset.gradient[0]}, ${preset.gradient[1]})`
            }}
            data-preset={preset.name.toLowerCase().replace(/\s+/g, '-')}>
            <span>{preset.name}</span>
          </div>
        ))}
        <div
          className={`light-item ${selectedPreset.name === 'Random Mix' ? 'selected' : ''}`}
          onClick={() => {
            const newPreset = generateRandomPreset();
            onPresetChange(newPreset);
            setShowInfo(true);
          }}
          data-preset="random"
          style={{
            background: 'linear-gradient(to right, var(--accent-color), var(--primary-color))'
          }}>
          <span>Random Mix</span>
        </div>
      </div>

      {showInfo && (
        <div className="light-info-section">
          <h4>Light Information - {selectedPreset.name}</h4>
          <p className="preset-description">{selectedPreset.description}</p>

          <div className="light-info">
            <h5>Directional Light</h5>
            <p>Color: {selectedPreset.directionalLight.color}</p>
            <p>Intensity: {selectedPreset.directionalLight.intensity}</p>
            <p>Position: [{selectedPreset.directionalLight.position.join(', ')}]</p>
          </div>

          <div className="light-info">
            <h5>Hemisphere Light</h5>
            <p>Sky Color: {selectedPreset.hemisphereLight.skyColor}</p>
            <p>Ground Color: {selectedPreset.hemisphereLight.groundColor}</p>
            <p>Intensity: {selectedPreset.hemisphereLight.intensity}</p>
          </div>

          <div className="light-info">
            <h5>Spotlights</h5>
            {selectedPreset.spotlights.map((light, index) => (
              <div key={index} className="spotlight-info">
                <p>Spotlight {index + 1}</p>
                <p>Color: {light.color}</p>
                <p>Intensity: {light.intensity}</p>
                <p>Position: [{light.position.join(', ')}]</p>
              </div>
            ))}
          </div>

          <div className="light-info">
            <h5>Ambient Light</h5>
            <p>Color: {selectedPreset.ambientLight.color}</p>
            <p>Intensity: {selectedPreset.ambientLight.intensity}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightSettings;
