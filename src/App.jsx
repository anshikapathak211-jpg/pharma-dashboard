import "./App.css";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const drugs = [
  {
    country: "USA",
    therapyArea: "Oncology",
    drugName: "Drug A",
    developerCompanyGlobal: "Company X",
    developerCompanyRegional: "Company Y",
    approvalDate: "2024-01-15",
    launchDate: "2024-03-10",
    loe: "2039",
  },
  {
    country: "Germany",
    therapyArea: "Cardiology",
    drugName: "Drug B",
    developerCompanyGlobal: "Company Z",
    developerCompanyRegional: "Company A",
    approvalDate: "2023-05-20",
    launchDate: "2023-07-15",
    loe: "2038",
  },
  {
    country: "India",
    therapyArea: "Diabetes",
    drugName: "Drug C",
    developerCompanyGlobal: "Company B",
    developerCompanyRegional: "Company C",
    approvalDate: "2022-08-10",
    launchDate: "2022-10-05",
    loe: "2037",
  },
  {
    country: "UK",
    therapyArea: "Neurology",
    drugName: "Drug D",
    developerCompanyGlobal: "Company D",
    developerCompanyRegional: "Company E",
    approvalDate: "2024-02-12",
    launchDate: "2024-04-20",
    loe: "2040",
  },
];

