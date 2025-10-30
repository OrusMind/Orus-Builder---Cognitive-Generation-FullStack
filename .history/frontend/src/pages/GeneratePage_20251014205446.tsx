/**
 * ============================================================================
 * ORUS BUILDER - GENERATE PAGE (FINAL VERSION v4.0)
 * ============================================================================
 * ✅ Backend REAL com Groq API
 * ✅ Download ZIP completo
 * ✅ Live Preview FUNCIONANDO
 * ✅ Chat Trinity AI
 * ✅ Animações épicas
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Zap,
  CheckCircle,
  Sparkles,
  FileCode,
  Copy,
  CheckCheck,
  MessageCircle,
  Eye,
  RefreshCw,
  Maximize2,
  AlertCircle,
  LayoutDashboard, 
  Rocket, 
  ExternalLink,
} from 'lucide-react';
import { PromptInput, PromptOptions } from '@/components/generation/PromptInput';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ============================================================================
// TYPES
// ============================================================================
declare global {
  interface Window {
    Babel: any;
  }
}

interface LocationState {
  prompt?: string;
  autoStart?: boolean;
}

interface GeneratedFile {
  path: string;
  fileName: string;
    name?: string;  
  content: string;
  language: string;
  lines: number;
    size?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'trinity';
  content: string;
  timestamp: Date;
}
// ============================================================================
// PREVIEW TYPES & INTERFACES
// ============================================================================

interface ParsedComponent {
  componentName: string;
 type: 'dashboard' | 'form' | 'button' | 'appointment' | 'generic';  // ✅ ADICIONAR 'appointment'
  data: Record<string, any>;
  hasForm: boolean;
  hasDashboard: boolean;
  hasCards: boolean;
  fields: FormField[];
  metrics: MetricData[];
}

interface FormField {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
}

interface MetricData {
  title: string;
  value: number | string;
  description: string;
  icon?: string;
  color?: string;
}

// ============================================================================
// PREVIEW HTML GENERATORS
// ============================================================================

/**
 * Generate Dashboard HTML
 */
function generateDashboardHTML(parsed: ParsedComponent, componentName: string): string {
  const metrics = parsed.metrics.length > 0 ? parsed.metrics : [
    { title: 'Usuários', value: 2543, description: '+12% vs mês anterior', icon: '👥', color: '#3b82f6' },
    { title: 'Receita', value: 'R$ 45.2K', description: '+8.3% vs mês anterior', icon: '💰', color: '#10b981' },
    { title: 'Vendas', value: 387, description: '+15.8% vs mês anterior', icon: '📦', color: '#f59e0b' },
    { title: 'Conversão', value: '18.2%', description: '+3.1% vs mês anterior', icon: '📈', color: '#8b5cf6' }
  ];

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORUS Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      min-height: 100vh;
      padding: 20px;
    }
    #root { max-width: 1400px; margin: 0 auto; }
    .component-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 12px;
    }
    .component-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.3s;
    }
    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .metric-title {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 6px;
    }
    .metric-description {
      font-size: 13px;
      color: #9ca3af;
    }
    .chart-container {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }
    .chart-title {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 24px;
    }
    .chart-placeholder {
      height: 300px;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-size: 16px;
      font-weight: 600;
    }
    .code-badge {
      display: inline-block;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #374151;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    (function() {
      'use strict';
      
      const { useState } = React;
      
      function ${componentName}() {
        const metricsData = ${JSON.stringify(metrics)};
        
        return React.createElement('div', null,
          React.createElement('h1', { className: 'component-title' }, '📊 ${componentName}'),
          React.createElement('p', { className: 'component-subtitle' }, 'Gerado por ORUS Builder + Groq AI | Dashboard Interativo'),
          
          React.createElement('div', { className: 'dashboard-grid' },
            ...metricsData.map((metric, index) =>
              React.createElement('div', { 
                key: index,
                className: 'metric-card'
              },
                React.createElement('div', {
                  className: 'metric-icon',
                  style: { background: (metric.color || '#3b82f6') + '15', color: metric.color || '#3b82f6' }
                }, metric.icon || '📊'),
                React.createElement('div', { className: 'metric-title' }, metric.title),
                React.createElement('div', { className: 'metric-value' }, metric.value),
                React.createElement('div', { className: 'metric-description' }, metric.description)
              )
            )
          ),
          
          React.createElement('div', { className: 'chart-container' },
            React.createElement('h2', { className: 'chart-title' }, '📈 Gráfico de Desempenho'),
            React.createElement('div', { className: 'chart-placeholder' }, 
              '📊 Área reservada para gráfico (LineChart via Recharts)'
            )
          ),
          
          React.createElement('div', { className: 'code-badge' }, '< ${componentName} />')
        );
      }
      
      try {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(${componentName}));
        console.log('✅ Dashboard preview renderizado!');
      } catch (error) {
        console.error('❌ Erro:', error);
        document.getElementById('root').innerHTML = '<div style="padding: 40px; background: #fee; border-radius: 16px; text-align: center;"><h2 style="color: #c00;">❌ Erro</h2><p>' + error.message + '</p></div>';
      }
    })();
  </script>
