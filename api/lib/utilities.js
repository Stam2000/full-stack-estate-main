export const validTypes = [
    // Automotive
    'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'electric_vehicle_charging_station', 'gas_station', 'parking', 'rest_stop',
    // Business
    'corporate_office', 'farm', 'ranch',
    // Culture
    'art_gallery', 'art_studio', 'auditorium', 'cultural_landmark', 'historical_place', 'monument', 'museum', 'performing_arts_theater', 'sculpture',
    // Education
    'library', 'preschool', 'primary_school', 'school', 'secondary_school', 'university',
    // Entertainment and Recreation
    'adventure_sports_center', 'amphitheatre', 'amusement_center', 'amusement_park', 'aquarium', 'banquet_hall', 'barbecue_area', 'botanical_garden', 'bowling_alley', 'casino', 'childrens_camp', 'comedy_club', 'community_center', 'concert_hall', 'convention_center', 'cultural_center', 'cycling_park', 'dance_hall', 'dog_park', 'event_venue', 'ferris_wheel', 'garden', 'hiking_area', 'historical_landmark', 'internet_cafe', 'karaoke', 'marina', 'movie_rental', 'movie_theater', 'national_park', 'night_club', 'observation_deck', 'off_roading_area', 'opera_house', 'park', 'philharmonic_hall', 'picnic_ground', 'planetarium', 'plaza', 'roller_coaster', 'skateboard_park', 'state_park', 'tourist_attraction', 'video_arcade', 'visitor_center', 'water_park', 'wedding_venue', 'wildlife_park', 'wildlife_refuge', 'zoo',
    // Facilities
    'public_bath', 'public_bathroom', 'stable',
    // Finance
    'accounting', 'atm', 'bank',
    // Food and Drink
    'acai_shop', 'afghani_restaurant', 'african_restaurant', 'american_restaurant', 'asian_restaurant', 'bagel_shop', 'bakery', 'bar', 'bar_and_grill', 'barbecue_restaurant', 'brazilian_restaurant', 'breakfast_restaurant', 'brunch_restaurant', 'buffet_restaurant', 'cafe', 'cafeteria', 'candy_store', 'cat_cafe', 'chinese_restaurant', 'chocolate_factory', 'chocolate_shop', 'coffee_shop', 'confectionery', 'deli', 'dessert_restaurant', 'dessert_shop', 'diner', 'dog_cafe', 'donut_shop', 'fast_food_restaurant', 'fine_dining_restaurant', 'food_court', 'french_restaurant', 'greek_restaurant', 'hamburger_restaurant', 'ice_cream_shop', 'indian_restaurant', 'indonesian_restaurant', 'italian_restaurant', 'japanese_restaurant', 'juice_shop', 'korean_restaurant', 'lebanese_restaurant', 'meal_delivery', 'meal_takeaway', 'mediterranean_restaurant', 'mexican_restaurant', 'middle_eastern_restaurant', 'pizza_restaurant', 'pub', 'ramen_restaurant', 'restaurant', 'sandwich_shop', 'seafood_restaurant', 'spanish_restaurant', 'steak_house', 'sushi_restaurant', 'tea_house', 'thai_restaurant', 'turkish_restaurant', 'vegan_restaurant', 'vegetarian_restaurant', 'vietnamese_restaurant', 'wine_bar',
    // Geographical Areas
    'administrative_area_level_1', 'administrative_area_level_2', 'country', 'locality', 'postal_code', 'school_district',
    // Government
    'city_hall', 'courthouse', 'embassy', 'fire_station', 'government_office', 'local_government_office', 'police', 'post_office',
    // Health and Wellness
    'chiropractor', 'dental_clinic', 'dentist', 'doctor', 'drugstore', 'hospital', 'massage', 'medical_lab', 'pharmacy', 'physiotherapist', 'sauna', 'skin_care_clinic', 'spa', 'tanning_studio', 'wellness_center', 'yoga_studio',
    // Housing
    'apartment_building', 'apartment_complex', 'condominium_complex', 'housing_complex',
    // Lodging
    'bed_and_breakfast', 'budget_japanese_inn', 'campground', 'camping_cabin', 'cottage', 'extended_stay_hotel', 'farmstay', 'guest_house', 'hostel', 'hotel', 'inn', 'japanese_inn', 'lodging', 'mobile_home_park', 'motel', 'private_guest_room', 'resort_hotel', 'rv_park',
    // Natural Features
    'beach',
    // Places of Worship
    'church', 'hindu_temple', 'mosque', 'synagogue',
    // Services
    'astrologer', 'barber_shop', 'beautician', 'beauty_salon', 'body_art_service', 'catering_service', 'cemetery', 'child_care_agency', 'consultant', 'courier_service', 'electrician', 'florist', 'food_delivery', 'foot_care', 'funeral_home', 'hair_care', 'hair_salon', 'insurance_agency', 'laundry', 'lawyer', 'locksmith', 'makeup_artist', 'moving_company', 'nail_salon', 'painter', 'plumber', 'psychic', 'real_estate_agency', 'roofing_contractor', 'storage', 'summer_camp_organizer', 'tailor', 'telecommunications_service_provider', 'tour_agency', 'tourist_information_center', 'travel_agency', 'veterinary_care',
    // Shopping
    'asian_grocery_store', 'auto_parts_store', 'bicycle_store', 'book_store', 'butcher_shop', 'cell_phone_store', 'clothing_store', 'convenience_store', 'department_store', 'discount_store', 'electronics_store', 'food_store', 'furniture_store', 'gift_shop', 'grocery_store', 'hardware_store', 'home_goods_store', 'home_improvement_store', 'jewelry_store', 'liquor_store', 'market', 'pet_store', 'shoe_store', 'shopping_mall', 'sporting_goods_store', 'store', 'supermarket', 'warehouse_store', 'wholesaler',
    // Sports
    'arena', 'athletic_field', 'fishing_charter', 'fishing_pond', 'fitness_center', 'golf_course', 'gym', 'ice_skating_rink', 'playground', 'ski_resort', 'sports_activity_location', 'sports_club', 'sports_coaching', 'sports_complex', 'stadium', 'swimming_pool',
    // Transportation
    'airport', 'airstrip', 'bus_station', 'bus_stop', 'ferry_terminal', 'heliport', 'international_airport', 'light_rail_station', 'park_and_ride', 'subway_station', 'taxi_stand', 'train_station', 'transit_depot', 'transit_station', 'truck_stop'
  ];
  
  export const systemPrompt = `You are an intelligent assistant specializing in providing detailed information about real estate locations. Your role is to answer user queries based on the property data provided and, when necessary, leverage the tools at your disposal to enhance your responses.

  **Important Instructions:**
  - **Always:** if the informations you received from a call tool are not enought to respond to the query, take and other try.for exemple: you can use the datas from previous tools to do an other specific calls tools. do you best to provide a answer with the provided tools. you have a maximum of 5 try.
  - **Function Calls:** When using tools, ensure your function calls match the exact input schemas provided.
  - **Input Formats:** Do not wrap inputs in unnecessary objects or additional layers unless specified.
  - **Examples:** Refer to the provided examples for the correct structure of function calls.
  
  **Available Tools:**
  
  1. **urlRetriever**
  
      - **Description:** Retrieve data from the specified URL.
      - **Usage:** Provide the URL as a simple string.
      - **Input Schema:** z.string() (a string representing the actual URL).
      - **Example Function Call:**
  
        json
        {{
          "name": "urlRetriever",
          "arguments": "https://www.example.com"
        }}
       
  
  2. **webSearch**
  
      - **Description:** Conduct a web search based on a query and retrieve relevant information.
      - **Usage:** Provide the search query as a simple string.
      - **Input Schema:** z.string() (a string representing the actual web query).
      - **Example Function Call:**
  
        json
        {{
          "name": "webSearch",
          "arguments": " exemple : Find information about the Eiffel Tower"
        }}
        
  
  3. **placeSearch**
  
      - **Description:** Search for nearby places based on location and specified criteria using the Google Places API.
      - **Usage:** Provide an object with location details, radius, includedTypes, and optional excludedTypes.
      - **Input Schema:**
  
        typescript
        z.object({{
          longitude: z.string().describe("the longitude of the point"),
          latitude: z.string().describe("the latitude of the point"),
          radius: z.number().int().positive().describe("The radius of the search in meters (0-50000)"),
          includedTypes: z.array(z.string()).describe("types to include, e.g., ['restaurant', 'golf_course']"),
          excludedTypes: z.array(z.string()).optional().describe("types to exclude, e.g., ['hotel', 'cafe']")
        }})
        
  
      - **Example Function Call:**
  
        json
        {{
          "name": "placeSearch",
          "arguments": {{
            "longitude": "-0.1278",
            "latitude": "51.5074",
            "radius": 1000,
            "includedTypes": ["restaurant", "cafe"],
            "excludedTypes": ["fast_food_restaurant"]
          }}
        }}
        
  
  **Valid Types for Google Places API:**
    ${JSON.stringify(validTypes)}
  
  **Maintain Clarity and Professionalism:**
  
  - Ensure responses are clear, concise, and free of technical jargon unless necessary.
  - Aim to be as helpful and informative as possible.
  
  **Final Notes:**
  
  - Always ensure the information provided is up-to-date and accurate based on the latest data available.
  - If uncertain about an answer, it's better to clarify.`
  
  