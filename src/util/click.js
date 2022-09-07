function debounce(fn, wait = 200) {
    let timer = null
    return function (...args) {
        if (timer !== null) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(args)
            timer = null
        }, wait)
    }
}

export default debounce
