import {NavLink} from "react-router-dom"

function CountryCard({Country}) {
 
    const{flags, name, population, region, capital } = Country;

  return (
    <div>
        <li className="country-card card">
        <div className="container-card bg-white-box">
          <img src={flags.svg} alt={flags.alt} />
          <div className="countryInfo">
            <p className="card-title">{name.common.length > 10 ? name.common.slice(0,10) + "..." : name.common}</p>

            <p>
                <span className="card-description">Population:</span>
                {population.toLocalString}
            </p>
            <p>
                <span className="card-description">Region:</span>
                {region}
            </p>
            <p>
                <span className="card-description">Capital:</span>
                {capital[0]}
            </p>
            <NavLink to={`/layout/country/${name.common}`}>
            <button>Read More</button>
            </NavLink>
          </div>
        </div>
        </li>
    </div>
  )
}

export default CountryCard