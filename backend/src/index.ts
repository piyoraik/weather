import axios, { AxiosError } from 'axios'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { WeatherType } from './Types/WeatherType'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

interface IErrorResponse {
	error: string
}

type weatherParams = {
	weather_code: string
}

const FetchWeather = (cityNumber: string): Promise<void | WeatherType> => {
	const weather = axios
		.get<WeatherType>(
			`https://weather.tsukumijima.net/api/forecast?city=${cityNumber}`
		)
		.then((res) => {
			return res.data
		})
		.catch((e: AxiosError<IErrorResponse>) => {
			if (e.response !== undefined) {
				console.error(e.response.data.error)
			}
		})
	return weather
}

app.post(
	'/',
	async (request: Request<{}, {}, weatherParams>, response: Response) => {
		const req = request.body
		const fetchData = await FetchWeather(req.weather_code)
		if (fetchData !== undefined) {
			response.status(200).send(fetchData)
		} else {
			response.status(500).send('Internal Server Error')
		}
	}
)

app.listen(port, () => {
	console.log(`start on port ${port}`)
})
