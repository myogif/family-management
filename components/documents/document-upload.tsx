'use client'

import { useState, useRef } from 'react'
import { useDocumentActions } from '@/hooks/useDocumentActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'

interface DocumentUploadProps {
  familyId: string
  onSuccess?: () => void
}

export function DocumentUpload({ familyId, onSuccess }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadDocument, formatFileSize, loading, error, MAX_FILE_SIZE, ALLOWED_TYPES } =
    useDocumentActions()

  const handleFileSelect = (file: File | null) => {
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`)
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('File type not allowed')
      return
    }

    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    const result = await uploadDocument(familyId, selectedFile, description)
    if (result?.data) {
      toast.success('Document uploaded successfully')
      setSelectedFile(null)
      setDescription('')
      onSuccess?.()
    } else if (error) {
      toast.error(error)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setDescription('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
            accept={ALLOWED_TYPES.join(',')}
          />
          <div className="text-4xl mb-2">📎</div>
          <p className="text-sm font-medium">
            {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {formatFileSize(MAX_FILE_SIZE)}
          </p>
          <p className="text-xs text-muted-foreground">
            Allowed: Images, PDF, Word, Excel, Text
          </p>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Add notes about this document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="w-full"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
      <Toaster />
    </>
  )
}
