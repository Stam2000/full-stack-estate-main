
import { agentApp } from "../lib/agentEstate";
import { HumanMessage } from "@langchain/core/messages"


export const handleQuestion = async (req,res) => {
  const {threadId,estateData,humanMessage} = req.body 
  console.log(`##### Body #####`,req.body)
 //TODO set initial user message 
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control','no-cache')
  res.setHeader('Connection', 'keep-alive')

  try{

  const eventStream =  agentApp.streamEvents({
    messages:[new HumanMessage(`${humanMessage} 
       
        ${JSON.stringify(estateData)}
      `)]
    },{
      configurable: { thread_id: threadId},
      version:"v2"
    })

    for await (const { event, name, data } of eventStream) {
      if (event === "on_custom_event" ) {
        console.log(`

          ====

          `)
        
      console.log(`${JSON.stringify(data)}|`);

      res.write(`${JSON.stringify(data)}\n`);

      console.log(`
        
        ====

        `)
      }
    }

    res.write(`${JSON.stringify({data:"success"})}\n`);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to handle question!"})
        res.write(`event: error\ndata: ${JSON.stringify({ message: 'Failed to handle question!' })}\n\n`);
    }finally{
      res.end()
    }
}