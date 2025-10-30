/**
 * ============================================================================
 * ORUS BUILDER - BLUEPRINT UPLOADER COMPONENT ⭐ (FIXED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T08:57:00-03:00
 * LAST_MODIFIED: 2025-10-10T11:14:00-03:00
 * COMPONENT_HASH: orus.frontend.component.blueprintuploader.20251010.BLU6L7M8.FIXED
 * 
 * PURPOSE:
 * - Drag-and-drop ORUS blueprint uploader
 * - Supports DOCX, MD, TXT, PDF formats
 * - Automatic ORUS pattern recognition
 * - Preview before parsing
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: FileUploadAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: Voz (Document Reading)
 * 
 * FIXES APPLIED:
 * ✅ Removed unused imports (Check, AlertCircle)
 * ✅ Changed toast.info to toast.success
 * ✅ Added null check for uploadedFile before using
 * ============================================================================
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Upload,
  File,
  FileText,
  FileCode,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlueprintUploaderProps {
  /**
   * Upload callback
   */
  onUpload: (file: File, content: string) => void;

  /**
   * Accepted file types
   * @default ['.docx', '.md', '.txt', '.pdf']
   */
  acceptedTypes?: string[];

  /**
   * Max file size in MB
   * @default 10
   */
  maxSize?: number;

  /**
   * Multiple file upload
   * @default false
   */
  multiple?: boolean;

  /**
   * Show preview
   * @default true
   */
  showPreview?: boolean;
}

interface UploadedFile {
  file: File;
  content: string;
  isOrusBlueprint: boolean;
  confidence: number;
  preview: string;
}

// ============================================================================
// ORUS PATTERN DETECTION
// ============================================================================

const ORUS_PATTERNS = [
  'ORUS BUILDER',
  'Hash Master Universal',
  'COMPONENT_HASH',
  'COGNITIVE AGENT DNA',
  'Trinity AI',
  'BLOCO',
  'orus.builder',
  'MINERVA',
];

const detectOrusPattern = (content: string): { isOrus: boolean; confidence: number } => {
  let matchCount = 0;
  const contentLower = content.toLowerCase();

  ORUS_PATTERNS.forEach((pattern) => {
    if (contentLower.includes(pattern.toLowerCase())) {
      matchCount++;
    }
  });

  const confidence = Math.min((matchCount / ORUS_PATTERNS.length) * 100, 100);
  const isOrus = confidence >= 30; // At least 30% match

  return { isOrus, confidence };
};

// ============================================================================
// BLUEPRINT UPLOADER COMPONENT
// ============================================================================

export const BlueprintUploader: React.FC<BlueprintUploaderProps> = ({
  onUpload,
  acceptedTypes = ['.docx', '.md', '.txt', '.pdf'],
  maxSize = 10,
  multiple = false,
  showPreview = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, []);

  // Handle file input change
  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await processFiles(files);
  }, []);

  // Process uploaded files
  const processFiles = async (files: File[]) => {
    setIsProcessing(true);

    const validFiles: UploadedFile[] = [];

    for (const file of files) {
      // Validate file type
      const fileExtension = `.${file.name.split('.').pop()}`;
      if (!acceptedTypes.includes(fileExtension)) {
        toast.error(`File type ${fileExtension} not supported`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      // Read file content
      try {
        const content = await readFileContent(file);
        const { isOrus, confidence } = detectOrusPattern(content);

        const preview = content.slice(0, 500) + (content.length > 500 ? '...' : '');

        validFiles.push({
          file,
          content,
          isOrusBlueprint: isOrus,
          confidence,
          preview,
        });

        if (isOrus) {
          toast.success(`✨ ORUS Blueprint detected! (${confidence.toFixed(0)}% confidence)`);
        } else {
          // ✅ FIXED: Changed toast.info to toast.success
          toast.success(`Document uploaded (${confidence.toFixed(0)}% ORUS match)`);
        }
      } catch (error) {
        toast.error(`Failed to read ${file.name}`);
        console.error('File read error:', error);
      }
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setIsProcessing(false);

    // Auto-upload if single file
    // ✅ FIXED: Added null check for uploadedFile
    if (validFiles.length === 1 && !multiple) {
      const uploadedFile = validFiles[0];
      if (uploadedFile) {
        onUpload(uploadedFile.file, uploadedFile.content);
      }
    }
  };

  // Read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  };

  // Remove file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload all files
  const handleUploadAll = () => {
    uploadedFiles.forEach((uploadedFile) => {
      onUpload(uploadedFile.file, uploadedFile.content);
    });
    toast.success(`${uploadedFiles.length} file(s) uploaded`);
    setUploadedFiles([]);
  };

  // Get file icon
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'docx':
      case 'doc':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'md':
      case 'txt':
        return <FileCode className="w-6 h-6 text-foreground-muted" />;
      case 'pdf':
        return <File className="w-6 h-6 text-red-400" />;
      default:
        return <File className="w-6 h-6 text-foreground-muted" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          'relative p-12 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-primary/30 hover:border-primary/60 hover:bg-background-elevated'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-foreground">Processing files...</p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ y: isDragging ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  'flex items-center justify-center w-16 h-16 rounded-full',
                  isDragging ? 'bg-primary' : 'bg-primary/20'
                )}
              >
                <Upload className={clsx('w-8 h-8', isDragging ? 'text-background' : 'text-primary')} />
              </motion.div>

              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-1">
                  {isDragging ? 'Drop your blueprint here' : 'Upload ORUS Blueprint'}
                </p>
                <p className="text-sm text-foreground-muted">
                  Drag & drop or click to select {acceptedTypes.join(', ')} files
                </p>
                <p className="text-xs text-foreground-muted mt-2">
                  Max size: {maxSize}MB
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-primary">
                <Sparkles className="w-4 h-4" />
                <span>ORUS pattern auto-detection enabled</span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Uploaded Files ({uploadedFiles.length})
              </h3>

              {multiple && uploadedFiles.length > 1 && (
                <Button onClick={handleUploadAll} size="sm">
                  Upload All
                </Button>
              )}
            </div>

            {uploadedFiles.map((uploadedFile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 rounded-lg bg-background-surface border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadedFile.file.name)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {uploadedFile.file.name}
                      </h4>

                      {uploadedFile.isOrusBlueprint && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-medium">
                          <Sparkles className="w-3 h-3" />
                          ORUS
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-foreground-muted mb-2">
                      {(uploadedFile.file.size / 1024).toFixed(2)} KB •{' '}
                      {uploadedFile.confidence.toFixed(0)}% ORUS match
                    </p>

                    {showPreview && (
                      <div className="p-3 rounded bg-background border border-primary/10">
                        <pre className="text-xs text-foreground-muted whitespace-pre-wrap font-mono overflow-hidden">
                          {uploadedFile.preview}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!multiple && (
                      <Button
                        onClick={() => onUpload(uploadedFile.file, uploadedFile.content)}
                        size="sm"
                        variant="secondary"
                      >
                        Parse
                      </Button>
                    )}

                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: BlueprintUploader (Blueprint drag-drop uploader)
 * NAMED_EXPORTS: BlueprintUploaderProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
