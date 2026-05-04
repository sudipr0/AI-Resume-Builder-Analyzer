import NodeClam from 'clamscan';

/**
 * Service to scan uploaded PDFs for malware/viruses before parsing.
 * Requires ClamAV daemon to be running on the host/container.
 */
class PdfScanner {
  constructor() {
    this.clamscan = null;
    this.init();
  }

  async init() {
    try {
      this.clamscan = await new NodeClam().init({
        removeInfected: true, // Auto remove file
        quarantineInfected: false,
        scanLog: '/var/log/clamav/scan.log',
        debugMode: false,
        fileList: null,
        scanRecursively: true,
        clamdscan: {
          host: process.env.CLAMAV_HOST || '127.0.0.1',
          port: process.env.CLAMAV_PORT || 3310,
          timeout: 60000,
          localFallback: false,
          multiscan: true,
          reloadDb: false,
          active: true,
          bypassTest: false,
        },
      });
      console.log('ClamAV Scanner Initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize ClamAV:', err.message);
      // Fail open in dev, but should fail closed in production
    }
  }

  /**
   * Scans a file path for viruses
   */
  async scanFile(filePath) {
    if (!this.clamscan) {
      console.warn('ClamAV not initialized. Bypassing scan.');
      return { isInfected: false, viruses: [] };
    }

    try {
      const { isInfected, viruses } = await this.clamscan.isInfected(filePath);
      if (isInfected) {
        console.error(`[SECURITY] Malware detected in file ${filePath}: ${viruses.join(', ')}`);
      }
      return { isInfected, viruses };
    } catch (err) {
      console.error('Error scanning file:', err);
      throw err;
    }
  }
}

export default new PdfScanner();
