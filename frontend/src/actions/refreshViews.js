'use server'

import { revalidatePath } from 'next/cache'

const REFRESH_PATHS = ['/dashboard', '/entries', '/reports', '/budgets', '/categories']

export async function revalidateAppViews() {
    REFRESH_PATHS.forEach((path) => revalidatePath(path))
}
