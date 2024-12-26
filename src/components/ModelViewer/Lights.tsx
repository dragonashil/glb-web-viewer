import React from 'react';
import { LightPreset } from '../../types';

interface LightsProps {
    preset: LightPreset;
}

export const Lights: React.FC<LightsProps> = ({ preset }) => {
    return (
        <>
            <directionalLight
                position={preset.directionalLight.position}
                intensity={preset.directionalLight.intensity}
                color={preset.directionalLight.color}
            />
            <hemisphereLight
                color={preset.hemisphereLight.skyColor}
                groundColor={preset.hemisphereLight.groundColor}
                intensity={preset.hemisphereLight.intensity}
            />
            {preset.spotlights.map((spotlight, index) => (
                <spotLight
                    key={index}
                    position={spotlight.position}
                    intensity={spotlight.intensity}
                    color={spotlight.color}
                />
            ))}
            <ambientLight
                intensity={preset.ambientLight.intensity}
                color={preset.ambientLight.color}
            />
        </>
    );
}; 