function getLanguageByCountry(country) {
    if (country === "DE" || country === "AT") {
      return (indexFileName = "German");
    } else if (
      country === "MX" ||
      country === "ES" ||
      country === "CO" ||
      country === "VE" ||
      country === "CL" ||
      country === "AR" ||
      country === "PE" ||
      country === "EC" ||
      country === "BO" ||
      country === "PY" ||
      country === "GT" ||
      country === "PR" ||
      country === "DO" ||
      country === "SV" ||
      country === "HN" ||
      country === "PA" ||
      country === "UY" ||
      country === "CR" ||
      country === "NI"
    ) {
      return (indexFileName = "Spanish");
    } else {
      return (indexFileName = "");
    }
  }
  module.exports = {
    getLanguageByCountry
  };