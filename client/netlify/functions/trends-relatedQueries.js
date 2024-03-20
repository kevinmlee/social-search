require("dotenv").config()
const googleTrends = require("google-trends-api")

exports.handler = async (event, context) => {
  const { searchQuery } = JSON.parse(event.body)

  const result = googleTrends
    .interestOverTime({
      keyword: searchQuery
    })
    .then(results => results.data)
    .catch(error => console.log(error))

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
