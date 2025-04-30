import axios from "axios";

//Instance method
const api = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

// HTTP GET METHOD (with the help of instance method we can get data from api)
export const getCountryData = () => {
  return api.get("/all?fields=name,population,region,capital,flags");
};

// // HTTP GET METHOD fro the indvi. country name
export const getCountryIndData = (name) => {
  return api.get(
    `/name/${name}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags`
  );
};