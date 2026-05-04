import crypto from 'crypto';

/**
 * Service to handle git-like version control for resumes.
 * Allows users to commit changes, view diffs, and rollback to previous states.
 */
class VersionControlService {
  constructor() {
    // In a real database, this would be a Model (e.g., ResumeVersion)
    // Structure: { resumeId: [ { commitId, timestamp, snapshot, message } ] }
    this.storage = new Map(); 
  }

  /**
   * Commits a new snapshot of the resume
   */
  commit(resumeId, snapshot, message = 'Update resume') {
    const commitId = crypto.randomBytes(8).toString('hex');
    const version = {
      commitId,
      timestamp: new Date().toISOString(),
      message,
      snapshot: JSON.parse(JSON.stringify(snapshot)) // deep copy
    };

    if (!this.storage.has(resumeId)) {
      this.storage.set(resumeId, []);
    }
    this.storage.get(resumeId).push(version);
    
    return version;
  }

  /**
   * Gets the history timeline of a resume
   */
  getHistory(resumeId) {
    const history = this.storage.get(resumeId) || [];
    return history.map(({ commitId, timestamp, message }) => ({
      commitId, timestamp, message
    })).reverse(); // Latest first
  }

  /**
   * Rolls back a resume to a specific commit ID
   */
  rollback(resumeId, commitId) {
    const history = this.storage.get(resumeId) || [];
    const targetVersion = history.find(v => v.commitId === commitId);
    
    if (!targetVersion) {
      throw new Error('Commit not found');
    }

    // Creating a new commit for the rollback
    return this.commit(
      resumeId, 
      targetVersion.snapshot, 
      `Revert to commit ${commitId}`
    );
  }

  /**
   * Gets a specific snapshot
   */
  getSnapshot(resumeId, commitId) {
    const history = this.storage.get(resumeId) || [];
    const targetVersion = history.find(v => v.commitId === commitId);
    return targetVersion ? targetVersion.snapshot : null;
  }
}

export default new VersionControlService();
