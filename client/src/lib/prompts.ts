export const initialPrompt = `Certainly! Below is a detailed prompt designed for an artificial intelligence system responsible for simulating questions that potential home buyers might have about a property's location. This prompt takes into account various types of buyers, such as single individuals, married couples with children, retirees, and others.

Prompt for AI: Simulating Home Buyer Location-Related Questions

Objective:
Generate a comprehensive list of questions that potential home buyers may have regarding the location of a property they are interested in purchasing. The questions should be tailored to different types of buyers, including but not limited to single individuals, married couples with children, retirees, and professionals.

Buyer Profiles to Consider:

Single Individuals
Married Couples without Children
Married Couples with Children
Retirees
Young Families
Professionals/Commuters
Investors
First-Time Home Buyers
Aspects of Location to Address:

Safety and Security

Crime rates
Neighborhood watch programs
Street lighting
Schools and Education

Quality of local schools
Availability of preschools and daycare centers
Proximity to universities or colleges
Amenities and Services

Nearby grocery stores, pharmacies, and shopping centers
Access to healthcare facilities and hospitals
Availability of parks and recreational areas
Transportation and Commute

Proximity to public transportation (buses, trains, subways)
Average commute times to major employment centers
Traffic conditions and ease of access to highways
Community and Lifestyle

Demographics of the neighborhood
Community events and activities
Noise levels and overall ambiance
Recreational Facilities

Parks, playgrounds, and sports facilities
Fitness centers and gyms
Cultural venues (theaters, museums, galleries)
Future Development and Growth

Planned infrastructure projects
Zoning laws and potential for property value appreciation
Upcoming commercial or residential developments
Environmental Factors

Air and water quality
Green spaces and sustainability initiatives
Risk of natural disasters (floods, earthquakes, etc.)
Financial Considerations

Property taxes in the area
Cost of living
Availability of local incentives or grants
Instructions:

Tailor Questions to Buyer Profiles:
For each buyer type listed, generate specific questions that align with their unique needs and priorities. For example, married couples with children might prioritize school quality and playgrounds, while retirees may focus on healthcare facilities and quiet neighborhoods.

Ensure Comprehensive Coverage:
Make sure that all aspects of location mentioned above are covered. Each question should aim to uncover information that is crucial for the buyer's decision-making process.

Use Clear and Concise Language:
Frame questions in a straightforward manner to ensure clarity. Avoid ambiguous or overly complex phrasing.

Vary the Depth of Questions:
Include both general questions (e.g., "Is the neighborhood safe?") and more specific ones (e.g., "What are the latest crime statistics for this area?").

Consider Long-Term Implications:
Encourage questions that think about future changes and how they might affect the buyer, such as upcoming developments or changes in local policies.

Example Outputs:

For Single Individuals:

"Are there vibrant nightlife and entertainment options nearby?"
"How active is the local community for young professionals?"
For Married Couples with Children:

"What is the rating of the nearest elementary and high schools?"
"Are there safe parks and playgrounds within walking distance?"
For Retirees:

"How accessible are healthcare services and hospitals from this location?"
"Is the neighborhood quiet and suitable for a relaxed lifestyle?"
For Professionals/Commuters:

"What is the average commute time to downtown/business districts?"
"Is there reliable public transportation available during peak hours?"
End of Prompt

Usage Instructions:
Provide this prompt to your AI system to enable it to generate tailored, location-specific questions that potential home buyers might consider during their property search. Ensure that the AI references the buyer profiles and location aspects to create relevant and insightful questions.`

const promptChatHistory = {
    title: "Stylish Apartment in Friedrichshain",
    price: 1600,
    address: "3456 Friedrichshain Road",
    city: "Berlin",
    bedroom: 2,
    bathroom: 1,
    latitude: "52.5148",
    longitude: "13.4506",
    type: "rent",
    property: "apartment",
    images:[]
  };