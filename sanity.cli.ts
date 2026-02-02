import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '507mpyae', // 👈 Copy this from your .env.local (NEXT_PUBLIC_SANITY_PROJECT_ID)
    dataset: 'production'
  }
})