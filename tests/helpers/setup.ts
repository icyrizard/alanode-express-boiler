import resetDb from './reset-db'

export async function beforeEachHelper() {
    await resetDb()
}
