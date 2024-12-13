import React, { useState } from 'react';
import { LightPreset } from '../../../types';
import './LightSettings.css';

interface LightSettingsProps {
  selectedPreset: LightPreset;
  onPresetChange: (preset: LightPreset) => void;
}

const LIGHT_PRESETS: LightPreset[] = [
  {
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
  },
  {
    name: "Neon Night",
    description: "Vibrant neon lighting for dramatic effect",
    gradient: ["#FF1493", "#00FFFF"],
    intensity: 1.2,
    directionalLight: {
      position: [0, 10, 0],
      color: "#FF1493",
      intensity: 2.0
    },
    hemisphereLight: {
      skyColor: "#FF1493",
      groundColor: "#00FFFF",
      intensity: 1.0
    },
    spotlights: [
      { position: [5, 5, 5], color: "#FF1493", intensity: 1.0 },
      { position: [-5, 5, -5], color: "#00FFFF", intensity: 1.0 }
    ],
    ambientLight: {
      intensity: 0.4,
      color: "#FF69B4"
    }
  },
  {
    name: "Cyberpunk",
    description: "Futuristic cyberpunk-style lighting",
    gradient: ["#00FF9F", "#FF00FF"],
    intensity: 1.5,
    directionalLight: {
      position: [3, 15, 3],
      color: "#00FF9F",
      intensity: 2.5
    },
    hemisphereLight: {
      skyColor: "#00FF9F",
      groundColor: "#FF00FF",
      intensity: 1.2
    },
    spotlights: [
      { position: [8, 8, 8], color: "#00FF9F", intensity: 1.2 },
      { position: [-8, 8, -8], color: "#FF00FF", intensity: 1.2 }
    ],
    ambientLight: {
      intensity: 0.5,
      color: "#00FF9F"
    }
  }
];

const LightSettings: React.FC<LightSettingsProps> = ({
  selectedPreset,
  onPresetChange
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

      <div className="light-items">
        {LIGHT_PRESETS.map((preset) => (
          <div
            key={preset.name}
            className={`light-item ${selectedPreset.name === preset.name ? 'selected' : ''}`}
            onClick={() => onPresetChange(preset)}
            data-preset={preset.name.toLowerCase().replace(' ', '-')}
          >
            <span>{preset.name}</span>
          </div>
        ))}
      </div>

      {showInfo && selectedPreset && (
        <div className="light-info-section">
          <h4>Light Configuration</h4>
          <div className="light-info">
            <h5>Directional Light</h5>
            <p>Position: [{selectedPreset.directionalLight.position.join(', ')}]</p>
            <p>Color: {selectedPreset.directionalLight.color}</p>
            <p>Intensity: {selectedPreset.directionalLight.intensity}</p>
          </div>
          <div className="light-info">
            <h5>Hemisphere Light</h5>
            <p>Sky Color: {selectedPreset.hemisphereLight.skyColor}</p>
            <p>Ground Color: {selectedPreset.hemisphereLight.groundColor}</p>
            <p>Intensity: {selectedPreset.hemisphereLight.intensity}</p>
          </div>
          <div className="light-info">
            <h5>Spotlights</h5>
            {selectedPreset.spotlights.map((spotlight, index) => (
              <div key={index}>
                <p>Position: [{spotlight.position.join(', ')}]</p>
                <p>Color: {spotlight.color}</p>
                <p>Intensity: {spotlight.intensity}</p>
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
