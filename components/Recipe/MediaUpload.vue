<script setup lang="ts">
import { ref, reactive } from 'vue'
import { configureMediaUpload } from '@/composables/actions/media.actions'

const emit = defineEmits<{
  'upload-success': [urls: string[]]
}>()

const toast = useToast()

// Upload configuration
const uploadConfig = reactive({
  endpoint: '',
  headers: {} as Record<string, string>,
  maxFileSize: 5, // MB
  maxFiles: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  isConfigured: false,
})

// File selection state
const selectedFiles = ref<File[]>([])
const uploading = ref(false)
const progress = ref(0)
const showConfigForm = ref(false)

// Handle file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    // Filter out files that exceed max size or are not allowed types
    const files = Array.from(input.files)
    const validFiles: File[] = []
    const invalidFiles: { file: File; reason: string }[] = []

    files.forEach((file) => {
      // Check file size (convert MB to bytes)
      if (file.size > uploadConfig.maxFileSize * 1024 * 1024) {
        invalidFiles.push({
          file,
          reason: `File exceeds maximum size of ${uploadConfig.maxFileSize}MB`,
        })
        return
      }

      // Check file type
      if (!uploadConfig.allowedTypes.includes(file.type)) {
        invalidFiles.push({
          file,
          reason: 'File type not allowed',
        })
        return
      }

      validFiles.push(file)
    })

    // Display errors for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, reason }) => {
        toast.add({
          title: 'Invalid File',
          description: `${file.name}: ${reason}`,
          color: 'error',
          icon: 'i-heroicons-exclamation-triangle',
        })
      })
    }

    // Add valid files to selection
    if (validFiles.length > 0) {
      if (
        selectedFiles.value.length + validFiles.length >
        uploadConfig.maxFiles
      ) {
        toast.add({
          title: 'Too Many Files',
          description: `You can upload a maximum of ${uploadConfig.maxFiles} files`,
          color: 'error',
          icon: 'i-heroicons-exclamation-triangle',
        })

        // Only add files up to the maximum
        const availableSlots =
          uploadConfig.maxFiles - selectedFiles.value.length
        selectedFiles.value = [
          ...selectedFiles.value,
          ...validFiles.slice(0, availableSlots),
        ]
      } else {
        selectedFiles.value = [...selectedFiles.value, ...validFiles]
      }
    }

    // Reset input
    input.value = ''
  }
}