</body>
</html>
  `;
}

/**
 * Generate Form HTML
 */
function generateFormHTML(parsed: ParsedComponent, componentName: string): string {
  // Retornar o HTML do formulário que já funciona
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORUS Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #root {
      background: white;
      border-radius: 24px;
      padding: 60px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
    }
    .component-title { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 12px; text-align: center; }
    .component-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 40px; text-align: center; }
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; font-size: 14px; }
    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.2s;
      font-family: inherit;
    }
    .form-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .form-input.error { border-color: #ef4444; }
    .error-message { color: #ef4444; font-size: 13px; margin-top: 6px; display: block; }
    .form-button {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 10px;
    }
    .form-button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.5); }
    .success-message {
      margin-top: 20px;
      padding: 16px;
      background: #d1fae5;
      border: 2px solid #6ee7b7;
      border-radius: 10px;
      color: #065f46;
      font-weight: 600;
      text-align: center;
      display: none;
    }
    .success-message.show { display: block; }
    .code-badge {
      display: inline-block;
      padding: 8px 16px;
      background: #f3f4f6;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #374151;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    (function() {
      'use strict';
      const { useState } = React;
      
      function ${componentName}() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [emailError, setEmailError] = useState('');
        const [passwordError, setPasswordError] = useState('');
        const [submitted, setSubmitted] = useState(false);
        
        const validateEmail = function(value) {
          if (!value) return 'Email é obrigatório';
          const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$/i;
          if (!regex.test(value)) return 'Email inválido';
          return '';
        };
        
        const validatePassword = function(value) {
          if (!value) return 'Senha é obrigatória';
          if (value.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
          return '';
        };
        
        const handleSubmit = function(e) {
          e.preventDefault();
          const emailErr = validateEmail(email);
          const passwordErr = validatePassword(password);
          setEmailError(emailErr);
          setPasswordError(passwordErr);
          if (!emailErr && !passwordErr) {
            console.log('✅ Login:', { email, password: '***' });
            setSubmitted(true);
            setTimeout(function() { setSubmitted(false); }, 3000);
          }
        };
        
        return React.createElement('div', null,
          React.createElement('h1', { className: 'component-title' }, '🔐 ${componentName}'),
          React.createElement('p', { className: 'component-subtitle' }, 'Gerado por ORUS Builder + Groq AI'),
          React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'email' }, 'Email:'),
              React.createElement('input', {
                type: 'email',
                id: 'email',
                className: 'form-input' + (emailError ? ' error' : ''),
                value: email,
                onChange: function(e) { setEmail(e.target.value); setEmailError(''); },
                placeholder: 'Digite seu email'
              }),
              emailError && React.createElement('span', { className: 'error-message' }, emailError)
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'password' }, 'Senha:'),
              React.createElement('input', {
                type: 'password',
                id: 'password',
                className: 'form-input' + (passwordError ? ' error' : ''),
                value: password,
                onChange: function(e) { setPassword(e.target.value); setPasswordError(''); },
                placeholder: 'Digite sua senha'
              }),
              passwordError && React.createElement('span', { className: 'error-message' }, passwordError)
            ),
            React.createElement('button', { type: 'submit', className: 'form-button' }, 'Entrar')
          ),
          React.createElement('div', { className: 'success-message' + (submitted ? ' show' : '') }, '✅ Login realizado com sucesso!'),
          React.createElement('div', { className: 'code-badge' }, '< ${componentName} />')
        );
      }
      
      try {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(${componentName}));
        console.log('✅ Form preview renderizado!');
      } catch (error) {
        console.error('❌ Erro:', error);
      }
    })();
  </script>
</body>
</html>
  `;
}

