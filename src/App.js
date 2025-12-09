import "./App.css";
import Header from "./Header";
import CardGive from "./CardGive";
import CardGet from "./CardGet";
import ImageModal from "./ImageModal";
import logo from "./assets/logo_chief_pdx.png";
import holiday_give_get from "./assets/holiday_give_get.png";
import rose from "./assets/rose.png";
import { useEffect, useState } from "react";

// const BANNERS = [
//   "chief_pdx"
//];

const funtime = "Chief";
const AUTH_KEY = "cpgg-authed"; // name in localStorage

function App() {
  // 1. auth hooks
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");

//     const [banner, setBanner] = useState(() => {
//     const saved =
//       typeof window !== "undefined" &&
//       window.localStorage &&
//       window.localStorage.getItem("theme-banner");

//     const attr =
//       typeof document !== "undefined" &&
//       document.documentElement.getAttribute("data-theme-banner");
//     return saved || attr || BANNERS[0];
//   });
  
  // 👇 check localStorage once, when the app mounts
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved === "true") {
      setAuthed(true);
    }
  }, []);

//   useEffect(() => {
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("data-theme-banner", banner);
//     }
//     if (typeof window !== "undefined" && window.localStorage) {
//       window.localStorage.setItem("theme-banner", banner);
//     }
//   }, [banner]);

//   const advanceBanner = () => {
//     const idx = BANNERS.indexOf(banner);
//     const next = BANNERS[(idx + 1) % BANNERS.length];
//     setBanner(next);
//   };

  // 2. app hooks
  const [cardData, setCardData] = useState([]);
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET data (right side)
const [getCardData, setGetCardData] = useState([]);
const [filteredGetCardData, setFilteredGetCardData] = useState([]);


  // fetch 'GIVE' data
  useEffect(() => {
    setLoading(true);
    fetch(
"https://script.google.com/macros/s/AKfycbw4bVPv3fQKz1SNjqXd8wW3DhnypySBDWctefhljgXjIXMzk9keI7hJJovGo88P5m5o/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        const BASE = window.location.pathname.startsWith("")
          ? ""
          : "";

        const fix = (v) => {
          if (!v) return v;
          if (typeof v === "string" && v.startsWith(`${BASE}/`)) return v;
          if (typeof v === "string" && v.startsWith("/")) return `${BASE}${v}`;
          return `${BASE}${v.replace(/^\.?\/*/, "")}`;
        };

        const patched = data.map((card) => ({
          ...card,
          give_field_01: fix(card.give_field_01),
          give_field_02: fix(card.give_field_02),
          give_field_03: fix(card.give_field_03),
          give_field_04: fix(card.give_field_04),

        }));

        setCardData(patched);
        setFilteredCardData(patched);
      })
      .catch((err) => console.error("Error loading data:", err))
      .finally(() => setLoading(false));
  }, []);

// fetch 'GET' data
useEffect(() => {
  setLoading(true);
  fetch(
"https://script.google.com/macros/s/AKfycbxIJ-pQ4X4uxyzXNvZ5tAyyIIMGhU4bEz9MKeMu81WIQVPk-jH9_gGnwPykQ2qAbMPvrg/exec"  )
    .then((res) => res.json())
    .then((data) => {
      const BASE = window.location.pathname.startsWith("")
        ? ""
        : "";

      const fix = (v) => {
        if (!v) return v;
        if (typeof v === "string" && v.startsWith(`${BASE}/`)) return v;
        if (typeof v === "string" && v.startsWith("/")) return `${BASE}${v}`;
        return `${BASE}${v.replace(/^\.?\/*/, "")}`;
      };

      const patched = data.map((cardGet) => ({
        ...cardGet,
        get_field_01: fix(cardGet.get_field_01),
        get_field_02: fix(cardGet.get_field_02),
        get_field_03: fix(cardGet.get_field_03),
        get_field_04: fix(cardGet.get_field_04),
      }));

      setGetCardData(patched);
      setFilteredGetCardData(patched);
    })
    .catch((err) => console.error("Error loading GET data:", err))
    .finally(() => setLoading(false));
}, []);









  // search filter
  useEffect(() => {
    const toText = (v, fieldName, card) => {
      if (v == null) return "";
      if (typeof v !== "string") {
        console.warn(
          `Non-string value in field "${fieldName}" for card:`,
          card,
          "Value:",
          v
        );
        return String(v);
      }
      return v.toLowerCase();
    };

    const term = searchTerm.toLowerCase();

    if (searchTerm === "") {
      setFilteredCardData(cardData);
    } else {
      const results = cardData.filter((card) =>
        ["give_field_01", "give_field_02", "give_field_03", "give_field_04"].some((field) =>
          toText(card[field], field, card).includes(term)
        )
      );
      setFilteredCardData(results);
    }
  }, [searchTerm, cardData]);





  // Filter GET cards when search term or GET data changes
