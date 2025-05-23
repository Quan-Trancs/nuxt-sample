/**
 * Media upload configuration and actions
 */

// Global configuration for media uploads
let mediaUploadConfig: {
  endpoint: string
  headers: Record<string, string>
  configured: boolean
} = {
  endpoint: '',
  headers: {},
  configured: false,
}

/**
 * Configure the media upload endpoint and headers
 * @param endpoint The URL endpoint for uploading media
 * @param headers Optional custom headers to include with upload requests
 */
export const configureMediaUpload = (
  endpoint: string,
  headers: Record<string, string> = {}
): void => {
  if (!endpoint) {
    throw new Error('Upload endpoint is required')
  }

  // Validate endpoint URL
  try {
    new URL(endpoint)
  } catch {
    throw new Error('Invalid upload endpoint URL')
  }

  // Set the configuration
  mediaUploadConfig = {
    endpoint,
    headers,
    configured: true,
  }

  console.log('Media upload configured with endpoint:', endpoint)
}

/**
 * Check if media upload is configured
 */
export const isMediaUploadConfigured = (): boolean => {
  return mediaUploadConfig.configured
}

/**
 * Get the current media upload configuration
 */
export const getMediaUploadConfig = (): {
  endpoint: string
  headers: Record<string, string>
} => {
  if (!mediaUploadConfig.configured) {
    throw new Error('Media upload not configured')
  }

  return {
    endpoint: mediaUploadConfig.endpoint,
    headers: mediaUploadConfig.headers,
  }
}

/**
 * Upload a media file
 * This is a mock implementation that would be replaced with actual API calls in production
 *
 * @param file The file to upload
 * @param onProgress Optional callback for upload progress
 */
export const uploadMediaFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!mediaUploadConfig.configured) {
    throw new Error(
      'Media upload not configured. Call configureMediaUpload first.'
    )
  }

  // In a real implementation, this would use fetch or axios to upload the file
  // This is a mock implementation that simulates an upload

  // Simulate upload progress
  const totalSteps = 10
  let currentStep = 0

  const updateProgress = () => {
    currentStep++
    const progress = (currentStep / totalSteps) * 100
    if (onProgress) {
      onProgress(progress)
    }
  }

  // Simulate network request with delays
  return new Promise((resolve, reject) => {
    const progressInterval = setInterval(() => {
      updateProgress()
      if (currentStep >= totalSteps) {
        clearInterval(progressInterval)

        // Generate a mock URL for the uploaded file
        const fileId = Math.random().toString(36).substring(2, 15)
        const mockUrl = `https://example.com/uploads/${fileId}-${file.name}`

        resolve(mockUrl)
      }
    }, 300)

    // Simulate random failures
    if (Math.random() < 0.05) {
      // 5% chance of failure
      clearInterval(progressInterval)
      reject(new Error('Upload failed: Network error'))
    }
  })
}

/**
 * Upload multiple media files
 * @param files Array of files to upload
 * @param onProgress Optional callback for overall upload progress
 */
export const uploadMediaFiles = async (
  files: File[],
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  if (files.length === 0) {
    return []
  }

  const urls: string[] = []
  let completedUploads = 0

  const updateOverallProgress = () => {
    completedUploads++
    const overallProgress = (completedUploads / files.length) * 100
    if (onProgress) {
      onProgress(overallProgress)
    }
  }

  // Upload each file sequentially to avoid overwhelming the server
  for (const file of files) {
    try {
      const url = await uploadMediaFile(file)
      urls.push(url)
      updateOverallProgress()
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error)
      updateOverallProgress()
      // Continue with other files even if one fails
    }
  }

  return urls
}
