const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { v4 } = require('uuid')


const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  await res.status(200).json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const questionById = await req.repositories.questionRepo.getQuestionById(req.params.questionId)
  await res.status(200).json(questionById)
})

app.post('/questions', async (req, res) => {
  await req.repositories.questionRepo.addQuestion(req.body)
  await res.status(200).send('Question added successfully')
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const AnswersByQuestionId = await req.repositories.questionRepo.getAnswers(req.params.questionId)
  await res.status(200).json(AnswersByQuestionId)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const AnswersByQuestionIdAndAnswerId = await req.repositories.questionRepo.getAnswer(req.params.questionId, req.params.answerId)
  await res.status(200).json(AnswersByQuestionIdAndAnswerId)
})


app.post('/questions/:questionId/answers', async (req, res) => {
  const newAnswer =await req.body
  const addAnswerByIdQuestion = await req.repositories.questionRepo.addAnswer(req.params.questionId, newAnswer)
  await res.status(200).send('Answer added successfully')

})


app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
