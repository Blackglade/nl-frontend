type LoaderProps = {
	isLoading?: boolean
	isError?: boolean
	error?: string
	className?: string
}

export function Loader({isLoading, isError, error, className} : LoaderProps){
	if(!isLoading && !isError) return <></>
	return(
		<div className={"w-full h-full z-20 flex items-center justify-center " + (className || 'absolute')}>
			<div className="absolute w-full h-full"></div>
			{isLoading && <span className="w-12 h-12 border-accentDark border-4 border-b-transparent rounded-full inline animate-spin z-[999]"></span>}
			{isError && <div className="text-red-700 z-[999] flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				<p>{error || 'Component Failed to Load'}</p>
			</div>}
		</div>
	)
}