var express = require("express");
var router = express.Router();

const { Client } = require("@elastic/elasticsearch");

// Create Elasticsearch client
const esClient = new Client({ node: "http://localhost:9200" });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Endpoint to index data
router.post("/api/index", async (req, res) => {
  try {
    const { title, content } = req.body;

    /**  Index the data : create a sample dummy data  through Postman which will insert to elasticsearch and can view through
     *    command or Kibana (A data visualization and exploration tool)
     **/
    const { body: response } = await esClient.index({
      index: "myindex",
      body: {
        title,
        content,
      },
    });

    res.json({ message: "Document indexed successfully", response });
  } catch (error) {
    console.error("Error indexing document:", error);
    res
      .status(500)
      .json({ error: "An error occurred while indexing the document" });
  }
});

// Endpoint to search data
router.get("/api/search", async (req, res) => {
  try {
    console.log("In");
    const { search_query } = req.query; // Corrected syntax to access query parameter

    // Search for data

    await esClient
      .search({
        index: "myindex",
        body: {
          query: {
            match: { content: search_query },
          },
        },
      })
      .then((result) => {
        // console.log(result.hits);
        res.json({ message: "Search results", results: result.hits });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "An error occurred while searching" });
  }
});

module.exports = router;
