import React from 'react'

function SearchFilter({ search, setSearch, filter, setFilter, countries, setCountries }) {

    function handleInputChange(event) {
        event.preventDefault();
        setSearch(event.target.value);
    }

    function handleSelectChange(event) {
        event.preventDefault();
        setFilter(event.target.value);
    }

    function sortCountries(value) {
        //Here sort apply according to name of countries
        const sortCountry = [...countries].sort((a, b) => { //[...countries] this is copy of "countries" because i can not 
            return value === "asc"                          //Directly sapply sort in useState
                ? a.name.common.localeCompare(b.name.common) //For ascending order
                : b.name.common.localeCompare(a.name.common) //For descending order
        })
        setCountries(sortCountry);
    }

    return (
        <div>
            <section className='section-searchFilter container'>
                <div>
                    <input type="text" placeholder='search'
                        value={search} onChange={handleInputChange} />
                </div>

                <div>
                    <button onClick={() => sortCountries("asc")}>Asc</button>
                </div>

                <div>
                    <button onClick={() => sortCountries("desc")}>Desc</button>
                </div>

                <div>
                    <select className='select-section'
                        value={filter} onChange={handleSelectChange}>
                        <option value="all">All</option>
                        <option value="Africa">Africa</option>
                        <option value="Americas">Americas</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Oceania">Oceania</option>
                    </select>
                </div>

            </section>
        </div>
    )
}

export default SearchFilter