useEffect(() => {
  const toText = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v.toLowerCase();
    if (v instanceof Date) return v.toLocaleDateString().toLowerCase();
    if (Array.isArray(v)) {
      return v
        .map((item) =>
          typeof item === "string" ? item.toLowerCase() : String(item).toLowerCase()
        )
        .join(" ");
    }
    if (typeof v === "object") {
      return Object.values(v)
        .map((value) =>
          typeof value === "string"
            ? value.toLowerCase()
            : value instanceof Date
            ? value.toLocaleDateString().toLowerCase()
            : String(value).toLowerCase()
        )
        .join(" ");
    }
    return String(v).toLowerCase();
  };

  const term = searchTerm.toLowerCase();

  if (searchTerm === "") {
    setFilteredGetCardData(getCardData);
  } else {
    const results = getCardData.filter((card) =>
      ["get_field_01", "get_field_02", "get_field_03", "get_field_04"].some(
        (field) => toText(card[field]).includes(term)
      )
    );
    setFilteredGetCardData(results);
  }
}, [searchTerm, getCardData]);








  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === funtime) {
      setAuthed(true);
      localStorage.setItem(AUTH_KEY, "true");
    } else {
      alert("No");
    }
  };

  // 3. now that all hooks are declared, you can branch in the render
  if (!authed) {
    return (
      <div className="splash">
              <div className="logo-container">
                <img src={logo} alt="Chief PDX Logo" /> 
              </div>
              <div className="holiday-give-get-container">
                <img src={holiday_give_get} alt="Holiday Give & Get" />
              </div>
         <div className="funtime-all"> 
        <h3>Password</h3>
        <form className="funtime-input-and-button"
        onSubmit={handleSubmit}>
          <input className="funtime-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=""
          />
          {input.length > 0 && (
          <button className="button funtime-button" type="submit">
                <span>Enter</span>
        </button> )}
        </form>
        </div>        
              <div className="rose-container">
                <img src={rose} alt="Rose" />
              </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main>
  {loading ? (
    <div className="no-results">
      <p>Loading Gives & Gets</p>
    </div>
  ) : (
    <div className="give-get-wrapper">
      {/* LEFT: GIVE cards */}
      <section className="give-column">
        <h2 className="column-title">GIVES</h2>
        {filteredCardData.length > 0 ? (
          <div className="card-grid">
            {filteredCardData.map((card, idx) => (
              <CardGive
                key={idx}
                give_field_01={card.give_field_01}
                give_field_02={card.give_field_02}
                give_field_03={card.give_field_03}
                give_field_04={card.give_field_04}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No GIVE results found for your search term</p>
          </div>
        )}
      </section>

      {/* RIGHT: GET cards */}
      <section className="get-column">
        <h2 className="column-title">GETS</h2>
        {filteredGetCardData.length > 0 ? (
          <div className="card-grid">
            {filteredGetCardData.map((card, idx) => (
              <CardGet
                key={idx}
                get_field_01={card.get_field_01}
                get_field_02={card.get_field_02}
                get_field_03={card.get_field_03}
                get_field_04={card.get_field_04}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No GET results found for your search term</p>
          </div>
        )}
      </section>
    </div>
  )}

  {/* keep your ImageModal logic just after this, unchanged */}
  {selectedIndex !== null && filteredCardData.length > 0 && (
    <ImageModal
      card={filteredCardData[selectedIndex]}
      onClose={() => setSelectedIndex(null)}
      onNext={() =>
        setSelectedIndex(
          (prev) => (prev + 1) % filteredCardData.length
        )
      }
      onPrev={() =>
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCardData.length) %
            filteredCardData.length
        )
      }
    />
  )}
</main>

      {selectedIndex !== null && (
        <ImageModal
          imageSrc={filteredCardData[selectedIndex].imageSrc}
          imageSmall={filteredCardData[selectedIndex].imageSmall}
          imageMedium={filteredCardData[selectedIndex].imageMedium}
          imageLarge={filteredCardData[selectedIndex].imageLarge}
          headline={filteredCardData[selectedIndex].headline}
          date={filteredCardData[selectedIndex].date}
          location={filteredCardData[selectedIndex].location}
          description={filteredCardData[selectedIndex].description}
          filename={filteredCardData[selectedIndex].filename}
          keywords={filteredCardData[selectedIndex].keywords}
          onClose={() => setSelectedIndex(null)}
          onNext={() =>
            setSelectedIndex(
              (prev) => (prev + 1) % filteredCardData.length
            )
          }
          onPrev={() =>
            setSelectedIndex(
              (prev) => (prev - 1 + filteredCardData.length) %
                filteredCardData.length
            )
          }
        />
      )}
    </div>
  );
}

export default App;
