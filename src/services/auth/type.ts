export interface RegisTerTypes {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
export interface UpdatePasswordTypes {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
export interface LoginTypes {
  email: string;
  password: string;
}
export interface EditProfileType {
  image: string;
  first_name: string;
  last_name: string;
  location: string;
  bio: string;
}
