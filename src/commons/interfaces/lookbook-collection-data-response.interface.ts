//DB에서 뽑아온 data를 프론트에 알맞은 양식으로 응답해주기 위해 틀을 작성.
export interface LookBookCollectionDataTransform {
  id: number;
  tops: {
    urls: string[];
  };
  accessories: {
    urls: string[];
  };
  pant: { url: string };
  shoe: { url: string };
}
