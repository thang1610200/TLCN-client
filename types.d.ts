export type course = {
  id: number;
  title: string;
  username: string;
  vote: string;
  students: string;
  price: string;
  oldPrice: string;
};

export type IUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  image: string;
  role: string;
  activation_code: string;
  registration_date: string;
  status: string;
}