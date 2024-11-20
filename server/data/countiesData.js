import mongoose from "mongoose";

const countyIds = [];
for (let i = 0; i < 41; i++) {
  countyIds.push(new mongoose.Types.ObjectId());
}

export const counties = [
  {
    _id: countyIds[0],
    idCounty: 1,
    name: "Alba",
  },
  {
    _id: countyIds[1],
    idCounty: 2,
    name: "Arad",
  },
  {
    _id: countyIds[2],
    idCounty: 3,
    name: "Arges",
  },
  {
    _id: countyIds[3],
    idCounty: 4,
    name: "Bacau",
  },
  {
    _id: countyIds[4],
    idCounty: 5,
    name: "Bihor",
  },
  {
    _id: countyIds[5],
    idCounty: 6,
    name: "Bistrita-Nasaud",
  },
  {
    _id: countyIds[6],
    idCounty: 7,
    name: "Botosani",
  },
  {
    _id: countyIds[7],
    idCounty: 8,
    name: "Braila",
  },
  {
    _id: countyIds[8],
    idCounty: 9,
    name: "Brasov",
  },
  {
    _id: countyIds[9],
    idCounty: 10,
    name: "Bucuresti",
  },
  {
    _id: countyIds[10],
    idCounty: 11,
    name: "Buzau",
  },
  {
    _id: countyIds[11],
    idCounty: 12,
    name: "Calarasi",
  },
  {
    _id: countyIds[12],
    idCounty: 13,
    name: "Caras-Severin",
  },
  {
    _id: countyIds[13],
    idCounty: 14,
    name: "Cluj",
  },
  {
    _id: countyIds[14],
    idCounty: 15,
    name: "Constanta",
  },
  {
    _id: countyIds[15],
    idCounty: 16,
    name: "Covasna",
  },
  {
    _id: countyIds[16],
    idCounty: 17,
    name: "Dambovita",
  },
  {
    _id: countyIds[17],
    idCounty: 18,
    name: "Dolj",
  },
  {
    _id: countyIds[18],
    idCounty: 19,
    name: "Galati",
  },
  {
    _id: countyIds[19],
    idCounty: 20,
    name: "Giurgiu",
  },
  {
    _id: countyIds[20],
    idCounty: 21,
    name: "Gorj",
  },
  {
    _id: countyIds[21],
    idCounty: 22,
    name: "Harghita",
  },
  {
    _id: countyIds[22],
    idCounty: 23,
    name: "Hunedoara",
  },
  {
    _id: countyIds[23],
    idCounty: 24,
    name: "Ialomita",
  },
  {
    _id: countyIds[24],
    idCounty: 25,
    name: "Iasi",
  },
  {
    _id: countyIds[25],
    idCounty: 26,
    name: "Maramures",
  },
  {
    _id: countyIds[26],
    idCounty: 27,
    name: "Mehedinti",
  },
  {
    _id: countyIds[27],
    idCounty: 28,
    name: "Mures",
  },
  {
    _id: countyIds[28],
    idCounty: 29,
    name: "Neamt",
  },
  {
    _id: countyIds[29],
    idCounty: 30,
    name: "Olt",
  },
  {
    _id: countyIds[30],
    idCounty: 31,
    name: "Prahova",
  },
  {
    _id: countyIds[31],
    idCounty: 32,
    name: "Salaj",
  },
  {
    _id: countyIds[32],
    idCounty: 33,
    name: "Satu Mare",
  },
  {
    _id: countyIds[33],
    idCounty: 34,
    name: "Sibiu",
  },
  {
    _id: countyIds[34],
    idCounty: 35,
    name: "Suceava",
  },
  {
    _id: countyIds[35],
    idCounty: 36,
    name: "Teleorman",
  },
  {
    _id: countyIds[36],
    idCounty: 37,
    name: "Timis",
  },
  {
    _id: countyIds[37],
    idCounty: 38,
    name: "Tulcea",
  },
  {
    _id: countyIds[38],
    idCounty: 39,
    name: "Valcea",
  },
  {
    _id: countyIds[39],
    idCounty: 40,
    name: "Vaslui",
  },
  {
    _id: countyIds[40],
    idCounty: 41,
    name: "Vrancea",
  },
  {
    _id: countyIds[41],
    idCounty: 42,
    name: "Ilfov",
  },
];
