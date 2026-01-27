'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './env'
import {schema} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  basePath: '/sanity-studio',
  projectId,
  dataset,
  
  // 👇 ADD THIS LINE
  title: "Tyaara Trends Admin", 

  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})