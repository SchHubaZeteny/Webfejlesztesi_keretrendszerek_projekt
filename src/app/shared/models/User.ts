export interface User {
    id: string;
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    tickets: string[];
    bought: string[];
  }