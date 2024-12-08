import { Link } from "react-router-dom";
import { useRef,useState,useEffect } from "react";
import "./card.scss";
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
import {createId} from "@paralleldrive/cuid2"
import { div, use } from "motion/react-client";
import MarkdownTypewriter from "../../lib/markdownTyper";
import initialQuestions from "../../lib/followUpQuestion";


function Card({ item,firstItem }) {

const [messages,setMessages] = useState([])
const[isOpen,setIsOpen]=useState(firstItem)
const [input,setInput] =useState("")
const [disableButton,setDisableButton] = useState(false)
const [placeResult,setPlaceResult] = useState(null)
const [displayedMessage,setDisplayedMessage] = useState("...")
const [threadId,setThreadId] = useState(createId())
const [streamedData,setStreamedData] = useState([])
const [followUpQuestion,setFollowUpQuestion] = useState(["loading..."])




const textareaRef = useRef(null);
const lastMessageRef = useRef(null)
const progressRef = useRef(null)

  const sendMessage = async ({msg,otherItems})=>{
    try {
      const response = await fetch("https://full-stack-estate-main-k9cj.onrender.com/api/ai", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // TODO send thread_id 
          // TODO Display web research
          // TODO test LOGIN
          threadId,
          humanMessage: msg,
          estateData:otherItems
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
  
      while (true) {
        const { value, done } = await reader.read();
  
        if (done) {
          break;
        }
  
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
  
        let lines = buffer.split('\n');
        buffer = lines.pop();
  
        for (let line of lines) {
          if (line.trim()) {
            const data = JSON.parse(line);
  
            if(data.event === "agent" && data.message ==="Completed" ){
              setMessages((prev)=>[...prev,{sender:"ai",content:data.data}])
              console.log(data)
            }
  
            if(data.event === "place_search" && data.message ==="Search completed"){
              setPlaceResult(data.data)
              console.log(data.data)
            }
  
            console.log(data.message)
            setDisplayedMessage(data.message);
            console.log(displayedMessage)
  
  
  
  /*           console.log(`
              
              ################# result Chunk #################
  
              `,data) */
            setStreamedData((prevData) => [...prevData, data]);
          }
        }
      }
  
      if (buffer.trim()) {
        const data = JSON.parse(buffer);
        setStreamedData((prevData) => [...prevData, data]);
      }
  
      setDisableButton(false)
      /* await apiRequest.get("/ai"); */
    } catch (err) {
      console.log(err);
      setDisableButton(false)
    }
  }

  const clickAi = async()=>{
    const {images,...otherItems} = item
    setDisableButton(true)
    setMessages((prev)=>[...prev,{sender:"human",content:input}])
    const msg = input
    setInput("")

    await sendMessage({msg,otherItems})
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    clickAi();
  }
}

  const handleResize = () => {
    setInput(textareaRef.current.value)
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  const handleSubmitQuestion = async (question)=>{
    setDisableButton(true)
    const {images,...otherItems} = item
    setMessages((prev)=>[...prev,{sender:"human",content:question}])
    await sendMessage({msg:question,otherItems})
  }

  const handleOpenCLose =()=>{

     if(isOpen){
      setMessages([])
      setThreadId(createId())
    }
    setIsOpen(prev => !prev)

  }



  useEffect(()=>{
    const tid = createId()
    setThreadId(tid)
    const fetchData = async () => {
      const res = await initialQuestions(item);
      console.log(res)
      setFollowUpQuestion(res.question)
    };
    fetchData();
  },[])

  return (
    <div className="item" >
      <div className="card">
        <Link to={`/${item.id}`} className="imageContainer">
          <img src={item.images[0]} alt="" />
        </Link>
        <div className="textContainer">
          <h2 className="title">
            <Link to={`/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="address">
            <img src="/pin.png" alt="" />
            <span>{item.address}</span>
          </p>
          <p className="price">$ {item.price}</p>
          <div className="bottom">
            <div className="features">
              <div className="feature">
                <img src="/bed.png" alt="" />
                <span>{item.bedroom} bedroom</span>
              </div>
              <div className="feature">
                <img src="/bath.png" alt="" />
                <span>{item.bathroom} bathroom</span>
              </div>
            </div>
            <div className="icons">
              <button className="ask-ai" onClick={handleOpenCLose} >{isOpen ? "close" :"Ask AI"}</button>
              <div className="icon">
                <img src="/save.png" alt="" />
              </div>
              <div className="icon">
                <img src="/chat.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && <motion.div 
          initial={{height:0}}
          animate={{height:300}}
          exit={{height:0}}
          key={"chat-ai-container"}
          className="chat-ai-container">
          <div className="messages-box" >
          {
                  messages.length === 0 ? (
                      <div className="follow-up-container" >
                        <span>generated by AI ⋆˙⟡</span>
                        {followUpQuestion.map((question,index)=>(
                          <button onClick={async ()=> {await handleSubmitQuestion(question)}} className="follow-up">
                            {question}
                        </button>))}
                      </div>
                  ) :(
                    messages.map((message, index) => (
                      <div 
                        style={{display:"flex",flexDirection:"column"}} 
                        >
                         {message.sender === "ai" ? (
                          <div key={index} className={`message ai`}>
                            <MarkdownTypewriter
                                content={message.content}
                                typeSpeed={3}
                                cursor={{
                                  shape: 'block',
                                  color: 'bg-blue-500'
                                }}
                              />
                          </div>):(<div key={index} className={`message human`}>
                            {message.content}
                          </div>)}
                          
                           {disableButton && index === messages.length-1 && <div style={{fontSize:"16px",alignSelf:"center",color:"black"}} >
                            {displayedMessage}
                          </div>}
                      </div>
                      ))
                  )
                }
          </div>
          <div className="send-container">
            <textarea onKeyDown={handleKeyDown} value={input} ref={textareaRef} onInput={handleResize} placeholder="Type a message" name="" id="" />
            <button disabled={disableButton || !input} onClick={clickAi} >
              { disableButton ? "Thinking..." : "➤"}
            </button>
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default Card;
