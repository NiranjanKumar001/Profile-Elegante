const Awards = ({ title, awards }) => {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="section-title mb-1 border-b-2 border-gray-300">{title}</h2>
      <ul className="list-disc ul-padding sub-content">
        {awards.map((award, index) => (
          <li key={index} className="leading-normal">
            {award.name}
            {award.issuer && (
              <span className="text-gray-600"> - {award.issuer}</span>
            )}
            {award.year && (
              <span className="text-gray-500"> ({award.year})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Awards;
