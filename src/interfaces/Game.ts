export default interface Game {
  _id: string;
  title: string;
  description: string;
  genres: { name: string }[];
  companies: { company: { name: string } }[];
  rating: number;
  cover_url: string;
  magnet_urls: {
    url: string;
    repack: boolean;
    crackGroup: boolean;
    cracker: string;
    repacker: string;
    title: string;
  }[];
  created_at: Date;
  updated_at: Date;
}
