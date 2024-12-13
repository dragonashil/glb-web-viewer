import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faCube, faCubes } from '@fortawesome/free-solid-svg-icons';
import './ModelHierarchy.css';

interface HierarchyNode {
  name: string;
  type: string;
  children?: HierarchyNode[];
}

interface ModelHierarchyProps {
  hierarchy: HierarchyNode | null;
}

const HierarchyItem: React.FC<{ node: HierarchyNode; depth: number }> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="hierarchy-item" style={{ marginLeft: `${depth * 16}px` }}>
      <div className="hierarchy-item-header">
        {hasChildren ? (
          <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
            <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
          </button>
        ) : (
          <span className="hierarchy-icon">
            <FontAwesomeIcon icon={faCube} />
          </span>
        )}
        <span className="hierarchy-name">{node.name}</span>
        <span className="hierarchy-type">{node.type}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="hierarchy-children">
          {node.children?.map((child, index) => (
            <HierarchyItem key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ModelHierarchy: React.FC<ModelHierarchyProps> = ({ hierarchy }) => {
  if (!hierarchy) {
    return (
      <div className="model-hierarchy">
        <h2>Hierarchy</h2>
        <div className="hierarchy-empty">No model selected</div>
      </div>
    );
  }

  return (
    <div className="model-hierarchy">
      <h2>
        <FontAwesomeIcon icon={faCubes} className="hierarchy-title-icon" />
        Hierarchy
      </h2>
      <div className="hierarchy-content">
        <HierarchyItem node={hierarchy} depth={0} />
      </div>
    </div>
  );
};

export default ModelHierarchy;
