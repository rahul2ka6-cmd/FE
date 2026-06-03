const express = require("express");
const path = require("path");
const models = require("./modelData/models_server");

const app = express();
const PORT = 3001;

// Serve ảnh tĩnh
app.use("/images", express.static(path.join(__dirname, "src/images")));

// Serve React build (production) - tùy chọn
app.use(express.static(path.join(__dirname, "build")));

// API: test info
app.get("/test/info", (req, res) => {
  res.json(models.schemaInfo());
});

// API: danh sách tất cả user
app.get("/user/list", (req, res) => {
  res.json(models.userListModel());
});

// API: chi tiết 1 user
app.get("/user/:id", (req, res) => {
  const user = models.userModel(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// API: ảnh của 1 user
app.get("/photosOfUser/:id", (req, res) => {
  const photos = models.photoOfUserModel(req.params.id);
  if (!photos) return res.status(404).json({ error: "Not found" });
  res.json(photos);
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
