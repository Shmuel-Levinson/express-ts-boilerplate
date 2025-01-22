
export function sleep(duration=2000) {
    return new Promise(resolve => setTimeout(resolve, duration))
}