import React, { Suspense, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Center } from '@react-three/drei';

interface ModelProps {
  url: string;
  type?: string;
}

const GLTFModel: React.FC<ModelProps> = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  
  useEffect(() => {
    console.log('GLTF Model loaded:', {
      animations: gltf.animations.length,
      scenes: gltf.scenes.length,
      materials: Object.keys(gltf.materials || {}).length
    });
  }, [gltf]);

  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
};

const OBJModel: React.FC<ModelProps> = ({ url }) => {
  const obj = useLoader(OBJLoader, url);

  useEffect(() => {
    console.log('OBJ Model loaded:', {
      children: obj.children.length,
      type: obj.type
    });
  }, [obj]);

  return (
    <Center>
      <primitive object={obj} />
    </Center>
  );
};

const FBXModel: React.FC<ModelProps> = ({ url }) => {
  const fbx = useLoader(FBXLoader, url);

  useEffect(() => {
    console.log('FBX Model loaded:', {
      children: fbx.children.length,
      animations: fbx.animations.length,
      type: fbx.type
    });
  }, [fbx]);

  return (
    <Center>
      <primitive object={fbx} scale={0.01} />
    </Center>
  );
};

export const Model: React.FC<ModelProps> = ({ url, type }) => {
  useEffect(() => {
    console.log('Attempting to load model:', {
      url,
      type
    });
  }, [url, type]);

  let ModelComponent: React.FC<ModelProps>;
  switch (type) {
    case 'glb':
    case 'gltf':
      ModelComponent = GLTFModel;
      break;
    case 'obj':
      ModelComponent = OBJModel;
      break;
    case 'fbx':
      ModelComponent = FBXModel;
      break;
    default:
      console.error('Unsupported file type:', type);
      return null;
  }

  return (
    <Suspense fallback={null}>
      <ModelComponent url={url} />
    </Suspense>
  );
};
