import dynamic from 'next/dynamic'
import type { BODY_PART, Study } from '../../pages/api/types'
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false})

const parseHeatMapData = (data: Study[]) => {
	let heatmap : {
		name: BODY_PART
		data: { x: string, y: number, totalRevenue: number }[]
	}[] = []

	data.forEach(study => {
		let i = heatmap.findIndex(part => part.name === study.body_part)
		const year = new Date(study.date).getFullYear()
		const revenue = study.revenue || 0
		if(i !== -1){
			let j = heatmap[i].data.findIndex(d => d.x === year.toString())
			if(j !== -1) {
				heatmap[i].data[j].y += 1
				heatmap[i].data[j].totalRevenue += revenue
			} else {
				heatmap[i].data.push({x: year.toString(), y: 1, totalRevenue: revenue})
			}
		} else {
			heatmap.push({
				name: study.body_part,
				data: [{ x: year.toString(), y: 1, totalRevenue: revenue}]
			})
		}
	})

	heatmap.forEach(part => part.data.sort((a, b) => parseInt(a.x) - parseInt(b.x)))

	return(heatmap)
}

export default function HeatMap({data} : {data: Study[]}){
	
	const series = parseHeatMapData(data)

	return(
		<div>
			<h2 className='text-3xl font-semibold mt-4 -mb-4'>BODY PART STUDIES HEATMAP</h2>
			<Chart width="100%" height="450px" type='heatmap' series={series}
				options={{
					chart: {
						id: `HeatMap-${Math.random()}`,
						type: 'heatmap',
						toolbar: { show: false },
						zoom: { enabled: false },
						fontFamily: "'Source Sans Pro', sans-serif;",
					},
					colors: ["#906AFB"],
					xaxis: {
						axisBorder: { show: false },
						axisTicks: { show: false },
						labels: { style: { colors: '#FFF' } },
						tooltip: { enabled: false }
					},
					yaxis: {
						opposite: true,
						labels: { style: { colors: '#FFF' } }
					},
					grid: { padding: {left: 0 } },
					plotOptions: { heatmap: { useFillColorAsStroke: true } },
					tooltip: {
						custom: ({seriesIndex, dataPointIndex}) =>
						`<div class="p-4 bg-black border-none">
							<h5 class="text-white">Revenue Earned<h5>
							<h4 class="text-success text-lg font-semibold">$${series[seriesIndex].data[dataPointIndex].totalRevenue.toLocaleString()}</h4>
						</div>`,
					}
				}}
			/>
		</div>
	)
}