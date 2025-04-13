import { Show } from "./Show";

export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    tickets: Show[];
  }