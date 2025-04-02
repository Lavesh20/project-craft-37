
import React, { useMemo } from 'react';
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';

interface Project {
  id: string;
  name: string;
  status: string;
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
  lastEdited?: string;
  // Add other properties as needed
}

interface DashboardChartProps {
  projects: Project[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ projects }) => {
  // Generate data for the past 3 months by week
  const chartData = useMemo(() => {
    // Make sure we have an array of projects
    const projectsArray = Array.isArray(projects) ? projects : [];

    // Current date and 3 months ago
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);
    
    // Get all weeks in the interval
    const weeks = eachWeekOfInterval({
      start: startOfMonth(threeMonthsAgo),
      end: endOfMonth(today)
    });
    
    // Map weeks to data points
    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const weekLabel = `${format(weekStart, 'MM/dd')} - ${format(weekEnd, 'MM/dd')}`;
      
      // Count projects by status for this week
      const completed = projectsArray.filter(project => {
        const lastEdited = project.lastEdited ? new Date(project.lastEdited) : null;
        return lastEdited && lastEdited >= weekStart && lastEdited <= weekEnd && project.status === 'Completed';
      }).length;
      
      const inProgress = projectsArray.filter(project => {
        const lastEdited = project.lastEdited ? new Date(project.lastEdited) : null;
        return lastEdited && lastEdited >= weekStart && lastEdited <= weekEnd && project.status === 'In Progress';
      }).length;
      
      const notStarted = projectsArray.filter(project => {
        const createdAt = project.createdAt ? new Date(project.createdAt) : null;
        return createdAt && createdAt >= weekStart && createdAt <= weekEnd && project.status === 'Not Started';
      }).length;
      
      return {
        week: weekLabel,
        completed,
        inProgress,
        notStarted
      };
    });
  }, [projects]);
  
  // Chart config for colors - Added dark theme value to each entry to fix TypeScript error
  const chartConfig = {
    completed: {
      label: "Completed",
      theme: {
        light: "#22c55e", // Green color
        dark: "#22c55e"   // Same color for dark mode
      }
    },
    inProgress: {
      label: "In Progress",
      theme: {
        light: "#3b82f6", // Blue color
        dark: "#3b82f6"   // Same color for dark mode
      }
    },
    notStarted: {
      label: "Not Started",
      theme: {
        light: "#6b7280", // Gray color
        dark: "#6b7280"   // Same color for dark mode
      }
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="week"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} verticalAlign="top" />
          <Bar dataKey="completed" name="completed" stackId="a" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" name="inProgress" stackId="a" fill="var(--color-inProgress)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="notStarted" name="notStarted" stackId="a" fill="var(--color-notStarted)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default DashboardChart;
