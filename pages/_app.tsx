import { useState } from 'react'
import '../styles/globals.css'
import 'react-circular-progressbar/dist/styles.css';
import type { AppProps } from 'next/app'
import { Hydrate, QueryClient, QueryClientProvider} from '@tanstack/react-query'

export default function App({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())

	queryClient.setDefaultOptions({
		queries: {
			keepPreviousData: true,
			staleTime: Infinity,
			cacheTime: Infinity,
			retry: false
		}
	})

	return(
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<Component {...pageProps} />
			</Hydrate>
		</QueryClientProvider>
	)
}
