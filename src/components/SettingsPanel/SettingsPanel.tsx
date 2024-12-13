import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faImage } from '@fortawesome/free-solid-svg-icons';
import { LightPreset } from '../../types';
import LightSettings from './LightSettings/LightSettings';
import EnvironmentSettings from './EnvironmentSettings/EnvironmentSettings';
import './SettingsPanel.css';

interface SettingsPanelProps {
  environmentPreset: string;
  onEnvironmentChange: (preset: string) => void;
  selectedLightPreset: LightPreset;
  onLightPresetChange: (preset: LightPreset) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  environmentPreset,
  onEnvironmentChange,
  selectedLightPreset,
  onLightPresetChange
}) => {
  const [activeTab, setActiveTab] = useState<'light' | 'environment'>('light');

  return (
    <div className="settings-panel">
      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'light' ? 'active' : ''}`}
          onClick={() => setActiveTab('light')}
        >
          <FontAwesomeIcon icon={faLightbulb} />
          Light
        </button>
        <button
          className={`tab-button ${activeTab === 'environment' ? 'active' : ''}`}
          onClick={() => setActiveTab('environment')}
        >
          <FontAwesomeIcon icon={faImage} />
          Environment
        </button>
      </div>

      {activeTab === 'light' ? (
        <LightSettings
          selectedPreset={selectedLightPreset}
          onPresetChange={onLightPresetChange}
        />
      ) : (
        <EnvironmentSettings
          selectedPreset={environmentPreset}
          onPresetChange={onEnvironmentChange}
        />
      )}
    </div>
  );
};

export default SettingsPanel;