/**
 * Generate Generic HTML (Button)
 */
function generateGenericHTML(parsed: ParsedComponent, componentName: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ORUS Preview - ${componentName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #root {
      background: white;
      border-radius: 24px;
      padding: 80px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    .component-title { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
    .component-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 30px; }
    .preview-button {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      border: none;
      padding: 18px 48px;
      font-size: 18px;
      font-weight: 700;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 10px 25px -5px rgba(0, 123, 255, 0.4);
    }
    .preview-button:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0, 123, 255, 0.6); }
    .code-badge {
      display: inline-block;
      padding: 8px 16px;
      background: #f3f4f6;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #374151;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    (function() {
      'use strict';
      const { useState } = React;
      
      function ${componentName}() {
        const [count, setCount] = useState(0);
        
        return React.createElement('div', null,
          React.createElement('h1', { className: 'component-title' }, '🎉 ${componentName}'),
          React.createElement('p', { className: 'component-subtitle' }, 'Gerado por ORUS Builder + Groq AI'),
          React.createElement('button', {
            className: 'preview-button',
            onClick: function() { setCount(count + 1); }
          }, count === 0 ? 'Clique Aqui! 🚀' : 'Clicado ' + count + ' vezes!'),
          React.createElement('div', { className: 'code-badge' }, '< ${componentName} />')
        );
      }
      
      try {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(${componentName}));
        console.log('✅ Generic preview renderizado!');
      } catch (error) {
        console.error('❌ Erro:', error);
      }
    })();
  </script>
</body>
</html>
  `;
}

// ===================================================================
// COMPONENTE LIVEPREVIEW - RENDERIZAÇÃO SEGURA EM IFRAME
// ===================================================================
const LivePreview: React.FC<{ files: GeneratedFile[] }> = ({ files }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!files || files.length === 0) {
      setError('Nenhum arquivo para preview');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const mainFile = files[0];
      let code = mainFile.content;

      // Preparar código
      code = code.replace(/import\s+.*\s+from\s+['"].*['"];?\n?/g, '');
      
      const exportMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
      const constMatch = code.match(/const\s+(\w+)\s*[:=]/);
      const componentName = exportMatch?.[1] || constMatch?.[1] || 'Component';
      
      code = code.replace(/export\s+default\s+/g, '');

      const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>body{margin:0;padding:20px;font-family:system-ui}#root{min-height:100vh}</style>
</head><body><div id="root"></div>
<script type="text/babel">
const {useState,useEffect,useRef}=React;
try{
${code}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div style={{padding:'20px'}}>
    <${componentName}/>
  </div>
);
console.log('✅ Renderizado: ${componentName}');
}catch(e){
console.error('❌ Erro:',e);
document.getElementById('root').innerHTML='<div style="padding:40px;text-align:center;background:#fee;border-radius:12px;max-width:600px;margin:40px auto"><h2 style="color:#c00;margin:0 0 16px 0">❌ Erro no Preview</h2><p style="margin:0 0 12px 0;color:#666">O componente tem um erro que impede a renderização:</p><pre style="margin:0;font-size:13px;overflow-x:auto;background:#fff;padding:16px;border-radius:8px;border:1px solid #fcc;text-align:left">'+e.message+'</pre><p style="margin:16px 0 0 0;color:#666;font-size:14px">💡 Dica: Verifique se todas as variáveis estão definidas</p></div>';
}
</script></body></html>`;

      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        const doc = iframe.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();
      }

      setTimeout(() => setLoading(false), 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [files]);

  if (error) {
    return <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20 p-6">
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-red-600 mb-2">❌ Erro</h3>
        <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/40 p-4 rounded-lg font-mono">{error}</p>
      </div>
    </div>;
  }

  return <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
    {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 z-10">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Renderizando...</p>
      </div>
    </div>}
    <iframe ref={iframeRef} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" title="Preview"/>
  </div>;
};

