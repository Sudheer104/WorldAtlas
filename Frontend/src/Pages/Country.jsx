import { useEffect, useState, useTransition } from 'react';
import { getCountryData } from '../api/postApi';
import Loader from './../UI/Loader';
import CountryCard from '.././components/Layouts/CountryCard';
import SearchFilter from './../UI/SearchFilter';
function Country() {
  const [isPending, startTransition] = useTransition()
  const [countries, setCountries] = useState([]);

  const [search, setSearch] = useState();
  const [filter, setFilter] = useState("all")


  useEffect(() => {
    startTransition(async () => {
      /** //If used fetch like this
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags");
        const data = res.json();
        setData(data);
       */
     
      //With the help of axios data are fetching
      const res = await getCountryData();
      setCountries(res.data);
    })
  }, [])

  if (isPending) return <Loader />

  //here is main logic for filter or search
  
  const searchCountry = (country) => {
    if (search) {
      return country.name.common.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  };
  
  const filterRegion = (country) => {
    if (filter === "all") return country;
    return country.region === filter;
  };
  
  const filterCountries = countries.filter((country) => 
      searchCountry(country) && filterRegion(country)
  );
  
  
  return (
    <>
      <section className='country-section'>

        <SearchFilter
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          countries={countries}
          setCountries={setCountries}
        />

        <ul className='grid grid-four-cols'>{
          //filterCountries inthis place when making a card this is country.map()
        filterCountries.map((curCountry, index) => {
            return <CountryCard Country={curCountry} key={index} />
          })
        }</ul>
      </section>
    </>
  )
}

export default Country;
