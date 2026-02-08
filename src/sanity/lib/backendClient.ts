import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Write operations should never use CDN
  token: process.env.SANITY_API_TOKEN, // 👇 This uses the secure token
})