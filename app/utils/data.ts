import { createServerFn } from '@tanstack/react-start'
import fs from 'fs/promises'
import path from 'path'

// Helper to locate data directory
async function getDataPath() {
    const currentDir = process.cwd()
    const dataDir = path.join(currentDir, 'data')
    // ensure directory exists
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
    return path.join(dataDir, 'data.json')
}

export const getData = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const filePath = await getDataPath();
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, return default structure
            return { habits: [], completions: [] };
        }
    })

export const saveData = createServerFn({
    method: "POST",
    validator: (data: { habits: any[], completions: any[] }) => data,
})
    .handler(async ({ data }) => {
        try {
            const filePath = await getDataPath();
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return { success: true };
        } catch (error) {
            console.error('Error saving data:', error);
            throw new Error('Failed to save data');
        }
    })
