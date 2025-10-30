import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  FileCode, 
  Calendar,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Clock,
  Zap
} from 'lucide-react';
import ProjectCard from '../components/project/ProjectCard';

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

interface DashboardStats {
  totalProjects: number;
  totalFiles: number;
  totalLines: number;
  lastGenerated: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterFramework, setFilterFramework] = useState<string>('all');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      const [projectsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/projects'),
        fetch('http://localhost:5000/api/dashboard/stats')
      ]);

      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();

      setProjects(projectsData.data || []);
      setStats(statsData.data || null);
    } catch (err) {
      setError('Erro ao carregar dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/dashboard/projects/${id}`, {
        method: 'DELETE'
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Erro ao excluir projeto');
      console.error(err);
    }
  };

  const handleOpenProject = (project: Project) => {
    navigate('/generate', { state: { project } });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = filterFramework === 'all' || project.framework === filterFramework;
    return matchesSearch && matchesFramework;
  });

  const frameworks = ['all', ...new Set(projects.map(p => p.framework))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não foi possível conectar ao servidor
          </p>
          <button
            onClick={loadDashboard}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* ✅ Header compacto (sem ocupar espaço do sidebar) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Meus Projetos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {projects.length} projetos salvos
            </p>
          </div>

          <button
            onClick={() => navigate('/generate')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<FileCode className="w-5 h-5" />}
              label="Projetos"
              value={stats.totalProjects}
              color="purple"
            />
            <StatCard
              icon={<FileCode className="w-5 h-5" />}
              label="Arquivos"
              value={stats.totalFiles}
              color="blue"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Linhas"
              value={stats.totalLines.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Último"
              value={stats.lastGenerated ? new Date(stats.lastGenerated).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'N/A'}
              color="pink"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterFramework}
            onChange={(e) => setFilterFramework(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
          >
            {frameworks.map(fw => (
              <option key={fw} value={fw}>
                {fw === 'all' ? 'Todos' : fw}
              </option>
            ))}
          </select>

          <div className="flex gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Tente outro termo' : 'Crie seu primeiro projeto'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/generate')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Criar Projeto
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              onOpen={handleOpenProject}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// StatCard Component
const StatCard: React.FC<any> = ({ icon, label, value, color }) => {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${colors[color]} text-white mb-2`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

export default DashboardPage;
