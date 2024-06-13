//DB에서 뽑아온 data를 프론트에 알맞은 양식으로 응답해주기 위해 틀을 작성.
export interface LookBookDetailDataTransform {
  lookbook: LookBookData;
  user: UserData;
  tops: ClothData[];
  accessories: ClothData[];
  pant: ClothData;
  shoe: ClothData;
  comments: CommentData[];
}

export interface LookBookData {
  lookbookId: number;
  title: string;
  type: string[];
  memo?: string | null;
  likeCnt: number;
  commentCnt: number;
}

export interface UserData {
  uuid: string;
  nickname: string;
  like: boolean;
  save: boolean;
}

export interface ClothData {
  id: number;
  url: string;
  memo?: string | null;
}

export interface CommentData {
  id: number;
  parentId: number | null;
  content: string;
  writer?: string | null;
  writerUUID?: string | null;
}
