const express=require("express");
const protect=require("../middleware/authMiddleware");
const {createContest,joinContest,getContestProblems,getLeaderboard,getContest}=require("../controllers/contestController")
const router=express.Router();
router.post("/",protect,createContest);
router.post("/join",protect,joinContest);
router.get("/:contestId/problems",protect,getContestProblems);
router.get("/:contestId/leaderboard",protect,getLeaderboard);
router.get("/:contestId",protect,getContest);
module.exports=router;