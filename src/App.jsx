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

  const countries = [...new Set(drugs.map((drug) => drug.country))];
  const therapyAreas = [...new Set(drugs.map((drug) => drug.therapyArea))];
  const drugNames = [...new Set(drugs.map((drug) => drug.drugName))];
  const globalCompanies = [
    ...new Set(drugs.map((drug) => drug.developerCompanyGlobal)),
  ];
  const regionalCompanies = [
    ...new Set(drugs.map((drug) => drug.developerCompanyRegional)),
  ];
  const approvalDates = [...new Set(drugs.map((drug) => drug.approvalDate))];
  const launchDates = [...new Set(drugs.map((drug) => drug.launchDate))];
  const loes = [...new Set(drugs.map((drug) => drug.loe))];

  const filteredDrugs = drugs.filter((drug) => {
    return (
      (!selectedCountry || drug.country === selectedCountry) &&
      (!selectedTherapyArea || drug.therapyArea === selectedTherapyArea) &&
      (!selectedDrugName || drug.drugName === selectedDrugName) &&
      (!selectedDeveloperCompanyGlobal ||
        drug.developerCompanyGlobal === selectedDeveloperCompanyGlobal) &&
      (!selectedDeveloperCompanyRegional ||
        drug.developerCompanyRegional === selectedDeveloperCompanyRegional) &&
      (!selectedApprovalDate ||
        drug.approvalDate === selectedApprovalDate) &&
      (!selectedLaunchDate || drug.launchDate === selectedLaunchDate) &&
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
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Pharma Dashboard</h1>
        <p>Drug & Market Intelligence Dashboard</p>
      </header>

      <main className="container">
        <section className="filter-section">
          <div className="filter-header">
            <h2>Filters</h2>

            <button className="clear-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="filters">
            {filters.map((filter) => (
              <div className="dropdown" key={filter.label}>
                <button
                  className="dropdown-btn"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === filter.label ? "" : filter.label
                    )
                  }
                >
                  <span>{filter.value || filter.label}</span>
                  <FaChevronDown />
                </button>

                {openDropdown === filter.label && (
                  <div className="dropdown-menu">
                    {filter.options.map((option) => (
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
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="table-section">
          <h2>Drug Information</h2>

          {filteredDrugs.length === 0 ? (
            <p className="no-data">No matching records found.</p>
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
                    <tr key={index}>
                      <td>{drug.country}</td>
                      <td>{drug.therapyArea}</td>
                      <td>{drug.drugName}</td>
                      <td>{drug.developerCompanyGlobal}</td>
                      <td>{drug.developerCompanyRegional}</td>
                      <td>{drug.approvalDate}</td>
                      <td>{drug.launchDate}</td>
                      <td>{drug.loe}</td>
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