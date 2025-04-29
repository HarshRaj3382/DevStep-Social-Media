
import { Router } from "express";
import User from "../models/user.js";
const router = Router();


const DEFAULT_PHOTO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1RvSFDmtFYeg_8VBHYi8B1loeKmLv8j25Tg&s";

router.put("/set-default-photo", async (req, res) => {
  try {
    const result = await User.updateMany(
      { $or: [{ photoUrl: { $exists: false } }, { photoUrl: null }, { photoUrl: "" }] },
      { $set: { photoUrl: DEFAULT_PHOTO_URL } }
    );

    res.status(200).json({ message: "Updated users", modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
