import { Variables } from "../constants";

export function separateWords(sentence: string) {
  if (!sentence)
    return []
  sentence = sentence.trim();
  const wordsArray = sentence.split(' ');
  return wordsArray;
}
export function getRandomNumber(min: number, max: number) {
  if (min >= max) {
    // throw new Error('Minimum value must be less than the maximum value.');
    return 0
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomNumbers(min: number, max: number, number: number) {
  if (min < max && max > number) {
    // throw new Error('Minimum value must be less than the maximum value.');
    var vals: number[] = []
    while (vals.length < number) {
      let random = Math.floor(Math.random() * (max - min + 1)) + min;
      if (vals.length == 0 || vals.find(x => x == random) == undefined) {
        vals.push(random)
      }
      // console.log(random)
    }
    return vals
  }
  return [0]
  // return Math.floor(Math.random() * (max - min + 1)) + min;

}
export function getRandom() {
  return Math.random() - 0.5; // Subtracting 0.5 to get both positive and negative values
}

export function randomSort(list: any) {
  const sort = () => {
    return getRandom();
  }
  list.sort(sort);
  return list
}
export function getTokenFromStorage() {
  let token = localStorage?.getItem(Variables.TOKEN_KEY)
  if (token)
    return JSON.parse(token);
}
// export {}