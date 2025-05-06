"use client"

import { useEffect, useRef } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ReviewsChartProps {
  ratingDistribution: Record<number, number>
  totalReviews: number
}

export function ReviewsChart({ ratingDistribution, totalReviews }: ReviewsChartProps) {
  const chartRef = useRef<ChartJS>(null)

  // Prepare data for the chart
  const labels = ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"]
  const data = [
    ratingDistribution[5],
    ratingDistribution[4],
    ratingDistribution[3],
    ratingDistribution[2],
    ratingDistribution[1],
  ]

  // Calculate percentages
  const percentages = data.map((count) => (totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0))

  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Number of Reviews",
        data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // 5 stars - green
          "rgba(74, 222, 128, 0.8)", // 4 stars - light green
          "rgba(250, 204, 21, 0.8)", // 3 stars - yellow
          "rgba(251, 146, 60, 0.8)", // 2 stars - orange
          "rgba(239, 68, 68, 0.8)", // 1 star - red
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(74, 222, 128)",
          "rgb(250, 204, 21)",
          "rgb(251, 146, 60)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex
            const count = data[index]
            const percentage = percentages[index]
            return `${count} reviews (${percentage}%)`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [ratingDistribution, totalReviews])

  if (totalReviews === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No review data available for the selected period</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
