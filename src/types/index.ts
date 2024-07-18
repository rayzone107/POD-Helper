export interface Category {
    id: string;
    name: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    categoryId: string;
  }
  