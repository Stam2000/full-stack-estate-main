
import {Annotation, Send} from "@langchain/langgraph"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { ChatOpenAI } from "@langchain/openai"
import z from "zod"
import {
    StateGraph,
    END,
    START
  } from "@langchain/langgraph";
import { compile } from "html-to-text"
import { ChatPromptTemplate } from "@langchain/core/prompts";



  const ResultAISearchSchema = z.object({
    name:z.string().describe(`Extract the official name of the company or service.`),
    url:z.string().url().describe(`Identify and extract the valid URL of the company's website.`),
    addresse:z.string().describe(`Retrieve the physical address of the company or service location.`),
    mainWebPage:z.string().describe(`Extract the main content of the web page, ensuring it is well-formatted (e.g., preserving headings, paragraphs)`),
    relevantInfo:z.string().describe(`Gather any additional pertinent information that could be beneficial to a user seeking details about the company or service (e.g., services offered, contact information, unique selling points)`),   
})



type ResultAISearch = z.infer<typeof ResultAISearchSchema>


const SearchGraphState = Annotation.Root({
    urls:Annotation<string[]>,
    resultWebSearch:Annotation<string[]>({
        reducer:(prev,next)=> prev.concat(next)
    })
})

const options = {
    wordwrap: 500,
  };
const compiledConvert = compile(options); 

const model = new ChatOpenAI({
    modelName:"gpt-4o",
    temperature:0.5,
}).withStructuredOutput(z.object({
    name:z.string().describe(`Extract the official name of the company or service.`),
    addresse:z.string().describe(`Retrieve the physical address of the company or service location.`),
    mainWebPage:z.string().describe(`Extract the main content of the web page, ensuring it is well-formatted (e.g., preserving headings, paragraphs)`),
    relevantInfo:z.string().describe(`Gather any additional pertinent information that could be beneficial to a user seeking details about the company or service (e.g., services offered, contact information, unique selling points)`),   
}))


function runParallelSearch(state: typeof SearchGraphState.State){

    console.log(`
        
        ######################### Run Parallel Search #########################
        
        `)


   

    return state.urls.map((url)=> new Send("webScrapper",{url}))
}

async function webScrapper(state:{url:string}):Promise<{resultWebSearch:string}>{

    console.log(`
        
        ######################### Web Scrapper #########################
        
        `)

    console.log(`
            ###########################################################################
            ############################################################################
                                                URL
            ############################################################################
            ############################################################################
  
  `,state.url)
    

    //TODO implement webScrapper
    const loader = new PuppeteerWebBaseLoader(state.url);
    const docs = await loader.load();

    const html = docs[0].pageContent;

    const formattedHtml = compiledConvert(html);

/*     console.log(`
        ###########################################################################
        ############################################################################
                                            formattedHtml
        ############################################################################
        ############################################################################

`,formattedHtml) */


/* const plannerPrompt = ChatPromptTemplate.fromTemplate(`You role are to remove irrelevant informations from formatted text derived from HTML content (converted using the html-to-text library).
    Remove all surrounding irrelevant text like (disclaimers, advertisements,...)
     
    Your task is to process the provided text and return a JSON object with the following fields:

    name: The official name of the company or service.
    address: The physical address of the company or service location.
    mainContent: the cleaned text here.
    relevantInfo: Additional pertinent information that could be beneficial to a user seeking details about the company or service (e.g., services offered, contact information, unique selling points).

    Here is the html input:
    {input}

    here is the output format:
    z.object({{
        name:z.string().describe(Extract the official name of the company or service.),
        addresse:z.string().describe(Retrieve the physical address of the company or service location.),
        mainWebPage:z.string().describe(cleaned text here)
        relevantInfo:z.string().describe(Gather any additional pertinent information that could be beneficial to a user seeking details about the company or service (e.g., services offered, contact information, unique selling points)),   
    }})

    your output:`);

    //TODO change prompt to reflect the task to be executed

    const recaper = plannerPrompt.pipe(model);
    const response = await recaper.invoke({input:formattedHtml})

    console.log(`
        ###########################################################################
        ############################################################################
                                            response
        ############################################################################
        ############################################################################

`,response) */
 
    return {resultWebSearch:formattedHtml}
}

function endGrap(state:typeof SearchGraphState.State){

    console.log(`
        
        ######################### End Graph #########################
        
        `)


    return state
}


const searchGraph = new StateGraph(SearchGraphState)
    .addNode("runParallelSearch",runParallelSearch)
    .addNode("webScrapper", webScrapper)
    .addNode("end", endGrap)
    .addConditionalEdges(START, runParallelSearch)
    .addConditionalEdges("runParallelSearch", runParallelSearch)
    .addEdge("webScrapper","end")
    .addEdge("end",END)
    
export const searchAgent = searchGraph.compile()
