import dynamic from 'next/dynamic'
import type { MODALITY, Study } from '../../pages/api/types'
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false})

const parseDonutChartData = (data: Study[]) => {

	let donutData : { series: number[], labels: MODALITY[]} = { series: [], labels: [] }

	data.forEach(study => {
		let i = donutData.labels.findIndex(modality => modality === study.modality)

		if(i !== -1) donutData.series[i] += 1
		else {
			donutData.series.push(1)
			donutData.labels.push(study.modality)
		}
	})

	return(donutData)
}

export default function DonutChart({data} : {data: Study[]}){

	const { series, labels } = parseDonutChartData(data)

	return(
		<div className='w-full'>
			<h2 className='text-2xl font-semibold text-white text-center'>MODALITY DISTRIBUTION</h2>
			<Chart width="100%" height="300px" type='donut' series={series}
				options={{
					chart: {
						id: `DonutChart-${Math.random()}`,
						type: 'donut',
						toolbar: { show: false },
						zoom: { enabled: false },
						fontFamily: "'Source Sans Pro', sans-serif;"
					},
					plotOptions: {
						pie: {
							expandOnClick: false,
							donut: {
								labels: { show: true, value: { color: 'var(--accentLight)' } },
								size: '50%'
							},
							
						}
					},
					labels: labels,
					dataLabels: {  },
					legend: { show: false },
					tooltip: { enabled: false },
					colors: ['var(--accentDark)'],
					stroke: {
						colors: ['var(--bgColor)']
					}
				}}
			/>
		</div>
	)
}