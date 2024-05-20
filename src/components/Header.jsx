import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

function Header({ backgroundImage }) {
  return (
    <div className="header-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="header-text">
        <h1>Clasa Pregătitoare</h1>
        <p>Repartizarea elevilor pe clase - Aplicație Web - proiect digital al Școlii Gimnaziale Ștefan cel Mare Vaslui</p>
      </div>
    </div>
  );
}

Header.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
};

export default Header;
