import React, { useMemo } from 'react';
import diff_match_patch from 'diff-match-patch';

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

/**
 * A component that visually compares two text strings and highlights insertions and deletions.
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({ oldText, newText }) => {
  const diffs = useMemo(() => {
    const dmp = new diff_match_patch();
    const differences = dmp.diff_main(oldText || '', newText || '');
    dmp.diff_cleanupSemantic(differences);
    return differences;
  }, [oldText, newText]);

  return (
    <div className="font-mono text-sm p-4 bg-gray-50 rounded-md whitespace-pre-wrap break-words border overflow-auto max-h-96">
      {diffs.map((diff, index) => {
        const [operation, text] = diff;

        // diff_match_patch operations: -1 = Delete, 1 = Insert, 0 = Equal
        if (operation === 1) {
          return (
            <span key={index} className="bg-green-200 text-green-900 px-1 rounded mx-0.5">
              {text}
            </span>
          );
        }
        
        if (operation === -1) {
          return (
            <span key={index} className="bg-red-200 text-red-900 line-through px-1 rounded mx-0.5">
              {text}
            </span>
          );
        }
        
        // Equal text
        return <span key={index} className="text-gray-700">{text}</span>;
      })}
    </div>
  );
};
