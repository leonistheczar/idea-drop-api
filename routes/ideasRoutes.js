import express from "express";
const router = express.Router();
// GET
// @route GET /api/ideas
// @desc Get all ideas
// @access Public
router.get("/", (req,res) => {
    const ideas = [
        {id: 1, title: "Ideas 1", description: "Description 1"},
        {id: 2, title: "Ideas 2", description: "Description 2"},
        {id: 3, title: "Ideas 3", description: "Description 3"},
    ]
    res.status(400);
    throw new Error("This is an error");
    res.json(ideas);
})
// POST
// @route POST /api/ideas
// @desc Add a new idea
// @access Public
router.post("/", (req, res) => {
    const {title, description} = req.body;
    res.send(`Idea added: ${title} - ${description}`);
    console.log(title, description);
})
export default router;