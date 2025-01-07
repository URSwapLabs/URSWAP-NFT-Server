const express = require('express');
const cors = require('cors');
const proxyRoutes = require('./routes/proxy');
const generateNft = require('./routes/generateNft');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/proxy', proxyRoutes);
app.use('/generateNft', generateNft);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
