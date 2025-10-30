/**
 * ============================================================================
 * PREVIEW PAGE - VISUALIZAÇÃO EM TELA CHEIA DO COMPONENTE
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, Eye, Download } from 'lucide-react';
import { PreviewSandbox } from '@components/generation/PreviewSandbox';
import toast from 'react-hot-toast';

export const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState<string>('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Carrega código do localStorage ou sessionStorage
  useEffect(() => {
    const savedCode = sessionStorage.getItem('generated-code');
    if (savedCode) {
      setCode(savedCode);
    } else {
      toast.error('Nenhum código para visualizar');
      navigate('/generate');
    }
  }, [navigate]);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.tsx';
    a.click();
    toast.success('Download iniciado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code2 className="w-4 h-4 inline mr-2" />
              Código
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-all"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Baixar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[calc(100vh-200px)]"
        >
          {viewMode === 'preview' ? (
            <PreviewSandbox code={code} />
          ) : (
            <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-auto h-full">
              <code>{code}</code>
            </pre>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewPage;
