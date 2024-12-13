import React from 'react';
import { EnvironmentPreset } from '../../../types';
import './EnvironmentSettings.css';

interface EnvironmentSettingsProps {
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
}

const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  { name: 'Sunset', value: 'sunset', description: 'Warm evening lighting' },
  { name: 'Dawn', value: 'dawn', description: 'Early morning atmosphere' },
  { name: 'Night', value: 'night', description: 'Dark night environment' },
  { name: 'Warehouse', value: 'warehouse', description: 'Indoor industrial setting' },
  { name: 'Forest', value: 'forest', description: 'Natural forest lighting' },
  { name: 'Apartment', value: 'apartment', description: 'Indoor residential lighting' },
  { name: 'Studio', value: 'studio', description: 'Professional studio setup' },
  { name: 'City', value: 'city', description: 'Urban environment' },
  { name: 'Park', value: 'park', description: 'Outdoor park setting' },
  { name: 'Lobby', value: 'lobby', description: 'Indoor lobby atmosphere' }
];

const EnvironmentSettings: React.FC<EnvironmentSettingsProps> = ({
  selectedPreset,
  onPresetChange
}) => {
  return (
    <div className="environment-settings">
      <h3>Environment Presets</h3>
      <div className="environment-items">
        {ENVIRONMENT_PRESETS.map((preset) => (
          <div
            key={preset.value}
            className={`environment-item ${selectedPreset === preset.value ? 'selected' : ''}`}
            onClick={() => onPresetChange(preset.value)}
          >
            <span>{preset.name}</span>
            {preset.description && (
              <small>{preset.description}</small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentSettings;
