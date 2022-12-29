import dynamic from 'next/dynamic'
import type { Study } from '../../pages/api/types'
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false})

const parseAreaChartData = (data: Study[]) => {
	let parsedData = data.reduce((acc: { year: number, passed: number, failed: number}[], cv) => {
		if(typeof cv.sla !== 'undefined'){
			const year = new Date(cv.date).getFullYear()
			let findYear = acc.findIndex(study => study.year === year)
			if(findYear === -1){
				acc.push({ 
					year: year, 
					passed: cv.sla >= 0 ? 1 : 0 , 
					failed: cv.sla < 0 ? 1 : 0 
				})
			} else {
				if(cv.sla >= 0) acc[findYear].passed += 1
				else acc[findYear].failed += 1
			}
		}
		return acc
	}, [])

	parsedData.sort((a, b) => a.year - b.year)

	return(parsedData.reduce((acc: { years: string[], series: [{ name: 'Passed', data: number[]}, { name: 'Failed', data: number[]}] }, cv) => {
		acc.years.push(cv.year.toString())
		acc.series[0].data.push(cv.passed)
		acc.series[1].data.push(cv.failed)
		return acc
	}, { years: [], series: [{ name: 'Passed', data: [] }, { name: 'Failed', data: []}] }))
}

export default function AreaChart({data} : {data: Study[]}){
	
	const { years, series } = parseAreaChartData(data)

	return(
		<div>
			<h2 className='text-3xl font-semibold -mb-4'>SLA TARGET PERCENTAGE</h2>
			<Chart width="100%" height="350px" type='bar' series={series}
				options={{
					chart: {
						id: `AreaChart-${Math.random()}`,
						type: 'bar',
						stacked: true,
						stackType: '100%',
						toolbar: { show: false },
						zoom: { enabled: false },
						fontFamily: "'Source Sans Pro', sans-serif;",
					},
					colors: ['var(--success)', 'var(--error)'],
					xaxis: {
						categories: years,
						axisBorder: { show: false },
						axisTicks: { show: false },
						labels: { style: { colors: '#FFF' } },
						tooltip: { enabled: false }
					},
					yaxis: {
						show: false,
						opposite: true,
					},
					legend: { show: false },
					tooltip: {
						custom: ({series, seriesIndex, dataPointIndex}) =>{
						return(`<div class="p-4 bg-black border-none">
							<h5 class="text-white">SLA ${seriesIndex ? 'Failed' : 'Passed'}<h5>
							<h4 class="${seriesIndex ? 'text-error' : 'text-success'} text-lg font-semibold">${series[seriesIndex][dataPointIndex]} Studies</h4>
						</div>`)},
					},
					grid: { padding: {left: 0, right: 0 }, borderColor: 'var(--darkerText)' },
					// plotOptions: { heatmap: { useFillColorAsStroke: true } },
				}}
			/>
		</div>
	)
}