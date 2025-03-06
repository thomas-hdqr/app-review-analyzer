'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * SentimentChart component for displaying sentiment analysis
 * @param {Object} props - Component props
 * @param {Object} props.sentimentData - Sentiment data object
 */
export default function SentimentChart({ sentimentData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!sentimentData) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
          {
            data: [
              sentimentData.positive,
              sentimentData.neutral,
              sentimentData.negative
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',  // green
              'rgba(156, 163, 175, 0.8)', // gray
              'rgba(239, 68, 68, 0.8)'    // red
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(156, 163, 175, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sentimentData]);

  if (!sentimentData) {
    return <div className="text-center text-gray-500">No sentiment data available</div>;
  }

  const totalReviews = sentimentData.total || 
    (sentimentData.positive + sentimentData.neutral + sentimentData.negative);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sentiment Distribution</h3>
      
      <div className="relative h-64 mb-4">
        <canvas ref={chartRef}></canvas>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{totalReviews}</p>
            <p className="text-sm text-gray-500">Total Reviews</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="text-center">
          <p className="text-sm font-medium text-green-700">Positive</p>
          <p className="text-lg font-bold text-gray-800">
            {sentimentData.positive}
            <span className="text-xs text-gray-500 ml-1">
              ({((sentimentData.positive / totalReviews) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Neutral</p>
          <p className="text-lg font-bold text-gray-800">
            {sentimentData.neutral}
            <span className="text-xs text-gray-500 ml-1">
              ({((sentimentData.neutral / totalReviews) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-red-700">Negative</p>
          <p className="text-lg font-bold text-gray-800">
            {sentimentData.negative}
            <span className="text-xs text-gray-500 ml-1">
              ({((sentimentData.negative / totalReviews) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Average Rating</span>
          <span className="text-lg font-bold text-blue-600">{sentimentData.averageScore.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-gray-500">Positive/Negative Ratio</span>
          <span className="text-lg font-bold text-blue-600">{sentimentData.sentimentRatio.toFixed(1)}:1</span>
        </div>
      </div>
    </div>
  );
}