export const THEMES: ITheme[] = [
  {
    hosts: ["turo.parkimo.com", "r1turo.parkimo.com"],
    siteName: 'Parkimo LLC',
    imagePath: {
      logo: "",
      favicon: "",
    },
    title: 'Turo Parkimo',
    primaryColor: "f49d1a",
  },
  {
    hosts: ["app.parkmycarshare.com", "r1app.parkmycarshare.com", "localhost"],
    siteName: 'Park My Car Share LLC',
    imagePath: {
      logo: "app.parkmycarshare.com",
      favicon: "app.parkmycarshare.com",
    },
    title: 'Park My Car Share',
    primaryColor: "8ccb9a",
  },
];

export interface ITheme {
  hosts: string[];
  siteName: string;
  imagePath: {
    logo: string;
    favicon: string;
  };
  title: string;
  primaryColor: string;
}
