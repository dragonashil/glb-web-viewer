import { LightPreset } from '../../../types';

export const defaultLightPreset: LightPreset = {
  name: "Environment Only",
  description: "Use only environment lighting",
  gradient: ["#000000", "#000000"],
  intensity: 0,
  directionalLight: {
    position: [0, 0, 0],
    color: "#000000",
    intensity: 0
  },
  hemisphereLight: {
    skyColor: "#000000",
    groundColor: "#000000",
    intensity: 0
  },
  spotlights: [],
  ambientLight: {
    intensity: 0,
    color: "#000000"
  }
};

export const lightPresets: LightPreset[] = [
  defaultLightPreset,
  {
    name: "Natural Day",
    description: "Soft, natural daylight illumination with warm undertones",
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
    description: "Vibrant cyberpunk-inspired lighting with neon accents",
    gradient: ["#20202A", "#2D3047"],
    intensity: 1.3,
    directionalLight: {
      position: [0, 15, 2],
      color: "#FF1493",
      intensity: 2.0
    },
    hemisphereLight: {
      skyColor: "#FF1493",
      groundColor: "#00FFFF",
      intensity: 1.2
    },
    spotlights: [
      { position: [5, 5, 0], color: "#FF00FF", intensity: 1.2 },
      { position: [-5, 5, 0], color: "#00FFFF", intensity: 1.2 },
      { position: [0, 5, 5], color: "#FF1493", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.4, color: "#2A2A3A" }
  },
  {
    name: "Cyberpunk",
    description: "High-contrast futuristic lighting with bold colors",
    gradient: ["#0B0B2C", "#2E0B45"],
    intensity: 1.4,
    directionalLight: {
      position: [3, 15, 2],
      color: "#00FF9F",
      intensity: 2.5
    },
    hemisphereLight: {
      skyColor: "#00FF9F",
      groundColor: "#FF00FF",
      intensity: 1.3
    },
    spotlights: [
      { position: [5, 8, 5], color: "#00FF9F", intensity: 1.5 },
      { position: [-5, 5, -5], color: "#FF00FF", intensity: 1.2 },
      { position: [0, 3, -3], color: "#00FFFF", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.5, color: "#2A0B45" }
  },
  {
    name: "Sunset Warmth",
    description: "Warm, golden hour lighting with soft shadows",
    gradient: ["#FF7F50", "#FFD700"],
    intensity: 1.2,
    directionalLight: {
      position: [-3, 10, -2],
      color: "#FFA07A",
      intensity: 2.2
    },
    hemisphereLight: {
      skyColor: "#FF7F50",
      groundColor: "#8B4513",
      intensity: 1.4
    },
    spotlights: [
      { position: [3, 6, 3], color: "#FFD700", intensity: 1.3 },
      { position: [-4, 4, -4], color: "#FFA07A", intensity: 1.1 }
    ],
    ambientLight: { intensity: 0.7, color: "#CD853F" }
  },
  {
    name: "Arctic Aurora",
    description: "Cool, ethereal lighting inspired by the northern lights",
    gradient: ["#000B3B", "#003366"],
    intensity: 1.1,
    directionalLight: {
      position: [0, 12, 0],
      color: "#80FFD4",
      intensity: 1.8
    },
    hemisphereLight: {
      skyColor: "#80FFD4",
      groundColor: "#4B0082",
      intensity: 1.6
    },
    spotlights: [
      { position: [4, 7, 4], color: "#7DF9FF", intensity: 1.4 },
      { position: [-4, 6, -4], color: "#E0FFFF", intensity: 1.2 },
      { position: [0, 8, 0], color: "#98FF98", intensity: 1.0 }
    ],
    ambientLight: { intensity: 0.3, color: "#191970" }
  },
  {
    name: "Studio Perfect",
    description: "Professional studio lighting setup for clear presentation",
    gradient: ["#2C3E50", "#34495E"],
    intensity: 1.5,
    directionalLight: {
      position: [2, 18, 4],
      color: "#F5F5F5",
      intensity: 3.5
    },
    hemisphereLight: {
      skyColor: "#E0E0E0",
      groundColor: "#A0A0A0",
      intensity: 1.8
    },
    spotlights: [
      { position: [6, 10, 6], color: "#FFFFFF", intensity: 1.6 },
      { position: [-6, 8, -6], color: "#F0F0F0", intensity: 1.4 },
      { position: [0, 12, -8], color: "#FAFAFA", intensity: 1.2 }
    ],
    ambientLight: { intensity: 0.8, color: "#D3D3D3" }
  },
  {
    name: "Mystic Forest",
    description: "Ethereal forest lighting with mystical green hues",
    gradient: ["#1B4F3C", "#2E8B57"],
    intensity: 1.2,
    directionalLight: {
      position: [1, 16, 3],
      color: "#98FB98",
      intensity: 2.0
    },
    hemisphereLight: {
      skyColor: "#98FB98",
      groundColor: "#006400",
      intensity: 1.5
    },
    spotlights: [
      { position: [5, 9, 5], color: "#90EE90", intensity: 1.3 },
      { position: [-5, 7, -5], color: "#7CCD7C", intensity: 1.1 },
      { position: [0, 6, 0], color: "#00FF7F", intensity: 0.9 }
    ],
    ambientLight: { intensity: 0.5, color: "#2F4F4F" }
  },
  {
    name: "Desert Sun",
    description: "Harsh, bright lighting typical of desert environments",
    gradient: ["#FFB74D", "#FFE0B2"],
    intensity: 1.6,
    directionalLight: {
      position: [0, 20, -2],
      color: "#FFFFFF",
      intensity: 4.0
    },
    hemisphereLight: {
      skyColor: "#FFB74D",
      groundColor: "#FFE0B2",
      intensity: 2.0
    },
    spotlights: [
      { position: [8, 12, 8], color: "#FFFFFF", intensity: 1.8 },
      { position: [-8, 10, -8], color: "#FFF8E1", intensity: 1.6 }
    ],
    ambientLight: { intensity: 1.0, color: "#FFE0B2" }
  },
  {
    name: "Horror Scene",
    description: "Dark and eerie lighting for horror effects",
    gradient: ["#1A1A1A", "#2C1810"],
    intensity: 0.8,
    directionalLight: {
      position: [-2, 8, -4],
      color: "#8B0000",
      intensity: 1.5
    },
    hemisphereLight: {
      skyColor: "#2C1810",
      groundColor: "#1A1A1A",
      intensity: 0.6
    },
    spotlights: [
      { position: [3, 5, 3], color: "#8B0000", intensity: 0.8 },
      { position: [-3, 4, -3], color: "#800000", intensity: 0.7 },
      { position: [0, 6, -5], color: "#A52A2A", intensity: 0.6 }
    ],
    ambientLight: { intensity: 0.3, color: "#2C1810" }
  },
  {
    name: "Underwater",
    description: "Soft, diffused lighting with aquatic color tones",
    gradient: ["#006994", "#00BFFF"],
    intensity: 0.9,
    directionalLight: {
      position: [0, 15, 5],
      color: "#00BFFF",
      intensity: 1.8
    },
    hemisphereLight: {
      skyColor: "#00BFFF",
      groundColor: "#006994",
      intensity: 1.2
    },
    spotlights: [
      { position: [5, 8, 5], color: "#87CEEB", intensity: 1.0 },
      { position: [-5, 6, -5], color: "#B0E0E6", intensity: 0.9 },
      { position: [0, 10, 0], color: "#00CED1", intensity: 0.8 }
    ],
    ambientLight: { intensity: 0.4, color: "#006994" }
  }
];

export const generateRandomPreset = (): LightPreset => {
  const generateRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  const generateRandomPosition = () => [
    Math.random() * 20 - 10,
    Math.random() * 20 + 5,
    Math.random() * 20 - 10
  ] as [number, number, number];

  return {
    name: "Random Mix",
    description: "Randomly generated lighting configuration",
    gradient: [generateRandomColor(), generateRandomColor()],
    intensity: Math.random() * 2 + 0.5,
    directionalLight: {
      position: generateRandomPosition(),
      color: generateRandomColor(),
      intensity: Math.random() * 3 + 0.5
    },
    hemisphereLight: {
      skyColor: generateRandomColor(),
      groundColor: generateRandomColor(),
      intensity: Math.random() * 1.5 + 0.5
    },
    spotlights: Array(3).fill(null).map(() => ({
      position: generateRandomPosition(),
      color: generateRandomColor(),
      intensity: Math.random() * 1.5 + 0.5
    })),
    ambientLight: {
      intensity: Math.random() * 0.5 + 0.2,
      color: generateRandomColor()
    }
  };
};
