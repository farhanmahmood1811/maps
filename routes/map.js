var express = require('express');
var router = express.Router();

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAA2S1l2OmKKH1jlx9CaNXlI5SiYjkBVgU',
  Promise: Promise
});

/* GET users listing. */
router.post('/matrix', async (req, res, next) => {
  const origin = req.body.origin;
  const destination = req.body.destination;

  if(!origin || !destination) {
    res.status(400).send({"error" : "Required Field Missing" })
    return
  }
  const payload = {
      origins : [ origin ],
      destinations : [ destination ]
  }

  try {
    const response = await googleMapsClient.distanceMatrix(payload).asPromise()
    let data = response.json
    if(!data || !data.status == "OK") {
      res.status(200).send({ "error": "Something went wrong" })
      return
    }

    const element = data.rows[0].elements[0]
    if(element.status != "OK") {
      res.status(200).send({ "error": "Invalid Inputs. No Result Found" })
      return
    }
    
    const metric = {
      "destination" : data.destination_addresses[0],
      "origin": data.origin_addresses[0], 
      distance : element.distance.text,
      duration : element.duration.text
    }
    res.status(200).send({ data : metric })
  } catch(error) {
    console.log(error)
    res.status(200).send({ "error": "Unable to Processss request"})
  }
});

module.exports = router;
