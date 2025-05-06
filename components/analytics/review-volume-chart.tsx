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
import {
  format,
  parseISO,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns"
import type { Review } from "@/hooks/use-reviews"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ReviewVolumeChartProps {
  reviews: Review[]
  timeRange: string
}

export function ReviewVolumeChart({ reviews, timeRange }: ReviewVolumeChartProps) {
  const chartRef = useRef<ChartJS>(null)

  // Determine interval based on time range
  const getIntervalAndFormat = () => {
    const now = new Date()
    let start: Date
    let interval: Date[]
    let dateFormat: string

    switch (timeRange) {
      case "7days":
        start = subDays(now, 7)
        interval = eachDayOfInterval({ start, end: now })
        dateFormat = "MMM d"
        break
      case "30days":
        start = subDays(now, 30)
        interval = eachDayOfInterval({ start, end: now })
        dateFormat = "MMM d"
        break
      case "90days":
        start = subDays(now, 90)
        interval = eachWeekOfInterval({ start, end: now })
        dateFormat = "MMM d"
        break
      case "6months":
        start = subMonths(now, 6)
        interval = eachWeekOfInterval({ start, end: now })
        dateFormat = "MMM d"
        break
      case "1year":
        start = subMonths(now, 12)
        interval = eachMonthOfInterval({ start, end: now })
        dateFormat = "MMM yyyy"
        break
      default:
        start = subDays(now, 30)
        interval = eachDayOfInterval({ start, end: now })
        dateFormat = "MMM d"
    }

    return { interval, dateFormat }
  }

  const { interval, dateFormat } = getIntervalAndFormat()

  // Count reviews for each interval
  const countReviewsByInterval = () => {
    const reviewCounts: number[] = []

    interval.forEach((date) => {
      let intervalStart: Date
      let intervalEnd: Date

      if (timeRange === "90days" || timeRange === "6months") {
        // Weekly intervals
        intervalStart = startOfWeek(date)
        intervalEnd = endOfWeek(date)
      } else if (timeRange === "1year") {
        // Monthly intervals
        intervalStart = startOfMonth(date)
        intervalEnd = endOfMonth(date)
      } else {
        // Daily intervals
        intervalStart = startOfDay(date)
        intervalEnd = endOfDay(date)
      }

      // Count reviews in this interval
      const count = reviews.filter((review) => {
        const reviewDate = parseISO(review.date)
        return reviewDate >= intervalStart && reviewDate <= intervalEnd
      }).length

      reviewCounts.push(count)
    })

    return reviewCounts
  }

  const reviewCounts = countReviewsByInterval()

  // Format dates for labels
  const labels = interval.map((date) => format(date, dateFormat))

  // Prepare chart data
  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Number of Reviews",
        data: reviewCounts,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [reviews, timeRange])

  if (reviews.length === 0) {
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
