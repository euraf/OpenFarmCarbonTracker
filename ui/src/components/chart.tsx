import { onMount } from 'solid-js'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Line } from 'solid-chartjs'

export const MyChart = () => {
    /**
     * You must register optional elements before using the chart,
     * otherwise you will have the most primitive UI
     */
    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors)
    })

    const chartData = {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [
            {
                label: 'Emission',
                data: [50, 60, 70, 80, 90],
            },
        ],
    }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <div>
            <Line data={chartData} options={chartOptions} width={500} height={500} />
        </div>
    )
}