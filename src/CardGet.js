import "./CardGiveGet.css";
const CardGet = ({ 
        get_field_01, 
        get_field_02, 
        get_field_03, 
        get_field_04
}) => {
return (
        <a className="card"
        href={get_field_04 ? `mailto:${get_field_04}` : undefined}>

                <h3 className="get give-get-field-01">{get_field_01 || ""}</h3>
                <p className="give-get-field-02">{get_field_02 || ""}</p>
                <p className="give-get-field-03">{get_field_03 || ""}</p>
                <p className="give-get-field-04">{get_field_04 || ""}</p>
        </a>
);
}

export default CardGet;