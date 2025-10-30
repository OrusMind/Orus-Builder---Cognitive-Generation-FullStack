import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileCode, 
  Trash2, 
  FolderOpen,
  Clock,
  Code2,
  Layers,
  ExternalLink,
  MoreVertical
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  files: any[];
  framework: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onOpen, 
  onDelete,
  viewMode = 'grid' 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFrameworkColor = (framework: string) => {
    const colors: Record<string, string> = {
      'react': 'from-cyan-500 to-blue-500',
      'vue': 'from-green-500 to-emerald-500',
      'angular': 'from-red-500 to-pink-500',
      'svelte': 'from-orange-500 to-red-500',
      'next': 'from-gray-800 to-gray-900',
      'nuxt': 'from-green-600 to-teal-600',
    };
    return colors[framework?.toLowerCase()] || 'from-purple-500 to-pink-500';
  };

  const getTotalLines = () => {
    return project.files.reduce((sum, file) => {
      return sum + (file.content?.split('\n').length || 0);
    }, 0);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-xl"
      >
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getFrameworkColor(project.framework)} flex items-center justify-center flex-shrink-0`}>
            <Code2 className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                  {project.description || project.prompt}
                </p>
              </div>
              <button
                onClick={() => onDelete(project.id)}
                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>{project.files.length} arquivos</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{getTotalLines()} linhas</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {project.framework}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onOpen(project)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex-shrink-0"
          >
            <FolderOpen className="w-5 h-5" />
            Abrir
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-2xl group"
    >
      {/* Header with Gradient */}
      <div className={`h-32 bg-gradient-to-r ${getFrameworkColor(project.framework)} relative overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        {/* Framework Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {project.framework}
          </span>
        </div>

        {/* Delete Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-red-500 text-white rounded-lg transition-all border border-white/30 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Icon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center border-4 border-gray-50 dark:border-gray-900">
            <Code2 className={`w-8 h-8 bg-gradient-to-r ${getFrameworkColor(project.framework)} bg-clip-text text-transparent`} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-10">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center line-clamp-1">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-4 line-clamp-2 min-h-[40px]">
          {project.description || project.prompt}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Arquivos</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.files.length}</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Linhas</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{getTotalLines()}</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Criado</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {new Date(project.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

        {/* Action Button */}
        <button
          onClick={() => onOpen(project)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg group"
        >
          <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Abrir Projeto</span>
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Atualizado {formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Ativo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
