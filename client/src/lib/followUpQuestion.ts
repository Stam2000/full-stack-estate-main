import { RunnableSequence } from "@langchain/core/runnables";
import {ChatOpenAI} from "@langchain/openai"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"


const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: `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`
  });

const parserfollowUp = StructuredOutputParser.fromZodSchema(z.object({question:z.array(z.string().describe("Maximum 5 questions"))}))


 const initialQuestions = async (informationEstate:string)=>{


    const systemPrompt:string = `
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
    
    
    Ensure Comprehensive Coverage:
    Make sure that all aspects of location mentioned above are covered. Each question should aim to uncover information that is crucial for the buyer's decision-making process.
    
    Use Clear and Concise Language:
    Frame questions in a straightforward manner to ensure clarity. Avoid ambiguous or overly complex phrasing.
    
    Vary the Depth of Questions:
    Include both general questions (e.g., "Is the neighborhood safe?")
    
    Consider Long-Term Implications:
    Encourage questions that think about future changes and how they might affect the buyer, such as upcoming developments or changes in local policies.
    
    {input}
    your response:
    `
    
    const input:string =`here are the information about the estate keep each question short and straightforward (max 100 characters) ${informationEstate}. Now generate 5 questions `

    const qGenPrompt = ChatPromptTemplate.fromTemplate(
      systemPrompt
    )

    const chain = qGenPrompt.pipe(model.withStructuredOutput(z.object({question:z.array(z.string().describe("Maximum 5 questions"))})))
   
    try{

    const response = await chain.invoke({
          input
        })

      console.log(response)
      return response
    }catch(err){
        console.log(err)
    }
    
  }

export default initialQuestions


