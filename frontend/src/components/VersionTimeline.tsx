import React from 'react';

interface Commit {
  commitId: string;
  timestamp: string;
  message: string;
}

interface VersionTimelineProps {
  history: Commit[];
  onRevert: (commitId: string) => void;
  onViewDiff: (commitId: string) => void;
}

/**
 * Git-like timeline visualization of document history.
 */
export const VersionTimeline: React.FC<VersionTimelineProps> = ({ history, onRevert, onViewDiff }) => {
  if (!history || history.length === 0) {
    return <div className="p-4 text-gray-500 text-sm">No version history yet.</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-semibold text-lg border-b pb-2">Version History</h3>
      
      <div className="relative border-l-2 border-blue-200 ml-3 pl-4 space-y-6">
        {history.map((commit, index) => (
          <div key={commit.commitId} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[23px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{commit.message}</span>
              <span className="text-xs text-gray-500">
                {new Date(commit.timestamp).toLocaleString()} • {commit.commitId.substring(0, 7)}
              </span>
              
              <div className="flex space-x-3 mt-2">
                <button 
                  onClick={() => onViewDiff(commit.commitId)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Changes
                </button>
                {index !== 0 && ( // Don't revert to current
                  <button 
                    onClick={() => onRevert(commit.commitId)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Restore this version
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
