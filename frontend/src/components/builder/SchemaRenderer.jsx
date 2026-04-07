// src/components/builder/SchemaRenderer.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPONENT_REGISTRY } from './ComponentRegistry';

/**
 * Renders a full builder interface from a JSON schema.
 * Supports props, state, and dynamic section rendering.
 */
const SchemaRenderer = ({ 
  schema, 
  data, 
  onUpdate, 
  activeSectionId, 
  onSectionClick 
}) => {
  if (!schema || !schema.sections) return null;

  return (
    <div className="schema-renderer space-y-6">
      <AnimatePresence mode="wait">
        {schema.sections.map((section) => {
          // If activeSectionId is provided, only render the active section (wizard mode)
          // Otherwise render all (scrolling mode)
          if (activeSectionId && section.id !== activeSectionId && section.type !== activeSectionId) {
             return null;
          }

          const Component = COMPONENT_REGISTRY[section.type];
          if (!Component) {
            console.warn(`[SchemaRenderer] No component found for type: ${section.type}`);
            return null;
          }

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="section-container"
              onClick={() => onSectionClick?.(section.id)}
            >
              <Component
                data={data[section.modelKey] || {}}
                onUpdate={(updates) => onUpdate({ [section.modelKey]: updates })}
                resumeData={data}
                {...section.props}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SchemaRenderer);
