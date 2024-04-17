require("dotenv").config();
const express = require("express");
const axios = require("axios");
const checkForAlerts = require("./emailAlerts");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.post("/validate-email", async (req, res) => {
  const { email } = req.body;

  try {
    const abstractResponse = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );
    const antideoResponse = await axios.get(
      `http://api.antideo.com/email/${email}?api_key=${process.env.ANTIDEO_API_KEY}`
    );

    const validationResults = {
      abstract: {
        is_disposable: abstractResponse.data.is_disposable,
        is_free: abstractResponse.data.is_free,
        is_spam: abstractResponse.data.is_spam || abstractResponse.data.toxic,
      },
      antideo: {
        is_disposable: antideoResponse.data.is_temporary,
        is_free: antideoResponse.data.is_free,
        is_spam: antideoResponse.data.is_spam,
      },
    };

    // Checando e emitindo alertas para e-mails suspeitos
    Object.values(validationResults).forEach(checkForAlerts);

    res.json(validationResults);
  } catch (error) {
    console.error("Error during email validation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
