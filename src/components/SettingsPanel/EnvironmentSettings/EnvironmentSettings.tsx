import React from 'react';
import './EnvironmentSettings.css';

interface EnvironmentSettingsProps {
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
}

interface EnvironmentPreset {
  name: string;
  description: string;
}

const environmentPresets: EnvironmentPreset[] = [
  { name: 'sunset', description: 'Warm evening lighting with orange and purple hues' },
  { name: 'dawn', description: 'Soft morning light with gentle blue tones' },
  { name: 'warehouse', description: 'Industrial indoor lighting with ambient occlusion' },
  { name: 'forest', description: 'Natural lighting filtered through trees' },
  { name: 'apartment', description: 'Modern interior lighting with soft shadows' },
  { name: 'studio', description: 'Clean, professional studio lighting setup' },
  { name: 'city', description: 'Urban environment with building reflections' },
  { name: 'park', description: 'Open outdoor lighting with natural ambiance' },
  { name: 'lobby', description: 'Elegant indoor lighting with marble reflections' },
  { name: 'night', description: 'Dark environment with moonlight and stars' }
];

const EnvironmentSettings: React.FC<EnvironmentSettingsProps> = ({
  selectedPreset,
  onPresetChange
}) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="environment-settings">
      <div className="environment-header">
        <h3>Environment Presets</h3>
      </div>
      <div className="preset-grid">
        {environmentPresets.map((preset) => (
          <div
            key={preset.name}
            className={`preset-item ${selectedPreset === preset.name ? 'selected' : ''}`}
            onClick={() => onPresetChange(preset.name)}
          >
            <h4>{capitalizeFirstLetter(preset.name)}</h4>
            <p>{preset.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentSettings;
