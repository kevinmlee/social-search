import { NextResponse } from 'next/server'
import axios from 'axios'

const mockLocation = {
  ip: '134.201.250.155',
  network: '134.201.250.155/32',
  version: 'IPv4',
  city: 'Los Angeles',
  region: 'California',
  region_code: 'CA',
  country: 'US',
  country_name: 'United States',
  country_code: 'US',
  country_code_iso3: 'USA',
  country_capital: 'Washington',
  country_tld: '.us',
  continent_code: 'NA',
  in_eu: false,
  postal: '90060',
  latitude: 34.0544,
  longitude: -118.2441,
  timezone: 'America/Los_Angeles',
  utc_offset: '-0700',
  country_calling_code: '+1',
  currency: 'USD',
  currency_name: 'Dollar',
  languages: 'en-US,es-US,haw,fr',
  country_area: 9629091.0,
  country_population: 327167434,
  asn: 'AS25876',
  org: 'LADWP-INTERNET',
}

export async function GET(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const clientIP = forwarded ? forwarded.split(',')[0] : null

  try {
    const response = await axios.get(`https://ipapi.co/${clientIP}/json`)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(mockLocation)
  }
}
