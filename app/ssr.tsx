import { getRouter } from './router'
import { StartServer, createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'

const handler = createStartHandler({
    createRouter: getRouter,
    getRouterManifest,
})

export default defaultStreamHandler(handler)
