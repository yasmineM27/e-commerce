"use client"

import { useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface RatingTrendsChartProps {
  reviews: Review[]
  timeRange: string
  detailed?: boolean
}

export function RatingTrendsChart({ reviews, timeRange, detailed = false }: RatingTrendsChartProps) {
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

  // Calculate average rating for each interval
  const calculateAverageRatings = () => {
    const averageRatings: number[] = []
    const ratingCounts: Record<number, number[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    }

    interval.forEach((date, index) => {
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

      // Filter reviews in this interval
      const intervalReviews = reviews.filter((review) => {
        const reviewDate = parseISO(review.date)
        return reviewDate >= intervalStart && reviewDate <= intervalEnd
      })

      // Calculate average rating for this interval
      if (intervalReviews.length > 0) {
        const sum = intervalReviews.reduce((acc, review) => acc + review.rating, 0)
        averageRatings.push(Number((sum / intervalReviews.length).toFixed(1)))

        // Count ratings by star level
        const counts = {
          1: intervalReviews.filter((r) => r.rating === 1).length,
          2: intervalReviews.filter((r) => r.rating === 2).length,
          3: intervalReviews.filter((r) => r.rating === 3).length,
          4: intervalReviews.filter((r) => r.rating === 4).length,
          5: intervalReviews.filter((r) => r.rating === 5).length,
        }

        ratingCounts[1].push(counts[1])
        ratingCounts[2].push(counts[2])
        ratingCounts[3].push(counts[3])
        ratingCounts[4].push(counts[4])
        ratingCounts[5].push(counts[5])
      } else {
        // No reviews in this interval
        averageRatings.push(0)
        ratingCounts[1].push(0)
        ratingCounts[2].push(0)
        ratingCounts[3].push(0)
        ratingCounts[4].push(0)
        ratingCounts[5].push(0)
      }
    })

    return { averageRatings, ratingCounts }
  }

  const { averageRatings, ratingCounts } = calculateAverageRatings()

  // Format dates for labels
  const labels = interval.map((date) => format(date, dateFormat))

  // Prepare chart data
  const chartData: ChartData<"line"> = {
    labels,
    datasets: detailed
      ? [
          {
            label: "5 Stars",
            data: ratingCounts[5],
            borderColor: "rgba(34, 197, 94, 1)",
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            tension: 0.3,
          },
          {
            label: "4 Stars",
            data: ratingCounts[4],
            borderColor: "rgba(74, 222, 128, 1)",
            backgroundColor: "rgba(74, 222, 128, 0.5)",
            tension: 0.3,
          },
          {
            label: "3 Stars",
            data: ratingCounts[3],
            borderColor: "rgba(250, 204, 21, 1)",
            backgroundColor: "rgba(250, 204, 21, 0.5)",
            tension: 0.3,
          },
          {
            label: "2 Stars",
            data: ratingCounts[2],
            borderColor: "rgba(251, 146, 60, 1)",
            backgroundColor: "rgba(251, 146, 60, 0.5)",
            tension: 0.3,
          },
          {
            label: "1 Star",
            data: ratingCounts[1],
            borderColor: "rgba(239, 68, 68, 1)",
            backgroundColor: "rgba(239, 68, 68, 0.5)",
            tension: 0.3,
          },
        ]
      : [
          {
            label: "Average Rating",
            data: averageRatings,
            borderColor: "rgba(99, 102, 241, 1)",
            backgroundColor: "rgba(99, 102, 241, 0.5)",
            tension: 0.3,
            fill: true,
          },
        ],
  }

  const options: ChartOptions<"line"> = {
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
        min: detailed ? 0 : undefined,
        max: detailed ? undefined : 5,
        ticks: {
          stepSize: detailed ? undefined : 1,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
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
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