function App() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTherapyArea, setSelectedTherapyArea] = useState("");
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [selectedDeveloperCompanyGlobal, setSelectedDeveloperCompanyGlobal] =
    useState("");
  const [selectedDeveloperCompanyRegional, setSelectedDeveloperCompanyRegional] =
    useState("");
  const [selectedApprovalDate, setSelectedApprovalDate] = useState("");
  const [selectedLaunchDate, setSelectedLaunchDate] = useState("");
  const [selectedLOE, setSelectedLOE] = useState("");

  const [openDropdown, setOpenDropdown] = useState("");

  // API states
  const [countrySearch, setCountrySearch] = useState("");
  const [apiDrugs, setApiDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch data from ClinicalTrials.gov
  const searchCountry = async () => {
    const country = countrySearch.trim();

    if (!country) {
      setApiError("Please enter a country name.");
      return;
    }

    setLoading(true);
    setApiError("");
    setApiDrugs([]);

    try {
      const url =
        `https://clinicaltrials.gov/api/v2/studies` +
        `?query.locn=${encodeURIComponent(country)}` +
        `&pageSize=50`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      const formattedData = [];

      data.studies.forEach((study) => {
        const protocol = study.protocolSection;

        const identification =
          protocol?.identificationModule || {};

        const conditions =
          protocol?.conditionsModule?.conditions || [];

        const sponsor =
          protocol?.sponsorCollaboratorsModule?.leadSponsor?.name || "";

        const locations =
          protocol?.contactsLocationsModule?.locations || [];

        const interventions =
          protocol?.armsInterventionsModule?.interventions || [];

        // Find drug interventions
        const drugInterventions = interventions.filter(
          (item) => item.type === "DRUG"
        );

        // If no DRUG intervention exists, skip it
        if (drugInterventions.length === 0) {
          return;
        }

        const matchingLocation = locations.find(
          (location) =>
            location.country?.toLowerCase() === country.toLowerCase()
        );

        drugInterventions.forEach((intervention) => {
          formattedData.push({
            country: matchingLocation?.country || country,
            therapyArea: conditions[0] || "Not Available",
            drugName:
              intervention.name || "Not Available",
            developerCompanyGlobal:
              sponsor || "Not Available",
            developerCompanyRegional: "Not Available",
            approvalDate: "Not Available",
            launchDate: "Not Available",
            loe: "Not Available",
            studyTitle:
              identification.briefTitle || "Not Available",
            studyId:
              identification.nctId || "Not Available",
          });
        });
      });

      setApiDrugs(formattedData);

      if (formattedData.length === 0) {
        setApiError(
          `No drug-related clinical study data found for ${country}.`
        );
      }
    } catch (error) {
      console.error(error);

      setApiError(
        "Unable to fetch data. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Combine original data + API data
  const allDrugs = [...drugs, ...apiDrugs];

  // Filter options
  const countries = [
    ...new Set(allDrugs.map((drug) => drug.country)),
  ];

  const therapyAreas = [
    ...new Set(allDrugs.map((drug) => drug.therapyArea)),
  ];

  const drugNames = [
    ...new Set(allDrugs.map((drug) => drug.drugName)),
  ];

  const globalCompanies = [
    ...new Set(
      allDrugs.map((drug) => drug.developerCompanyGlobal)
    ),
  ];

  const regionalCompanies = [
    ...new Set(
      allDrugs.map((drug) => drug.developerCompanyRegional)
    ),
  ];

  const approvalDates = [
    ...new Set(
      allDrugs
        .map((drug) => drug.approvalDate)
        .filter((date) => date !== "Not Available")
    ),
  ];

  const launchDates = [
    ...new Set(
      allDrugs
        .map((drug) => drug.launchDate)
        .filter((date) => date !== "Not Available")
    ),
  ];

  const loes = [
    ...new Set(
      allDrugs
        .map((drug) => drug.loe)
        .filter((loe) => loe !== "Not Available")
    ),
  ];

  // Apply filters
  const filteredDrugs = allDrugs.filter((drug) => {
    return (
      (!selectedCountry || drug.country === selectedCountry) &&
      (!selectedTherapyArea ||
        drug.therapyArea === selectedTherapyArea) &&
      (!selectedDrugName ||
        drug.drugName === selectedDrugName) &&
      (!selectedDeveloperCompanyGlobal ||
        drug.developerCompanyGlobal ===
          selectedDeveloperCompanyGlobal) &&
      (!selectedDeveloperCompanyRegional ||
        drug.developerCompanyRegional ===
          selectedDeveloperCompanyRegional) &&
      (!selectedApprovalDate ||
        drug.approvalDate === selectedApprovalDate) &&
      (!selectedLaunchDate ||
        drug.launchDate === selectedLaunchDate) &&
      (!selectedLOE || drug.loe === selectedLOE)
    );
  });

  const filters = [
    {
      label: "Country",
      value: selectedCountry,
      setter: setSelectedCountry,
      options: countries,
    },
    {
      label: "Therapy Area",
      value: selectedTherapyArea,
      setter: setSelectedTherapyArea,
      options: therapyAreas,
    },
    {
      label: "Drug Name",
      value: selectedDrugName,
      setter: setSelectedDrugName,
      options: drugNames,
    },
    {
      label: "Global Company",
      value: selectedDeveloperCompanyGlobal,
      setter: setSelectedDeveloperCompanyGlobal,
      options: globalCompanies,
    },
    {
      label: "Regional Company",
      value: selectedDeveloperCompanyRegional,
      setter: setSelectedDeveloperCompanyRegional,
      options: regionalCompanies,
    },
    {
      label: "Approval Date",
      value: selectedApprovalDate,
      setter: setSelectedApprovalDate,
      options: approvalDates,
    },
    {
      label: "Launch Date",
      value: selectedLaunchDate,
      setter: setSelectedLaunchDate,
      options: launchDates,
    },
    {
      label: "LOE",
      value: selectedLOE,
      setter: setSelectedLOE,
      options: loes,
    },
  ];

  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedTherapyArea("");
    setSelectedDrugName("");
    setSelectedDeveloperCompanyGlobal("");
    setSelectedDeveloperCompanyRegional("");
    setSelectedApprovalDate("");
    setSelectedLaunchDate("");
    setSelectedLOE("");
    setOpenDropdown("");
    setCountrySearch("");
    setApiDrugs([]);
    setApiError("");
  };

  return (
    <div className="app">

      <header className="header">
        <h1>Pharma Dashboard</h1>
        <p>Drug & Market Intelligence Dashboard</p>
      </header>

      <main className="container">

        {/* API COUNTRY SEARCH */}
        <section className="filter-section">

          <div className="filter-header">
            <h2>Search Country</h2>

            <button
              className="clear-btn"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Enter any country e.g. India"
              value={countrySearch}
              onChange={(e) =>
                setCountrySearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchCountry();
                }
              }}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                minWidth: "250px",
                fontSize: "15px",
              }}
            />

            <button
              onClick={searchCountry}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          {loading && (
            <p>
              Searching API data for{" "}
              <strong>{countrySearch}</strong>...
            </p>
          )}

          {apiError && (
            <p className="no-data">
              {apiError}
            </p>
          )}

          {/* EXISTING FILTERS */}
          <div className="filters">

            {filters.map((filter) => (
              <div
                className="dropdown"
                key={filter.label}
              >

                <button
                  className="dropdown-btn"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === filter.label
                        ? ""
                        : filter.label
                    )
                  }
                >
                  <span>
                    {filter.value || filter.label}
                  </span>

                  <FaChevronDown />
                </button>

                {openDropdown === filter.label && (
                  <div className="dropdown-menu">

                    {filter.options.length === 0 ? (
                      <div className="dropdown-option">
                        No options
                      </div>
                    ) : (
                      filter.options.map((option) => (
                        <div
                          className="dropdown-option"
                          key={option}
                          onClick={() => {
                            filter.setter(option);
                            setOpenDropdown("");
                          }}
                        >
                          {option}
                        </div>
                      ))
                    )}

                  </div>
                )}

              </div>
            ))}

          </div>
        </section>

        {/* TABLE */}
        <section className="table-section">

          <h2>Drug Information</h2>

          {filteredDrugs.length === 0 ? (
            <p className="no-data">
              No matching records found.
            </p>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Therapy Area</th>
                    <th>Drug Name</th>
                    <th>Global Company</th>
                    <th>Regional Company</th>
                    <th>Approval Date</th>
                    <th>Launch Date</th>
                    <th>LOE</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDrugs.map((drug, index) => (
                    <tr key={`${drug.country}-${drug.drugName}-${index}`}>

                      <td>{drug.country}</td>

                      <td>
                        {drug.therapyArea}
                      </td>

                      <td>
                        {drug.drugName}
                      </td>

                      <td>
                        {drug.developerCompanyGlobal}
                      </td>

                      <td>
                        {drug.developerCompanyRegional}
                      </td>

                      <td>
                        {drug.approvalDate}
                      </td>

                      <td>
                        {drug.launchDate}
                      </td>

                      <td>
                        {drug.loe}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;