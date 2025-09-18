import { AnalysisMetrics, ChartData } from './types';

// Chart data generators with proper typing
export const generateRadarChartData = (metrics: AnalysisMetrics): ChartData => ({
  labels: ['Symmetry', 'Complexity', 'Cultural', 'Aesthetic', 'Innovation', 'Technical'],
  datasets: [
    {
      label: 'Analysis Results',
      data: [
        metrics.symmetry,
        metrics.complexity,
        metrics.cultural,
        metrics.aesthetic,
        metrics.innovation,
        metrics.technical
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)',
    }
  ]
});

export const generateSymmetryBreakdownData = (): ChartData => ({
  labels: ['Radial', 'Bilateral', 'Translational', 'Rotational'],
  datasets: [
    {
      data: [30, 25, 20, 25],
      backgroundColor: [
        '#3B82F6',
        '#8B5CF6',
        '#10B981',
        '#F59E0B'
      ],
      borderWidth: 0,
    }
  ]
});

export const generateColorAnalysisData = (): ChartData => ({
  labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'],
  datasets: [
    {
      label: 'Color Distribution',
      data: [25, 15, 20, 10, 18, 12],
      backgroundColor: [
        '#EF4444',
        '#F97316',
        '#EAB308',
        '#22C55E',
        '#3B82F6',
        '#8B5CF6'
      ],
    }
  ]
});

export const generateComplexityTrendData = (): ChartData => ({
  labels: ['Basic Elements', 'Intermediate Patterns', 'Advanced Motifs', 'Master Craftsmanship'],
  datasets: [
    {
      label: 'Complexity Levels',
      data: [85, 72, 68, 45],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ]
});

// Chart options configurations
export const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: { display: false },
      grid: { color: 'rgba(0,0,0,0.1)' }
    }
  },
  plugins: {
    legend: { display: false }
  }
};

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  }
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, max: 100 }
  }
};