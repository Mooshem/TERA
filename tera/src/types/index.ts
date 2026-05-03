export type User = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  points: number;
  badges: string[];
};

export type Post = {
  id?: string;
  caption: string;
  imageURL: string;
  userID: string;
  userName?: string;
  userPhoto?: string;
  createdAt: any;
  challengeID?: string;
};