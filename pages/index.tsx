import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Header from '../components/Header'
import { Study, type User } from './api/types'
import CountUp from 'react-countup'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { Loader } from '../components/Helpers'
import { AreaChart, DonutChart, HeatMap } from '../components/Charts'
import Table from '../components/Table'


export default function Home({users} : { users: User[]}) {

	const [user, setUser] = useState(users[0])

	const { data, isFetching, isError } = useQuery<Study[]>(['users', user.id], async () => fetch('/api/studies/' + user.id).then(res => {
		if(res.ok) return res.json()
		throw 'API Error'
	}))

	const revenue = (data || []).reduce((acc, cv) => acc + (cv.revenue || 0), 0)

	return (
		<>
			<Header users={users} setUser={setUser} isFetching={isFetching} />
			{!isFetching && data ? <main className='max-w-7xl mx-auto flex gap-4'>
				<section className='w-96 flex-shrink-0'>
					<div className='flex items-center gap-4 h-16 border-b border-borderBlack pl-4 mb-4'>
						<h4 className='font-semibold'>{user.name}</h4>
						<span className='text-borderBlack'>/</span>
						<h5 className='text-lightText'>ID: {user.id.toUpperCase()}</h5>
					</div>
					<div className='flex flex-col items-center gap-4 animate-fade-in-up px-4'>
						<div className='card'>
							<div>
								<h3 className='text-xl text-lightText'>Total Revenue</h3>
								<h2 className='font-bold text-3xl text-success'><CountUp end={revenue} separator="," prefix='$' /></h2>
								<h4 className='text-lg text-accentLight'>Target - ${user.revenue_goal.toLocaleString()}</h4>
							</div>
							<div className='w-20'>
								<CircularProgressbar value={revenue/user.revenue_goal * 100} text={`${Math.round(revenue/user.revenue_goal * 100)}%`} styles={buildStyles({ textColor: 'white', pathColor: 'var(--accentDark)', trailColor: 'var(--accentLight)'})} />
							</div>
						</div>
						<div className='card'>
							<div>
								<h3 className='text-xl text-lightText'>Studies Completed</h3>
								<h2 className='font-bold text-3xl text-success'><CountUp end={(data || [0]).length} separator="," /></h2>
								<h4 className='text-lg text-accentLight'>Target - {user.studies_goal.toLocaleString()}</h4>
							</div>
							<div className='w-20'>
								<CircularProgressbar value={data.length/user.studies_goal * 100} text={`${Math.round(data.length/user.studies_goal * 100)}%`} styles={buildStyles({ textColor: 'white', pathColor: 'var(--accentDark)', trailColor: 'var(--accentLight)'})} />
							</div>
						</div>
						<div className='card'>
							<h3 className='text-xl text-lightText'>SLA Target</h3>
							<h2 className='font-bold text-3xl text-success'>{user.sla_goal}%</h2>
						</div>
						<div className='card'>
							<h3 className='text-xl text-lightText'>Body Part</h3>
							<h2 className='font-bold text-3xl text-accentLight'>{user.subspecialty_body_part}</h2>
							<h3 className='text-xl text-lightText'>Modality</h3>
							<h2 className='font-bold text-3xl text-accentLight'>{user.subspecialty_modality}</h2>
						</div>
						<DonutChart data={data} />
					</div>
				</section>
				<section className='w-full animate-fade-in-up mb-8'>
					<Table data={data} />
					<HeatMap data={data} />
					<AreaChart data={data} />
				</section>
			</main> : <Loader isLoading={isFetching} isError={isError} className='fixed' />}
		</>
	)
}

export async function getServerSideProps(){
	try {
		const users = await fetch('http://127.0.0.1:8000/api/users/').then(res => {
			if(res.ok) return res.json()
			throw 'Unable to retrieve users'
		})

		return { props: {users} }

	} catch(e){
		return { redirect: { permanent: false, destination: '/404' }}
	}
}