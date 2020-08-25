export const randomChance = (maximum?) => {
    if(maximum) {
        return Math.floor(Math.random() * (maximum + 1)) +1;
    } else {
        return Math.floor(Math.random() * 10) + 1;
    }
}
