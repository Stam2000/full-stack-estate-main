
import {dispatchCustomEvent} from "@langchain/core/callbacks/dispatch";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { BaseMessage,SystemMessage } from "@langchain/core/messages"
import { tool } from '@langchain/core/tools';
import {Annotation,messagesStateReducer} from "@langchain/langgraph"
import { ToolNode} from "@langchain/langgraph/prebuilt"
import { ChatOpenAI } from "@langchain/openai"
import z from "zod"
import axios from "axios"
import {
    StateGraph,
    END,
    START
  } from "@langchain/langgraph";
  import { validTypes,systemPrompt } from "./utilities";
  import { AxiosError } from 'axios'
  import {TavilySearchResults} from "@langchain/community/tools/tavily_search"

  import { searchAgent } from "./searchAgent";
  import { MemorySaver } from "@langchain/langgraph";

  interface Article {
    title: string;
    url: string;
    content: string;
    score: number;
    raw_content: any | null;
  }
  
  const PlaceSearchInputSchema = z.object({
    longitude:z.string().describe("the longitude of the point"),
    latitude:z.string().describe("the latitude of the point"),
    radius:z.number().int().positive().describe("The radius of the search in meters value must be between 0 and 50000 "),
    includedTypes:z.array(z.string()).describe("the type the user is searching for i.e restaurant,golf_course"),
    excludedTypes:z.array(z.string()).optional().describe("the type the user is excluding from the search for i.e hotel, cafe"),
})

const ResultAISearchSchema = z.object({
  name:z.string().describe(`Extract the official name of the company or service.`),
  url:z.string().url().describe(`Identify and extract the valid URL of the company's website.`),
  addresse:z.string().describe(`Retrieve the physical address of the company or service location.`),
  mainWebPage:z.string().describe(`Extract the main content of the web page, ensuring it is well-formatted (e.g., preserving headings, paragraphs)`),
  relevantInfo:z.string().describe(`Gather any additional pertinent information that could be beneficial to a user seeking details about the company or service (e.g., services offered, contact information, unique selling points)`),   
})


type ResultAISearch = z.infer<typeof ResultAISearchSchema>


const googleApiKey = process.env.GOOGLE_API_KEY

const Tavilytool = new TavilySearchResults({
    maxResults:2,
})

const MainGraphState = Annotation.Root({

    messages:Annotation<BaseMessage[]>({
        reducer:messagesStateReducer,
        default:()=>[new SystemMessage(systemPrompt)]
    }),
    searchResults:Annotation<ResultAISearch[]>()
})

//TODO build the Z.schema to guide the model how to do the set the params for the place NEW API

const placeSearch = tool(async (input)=>{

  await dispatchCustomEvent("place_search", {event:"place_search",message:"Searching...",data:null });

    if (input.radius > 50000){
        throw new Error("The radius is too big")
    }

    const invalidTypes = [...input.includedTypes.filter(type => !validTypes.includes(type)),
        ...(input.excludedTypes ? input.excludedTypes.filter(type => !validTypes.includes(type)) : [])
    ]
    if(invalidTypes.length > 0 ){
        throw new Error(`Invalid types: ${invalidTypes.join(',')}`);
    }
    
    

    const requestBody = {
        locationRestriction:{
            circle:{
                center:{
                    latitude:parseFloat(input.latitude),
                    longitude:parseFloat(input.longitude),
                },
                radius:input.radius
            }
        },
        includedTypes:[input.includedTypes],
        maxResultCount:20,
        languageCode:"en",
        ...(input.excludedTypes && {excludedTypes:input.excludedTypes})
    }


    const fieldMask = 'places.displayName,places.formattedAddress,places.types,places.websiteUri,places.userRatingCount,places.rating,places.nationalPhoneNumber,places.priceLevel,places.priceRange,places.regularOpeningHours,places.reviews';

    try{

        const response = await axios.post(
                'https://places.googleapis.com/v1/places:searchNearby',
                requestBody,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': googleApiKey,
                    'X-Goog-FieldMask': fieldMask,
                    },
                }
            );


            await dispatchCustomEvent("place_search", {event:"place_search",message:"Search completed",data:response.data })

            console.log(response.data)
        return response.data

    }catch(error:unknown){
        if (error instanceof AxiosError) {
            console.error('Axios Error:', error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error('Generic Error:', error.message);
          } else {
            console.error('Unexpected error:', error);
          }
    }

  
},{
    name:"placeSearch",
    description:"Search for places near by",
    schema:PlaceSearchInputSchema
})

const webSearch = tool(async(researchQuery:string)=>{

    await dispatchCustomEvent("web_search", {event:"web_search",message:"Searching..." ,data:null });

    const Tavilyres:string = await Tavilytool.invoke(researchQuery)

    const json:Article[] = JSON.parse(Tavilyres)
    const urls = json.map((result)=>result.url)

    const response = await searchAgent.invoke({urls})

    await dispatchCustomEvent("web_search", {event:"web_search",message:"Search completed" ,data:null  })

    return JSON.stringify({searchResults:response})
    },{
        name:"webSearch",
        description:"Search the web for the place",
        schema:z.string().describe("the actual Web Query")
})

const urlRetriever = tool(async(i):Promise<string>=>{

  console.log(`
              ###########################################################################
              ############################################################################
                                                  i
              ############################################################################
              ############################################################################
    
    `,i)

  await dispatchCustomEvent("url_retriever", {event:"url_retriever", message:"Searching..." ,data:null });
  const response :string = await searchAgent.invoke({
    urls:[i]})

  await dispatchCustomEvent("url_retriever", {event:"url_retriever", message:"Search completed" ,data:null });  

  console.log(`############## result retriver ###############`,response)
  return JSON.stringify(response)

},{
  name:"urlRetriever",
  description:"Search the web for the place",
  schema:z.string().describe("actual url")

})

const tools = [placeSearch,webSearch,urlRetriever]
const toolNode = new ToolNode(tools)

const model = new ChatOpenAI({
  modelName:"gpt-4o",
  temperature:0.5,
}).bindTools(tools)


const agent =  async (state:typeof MainGraphState.State )=>{ 

  await dispatchCustomEvent("agent", {event:"agent",message:"Thinking..." ,data:null });
  console.log(`####################################### Start Agent ########################################`)
  const response = await model.invoke(state.messages)

  /* console.log(response) */
  return {
      messages:response
  }
}

const handleContinue =  async(state:typeof MainGraphState.State)=>{
  const {messages} = state
  const lastMessage = messages[messages.length-1]

  /* console.log(lastMessage) */
  if("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length){
      return "tools"
  }

  const AImessage = await new StringOutputParser().invoke(lastMessage)
  console.log(`#################################  END ####`,AImessage)

  await dispatchCustomEvent("ai_message", {event:"agent",message:"Completed" ,data:AImessage });
  return END
}
//build and connect graph now and try to handle a request. 

const worflow = new StateGraph(MainGraphState)
  .addNode("agent",agent)
  .addNode("tools",toolNode)
  .addEdge(START,"agent")
  .addConditionalEdges("agent", handleContinue,["tools",END])
  .addEdge("tools","agent")

const checkpointer = new MemorySaver()

export const agentApp = worflow.compile({checkpointer})