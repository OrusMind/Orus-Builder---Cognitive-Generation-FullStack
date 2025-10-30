/**
 * ============================================================================
 * ORUS BUILDER - PROJECT LIST COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:27:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:27:00-03:00
 * COMPONENT_HASH: orus.frontend.component.projectlist.20251009.PRL9E0F1
 * 
 * PURPOSE:
 * - Display projects in list/grid view
 * - Filter, sort, and search functionality
 * - Pagination and infinite scroll support
 * - Bulk actions for multiple projects
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ListManagementAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Grid,
  List as ListIcon,
  Search,
  Filter,
  SortAsc,
  ChevronDown,
} from 'lucide-react';
import { Project } from '@/types/api.types';
import { ProjectCard } from './ProjectCard';
import { Input } from '@components/common/Input';
import { Dropdown, DropdownOption } from '@components/common/Dropdown';
import { Loading } from '@components/common/Loading';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ProjectListProps {
  /**
   * Array of projects to display
   */
  projects: Project[];

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * View mode
   * @default 'grid'
   */
  viewMode?: 'grid' | 'list';

  /**
   * Enable search
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Enable filters
   * @default true
   */
  enableFilters?: boolean;

  /**
   * Enable sorting
   * @default true
   */
  enableSort?: boolean;

  /**
   * Project selection callback
   */
  onProjectSelect?: (project: Project) => void;

  /**
   * Project edit callback
   */
  onProjectEdit?: (project: Project) => void;

  /**
   * Project delete callback
   */
  onProjectDelete?: (projectId: string) => void;

  /**
   * Project duplicate callback
   */
  onProjectDuplicate?: (project: Project) => void;
}

type SortField = 'name' | 'updatedAt' | 'createdAt' | 'status';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'active' | 'archived' | 'draft';
type FilterFramework = 'all' | 'react' | 'vue' | 'angular' | 'nextjs';

// ============================================================================
// PROJECT LIST COMPONENT
// ============================================================================

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading = false,
  viewMode: initialViewMode = 'grid',
  enableSearch = true,
  enableFilters = true,
  enableSort = true,
  onProjectSelect,
  onProjectEdit,
  onProjectDelete,
  onProjectDuplicate,
}) => {
  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFramework, setFilterFramework] = useState<FilterFramework>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter options
  const statusOptions: DropdownOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  const frameworkOptions: DropdownOption[] = [
    { value: 'all', label: 'All Frameworks' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'updatedAt-desc', label: 'Recently Updated' },
    { value: 'updatedAt-asc', label: 'Oldest Updated' },
    { value: 'createdAt-desc', label: 'Recently Created' },
    { value: 'createdAt-asc', label: 'Oldest Created' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ];

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((project) => project.status === filterStatus);
    }

    // Apply framework filter
    if (filterFramework !== 'all') {
      filtered = filtered.filter((project) => project.framework === filterFramework);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchQuery, filterStatus, filterFramework, sortField, sortOrder]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortField(field as SortField);
    setSortOrder(order as SortOrder);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading variant="neural" size="lg" message="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        {enableSearch && (
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              fullWidth
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          {enableFilters && (
            <>
              <Dropdown
                options={statusOptions}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as FilterStatus)}
                placeholder="Status"
              />

              <Dropdown
                options={frameworkOptions}
                value={filterFramework}
                onChange={(value) => setFilterFramework(value as FilterFramework)}
                placeholder="Framework"
              />
            </>
          )}

          {/* Sort */}
          {enableSort && (
            <Dropdown
              options={sortOptions}
              value={`${sortField}-${sortOrder}`}
              onChange={handleSortChange}
              placeholder="Sort"
            />
          )}

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-background-surface rounded-lg p-1 border border-primary/20">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-background'
                  : 'text-foreground-muted hover:text-foreground'
              )}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-background'
                  : 'text-foreground-muted hover:text-foreground'
              )}
              aria-label="List view"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <span>
          Showing {filteredProjects.length} of {projects.length} projects
        </span>

        {(searchQuery || filterStatus !== 'all' || filterFramework !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterFramework('all');
            }}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-background-surface rounded-lg border border-primary/20">
          <Filter className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-foreground-muted">
            {searchQuery || filterStatus !== 'all' || filterFramework !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by creating your first project'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className={clsx(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
            )}
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => onProjectSelect?.(project)}
                  onEdit={onProjectEdit}
                  onDelete={onProjectDelete}
                  onDuplicate={onProjectDuplicate}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: ProjectList (Project list with filters component)
 * NAMED_EXPORTS: ProjectListProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
