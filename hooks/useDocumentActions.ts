'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

export function useDocumentActions() {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const getDocuments = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/documents`)

      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch documents'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit'
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not allowed. Allowed: images, PDF, Word, Excel, text'
    }
    return null
  }

  const uploadDocument = async (
    familyId: string,
    file: File,
    description?: string
  ) => {
    setLoading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${familyId}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('family-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Create document record in database
      const response = await fetch(`/api/families/${familyId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          filePath: filePath,
          fileType: file.type,
          fileSize: file.size,
          description: description || '',
        }),
      })

      if (!response.ok) {
        // Rollback storage upload if DB fails
        await supabase.storage.from('family-documents').remove([filePath])
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create document record')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      setError(message)
      return null
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const deleteDocument = async (familyId: string, documentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/families/${familyId}/documents/${documentId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete document')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const downloadDocument = async (familyId: string, documentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/families/${familyId}/documents/${documentId}`
      )

      if (!response.ok) {
        throw new Error('Failed to get download URL')
      }

      const result = await response.json()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download document'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    return '📎'
  }

  return {
    getDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    formatFileSize,
    getFileIcon,
    loading,
    uploadProgress,
    error,
    MAX_FILE_SIZE,
    ALLOWED_TYPES,
  }
}
