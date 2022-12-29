import type { NextApiRequest, NextApiResponse } from 'next'

// Simple wrapper to not deal with CORS issues. Could have better error handeling.
export default async function handler(req: NextApiRequest, res: NextApiResponse){
	try {
		const user = req.query.user as string
        const data = await fetch('http://127.0.0.1:8000/api/studies/?assigned_to=' + user).then(res => {
			if(res.ok) return res.json()
			throw 'API Error'
		})
		return res.status(200).json(data)
	} catch(e) {
		return res.status(400).json({ message: 'Something went wrong.'})
	}
}