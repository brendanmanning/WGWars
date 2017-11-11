/**
 * These are Flow types which correspond to the GraphQL types
 * @flow 
 */
export type Player = {
    id: string,
    name: string,
    verified: boolean
}

/**
 * Allows us to get a user by their ID number from the database
 */
export function getPlayer(id) {
    if(id == 'b') {
        return {
            id: 'b',
            name: 'Brendan Manning',
            verified: true
        }
    } else if(id == 'j') {
        return {
            id: 'j',
            name: 'Joe Manning',
            verified: false
        }
    }
}