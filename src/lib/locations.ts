export type Location = {
  slug: string;
  name: string;
  nearby: string[];
};

export const LOCATIONS: Location[] = [
  { slug: "leicester", name: "Leicester", nearby: ["Loughborough", "Hinckley", "Market Harborough"] },
  { slug: "london", name: "London", nearby: ["Croydon", "Wembley", "Stratford"] },
  { slug: "birmingham", name: "Birmingham", nearby: ["Solihull", "Wolverhampton", "West Bromwich"] },
  { slug: "manchester", name: "Manchester", nearby: ["Salford", "Stockport", "Bolton"] },
  { slug: "leeds", name: "Leeds", nearby: ["Bradford", "Wakefield", "Harrogate"] },
  { slug: "liverpool", name: "Liverpool", nearby: ["Birkenhead", "St Helens", "Wirral"] },
  { slug: "sheffield", name: "Sheffield", nearby: ["Rotherham", "Chesterfield", "Barnsley"] },
  { slug: "bristol", name: "Bristol", nearby: ["Bath", "Weston-super-Mare", "Filton"] },
  { slug: "newcastle-upon-tyne", name: "Newcastle upon Tyne", nearby: ["Gateshead", "Sunderland", "North Shields"] },
  { slug: "nottingham", name: "Nottingham", nearby: ["Derby", "Beeston", "Mansfield"] },
  { slug: "coventry", name: "Coventry", nearby: ["Rugby", "Nuneaton", "Warwick"] },
  { slug: "bradford", name: "Bradford", nearby: ["Leeds", "Halifax", "Keighley"] },
  { slug: "southampton", name: "Southampton", nearby: ["Portsmouth", "Winchester", "Eastleigh"] },
  { slug: "portsmouth", name: "Portsmouth", nearby: ["Southampton", "Havant", "Chichester"] },
  { slug: "brighton", name: "Brighton", nearby: ["Hove", "Lewes", "Worthing"] },
  { slug: "reading", name: "Reading", nearby: ["Wokingham", "Bracknell", "Slough"] },
  { slug: "derby", name: "Derby", nearby: ["Nottingham", "Burton upon Trent", "Chesterfield"] },
  { slug: "plymouth", name: "Plymouth", nearby: ["Torquay", "Exeter", "Saltash"] },
  { slug: "stoke-on-trent", name: "Stoke-on-Trent", nearby: ["Newcastle-under-Lyme", "Stafford", "Crewe"] },
  { slug: "wolverhampton", name: "Wolverhampton", nearby: ["Birmingham", "Dudley", "Walsall"] },
  { slug: "milton-keynes", name: "Milton Keynes", nearby: ["Northampton", "Bedford", "Luton"] },
  { slug: "luton", name: "Luton", nearby: ["Dunstable", "Watford", "Milton Keynes"] },
  { slug: "norwich", name: "Norwich", nearby: ["Great Yarmouth", "Lowestoft", "Ipswich"] },
  { slug: "york", name: "York", nearby: ["Leeds", "Harrogate", "Selby"] },
  { slug: "glasgow", name: "Glasgow", nearby: ["Paisley", "Hamilton", "East Kilbride"] },
  { slug: "edinburgh", name: "Edinburgh", nearby: ["Livingston", "Musselburgh", "Dunfermline"] },
  { slug: "cardiff", name: "Cardiff", nearby: ["Newport", "Barry", "Bridgend"] },
  { slug: "swansea", name: "Swansea", nearby: ["Neath", "Llanelli", "Port Talbot"] },
  { slug: "aberdeen", name: "Aberdeen", nearby: ["Dyce", "Stonehaven", "Inverurie"] },
  { slug: "dundee", name: "Dundee", nearby: ["Perth", "St Andrews", "Arbroath"] },
  { slug: "belfast", name: "Belfast", nearby: ["Lisburn", "Newtownabbey", "Bangor"] },

  { slug: "cambridge", name: "Cambridge", nearby: ["Ely", "Newmarket", "Huntingdon"] },
  { slug: "oxford", name: "Oxford", nearby: ["Abingdon", "Bicester", "Didcot"] },
  { slug: "bath", name: "Bath", nearby: ["Bristol", "Keynsham", "Trowbridge"] },
  { slug: "exeter", name: "Exeter", nearby: ["Exmouth", "Newton Abbot", "Torquay"] },

  { slug: "kingston-upon-hull", name: "Kingston upon Hull", nearby: ["Beverley", "Hessle", "Bridlington"] },
  { slug: "middlesbrough", name: "Middlesbrough", nearby: ["Stockton-on-Tees", "Redcar", "Hartlepool"] },
  { slug: "sunderland", name: "Sunderland", nearby: ["Newcastle upon Tyne", "Washington", "South Shields"] },
  { slug: "doncaster", name: "Doncaster", nearby: ["Rotherham", "Barnsley", "Worksop"] },
  { slug: "huddersfield", name: "Huddersfield", nearby: ["Halifax", "Dewsbury", "Brighouse"] },

  { slug: "northampton", name: "Northampton", nearby: ["Wellingborough", "Kettering", "Milton Keynes"] },
  { slug: "peterborough", name: "Peterborough", nearby: ["Stamford", "Spalding", "Huntingdon"] },
  { slug: "chelmsford", name: "Chelmsford", nearby: ["Braintree", "Brentwood", "Southend-on-Sea"] },
  { slug: "southend-on-sea", name: "Southend-on-Sea", nearby: ["Basildon", "Chelmsford", "Rochford"] },
  { slug: "ipswich", name: "Ipswich", nearby: ["Felixstowe", "Colchester", "Bury St Edmunds"] },

  { slug: "warrington", name: "Warrington", nearby: ["Widnes", "St Helens", "Manchester"] },
  { slug: "wigan", name: "Wigan", nearby: ["Bolton", "Warrington", "St Helens"] },
  { slug: "preston", name: "Preston", nearby: ["Blackburn", "Chorley", "Blackpool"] },
  { slug: "blackpool", name: "Blackpool", nearby: ["Preston", "Lytham St Annes", "Fleetwood"] },

  { slug: "bournemouth", name: "Bournemouth", nearby: ["Poole", "Christchurch", "Southampton"] },
];

export function getAllLocations(): Location[] {
  return [...LOCATIONS].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}
