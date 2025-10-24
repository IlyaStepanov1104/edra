import { FC, useEffect, useState } from 'react';
import { Card, Text, View } from 'reshaped';
import { getStatistics } from '@shared/lib/api';
import { useAuth } from '@shared/lib/auth';
import { useParams } from 'react-router-dom';

interface StatisticsData {
  metrics: {
    accuracy?: number;
    avgResponseTime?: number;
    sessionsCount?: number;
  };
  updatedAt?: string;
}

interface StatItem {
  title: string;
  value: string | number;
}

export const Statistics: FC = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [error, setError] = useState('');
  const params = useParams();
  const botSlug = params.bot;

  useEffect(() => {
    if (!botSlug) return;

    const token = getToken();
    if (!token) {
      setError('Authentication required');
      return;
    }

    const loadStats = async () => {
      try {
        const data: StatisticsData = await getStatistics(botSlug, token);
        setStats([
          { title: 'Accuracy', value: `${data.metrics?.accuracy || 0}%` },
          { title: 'Response Time', value: `${data.metrics?.avgResponseTime || 0}s` },
          { title: 'Sessions', value: String(data.metrics?.sessionsCount || 0) },
          { title: 'Last Updated', value: new Date(data.updatedAt || Date.now()).toLocaleString() }
        ]);
      } catch (err) {
        setError('Failed to load statistics');
      }
    };

    loadStats();
  }, [botSlug, getToken]);

  if (!botSlug) {
    return (
      <Card padding={6}>
        <Text variant="body-1">Select a bot to view statistics</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding={6}>
        <Text color="critical">{error}</Text>
      </Card>
    );
  }

  return (
    <Card padding={6}>
      <View gap={4}>
        <Text variant="featured-2">Bot Statistics</Text>
        <View direction="row" wrap gap={4}>
          {stats.map((stat) => (
            <View key={stat.title} width="100%" maxWidth="200px">
              <Text variant="body-2" color="neutral-faded">
                {stat.title}
              </Text>
              <Text variant="body-1">{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};