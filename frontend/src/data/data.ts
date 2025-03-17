import prod1 from "../assets/prod1.jpg";
import prod2 from "../assets/prod2.jpg";
import prod3 from "../assets/prod3.jpg";
import prod4 from "../assets/prod4.jpg";
import prod5 from "../assets/prod5.jpg";
import prod6 from "../assets/prod6.jpg";

export interface Product {
  name: string;
  description: string;
  price: number;
  ratings: number;
  images: { public_id: string; url: string }[];
  category: string;
}

export const sampleProducts: Product[] = [
  {
    name: "hello",
    description: "A stylish, vibrant T-shirt from Rukpala",
    price: 999,
    ratings: 4.5,
    images: [{ public_id: "sample1", url: prod1 }],
    category: "T-Shirts",
  },
  {
    name: "Rukpala Graphic Tee",
    description: "A bold graphic tee for streetwear lovers",
    price: 899,
    ratings: 4.3,
    images: [{ public_id: "sample2", url: prod2 }],
    category: "T-Shirts",
  },
  {
    name: "Rukpala Abstract Tee",
    description: "A unique abstract graphic tee",
    price: 899,
    ratings: 4.3,
    images: [{ public_id: "sample3", url: prod3 }],
    category: "T-Shirts",
  },
  {
    name: "Rukpala Streetwear Tee",
    description: "The perfect streetwear fit",
    price: 899,
    ratings: 4.3,
    images: [{ public_id: "sample4", url: prod4 }],
    category: "T-Shirts",
  },
  {
    name: "Rukpala Yellow Tee",
    description: "A trendy yellow T-shirt for casual wear",
    price: 899,
    ratings: 4.3,
    images: [{ public_id: "sample5", url: prod5 }],
    category: "T-Shirts",
  },
  {
    name: "Rukpala Colorful Tee",
    description: "A vibrant and colorful T-shirt",
    price: 899,
    ratings: 4.3,
    images: [{ public_id: "sample6", url: prod6 }],
    category: "T-Shirts",
  },
];
