import express from "express"
import { handleQuestion } from "../controllers/ai.controller"

const router = express.Router()

router.post("/",handleQuestion)

export default router