// ============================================================================
// MAIN GENERATE PAGE COMPONENT
// ============================================================================

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const hasInitialPrompt = Boolean(state?.prompt);

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
const [showCode, setShowCode] = useState(false); // ✅ CÓDIGO ESCONDIDO (preview primeiro)
const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
 
// ✅ FUNÇÃO SALVAR PROJETO
const handleSaveProject = async () => {
  if (!files || files.length === 0) {
    alert('❌ Nenhum arquivo para salvar');
    return;
  }

  const projectName = prompt('Nome do projeto:', 'Meu Projeto');
  if (!projectName) return;

  try {
    const response = await fetch('http://localhost:5000/api/dashboard/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: projectName,
        description: chatMessages[0]?.content || 'Projeto ORUS Builder',
files: files || [],  
        framework: 'react',
        prompt: chatMessages[0]?.content || ''
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('✅ Projeto salvo no dashboard!');
    } else {
      alert(`❌ ${data.message || 'Erro ao salvar'}`);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('❌ Erro ao conectar com backend');
  }
};
  // ✅ FUNÇÃO DEPLOY
  const handleDeploy = () => {
    toast('🚀 Deploy em desenvolvimento!', { icon: '🚧' });
  };


  /**
   * Add message helper
   */
  const addMessage = (role: 'user' | 'trinity', content: string) => {
    setChatMessages(prev => [...prev, {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    }]);
  };

  /**
   * Handle generation with REAL backend
   */
  const handleGenerate = async (prompt: string, options: PromptOptions) => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);
    setFiles(null);
    setJobId(null);
