/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 PROJECT MODEL - ORUS BUILDER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  projectId: string;
  name: string;
  description?: string;
  userId: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte';
  language: 'typescript' | 'javascript';
  
  generationData: {
    prompt: string;
    mode: string;
    target: string;
    context?: any;
  };
  
  files: Array<{
    path: string;
    name: string;
    content: string;
    language: string;
    size: number;
  }>;
  
  metadata: {
    totalFiles: number;
    totalLines: number;
    confidence: number;
    cigScore: number;
    generationTime: number;
  };
  
  status: 'draft' | 'generated' | 'deployed' | 'archived';
  deploymentUrl?: string;
  
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  projectId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  userId: { type: String, required: true, index: true },
  framework: { type: String, enum: ['react', 'vue', 'angular', 'svelte'], default: 'react' },
  language: { type: String, enum: ['typescript', 'javascript'], default: 'typescript' },
  
  generationData: {
    prompt: { type: String, required: true },
    mode: String,
    target: String,
    context: Schema.Types.Mixed
  },
  
  files: [{
    path: String,
    name: String,
    content: String,
    language: String,
    size: Number
  }],
  
  metadata: {
    totalFiles: Number,
    totalLines: Number,
    confidence: Number,
    cigScore: Number,
    generationTime: Number
  },
  
  status: { type: String, enum: ['draft', 'generated', 'deployed', 'archived'], default: 'draft' },
  deploymentUrl: String,
  
  version: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ status: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
