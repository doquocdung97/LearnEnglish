function getRandom() {
    return Math.random() - 0.5; // Subtracting 0.5 to get both positive and negative values
}

export function randomSort(list: any) {
    const sort = () => {
        return getRandom();
    }
    list.sort(sort);
    return list
}