setShowCode(false);  // ✅ CORRETO

    addMessage('user', prompt);
    addMessage('trinity', '🚀 Conectando com Groq API...');

    try {
      // Step 1: Create generation job
      const response = await fetch('http://localhost:5000/api/v1/generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
  prompt: prompt.trim(),
  options: {
    framework: options.framework || 'react',        // ✅ lowercase
    language: options.language || 'typescript',     // ✅ Movido
    complexity: options.complexity || 'standard',   // ✅ Adicionado
    includeTests: options.includeTests || false,
    style: options.style || 'modern',
    applyStyles: true,
    applyTailwind: true,
    darkMode: true,
    responsive: true,
  },
})

      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      const generatedJobId = data.jobId || data.data?.jobId;

      if (!generatedJobId) {
        throw new Error('No jobId received from backend');
      }

      setJobId(generatedJobId);
      addMessage('trinity', `✅ Job criado: ${generatedJobId}. Gerando com Groq...`);

      // Step 2: Simulate progress while backend processes
      const stages = [
        { name: 'Analisando prompt com Trinity AI', progress: 20, duration: 2000 },
        { name: 'Groq gerando arquitetura...', progress: 40, duration: 3000 },
        { name: 'Escrevendo componentes React...', progress: 70, duration: 4000 },
        { name: 'Validando com CIG-2.0...', progress: 90, duration: 2000 },
        { name: 'Finalizando...', progress: 100, duration: 1000 },
      ];

      for (const stage of stages) {
        setCurrentStage(stage.name);
        setProgress(stage.progress);
        await new Promise(resolve => setTimeout(resolve, stage.duration));
      }

      // Step 3: Get results from backend
      const resultResponse = await fetch(
        `http://localhost:5000/api/v1/generation/${generatedJobId}/result`
      );
      
      if (!resultResponse.ok) {
        throw new Error(`Failed to get results: ${resultResponse.statusText}`);
      }

      const result = await resultResponse.json();
      console.log('✅ Result from backend:', result);

      // Parse files
      const generatedFiles: GeneratedFile[] = 
        result.data?.files || 
        result.files || 
        result.result?.files || 
        [];

      if (generatedFiles.length === 0) {
        throw new Error('No files generated by backend');
      }

      // Format files
      const formattedFiles: GeneratedFile[] = generatedFiles.map((file: any) => ({
        path: file.path || file.fileName || 'unknown',
        fileName: file.fileName || file.name || file.path || 'file.tsx',
        content: file.content || '// No content',
        language: file.language || 'typescript',
        lines: file.lines || file.content?.split('\n').length || 0,
      }));

      setFiles(formattedFiles);
      setIsGenerating(false);
      setIsComplete(true);
      setProgress(100);

      // Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      addMessage('trinity', `🎉 Código REAL gerado! ${formattedFiles.length} arquivos criados com Groq!`);
      toast.success(`✅ ${formattedFiles.length} arquivos gerados!`);

    } catch (error: any) {
      console.error('❌ Generation error:', error);
      
      setIsGenerating(false);
      setIsComplete(false);
      
      addMessage('trinity', `❌ Erro: ${error.message}`);
      toast.error(`Erro: ${error.message}`);
    }
  };

  /**
   * Handle download ZIP
   */
  const handleDownload = async () => {
    if (!files || files.length === 0) {
      toast.error('Nenhum arquivo para baixar');
      return;
    }

    try {
      const { saveAs } = await import('file-saver');
      const JSZip = (await import('jszip')).default;

      const zip = new JSZip();

      // Add all files
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add package.json
      const packageJson = {
        name: 'orus-generated-project',
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          axios: '^1.6.0',
        },
        devDependencies: {
          '@types/react': '^18.3.0',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.2.0',
          typescript: '^5.2.2',
          vite: '^5.0.0',
        },
      };

      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // Add README
      const readme = `# ORUS Generated Project

Generated by ORUS Builder with Trinity AI + Groq

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Files Generated

${files.map(f => `- ${f.path}`).join('\n')}

---

Powered by ORUS Builder 🚀
`;

      zip.file('README.md', readme);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `orus-project-${Date.now()}.zip`);

      toast.success('📦 Download iniciado!');
      addMessage('trinity', '📦 Projeto baixado com sucesso!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Erro ao fazer download: ${error.message}`);
    }
  };

  /**
   * Auto-start on mount
   */
  useEffect(() => {
    if (hasInitialPrompt && state.prompt && !isGenerating && !isComplete && !jobId) {
      handleGenerate(state.prompt, {
        framework: 'react',
        language: 'typescript',
        style: 'standard',
        includeTests: true,
      });
    }
  }, []);

  /**
   * Copy file
   */
  const handleCopyFile = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      toast.success(`📋 ${filename} copiado!`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  /**
   * Handle new generation
   */
  const handleNewGeneration = () => {
    setFiles(null);
    setIsComplete(false);
    setIsGenerating(false);
setShowCode(false);  // ✅ CORRETO
    setProgress(0);
    setChatMessages([]);
    navigate('/generate', { replace: true, state: {} });
  };

  const showPromptInput = !hasInitialPrompt && !isGenerating && !isComplete;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
       <button
  onClick={() => setShowCode(!showCode)}
  className="btn-secondary flex items-center gap-2"
>
  {showCode ? <Eye className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
  {showCode ? 'Ver Preview' : 'Ver Código'}
</button>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow" />
              <span className="font-heading font-bold gradient-text">ORUS Builder</span>
            </div>

          {isComplete && (
  <div className="space-y-6">
    {/* HEADER COM TÍTULO E BOTÕES */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🎉 Seu App Está Pronto!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
{(files || []).length} arquivos gerados • 100% pronto para produção
          </p>
        </div>
      </div>

      {/* ✅ TODOS OS BOTÕES DE AÇÃO */}
      <div className="flex items-center gap-2">
        {/* Botão Ver Código/Preview */}
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <Eye className="w-4 h-4" />
          {showCode ? 'Ver Preview' : 'Ver Código'}
        </button>

        {/* ✅ Botão Salvar Dashboard */}
        <button
          onClick={handleSaveProject}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <LayoutDashboard className="w-4 h-4" />
          Salvar Dashboard
        </button>

        {/* ✅ Botão Ir para Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Dashboard
        </button>

        {/* ✅ Botão Deploy */}
        <button
          onClick={handleDeploy}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <Rocket className="w-4 h-4" />
          Deploy
        </button>

        {/* Botão Download ZIP */}
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <Download className="w-4 h-4" />
          Download ZIP
        </button>

        {/* Botão Nova Geração */}
        <button
          onClick={handleNewGeneration}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <Zap className="w-4 h-4" />
          Nova Geração
        </button>
      </div>
    </div>

    {/* CONTEÚDO: PREVIEW OU CÓDIGO */}
    <AnimatePresence mode="wait">
      {!showCode ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-card overflow-hidden"
          style={{ height: '600px' }}
        >
<LivePreview files={files || []} />  // ✅ garante array vazio
        </motion.div>
      ) : (
        <motion.div
          key="code"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-4"
        >
{(files || []).map((file, index) => (  // ✅ garante array vazio
            <div key={index} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-semibold">{file.path}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {file.lines} linhas • {file.language}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyFile(file.content, file.path)}
                  className="btn-ghost p-2"
                >
                  {copiedFile === file.path ? (
                    <CheckCheck className="w-5 h-5 text-success-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <pre className="code-block overflow-x-auto max-h-96 text-xs">
                <code>{file.content}</code>
              </pre>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {/* PROMPT INPUT */}
            {showPromptInput && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl font-heading font-bold">
                    O que você quer <span className="gradient-text">criar</span> hoje?
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300">
                    Descreva sua ideia e Trinity AI gerará código real
                  </p>
                </div>

                <PromptInput
                  onSubmit={(prompt, options) => {
                    addMessage('user', prompt);
                    handleGenerate(prompt, options);
                  }}
                  isGenerating={isGenerating}
                  validatePrompt={(prompt) => ({
                    isValid: prompt.length >= 10,
                    quality: Math.min((prompt.length / 100) * 100, 100),
                  })}
                  minLength={10}
                  maxLength={2000}
                />
              </motion.div>
            )}

            {/* GENERATING */}
            {isGenerating && (
              <motion.div key="generating" className="glass-card p-12 space-y-8">
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-glow"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-4xl font-heading font-bold">
                    Trinity AI está trabalhando...
                  </h2>
                  <p className="text-xl text-gray-700 dark:text-gray-300">{currentStage}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{currentStage}</span>
                    <span className="text-3xl font-bold gradient-text">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {isComplete && files && (
              <motion.div key="results" className="space-y-6">
                <div className="glass-card p-8">
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-heading font-bold mb-2">
                        🎉 Seu App Está Pronto!
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {files.length} arquivos gerados • 100% pronto para produção
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview or Code */}
{!showCode ? (
                  <div className="glass-card overflow-hidden" style={{ height: '600px' }}>
                    <LivePreview files={files} />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-mono text-sm font-semibold">{file.path}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {file.lines} linhas • {file.language}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyFile(file.content, file.path)}
                            className="btn-ghost p-2"
                          >
                            {copiedFile === file.path ? (
                              <CheckCheck className="w-5 h-5 text-success-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <pre className="code-block overflow-x-auto max-h-96 text-xs">
                          <code>{file.content}</code>
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TRINITY CHAT */}
      <motion.div
        animate={{ height: isChatExpanded ? '300px' : '60px' }}
        className="border-t bg-white dark:bg-gray-800 flex flex-col"
      >
        <div
          className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">Trinity AI Chat</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isGenerating ? 'Gerando...' : isComplete ? 'Completo!' : 'Pronto'}
              </p>
            </div>
          </div>
        </div>

        {isChatExpanded && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