// Remove file from selection
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// Configure endpoint
const configureEndpoint = () => {
  try {
    if (!uploadConfig.endpoint) {
      toast.add({
        title: 'Configuration Error',
        description: 'Upload endpoint is required',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
      return
    }

    // Call the configuration function
    configureMediaUpload(uploadConfig.endpoint, uploadConfig.headers)
    uploadConfig.isConfigured = true
    showConfigForm.value = false

    toast.add({
      title: 'Configuration Success',
      description: 'Upload endpoint configured successfully',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    toast.add({
      title: 'Configuration Error',
      description:
        error instanceof Error
          ? error.message
          : 'Failed to configure upload endpoint',
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  }
}

// Upload files
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    toast.add({
      title: 'Upload Error',
      description: 'No files selected',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  if (!uploadConfig.isConfigured) {
    toast.add({
      title: 'Configuration Required',
      description: 'Please configure the upload endpoint first',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
    showConfigForm.value = true
    return
  }

  try {
    uploading.value = true
    progress.value = 0

    // In a real application, we would actually upload the files here
    // For this mock implementation, we'll simulate a network request

    // Simulate upload progress
    const totalSteps = 10
    const interval = setInterval(() => {
      progress.value += 100 / totalSteps
      if (progress.value >= 100) {
        clearInterval(interval)
        completeUpload()
      }
    }, 300)

    // This function would be called after the actual upload
    const completeUpload = () => {
      // Generate mock URLs for the uploaded files
      const mockUrls = selectedFiles.value.map((file, index) => {
        // Create URLs for the files (in a real app, these would come from the server)
        return `https://example.com/uploads/${Date.now()}-${index}-${file.name}`
      })

      // Emit success event with the URLs
      emit('upload-success', mockUrls)

      // Reset state
      selectedFiles.value = []
      uploading.value = false
      progress.value = 0

      toast.add({
        title: 'Upload Complete',
        description: `Successfully uploaded ${mockUrls.length} files`,
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    }
  } catch (error) {
    uploading.value = false
    progress.value = 0

    toast.add({
      title: 'Upload Error',
      description:
        error instanceof Error ? error.message : 'Failed to upload files',
      color: 'success',
      icon: 'i-heroicons-x-circle',
    })
  }
}

// Add custom header
const newHeader = reactive({ key: '', value: '' })
const addHeader = () => {
  if (newHeader.key && newHeader.value) {
    uploadConfig.headers[newHeader.key] = newHeader.value
    newHeader.key = ''
    newHeader.value = ''
  }
}

// Remove header
const removeHeader = (key: string) => {
  if (uploadConfig.headers[key]) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete uploadConfig.headers[key]
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Configuration Button -->
    <div class="flex justify-end">
      <UButton
        type="button"
        color="neutral"
        variant="soft"
        icon="i-heroicons-cog-6-tooth"
        @click="showConfigForm = !showConfigForm"
      >
        {{
          uploadConfig.isConfigured ? 'Reconfigure Upload' : 'Configure Upload'
        }}
      </UButton>
    </div>

    <!-- Configuration Form -->
    <UCard v-if="showConfigForm" class="p-4">
      <h3 class="text-lg font-semibold mb-4">Configure Upload Settings</h3>

      <div class="space-y-4 grid grid-cols-1 md:grid-cols-2">
        <UFormField label="Upload Endpoint" required class="md:col-span-2">
          <UInput
            v-model="uploadConfig.endpoint"
            placeholder="https://example.com/api/upload"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Custom Headers" class="md:col-span-2">
          <div class="space-y-2">
            <div
              v-for="(value, key) in uploadConfig.headers"
              :key="key"
              class="flex items-center"
            >
              <div class="flex-grow grid grid-cols-2 gap-2">
                <UInput :model-value="key" readonly placeholder="Header key" />
                <UInput
                  :model-value="value"
                  readonly
                  placeholder="Header value"
                />
              </div>
              <UButton
                type="button"
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                class="ml-2"
                @click="removeHeader(key)"
              />
            </div>

            <div class="flex items-center">
              <div class="flex-grow grid grid-cols-2 gap-2">
                <UInput v-model="newHeader.key" placeholder="Header key" />
                <UInput v-model="newHeader.value" placeholder="Header value" />
              </div>
              <UButton
                type="button"
                color="success"
                variant="soft"
                icon="i-heroicons-plus"
                class="ml-2"
                @click="addHeader"
              />
            </div>
          </div>
        </UFormField>

        <UFormField label="Maximum File Size (MB)">
          <UInput
            v-model.number="uploadConfig.maxFileSize"
            type="number"
            min="1"
            max="20"
          />
        </UFormField>

        <UFormField label="Maximum Files">
          <UInput
            v-model.number="uploadConfig.maxFiles"
            type="number"
            min="1"
            max="20"
          />
        </UFormField>

        <div class="flex justify-end space-x-2 col-span-2">
          <UButton
            type="button"
            color="neutral"
            variant="soft"
            @click="showConfigForm = false"
          >
            Cancel
          </UButton>
          <UButton type="button" color="info" @click="configureEndpoint">
            Save Configuration
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- File Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      :class="{ 'border-blue-500 bg-blue-50': selectedFiles.length > 0 }"
    >
      <div v-if="selectedFiles.length === 0">
        <div class="text-gray-500">
          <div class="flex justify-center">
            <UIcon name="i-heroicons-photo" class="h-12 w-12" />
          </div>
          <p class="mt-2 text-sm font-semibold">
            Drag and drop your images here, or click to select files
          </p>
          <p class="mt-1 text-xs">
            Supported formats: JPG, PNG, WebP, GIF
            <br >Maximum file size: {{ uploadConfig.maxFileSize }}MB
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          class="absolute inset-0 opacity-0 cursor-pointer mt-10"
          :class="showConfigForm ? 'mt-[430px]' : 'mt-[40px]'"
          :style="`height: calc(100% - ${showConfigForm ? 430 : 40}px)`"
          @change="handleFileSelect"
        >
      </div>

      <div v-else class="space-y-4">
        <h3 class="text-lg font-semibold">Selected Files</h3>

        <div class="space-y-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center p-2 bg-white rounded-lg shadow-sm"
          >
            <div class="flex-grow flex items-center">
              <UIcon name="i-heroicons-photo" class="mr-2 text-blue-500" />
              <div>
                <p class="text-sm font-medium truncate" :title="file.name">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                </p>
              </div>
            </div>
            <UButton
              type="button"
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="removeFile(index)"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <UButton
            type="button"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
          >
            <label class="cursor-pointer">
              Add More Files
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              >
            </label>
          </UButton>

          <UButton
            type="button"
            color="info"
            icon="i-heroicons-cloud-arrow-up"
            :loading="uploading"
            :disabled="uploading"
            @click="uploadFiles"
          >
            Upload
          </UButton>
        </div>
      </div>
    </div>

    <!-- Upload Progress -->
    <UProgress v-if="uploading" :value="progress" color="info" class="mt-2">
      Uploading: {{ Math.round(progress) }}%
    </UProgress>
  </div>
</template>
