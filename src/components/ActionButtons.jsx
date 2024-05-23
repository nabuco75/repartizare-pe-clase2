import React from "react";
import PropTypes from "prop-types";

function ActionButtons({ onRepartizeaza, onReset }) {
  return (
    <div className="button-group">
      <button className="button" onClick={onRepartizeaza}>
        Repartizează
      </button>
      <button className="button reset-button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

ActionButtons.propTypes = {
  onRepartizeaza: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ActionButtons;
