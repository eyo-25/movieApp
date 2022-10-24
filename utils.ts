//width: string = "w500" default 값을 w500을 넣어 width값이 없어도 사용될수 있다.
export const makeImgPath = (img: string, width: string = "w500") =>
  `https://image.tmdb.org/t/p/${width}${img}`;
