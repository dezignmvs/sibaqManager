// ====================================================
// Cloudinary Configuration & Uploader for Sibaq
// ====================================================

const savedCloud = localStorage.getItem('cloudinary_cloud_name');
const savedPreset = localStorage.getItem('cloudinary_upload_preset');

const CLOUDINARY_CONFIG = {
  cloudName: (savedCloud && savedCloud !== 'sibaq-cloud') ? savedCloud : 'da6fjyirm',
  uploadPreset: (savedPreset && savedPreset !== 'sibaq_preset') ? savedPreset : 'sibaq_tracking'
};

window.SibaqCloudinary = {
  config: CLOUDINARY_CONFIG,

  setCredentials(cloudName, uploadPreset) {
    if (cloudName) {
      CLOUDINARY_CONFIG.cloudName = cloudName;
      localStorage.setItem('cloudinary_cloud_name', cloudName);
    }
    if (uploadPreset) {
      CLOUDINARY_CONFIG.uploadPreset = uploadPreset;
      localStorage.setItem('cloudinary_upload_preset', uploadPreset);
    }
  },

  /**
   * Upload an image or file to Cloudinary via unsigned upload
   * @param {File|Blob} file File to upload
   * @param {string} [folder='sibaq_uploads'] Destination folder in Cloudinary
   * @returns {Promise<{url: string, publicId: string, secureUrl: string}>}
   */
  async uploadFile(file, folder = 'sibaq_uploads') {
    const cloudName = CLOUDINARY_CONFIG.cloudName;
    const uploadPreset = CLOUDINARY_CONFIG.uploadPreset;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary cloudName and uploadPreset must be configured.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder); 
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return {
        url: data.secure_url || data.url,
        secureUrl: data.secure_url,
        secure_url: data.secure_url,
        publicId: data.public_id,
        public_id: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  }
};
